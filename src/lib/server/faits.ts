/**
 * Données de l'espace « Les faits » (démissions, déclarations, sondages).
 *
 * Même principe que la revue de presse : chaque section lit d'abord sa table
 * Notion, remplie par les bénévoles, et retombe sur le fichier JSON du dépôt si
 * la table n'est pas configurée, ne répond pas ou est vide (aucune régression).
 *
 * Variables d'environnement (Netlify) :
 *   NOTION_API_KEY                         la clé déjà utilisée par le site
 *   NOTION_FAITS_DEMISSIONS_DATABASE_ID    table des démissions
 *   NOTION_FAITS_DECLARATIONS_DATABASE_ID  table des déclarations
 *   NOTION_FAITS_SONDAGES_DATABASE_ID      table des sondages
 *
 * Les noms des colonnes Notion sont regroupés dans COLONNES ci-dessous : s'ils
 * diffèrent dans les tables des bénévoles, c'est le seul endroit à modifier.
 *
 * Contrôle : seules les lignes cochées « Visible » sont lues, et une ligne
 * incomplète (citation sans source, date illisible, lien non https…) est
 * écartée avec un avertissement dans le journal, au lieu de s'afficher cassée.
 */
import { env } from '$env/dynamic/private'
import demissionsJson from '$lib/data/demissions.json'
import declarationsJson from '$lib/data/declarations.json'
import sondagesJson from '$lib/data/sondages.json'

export type Statut = 'a_verifier' | 'valide'
export interface Source {
	titre: string
	url: string
}

export interface Demission {
	id: string
	nom: string
	labo: string
	poste: string
	date: string // AAAA-MM
	citation: string // en français
	citation_originale?: string // dans la langue d'origine, si traduite
	contexte?: string
	source: Source
	photo: { url: string; auteur: string; licence: string } | null
	statut: Statut
}

export type CategorieDeclaration = 'scientifiques' | 'labos' | 'personnalites' | 'lanceurs_alerte'
export interface Declaration {
	id: string
	type: 'collectif' | 'individuel'
	auteur: string // la personne, ou le nom du texte collectif
	fonction: string // sa fonction, ou qui a signé le texte collectif
	categorie?: CategorieDeclaration // voix individuelles seulement
	date: string // AAAA ou AAAA-MM
	citation: string
	citation_originale?: string
	contexte?: string
	source: Source
	statut: Statut
}

export interface Sondage {
	id: string
	titre: string
	organisme: string
	date: string // AAAA-MM : publication des résultats
	repondants: string
	chiffre: string
	resultat: string
	precision?: string
	source: Source
	statut: Statut
}

/** Noms des colonnes dans les tables Notion (à ajuster sur les vraies tables). */
export const COLONNES = {
	publie: 'Visible', // case à cocher, comme les autres tables du site : décochée = masquée
	sourceTitre: 'Source',
	sourceLien: 'URL',
	demissions: {
		nom: 'Nom',
		labo: 'Labo',
		poste: 'Poste',
		date: 'Date',
		citation: 'Citation',
		citationOriginale: 'Citation originale',
		contexte: 'Contexte',
		photo: 'Photo',
		photoAuteur: 'Photo – auteur',
		photoLicence: 'Photo – licence'
	},
	declarations: {
		auteur: 'Auteur',
		type: 'Type', // « Texte collectif » ou « Voix individuelle »
		fonction: 'Fonction',
		categorie: 'Catégorie', // Scientifiques, Dirigeants de labos, Personnalités, Lanceurs d'alerte
		date: 'Date',
		citation: 'Citation',
		citationOriginale: 'Citation originale',
		contexte: 'Contexte'
	},
	sondages: {
		titre: 'Titre',
		organisme: 'Organisme',
		date: 'Date',
		repondants: 'Répondants',
		chiffre: 'Chiffre',
		resultat: 'Résultat',
		precision: 'Précision'
	}
} as const

// ── Lecture des propriétés Notion ────────────────────────────────────────────

interface Propriete {
	type?: string
	title?: { plain_text: string }[]
	rich_text?: { plain_text: string }[]
	select?: { name: string } | null
	url?: string | null
	checkbox?: boolean
	date?: { start: string } | null
}
export interface PageNotion {
	id: string
	properties: Record<string, Propriete | undefined>
}

/** Texte d'une colonne Titre, Texte, Sélection ou Lien. */
export function texte(p: Propriete | undefined): string {
	if (!p) return ''
	const morceaux = p.title ?? p.rich_text
	if (morceaux)
		return morceaux
			.map((m) => m.plain_text)
			.join('')
			.trim()
	if (p.select) return p.select.name.trim()
	if (typeof p.url === 'string') return p.url.trim()
	return ''
}

/** « 2025-09-17 » ou « 2025-09 » ou « 1951 », colonne Date ou Texte. */
export function dateCourte(p: Propriete | undefined, moisObligatoire: boolean): string {
	const brut = p?.date?.start ?? texte(p)
	const m = /^(\d{4})(?:-(0[1-9]|1[0-2]))?/.exec(brut)
	if (!m || (moisObligatoire && !m[2])) return ''
	return m[2] ? `${m[1]}-${m[2]}` : m[1]
}

function lienHttps(p: Propriete | undefined): string {
	const url = texte(p)
	return url.startsWith('https://') ? url : ''
}

/** « Dirigeants de labos » -> « dirigeants-de-labos » (pour comparer sans accents). */
function simple(valeur: string): string {
	return valeur
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

const optionnel = (valeur: string) => valeur || undefined

function source(page: PageNotion): Source {
	return {
		titre: texte(page.properties[COLONNES.sourceTitre]),
		url: lienHttps(page.properties[COLONNES.sourceLien])
	}
}

function ecarter(table: string, page: PageNotion, raison: string): null {
	console.warn(`[faits] ${table} : ligne Notion ${page.id} écartée (${raison})`)
	return null
}

// ── Conversion d'une ligne Notion vers le format des pages ──────────────────

export function versDemission(page: PageNotion): Demission | null {
	const c = COLONNES.demissions
	const p = page.properties
	const d: Demission = {
		id: page.id,
		nom: texte(p[c.nom]),
		labo: texte(p[c.labo]),
		poste: texte(p[c.poste]),
		date: dateCourte(p[c.date], true),
		citation: texte(p[c.citation]),
		citation_originale: optionnel(texte(p[c.citationOriginale])),
		contexte: optionnel(texte(p[c.contexte])),
		source: source(page),
		photo: null,
		statut: 'valide'
	}
	const photo = {
		url: lienHttps(p[c.photo]),
		auteur: texte(p[c.photoAuteur]),
		licence: texte(p[c.photoLicence])
	}
	// Photo : seulement avec son auteur et sa licence (licence libre obligatoire).
	if (photo.url && photo.auteur && photo.licence) d.photo = photo
	const manque = (['nom', 'labo', 'poste', 'date', 'citation'] as const).filter((k) => !d[k])
	if (manque.length) return ecarter('démissions', page, `manque : ${manque.join(', ')}`)
	if (!d.source.titre || !d.source.url) return ecarter('démissions', page, 'source incomplète')
	return d
}

const CATEGORIES: Partial<Record<string, CategorieDeclaration>> = {
	scientifiques: 'scientifiques',
	'dirigeants-de-labos': 'labos',
	personnalites: 'personnalites',
	'lanceurs-d-alerte': 'lanceurs_alerte'
}

export function versDeclaration(page: PageNotion): Declaration | null {
	const c = COLONNES.declarations
	const p = page.properties
	const type = simple(texte(p[c.type])).startsWith('texte') ? 'collectif' : 'individuel'
	const d: Declaration = {
		id: page.id,
		type,
		auteur: texte(p[c.auteur]),
		fonction: texte(p[c.fonction]),
		date: dateCourte(p[c.date], false),
		citation: texte(p[c.citation]),
		citation_originale: optionnel(texte(p[c.citationOriginale])),
		contexte: optionnel(texte(p[c.contexte])),
		source: source(page),
		statut: 'valide'
	}
	if (type === 'individuel') {
		d.categorie = CATEGORIES[simple(texte(p[c.categorie]))]
		if (!d.categorie) return ecarter('déclarations', page, 'catégorie inconnue')
	}
	const manque = (['auteur', 'fonction', 'date', 'citation'] as const).filter((k) => !d[k])
	if (manque.length) return ecarter('déclarations', page, `manque : ${manque.join(', ')}`)
	if (!d.source.titre || !d.source.url) return ecarter('déclarations', page, 'source incomplète')
	return d
}

export function versSondage(page: PageNotion): Sondage | null {
	const c = COLONNES.sondages
	const p = page.properties
	const s: Sondage = {
		id: page.id,
		titre: texte(p[c.titre]),
		organisme: texte(p[c.organisme]),
		date: dateCourte(p[c.date], true),
		repondants: texte(p[c.repondants]),
		chiffre: texte(p[c.chiffre]),
		resultat: texte(p[c.resultat]),
		precision: optionnel(texte(p[c.precision])),
		source: source(page),
		statut: 'valide'
	}
	const champs = ['titre', 'organisme', 'date', 'repondants', 'chiffre', 'resultat'] as const
	const manque = champs.filter((k) => !s[k])
	if (manque.length) return ecarter('sondages', page, `manque : ${manque.join(', ')}`)
	if (!s.source.titre || !s.source.url) return ecarter('sondages', page, 'source incomplète')
	return s
}

// ── Requête Notion (toutes les pages, seulement les lignes « Visible ») ───────

async function lireTable(baseId: string | undefined): Promise<PageNotion[]> {
	const cle = env.NOTION_API_KEY
	if (!cle || !baseId) return []
	const pages: PageNotion[] = []
	let curseur: string | undefined
	try {
		do {
			const reponse = await fetch(`https://api.notion.com/v1/databases/${baseId}/query`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${cle}`,
					'Notion-Version': '2022-06-28',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					filter: { property: COLONNES.publie, checkbox: { equals: true } },
					start_cursor: curseur
				})
			})
			if (!reponse.ok) {
				console.error(`[faits] Notion : erreur ${reponse.status} - ${await reponse.text()}`)
				return []
			}
			const donnees = (await reponse.json()) as {
				results: PageNotion[]
				has_more: boolean
				next_cursor: string | null
			}
			pages.push(...donnees.results)
			curseur = donnees.has_more ? (donnees.next_cursor ?? undefined) : undefined
		} while (curseur)
	} catch (erreur) {
		console.error('[faits] Notion injoignable :', erreur)
		return []
	}
	return pages
}

/** Notion d'abord ; sinon le JSON du dépôt (avec les fiches « à vérifier » en local). */
async function charger<T extends { statut: Statut; date: string }>(
	baseId: string | undefined,
	convertir: (page: PageNotion) => T | null,
	secours: T[],
	dev: boolean
): Promise<T[]> {
	const depuisNotion = (await lireTable(baseId)).map(convertir).filter((x): x is T => x !== null)
	const liste = depuisNotion.length
		? depuisNotion
		: secours.filter((x) => dev || x.statut === 'valide')
	return [...liste].sort((a, b) => b.date.localeCompare(a.date))
}

export const chargerDemissions = (dev: boolean) =>
	charger(
		env.NOTION_FAITS_DEMISSIONS_DATABASE_ID,
		versDemission,
		demissionsJson as Demission[],
		dev
	)

export const chargerDeclarations = (dev: boolean) =>
	charger(
		env.NOTION_FAITS_DECLARATIONS_DATABASE_ID,
		versDeclaration,
		declarationsJson as Declaration[],
		dev
	)

export const chargerSondages = (dev: boolean) =>
	charger(env.NOTION_FAITS_SONDAGES_DATABASE_ID, versSondage, sondagesJson as Sondage[], dev)
