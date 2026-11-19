/**
 * Relais Notion → Discord pour les inscriptions aux groupes locaux.
 *
 * Notion (action d'automatisation « Envoyer un webhook ») envoie la nouvelle
 * ligne de la base « Inscriptions aux groupes locaux » ; on n'en garde que le
 * pseudo Discord et le département, et on poste une ligne dans #bienvenue.
 * Le format exact envoyé par Notion n'est pas documenté : la lecture est
 * volontairement tolérante (voir les tests).
 */
import { trouverDepartement } from '$lib/departements'

type Json = unknown

const norm = (s: string) =>
	s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()

/** Trouve l'objet `properties` de la page, où qu'il soit dans le message. */
export function trouverProprietes(body: Json, profondeur = 0): Record<string, Json> | null {
	if (!body || typeof body !== 'object' || profondeur > 4) return null
	const o = body as Record<string, Json>
	if (o.properties && typeof o.properties === 'object' && !Array.isArray(o.properties)) {
		return o.properties as Record<string, Json>
	}
	for (const cle of ['data', 'page', 'entity', 'payload']) {
		const r = trouverProprietes(o[cle], profondeur + 1)
		if (r) return r
	}
	return null
}

/** Texte d'une valeur de propriété Notion (rich_text, title, select, number…), ou d'une chaîne simple. */
export function texteDePropriete(valeur: Json): string {
	if (valeur == null) return ''
	if (typeof valeur === 'string') return valeur.trim()
	if (typeof valeur === 'number') return String(valeur)
	if (Array.isArray(valeur)) {
		return valeur
			.map((v) =>
				typeof v === 'string'
					? v
					: v && typeof v === 'object'
						? String(
								(v as Record<string, Json>).plain_text ??
									((v as Record<string, Record<string, Json>>).text?.content || '')
							)
						: ''
			)
			.join('')
			.trim()
	}
	if (typeof valeur === 'object') {
		const o = valeur as Record<string, Json>
		const type = typeof o.type === 'string' ? o.type : ''
		if (type && type in o) return texteDePropriete(o[type])
		for (const cle of ['rich_text', 'title', 'name', 'plain_text', 'content', 'value']) {
			if (cle in o) return texteDePropriete(o[cle])
		}
		if ('select' in o) return texteDePropriete(o.select)
	}
	return ''
}

/** Valeur de la première propriété dont le nom (sans accents ni ponctuation) contient tous les mots donnés. */
export function lirePropriete(props: Record<string, Json>, ...mots: string[]): string {
	for (const [nom, valeur] of Object.entries(props)) {
		const n = norm(nom)
		if (mots.every((m) => n.includes(m))) return texteDePropriete(valeur)
	}
	return ''
}

/** Neutralise la mise en forme Discord (un pseudo comme `bob_dupont` passerait en italique). */
export function echapperDiscord(s: string): string {
	return s
		.replace(/[\r\n\t]+/g, ' ')
		.trim()
		.slice(0, 100)
		.replace(/([\\*_~`|>#[\]()<:-])/g, '\\$1')
}

/**
 * Le pseudo en police de code (`romain73`), demande d’Antonin (18/11/2026) : il se
 * repère mieux dans le salon, et Discord n’y interprète aucune mise en forme, donc
 * plus besoin d’échapper les « _ ». Seul l’accent grave, qui fermerait le code, est
 * retiré.
 */
export function pseudoEnCode(s: string): string {
	const p = s
		.replace(/[\r\n\t]+/g, ' ')
		.replace(/`/g, '')
		.trim()
		.replace(/^@+/, '')
		.slice(0, 100)
		.trim()
	return p ? `\`${p}\`` : ''
}

export function construireMessage(pseudo: string, departement: string): string {
	const qui = pseudoEnCode(pseudo) || 'Une personne (pas de pseudo Discord indiqué)'
	const d = trouverDepartement(departement)
	if (d)
		return `${qui} souhaite rejoindre un groupe local dans le département "${d.nom}" (${d.code})`
	const brut = echapperDiscord(departement).replace(/"/g, "'")
	if (brut) return `${qui} souhaite rejoindre un groupe local dans le département "${brut}"`
	return `${qui} souhaite rejoindre un groupe local`
}

/** Extrait pseudo et département du message Notion, ou `null` si ce n'est pas une page de la base. */
export function messageDepuisNotion(body: Json): string | null {
	const props = trouverProprietes(body)
	if (!props) return null
	const pseudo = lirePropriete(props, 'discord', 'utilisateur')
	const departement = lirePropriete(props, 'departement')
	if (!pseudo && !departement) return null
	return construireMessage(pseudo, departement)
}
