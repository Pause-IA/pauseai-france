// Noms de pays : PauseAI Global les fournit en texte libre, en anglais
// (« Germany », « United States »…). On les ramène à un code ISO pour regrouper
// les variantes et les afficher dans la langue de la page, via Intl.DisplayNames
// (aucune liste à maintenir).

const norm = (s: string) =>
	s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/gi, ' ')
		.trim()
		.toLowerCase()

const ALIASES: Record<string, string> = {
	usa: 'US',
	us: 'US',
	'united states of america': 'US',
	america: 'US',
	uk: 'GB',
	'great britain': 'GB',
	england: 'GB',
	scotland: 'GB',
	wales: 'GB',
	holland: 'NL',
	'the netherlands': 'NL',
	'south korea': 'KR',
	korea: 'KR',
	russia: 'RU',
	czechia: 'CZ',
	'czech republic': 'CZ'
}

// Codes historiques ou réservés qu'Intl nomme comme un pays actuel
// (DD « Germany », FX « France », UK « United Kingdom »…) : ignorés.
const SKIP = new Set([
	'AN',
	'BU',
	'CS',
	'DD',
	'DY',
	'EU',
	'EZ',
	'FX',
	'HV',
	'NT',
	'QO',
	'RH',
	'SU',
	'TP',
	'UK',
	'UN',
	'VD',
	'YD',
	'YU',
	'ZR'
])

let index: Map<string, string> | null = null

/** Index « nom normalisé → code ISO », en anglais et en français. */
function buildIndex(): Map<string, string> {
	const map = new Map<string, string>()
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const names = ['en', 'fr'].map((l) => new Intl.DisplayNames([l], { type: 'region' }))
	for (const a of letters)
		for (const b of letters) {
			const code = a + b
			if (SKIP.has(code)) continue
			for (const dn of names) {
				let name: string | undefined
				try {
					name = dn.of(code)
				} catch {
					continue
				}
				// Code inconnu : DisplayNames renvoie le code lui-même.
				// Premier code gagnant : FR avant FX (« France métropolitaine »), GB avant UK.
				if (name && name !== code && !map.has(norm(name))) map.set(norm(name), code)
			}
		}
	for (const [alias, code] of Object.entries(ALIASES)) map.set(alias, code)
	return map
}

/** Code ISO du pays (ex. « FR »), ou le nom tel quel s'il n'est pas reconnu. */
export function countryKey(name: string | undefined): string | undefined {
	if (!name?.trim()) return undefined
	index ??= buildIndex()
	return index.get(norm(name)) ?? name.trim()
}

/** Nom du pays dans la langue de la page. */
export function countryLabel(key: string, lang: 'fr' | 'en'): string {
	if (!/^[A-Z]{2}$/.test(key)) return key
	try {
		return new Intl.DisplayNames([lang], { type: 'region' }).of(key) ?? key
	} catch {
		return key
	}
}
