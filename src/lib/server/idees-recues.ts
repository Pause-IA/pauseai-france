/**
 * Rubrique « Idées reçues » : objections courantes sur l'IA et réponses de Pause IA.
 *
 * Source : la table Notion « Idées reçues », remplie par l'équipe com
 * (variable Netlify NOTION_IDEES_RECUES_DATABASE_ID, clé NOTION_API_KEY déjà
 * utilisée par le site). Une ligne = une objection :
 *   - colonnes : voir COLONNES ci-dessous (seul endroit à modifier si un nom change) ;
 *   - argumentaire et sources : dans le corps de la page Notion (titres, paragraphes,
 *     listes à puces, liens).
 *
 * Contrôle : seules les lignes cochées « Visible » sont lues ; une ligne incomplète
 * (objection, slug, catégorie ou réponse courte manquants, slug mal formé, doublon)
 * est écartée avec un avertissement dans le journal Netlify.
 * Pas de liste de secours : tant qu'aucune réponse n'est validée, la page l'annonce.
 */
import { env } from '$env/dynamic/private'

export const COLONNES = {
	objection: 'Objection',
	slug: 'Slug', // fin de l'adresse : /fr/idees-recues/<slug> ; ne plus la changer une fois publiée
	numero: 'Numéro', // 1-1, 2-1… : ordre d'affichage
	categorie: 'Catégorie',
	themes: 'Thèmes', // sélection multiple : tags trans-catégories (#alignement…)
	reponseCourte: 'Réponse courte',
	auteur: 'Auteur', // la signature affichée, pas un compte Notion
	publieLe: 'Publié le',
	misAJourLe: 'Mis à jour le', // saisie à la main : une virgule corrigée ne doit pas
	// faire remonter une fausse actualité, contrairement au champ automatique de Notion
	visible: 'Visible'
} as const

/** Ordre d'affichage des catégories (celles de Carmilla). */
export const CATEGORIES = [
	'Nature de l’IA',
	'Contrôle technique',
	'Économie et monde du travail',
	'Gouvernance et géopolitique',
	'Évaluation du risque',
	'Dynamiques sociales et psychologiques'
]

export interface IdeeRecue {
	id: string // identifiant de la page Notion (pour lire son corps)
	objection: string
	slug: string
	numero: string
	categorie: string
	themes: string[]
	reponseCourte: string
	auteur: string
	publieLe: string // AAAA-MM-JJ tel que Notion le donne ; '' si la colonne est vide
	misAJourLe: string
}

/** Un morceau de texte, éventuellement en gras, en italique ou lié (https seulement). */
export interface Segment {
	texte: string
	gras?: boolean
	italique?: boolean
	lien?: string
}
export type Bloc =
	| { type: 'titre'; niveau: 2 | 3; segments: Segment[] }
	| { type: 'paragraphe'; segments: Segment[] }
	| { type: 'liste'; numerotee: boolean; elements: Segment[][] }
	| { type: 'citation'; segments: Segment[] }

// ── Lecture des propriétés et des blocs Notion ───────────────────────────────

interface TexteRiche {
	plain_text: string
	href?: string | null
	annotations?: { bold?: boolean; italic?: boolean }
}
interface Propriete {
	title?: TexteRiche[]
	rich_text?: TexteRiche[]
	select?: { name: string } | null
	multi_select?: { name: string }[]
	date?: { start: string } | null
	checkbox?: boolean
}
export interface PageNotion {
	id: string
	properties: Record<string, Propriete | undefined>
}
export interface BlocNotion {
	type: string
	[cle: string]: unknown
}

function texte(p: Propriete | undefined): string {
	if (!p) return ''
	const morceaux = p.title ?? p.rich_text
	if (morceaux)
		return morceaux
			.map((m) => m.plain_text)
			.join('')
			.trim()
	return p.select?.name.trim() ?? ''
}

/** Les étiquettes d'une colonne « sélection multiple », vides écartées. */
function etiquettes(p: Propriete | undefined): string[] {
	return (p?.multi_select ?? []).map((e) => e.name.trim()).filter(Boolean)
}

/** Le jour d'une colonne Date, ou son texte si la colonne est restée en Texte. */
function jour(p: Propriete | undefined): string {
	return p?.date?.start ?? texte(p)
}

const MOIS = [
	'janvier',
	'février',
	'mars',
	'avril',
	'mai',
	'juin',
	'juillet',
	'août',
	'septembre',
	'octobre',
	'novembre',
	'décembre'
]

/**
 * « 2026-10-23 » -> « 23 octobre 2026 ». Accepte aussi « 2026-10 » et « 2026 ».
 *
 * Écrit à la main plutôt qu'avec Intl : `new Date('2026-10-23')` vaut minuit UTC,
 * et l'afficher dans le fuseau du visiteur décale la date d'un jour à l'ouest de
 * Greenwich. Ici il n'y a pas de fuseau, donc pas de décalage.
 */
export function dateEnFrancais(iso: string): string {
	const [annee, mois, jourDuMois] = iso.trim().split('-')
	if (!/^\d{4}$/.test(annee ?? '')) return ''
	if (!mois) return annee
	// Un mois hors bornes vient d'une saisie fautive : mieux vaut ne rien afficher
	// que l'année seule, qui aurait l'air d'une date volontairement imprécise.
	const nomDuMois = MOIS[Number(mois) - 1]
	if (!nomDuMois) return ''
	if (!/^\d{1,2}$/.test(jourDuMois ?? '')) return `${nomDuMois} ${annee}`
	return `${Number(jourDuMois)} ${nomDuMois} ${annee}`
}

/** Apostrophe droite -> typographique, pour comparer « Nature de l'IA » et « Nature de l’IA ». */
const typo = (valeur: string) => valeur.replace(/'/g, '’')

function segments(riche: TexteRiche[] | undefined): Segment[] {
	return (riche ?? [])
		.filter((r) => r.plain_text)
		.map((r) => {
			const s: Segment = { texte: r.plain_text }
			if (r.annotations?.bold) s.gras = true
			if (r.annotations?.italic) s.italique = true
			// Un lien n'est gardé que s'il mène vers un site en https (jamais « javascript: »).
			if (r.href?.startsWith('https://')) s.lien = r.href
			return s
		})
}

export function versIdeeRecue(page: PageNotion): IdeeRecue | null {
	const p = page.properties
	const idee: IdeeRecue = {
		id: page.id,
		objection: texte(p[COLONNES.objection]).replace(/[.…\s]+$/, ''),
		slug: texte(p[COLONNES.slug]).toLowerCase(),
		numero: texte(p[COLONNES.numero]),
		categorie: typo(texte(p[COLONNES.categorie])),
		themes: etiquettes(p[COLONNES.themes]),
		reponseCourte: texte(p[COLONNES.reponseCourte]),
		auteur: texte(p[COLONNES.auteur]),
		publieLe: jour(p[COLONNES.publieLe]),
		misAJourLe: jour(p[COLONNES.misAJourLe])
	}
	const ecarter = (raison: string) => {
		console.warn(`[idees-recues] ligne Notion ${page.id} écartée (${raison})`)
		return null
	}
	const manque = (['objection', 'slug', 'categorie', 'reponseCourte'] as const).filter(
		(k) => !idee[k]
	)
	if (manque.length) return ecarter(`manque : ${manque.join(', ')}`)
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(idee.slug)) return ecarter(`slug mal formé : ${idee.slug}`)
	return idee
}

/** « 2-1 » avant « 10-1 », puis les lignes sans numéro. */
function parNumero(a: IdeeRecue, b: IdeeRecue): number {
	const cle = (n: string) => n.split('-').map((x) => Number(x) || 999)
	const [x, y] = [cle(a.numero || '999'), cle(b.numero || '999')]
	return x[0] - y[0] || (x[1] ?? 0) - (y[1] ?? 0)
}

export function versBlocs(blocs: BlocNotion[]): Bloc[] {
	const sortie: Bloc[] = []
	for (const bloc of blocs) {
		const contenu = bloc[bloc.type] as { rich_text?: TexteRiche[] } | undefined
		const segs = segments(contenu?.rich_text)
		if (!segs.length) continue
		switch (bloc.type) {
			case 'heading_1':
			case 'heading_2':
				sortie.push({ type: 'titre', niveau: 2, segments: segs })
				break
			case 'heading_3':
				sortie.push({ type: 'titre', niveau: 3, segments: segs })
				break
			case 'paragraph':
				sortie.push({ type: 'paragraphe', segments: segs })
				break
			case 'quote':
			case 'callout':
				sortie.push({ type: 'citation', segments: segs })
				break
			case 'bulleted_list_item':
			case 'numbered_list_item': {
				const numerotee = bloc.type === 'numbered_list_item'
				const precedent = sortie.at(-1)
				// Les éléments consécutifs d'une même liste sont regroupés.
				if (precedent?.type === 'liste' && precedent.numerotee === numerotee) {
					precedent.elements.push(segs)
				} else {
					sortie.push({ type: 'liste', numerotee, elements: [segs] })
				}
				break
			}
			// Images, tableaux, bases imbriquées… : ignorés (non prévus dans un argumentaire).
		}
	}
	return sortie
}

// ── Appels à l'API Notion ────────────────────────────────────────────────────

async function notion<T>(chemin: string, corps?: unknown): Promise<T | null> {
	const cle = env.NOTION_API_KEY
	if (!cle) return null
	try {
		const reponse = await fetch(`https://api.notion.com/v1/${chemin}`, {
			method: corps ? 'POST' : 'GET',
			headers: {
				Authorization: `Bearer ${cle}`,
				'Notion-Version': '2022-06-28',
				'Content-Type': 'application/json'
			},
			body: corps ? JSON.stringify(corps) : undefined
		})
		if (!reponse.ok) {
			console.error(`[idees-recues] Notion : erreur ${reponse.status} - ${await reponse.text()}`)
			return null
		}
		return (await reponse.json()) as T
	} catch (erreur) {
		console.error('[idees-recues] Notion injoignable :', erreur)
		return null
	}
}

interface Liste<T> {
	results: T[]
	has_more: boolean
	next_cursor: string | null
}

/** Les idées reçues publiées (cochées « Visible » et complètes), dans l'ordre des numéros. */
export async function chargerIdeesRecues(): Promise<IdeeRecue[]> {
	const baseId = env.NOTION_IDEES_RECUES_DATABASE_ID
	if (!baseId) return []
	const pages: PageNotion[] = []
	let curseur: string | undefined
	do {
		const reponse = await notion<Liste<PageNotion>>(`databases/${baseId}/query`, {
			filter: { property: COLONNES.visible, checkbox: { equals: true } },
			start_cursor: curseur
		})
		if (!reponse) return []
		pages.push(...reponse.results)
		curseur = reponse.has_more ? (reponse.next_cursor ?? undefined) : undefined
	} while (curseur)

	const vus = new Set<string>()
	const idees: IdeeRecue[] = []
	for (const idee of pages.map(versIdeeRecue)) {
		if (!idee) continue
		if (vus.has(idee.slug)) {
			console.warn(`[idees-recues] slug en double, seconde ligne écartée : ${idee.slug}`)
			continue
		}
		vus.add(idee.slug)
		idees.push(idee)
	}
	return idees.sort(parNumero)
}

/** L'argumentaire : le corps de la page Notion de l'objection. */
export async function chargerArgumentaire(pageId: string): Promise<Bloc[]> {
	const blocs: BlocNotion[] = []
	let curseur: string | undefined
	do {
		const suite = curseur ? `&start_cursor=${encodeURIComponent(curseur)}` : ''
		const reponse = await notion<Liste<BlocNotion>>(
			`blocks/${encodeURIComponent(pageId)}/children?page_size=100${suite}`
		)
		if (!reponse) break
		blocs.push(...reponse.results)
		curseur = reponse.has_more ? (reponse.next_cursor ?? undefined) : undefined
	} while (curseur)
	return versBlocs(blocs)
}
