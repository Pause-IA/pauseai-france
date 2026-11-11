/**
 * Signalement des liens qui mènent vers un contenu en anglais.
 *
 * Demande de l'équipe com : un lecteur francophone doit savoir, avant de
 * cliquer, qu'il va arriver sur une page en anglais.
 *
 * Choix : une liste explicite de domaines, et non une détection automatique.
 * Deviner la langue d'une page sans l'avoir chargée est impossible, et se
 * tromper dans un sens comme dans l'autre décrédibilise le signalement. La
 * liste ne contient donc que des sites dont nous savons qu'ils n'existent qu'en
 * anglais ; tout le reste n'est pas signalé, quitte à en oublier.
 *
 * Pour ajouter un domaine : vérifier qu'il n'a pas de version française, puis
 * l'ajouter ci-dessous. Les sous-domaines sont couverts (« images.controlai.com »
 * est couvert par « controlai.org » seulement si on l'ajoute, pas automatiquement).
 */

/** Domaines connus pour n'exister qu'en anglais. Sans « www. ». */
export const HOTES_ANGLOPHONES = new Set([
	'arxiv.org',
	'safe.ai',
	'aiimpacts.org',
	'ai-2027.com',
	'ai-2040.com',
	'controlai.org',
	'images.controlai.com',
	'pauseai.info',
	'anthropic.com',
	'openai.com',
	'futureoflife.org',
	'intelligence.org',
	'hedweb.com',
	'lesswrong.com',
	'alignmentforum.org',
	'epoch.ai',
	'metr.org',
	'redwoodresearch.org',
	'sanders.senate.gov',
	'gov.uk',
	'commons.parliament.uk'
])

/**
 * Ce lien mène-t-il vers une page en anglais ?
 *
 * Renvoie faux pour tout ce qui n'est pas une adresse http(s), et pour une
 * adresse dont le chemin annonce une version française (« /fr/… »), car
 * plusieurs de ces sites publient des traductions ponctuelles.
 */
export function estEnAnglais(href: string): boolean {
	let url: URL
	try {
		url = new URL(href)
	} catch {
		return false
	}
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
	if (/(^|\/)fr(\/|$)/.test(url.pathname)) return false
	const hote = url.hostname.toLowerCase().replace(/^www\./, '')
	return HOTES_ANGLOPHONES.has(hote)
}
