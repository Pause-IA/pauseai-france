// Résolution de la circonscription législative exacte à partir d’une adresse.
// Utilisée UNIQUEMENT dans le cas ambigu (un code postal couvrant plusieurs
// circonscriptions), en amélioration progressive : toute erreur retombe
// silencieusement sur le comportement par défaut.
//
// Deux briques : géocodage via la Base Adresse Nationale (service public, sans
// clé), puis point-in-polygon contre les contours de circonscriptions du
// département (chargés à la demande depuis /circo-geo/<dept>.json).

export interface GeoPoint {
	lon: number
	lat: number
}

/** Géocode une adresse via la BAN. Renvoie le point le plus probable ou null. */
export async function geocodeAddress(query: string, postcode?: string): Promise<GeoPoint | null> {
	const q = query.trim()
	if (!q) return null
	const params = new URLSearchParams({ q, limit: '1', autocomplete: '0' })
	if (postcode && /^\d{5}$/.test(postcode)) params.set('postcode', postcode)
	try {
		const res = await fetch(`https://api-adresse.data.gouv.fr/search/?${params.toString()}`)
		if (!res.ok) return null
		const data = (await res.json()) as {
			features?: { geometry?: { coordinates?: unknown } }[]
		}
		const coords = data.features?.[0]?.geometry?.coordinates
		if (!Array.isArray(coords) || coords.length < 2) return null
		return { lon: Number(coords[0]), lat: Number(coords[1]) }
	} catch {
		return null
	}
}

type Ring = number[][]
type PolygonCoords = Ring[]

// Ray casting : le point est-il dans l’anneau ?
function inRing(pt: [number, number], ring: Ring): boolean {
	const [x, y] = pt
	let inside = false
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const xi = ring[i][0]
		const yi = ring[i][1]
		const xj = ring[j][0]
		const yj = ring[j][1]
		const hit = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
		if (hit) inside = !inside
	}
	return inside
}

// Dans le polygone = dans l’anneau extérieur mais dans aucun trou.
function inPolygon(pt: [number, number], poly: PolygonCoords): boolean {
	if (!poly.length || !inRing(pt, poly[0])) return false
	for (let k = 1; k < poly.length; k++) {
		if (inRing(pt, poly[k])) return false
	}
	return true
}

interface CircoGeometry {
	// Type déclaré large : la valeur vient d’un fichier GeoJSON, on la vérifie
	// à l’exécution plutôt que de la tenir pour acquise.
	type: string
	coordinates: PolygonCoords | PolygonCoords[]
}

function inGeometry(pt: [number, number], geom: CircoGeometry): boolean {
	if (geom.type === 'Polygon') return inPolygon(pt, geom.coordinates as PolygonCoords)
	if (geom.type === 'MultiPolygon')
		return (geom.coordinates as PolygonCoords[]).some((poly) => inPolygon(pt, poly))
	return false
}

interface CircoFeature {
	properties: { circo: number }
	geometry: CircoGeometry
}

const deptCache = new Map<string, Promise<CircoFeature[] | null>>()

function loadDept(dept: string): Promise<CircoFeature[] | null> {
	let cached = deptCache.get(dept)
	if (!cached) {
		cached = fetch(`/circo-geo/${encodeURIComponent(dept)}.json`)
			.then((r) => (r.ok ? (r.json() as Promise<{ features?: CircoFeature[] } | null>) : null))
			.then((fc) => fc?.features ?? null)
			.catch(() => null)
		deptCache.set(dept, cached)
	}
	return cached
}

/** Numéro de circonscription contenant le point dans ce département, ou null. */
export async function findCirco(dept: string, p: GeoPoint): Promise<number | null> {
	const features = await loadDept(dept)
	if (!features) return null
	const pt: [number, number] = [p.lon, p.lat]
	for (const f of features) {
		if (inGeometry(pt, f.geometry)) return f.properties.circo
	}
	return null
}

/**
 * Géocode l’adresse puis trouve la circonscription exacte, en testant chaque
 * département candidat (en général un seul). Renvoie { dept, circo } ou null.
 */
export async function resolveCirco(
	query: string,
	postcode: string,
	departements: string[]
): Promise<{ dept: string; circo: number } | null> {
	const p = await geocodeAddress(query, postcode)
	if (!p) return null
	for (const dept of departements) {
		const circo = await findCirco(dept, p)
		if (circo != null) return { dept, circo }
	}
	return null
}
