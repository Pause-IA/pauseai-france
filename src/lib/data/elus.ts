// Accès aux données des élus (députés + sénateurs) pour la page « Écrire à mes élus ».
//
// Le fichier elus.json est généré par `node scripts/generate-elus.js` à partir
// de sources ouvertes (NosDéputés / NosSénateurs), avec croisement des emails.
// Voir l'en-tête du script pour le détail des niveaux de confiance.
//
// Résolution :
//  - Sénateurs : par DÉPARTEMENT (ils sont élus au département) — toujours fiable.
//  - Députés : par CIRCONSCRIPTION exacte quand le code postal est présent dans
//    code-postal-circo.json (géocodage fin) ; sinon repli sur tous les députés
//    du département (l'utilisateur reconnaît le sien au nom de circonscription).
// Tout est déterministe et sans appel réseau au runtime.

import eluxData from './elus.json'
import cpCircoData from './code-postal-circo.json'

export type EmailConfidence = 'high' | 'medium' | 'low' | 'none'

export interface Elu {
	id: string
	nom: string
	civ?: 'M' | 'Mme' | null
	role: 'depute' | 'senateur'
	departement: string
	circo?: number | null
	nomCirco?: string | null
	nomDept?: string | null
	groupe?: string | null
	email: string | null
	emailConfidence: EmailConfidence
	emailSources: string[]
	contactUrl: string | null
	photo?: string | null
}

interface ElusData {
	generatedAt: string
	sample?: boolean
	senateursParDept: Record<string, Elu[] | undefined>
	deputesParDept: Record<string, Elu[] | undefined>
	deputes: Elu[]
	senateurs: Elu[]
}

interface CircoRef {
	departement: string
	circo: number
}

const data = eluxData as unknown as ElusData
const cpToCirco = cpCircoData as unknown as Record<string, CircoRef[] | undefined>

export const generatedAt = data.generatedAt
export const isSampleData = data.sample === true

/**
 * Déduit le ou les départements à partir d'un code postal français.
 * Renvoie plusieurs départements pour la Corse (20 → 2A/2B, ambigu sur le seul
 * code postal). Renvoie [] si le code postal est invalide.
 */
export function departementsFromCodePostal(cp: string): string[] {
	const clean = (cp || '').replace(/\s/g, '')
	if (!/^\d{5}$/.test(clean)) return []

	// Outre-mer et collectivités : département sur 3 chiffres (97x / 98x).
	if (clean.startsWith('97') || clean.startsWith('98')) {
		return [clean.slice(0, 3)]
	}

	const deux = clean.slice(0, 2)

	// Corse : ambigu sur le seul code postal → on propose les deux départements.
	if (deux === '20') return ['2A', '2B']

	return [deux]
}

export interface LookupResult {
	departements: string[]
	senateurs: Elu[]
	deputes: Elu[]
	/** true si les députés sont ciblés à la circonscription exacte (géocodage). */
	exactDeputes: boolean
}

/** Renvoie tous les élus (sénateurs + députés) pour un code postal donné. */
export function lookupElus(codePostal: string): LookupResult | null {
	const clean = (codePostal || '').replace(/\s/g, '')
	const depts = departementsFromCodePostal(clean)
	if (depts.length === 0) return null

	const senateurs: Elu[] = []
	const allDeputes: Elu[] = []
	for (const dept of depts) {
		senateurs.push(...(data.senateursParDept[dept] ?? []))
		allDeputes.push(...(data.deputesParDept[dept] ?? []))
	}

	// Géocodage fin : si le code postal mappe vers des circonscriptions précises,
	// on ne garde que les députés de ces circonscriptions.
	let deputes = allDeputes
	let exactDeputes = false
	const circos = cpToCirco[clean]
	if (circos && circos.length) {
		const keys = new Set(circos.map((c) => `${c.departement}-${c.circo}`))
		const filtered = allDeputes.filter((d) => keys.has(`${d.departement}-${d.circo}`))
		if (filtered.length) {
			deputes = filtered
			exactDeputes = true
		}
	}

	if (senateurs.length === 0 && deputes.length === 0) return null

	return { departements: depts, senateurs, deputes, exactDeputes }
}
