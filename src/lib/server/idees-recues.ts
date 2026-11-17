/**
 * Rubrique « Idées reçues » : objections courantes sur l’IA et réponses de Pause IA.
 *
 * Source : la table Notion « Idées reçues », remplie par l’équipe com
 * (variable Netlify NOTION_IDEES_RECUES_DATABASE_ID, clé NOTION_API_KEY déjà
 * utilisée par le site). Une ligne = une objection :
 *   - colonnes : voir COLONNES ci-dessous (seul endroit à modifier si un nom change) ;
 *   - argumentaire et sources : dans le corps de la page Notion (titres, paragraphes,
 *     listes à puces, liens).
 *
 * Contrôle : seules les lignes cochées « Visible » sont lues ; une ligne incomplète
 * (objection, slug, catégorie ou réponse courte manquants, slug mal formé, doublon)
 * est écartée avec un avertissement dans le journal Netlify.
 * Pas de liste de secours : tant qu’aucune réponse n’est validée, la page l'annonce.
 */
import { env } from '$env/dynamic/private'

export const COLONNES = {
	objection: 'Objection',
	slug: 'Slug', // fin de l'adresse : /fr/idees-recues/<slug> ; ne plus la changer une fois publiée
	numero: 'Numéro', // 1-1, 2-1… : ordre d'affichage
	categorie: 'Catégorie',
	themes: 'Thèmes', // sélection multiple : tags trans-catégories (#alignement…)
	themesAutreNom: 'Thème', // nom donné à la colonne dans Notion (05/11/2026) : les deux sont lus
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
	reponseCourte: string // texte seul (recherche, aperçus de lien, partage)
	reponseCourteMiseEnForme: Segment[] // avec gras, italique et liens (Markdown accepté)
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
 * Écrit à la main plutôt qu’avec Intl : `new Date('2026-10-23')` vaut minuit UTC,
 * et l’afficher dans le fuseau du visiteur décale la date d’un jour à l’ouest de
 * Greenwich. Ici il n’y a pas de fuseau, donc pas de décalage.
 */
export function dateEnFrancais(iso: string): string {
	const [annee, mois, jourDuMois] = iso.trim().split('-')
	if (!/^\d{4}$/.test(annee ?? '')) return ''
	if (!mois) return annee
	// Un mois hors bornes vient d’une saisie fautive : mieux vaut ne rien afficher
	// que l'année seule, qui aurait l’air d’une date volontairement imprécise.
	const nomDuMois = MOIS[Number(mois) - 1]
	if (!nomDuMois) return ''
	if (!/^\d{1,2}$/.test(jourDuMois ?? '')) return `${nomDuMois} ${annee}`
	return `${Number(jourDuMois)} ${nomDuMois} ${annee}`
}

/**
 * Apostrophe droite -> typographique (’), le style du reste du site. Notion garde
 * l’apostrophe tapée au clavier : on la convertit pour tout texte affiché (les
 * adresses des liens et le slug ne passent pas par ici). Sert aussi à comparer
 * « Nature de l’IA » et « Nature de l’IA » dans les filtres.
 */
const typo = (valeur: string) => valeur.replace(/'/g, '’')

/**
 * Les espaces au bord d’un lien en sont sortis : dans Notion, l’espace avant une
 * adresse collée fait souvent partie du lien, et le soulignement commençait par
 * un blanc (« arXiv:2212.08073 ⎵https://… », 05/11/2026).
 */
function sortirLesEspaces(s: Segment): Segment[] {
	if (!s.lien) return [s]
	const [, avant = '', coeur = '', apres = ''] = /^(\s*)(.*?)(\s*)$/s.exec(s.texte) ?? []
	if (!coeur) return [{ ...s, lien: undefined }]
	const blanc = (t: string): Segment[] => (t ? [{ texte: t }] : [])
	return [...blanc(avant), { ...s, texte: coeur }, ...blanc(apres)]
}

function segments(riche: TexteRiche[] | undefined): Segment[] {
	return (riche ?? [])
		.filter((r) => r.plain_text)
		.map((r) => {
			const s: Segment = { texte: typo(r.plain_text) }
			if (r.annotations?.bold) s.gras = true
			if (r.annotations?.italic) s.italique = true
			// Un lien n'est gardé que s’il mène vers un site web (jamais « javascript: »).
			if (/^https?:\/\//.test(r.href ?? '')) s.lien = r.href ?? undefined
			return s
		})
		.flatMap(sortirLesEspaces)
}

// ── Markdown ─────────────────────────────────────────────────────────────────
//
// Demande de Romain (04/11/2026) : un texte écrit en Markdown dans Notion (souvent
// collé depuis un autre outil) est mis en forme ; un texte ordinaire reste tel
// quel. Seul un petit Markdown est reconnu : **gras**, *italique* ou _italique_,
// [texte](https://adresse) ; et, en début de ligne d’un paragraphe : # à ######
// (titres), - ou * (puces), 1. (liste numérotée), > (citation).
// Le résultat reste des segments de texte : jamais de HTML interprété.

const LIEN_MD = String.raw`\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)`
const ADRESSE_NUE = String.raw`(https?:\/\/[^\s<>\]]*[^\s<>\].,;:!?)'"»])`
const EMPHASE = String.raw`\*\*(?=\S)(.+?)(?<=\S)\*\*|__(?=\S)(.+?)(?<=\S)__|(?<![\w*])\*(?=[^\s*])(.+?)(?<=\S)\*(?![\w*])|(?<![\w_/])_(?=[^\s_])(.+?)(?<=\S)_(?![\w_])`
// Lecture : les adresses nues deviennent cliquables (avant l'emphase, pour qu'un
// « _ » d'adresse ne soit jamais pris pour de l’italique).
const MD_EN_LIGNE = new RegExp(`${LIEN_MD}|${ADRESSE_NUE}|${EMPHASE}`, 'g')
// Détection : une adresse nue seule ne fait pas d’un texte du Markdown.
const MD_DETECTION = new RegExp(`${LIEN_MD}|${EMPHASE}`)
const MD_LIGNE = /^ {0,3}(#{1,6} |[-*+] |\d{1,3}[.)] |> )/m

/** Le texte contient-il du Markdown reconnu ? */
export function estDuMarkdown(texte: string): boolean {
	return MD_LIGNE.test(texte) || MD_DETECTION.test(texte)
}

/** Une ligne de Markdown -> segments (gras, italique, liens). */
export function markdownEnLigne(texte: string): Segment[] {
	const sortie: Segment[] = []
	const brut = (t: string, forme: Partial<Segment> = {}) => {
		if (t) sortie.push({ texte: typo(t), ...forme })
	}
	let debut = 0
	for (const m of texte.matchAll(MD_EN_LIGNE)) {
		brut(texte.slice(debut, m.index))
		const [, lienTexte, lien, nue, gras1, gras2, ital1, ital2] = m
		if (lien) brut(lienTexte, { lien })
		else if (nue) brut(nue, { lien: nue })
		else if (gras1 || gras2) brut(gras1 || gras2, { gras: true })
		else brut(ital1 || ital2, { italique: true })
		debut = m.index + m[0].length
	}
	brut(texte.slice(debut))
	return sortie
}

/** Un paragraphe Notion écrit en Markdown -> titres, listes, citations, paragraphes. */
export function markdownEnBlocs(texte: string): Bloc[] {
	const sortie: Bloc[] = []
	let paragraphe: string[] = []
	const finirLeParagraphe = () => {
		if (paragraphe.length)
			sortie.push({ type: 'paragraphe', segments: markdownEnLigne(paragraphe.join(' ')) })
		paragraphe = []
	}
	for (const ligne of texte.split('\n').map((l) => l.trim())) {
		const titre = /^(#{1,6}) (.+)$/.exec(ligne)
		const puce = /^[-*+] (.+)$/.exec(ligne)
		const numero = /^\d{1,3}[.)] (.+)$/.exec(ligne)
		const citation = /^> ?(.*)$/.exec(ligne)
		if (!ligne) finirLeParagraphe()
		else if (titre) {
			finirLeParagraphe()
			const niveau = titre[1].length >= 3 ? 3 : 2 // #### et au-delà : comme ###
			sortie.push({ type: 'titre', niveau, segments: markdownEnLigne(titre[2]) })
		} else if (puce ?? numero) {
			finirLeParagraphe()
			ajouterAuxBlocs(sortie, {
				type: 'liste',
				numerotee: Boolean(numero),
				elements: [markdownEnLigne((puce ?? numero)?.[1] ?? '')]
			})
		} else if (citation) {
			finirLeParagraphe()
			sortie.push({ type: 'citation', segments: markdownEnLigne(citation[1]) })
		} else paragraphe.push(ligne)
	}
	finirLeParagraphe()
	return sortie
}

/** Ajoute un bloc ; les éléments consécutifs d’une même liste sont regroupés. */
function ajouterAuxBlocs(sortie: Bloc[], bloc: Bloc) {
	const precedent = sortie.at(-1)
	if (
		bloc.type === 'liste' &&
		precedent?.type === 'liste' &&
		precedent.numerotee === bloc.numerotee
	) {
		precedent.elements.push(...bloc.elements)
	} else sortie.push(bloc)
}

export function versIdeeRecue(page: PageNotion): IdeeRecue | null {
	const p = page.properties
	const idee: IdeeRecue = {
		id: page.id,
		objection: typo(texte(p[COLONNES.objection])).replace(/[.…\s]+$/, ''),
		slug: texte(p[COLONNES.slug]).toLowerCase(),
		numero: texte(p[COLONNES.numero]),
		categorie: typo(texte(p[COLONNES.categorie])),
		themes: etiquettes(p[COLONNES.themes] ?? p[COLONNES.themesAutreNom]).map(typo),
		reponseCourte: '',
		reponseCourteMiseEnForme: [],
		auteur: typo(texte(p[COLONNES.auteur])),
		publieLe: jour(p[COLONNES.publieLe]),
		misAJourLe: jour(p[COLONNES.misAJourLe])
	}
	const courte = texte(p[COLONNES.reponseCourte])
	idee.reponseCourteMiseEnForme = estDuMarkdown(courte)
		? markdownEnLigne(courte.replace(/\s*\n\s*/g, ' '))
		: [{ texte: typo(courte) }].filter((s) => s.texte)
	idee.reponseCourte = idee.reponseCourteMiseEnForme.map((s) => s.texte).join('')
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
		// Un lien posé dans Notion sur un texte devient un lien Markdown, pour ne pas
		// le perdre si le bloc est lu comme du Markdown. Une adresse collée (texte =
		// adresse) reste telle quelle : elle peut être au milieu d’un [texte](adresse).
		const brut = (contenu?.rich_text ?? [])
			.map((r) =>
				r.href && /^https?:\/\//.test(r.href) && r.plain_text.trim() !== r.href
					? `[${r.plain_text}](${r.href})`
					: r.plain_text
			)
			.join('')
		// Écrit en Markdown : on lit le texte brut (la mise en forme Notion, s'il y
		// en a, est alors ignorée). Sinon, la mise en forme Notion telle quelle.
		// Détection sur le texte tel qu’écrit (sans les liens Notion convertis).
		const markdown = estDuMarkdown((contenu?.rich_text ?? []).map((r) => r.plain_text).join(''))
		if (markdown && bloc.type === 'paragraph') {
			for (const b of markdownEnBlocs(brut)) ajouterAuxBlocs(sortie, b)
			continue
		}
		const segs = markdown
			? markdownEnLigne(brut.replace(/\s*\n\s*/g, ' '))
			: segments(contenu?.rich_text)
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
			case 'numbered_list_item':
				ajouterAuxBlocs(sortie, {
					type: 'liste',
					numerotee: bloc.type === 'numbered_list_item',
					elements: [segs]
				})
				break
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
