/**
 * Blocs Notion -> Markdown mdsvex, pour le guide de sensibilisation.
 *
 * Fonctions pures (aucun appel réseau) : testées par tests/guideNotion.test.ts.
 * Le téléchargement des blocs et des images est dans scripts/guide-notion.mjs.
 *
 * Ce qui est rendu :
 * - titres (le titre 1 « Introduction » est sauté : la page a déjà son titre),
 *   paragraphes, listes à puces et numérotées (imbriquées), citations,
 *   séparateurs ;
 * - encadrés (« callout ») -> <Callout title="…"> : si la première ligne de
 *   l'encadré est entièrement en gras, elle devient le titre ;
 * - blocs dépliables (« toggle », et titres dépliables) -> <details><summary> ;
 * - tableaux -> une liste (une entrée par ligne, chaque colonne en sous-point),
 *   lisible sur téléphone ;
 * - images -> fichier téléchargé à l'avance (voir `images`), jamais l'URL Notion,
 *   qui expire au bout d'une heure ;
 * - colonnes : leur contenu, l'une après l'autre.
 * Le reste (bases imbriquées, vidéos, sous-pages…) est ignoré et signalé.
 *
 * Le texte est échappé : un « { » ou un « < » tapé dans Notion serait sinon
 * interprété par Svelte, et un « * » par le Markdown.
 */

import { applyTypographyRules } from '../../src/lib/typographyPlugin.js'

/**
 * @typedef {Record<string, any>} Bloc Un bloc de l'API Notion (`children` ajouté au chargement).
 * @typedef {{ plain_text?: string, text?: { content?: string, link?: { url?: string } | null }, href?: string | null, annotations?: Record<string, boolean> }} Riche
 * @typedef {{ images?: Record<string, string>, avertir?: (m: string) => void }} Options
 */

/** Titres de niveau 1 qui ne sont pas rendus (la page porte déjà son titre). */
export const TITRES_SAUTES = ['introduction']

/**
 * Ancres utilisées par d'autres pages du site (le guide court renvoie vers
 * « #outil-1-la-cartographie-de-votre-réseau »…). Les titres viennent de Notion
 * et peuvent changer de formulation : l'ancre est posée sur le titre qui
 * correspond au motif, pour que ces liens ne cassent pas.
 */
/** @type {Array<[RegExp, string]>} */
export const ANCRES = [
	[/principes de la sensibilisation/i, 'les-principes-de-la-sensibilisation'],
	[/^\s*outil\s*1\b/i, 'outil-1-la-cartographie-de-votre-réseau'],
	[/^\s*outil\s*2\b/i, 'outil-2-le-dialogue-authentique'],
	[/^\s*outil\s*3\b/i, 'outil-3-créer-des-ponts'],
	[/^\s*outil\s*4\b/i, 'outil-4-répondre-aux-objections'],
	[/^\s*outil\s*5\b/i, 'outil-5-les-engagements-possibles']
]

/**
 * Échappe un texte pour mdsvex : Svelte ({ } <) puis Markdown.
 * @param {string} t
 */
export function echapper(t) {
	return t
		.replace(/\\/g, '\\\\')
		.replace(/[*_`[\]~|]/g, (/** @type {string} */ c) => '\\' + c)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/{/g, '&#123;')
		.replace(/}/g, '&#125;')
}

const LIEN_SUR = /^(https?:\/\/|mailto:|\/)/

/**
 * Texte riche Notion -> Markdown en ligne. Les espaces au bord d'un passage en
 * gras ou en italique sont sortis des marques (« ** mot** » ne serait pas du gras).
 * @param {Riche[]} [riche]
 */
export function texteRiche(riche = []) {
	return riche
		.map((r) => {
			const brut = r.plain_text ?? r.text?.content ?? ''
			if (!brut) return ''
			let [, avant = '', coeur = '', apres = ''] = /^(\s*)([\s\S]*?)(\s*)$/.exec(brut) ?? []
			if (!coeur) return brut.replace(/\n/g, ' ')
			const a = r.annotations ?? {}
			const href = r.href ?? r.text?.link?.url
			// Un lien dont le texte est l'adresse elle-même s'affiche sans « https:// » :
			// plus lisible, et la typographie ne la coupe plus (« https ://… »).
			if (href && coeur.trim() === href.trim()) {
				coeur = coeur.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
			}
			let t = a.code ? '`' + coeur.replace(/`/g, '') + '`' : echapper(coeur)
			t = t.replace(/\n/g, '<br />')
			if (a.bold) t = `**${t}**`
			if (a.italic) t = `_${t}_`
			if (a.strikethrough) t = `~~${t}~~`
			if (href && LIEN_SUR.test(href)) t = `[${t}](${href.replace(/[()\s]/g, encodeURIComponent)})`
			return avant + t + apres
		})
		.join('')
}

/**
 * Texte sans mise en forme (titres d'encadré, motifs d'ancre).
 * @param {Riche[]} [riche]
 */
export function texteSimple(riche = []) {
	return riche.map((r) => r.plain_text ?? r.text?.content ?? '').join('')
}

/**
 * Texte pour du HTML brut (<summary>) : typographie française, puis échappement
 * HTML et Svelte. Le Markdown n'y est pas interprété.
 * @param {string} t
 */
export function html(t) {
	return applyTypographyRules(t)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/{/g, '&#123;')
		.replace(/}/g, '&#125;')
}

/**
 * Identifiant d'un titre, comme le fait rehype-slug pour les autres titres.
 * @param {string} t
 */
export function ancreDe(t) {
	return t
		.toLowerCase()
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
		.replace(/\s/g, '-')
}

/**
 * Échappement pour un attribut entre guillemets (titre d'un encadré).
 * @param {string} t
 */
function attribut(t) {
	return t
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/[{}]/g, (/** @type {string} */ c) => (c === '{' ? '&#123;' : '&#125;'))
}

/**
 * @param {string} md
 * @param {number} n
 */
function indenter(md, n) {
	const pad = ' '.repeat(n)
	return md
		.split('\n')
		.map((l) => (l ? pad + l : l))
		.join('\n')
}

/**
 * Convertit une suite de blocs (avec leurs enfants déjà chargés dans `children`).
 * @param {Bloc[]} blocs
 * @param {Options} [options]
 *   images : identifiant du bloc image -> adresse publique du fichier téléchargé.
 * @returns {string}
 */
export function versMarkdown(blocs, options = {}) {
	const avertir = options.avertir ?? (() => {})
	const images = options.images ?? {}
	const morceaux = []
	let i = 0
	while (i < blocs.length) {
		const b = blocs[i]
		// Listes : les éléments consécutifs d'un même type forment une seule liste.
		if (b.type === 'bulleted_list_item' || b.type === 'numbered_list_item') {
			const items = []
			let n = 1
			while (i < blocs.length && blocs[i].type === b.type) {
				const it = blocs[i]
				const puce = b.type === 'numbered_list_item' ? `${n++}.` : '-'
				let md = `${puce} ${texteRiche(it[it.type].rich_text)}`
				if (it.children?.length) {
					md += '\n\n' + indenter(versMarkdown(it.children, options), puce.length + 1)
				}
				items.push(md)
				i++
			}
			morceaux.push(items.join('\n'))
			continue
		}
		const md = bloc(b, options, avertir, images)
		if (md) morceaux.push(md)
		i++
	}
	return morceaux.join('\n\n')
}

/**
 * @param {Bloc} b
 * @param {Options} options
 * @returns {string}
 */
function enfants(b, options) {
	return b.children?.length ? versMarkdown(b.children, options) : ''
}

/**
 * @param {Bloc} b
 * @param {Options} options
 * @param {(m: string) => void} avertir
 * @param {Record<string, string>} images
 * @returns {string}
 */
function bloc(b, options, avertir, images) {
	const c = b[b.type] ?? {}
	switch (b.type) {
		case 'paragraph': {
			const t = texteRiche(c.rich_text)
			const sous = enfants(b, options)
			return [t, sous].filter(Boolean).join('\n\n')
		}
		case 'heading_1':
		case 'heading_2':
		case 'heading_3':
		case 'heading_4': {
			const simple = texteSimple(c.rich_text).trim()
			if (b.type === 'heading_1' && TITRES_SAUTES.includes(simple.toLowerCase())) {
				return enfants(b, options)
			}
			// Le gras est retiré des titres : ils sont déjà en gras, et des « ** »
			// gêneraient la génération des ancres.
			const texte = echapper(simple)
			const niveau = b.type === 'heading_3' ? '###' : b.type === 'heading_4' ? '####' : '##'
			const ancre = ANCRES.find(([motif]) => motif.test(simple))
			const titre = (ancre ? `<span id="${ancre[1]}"></span>\n\n` : '') + `${niveau} ${texte}`
			if (c.is_toggleable) {
				// Titre dépliable (comme dans Notion) : le titre lui-même ouvre la partie.
				// HTML brut : le Markdown n'est pas lu dans <summary>, d'où l'identifiant
				// et la typographie posés ici.
				const h = `h${niveau.length}`
				const id = ancre ? ancre[1] : ancreDe(simple)
				return `<details class="depliable">\n<summary><${h} id="${id}">${html(simple)}</${h}></summary>\n\n${enfants(b, options)}\n\n</details>`
			}
			return titre
		}
		case 'quote': {
			const t = [texteRiche(c.rich_text), enfants(b, options)].filter(Boolean).join('\n\n')
			return t
				.split('\n')
				.map((l) => (l ? `> ${l}` : '>'))
				.join('\n')
		}
		case 'callout': {
			// Première ligne entièrement en gras -> titre de l'encadré.
			const riche = c.rich_text ?? []
			let titre = ''
			let corps = riche
			const premiere = texteSimple(riche).split('\n')[0]
			if (premiere.trim()) {
				let lu = ''
				const tete = []
				for (const r of riche) {
					if (lu.length >= premiere.length) break
					tete.push(r)
					lu += r.plain_text ?? ''
				}
				const toutGras = tete.every((r) => !(r.plain_text ?? '').trim() || r.annotations?.bold)
				if (toutGras && lu.length >= premiere.length) {
					titre = premiere.trim()
					const reste = lu.slice(premiere.length).replace(/^\n+/, '')
					const derniere = tete.at(-1)
					corps = [
						...(reste ? [{ ...derniere, plain_text: reste }] : []),
						...riche.slice(tete.length)
					]
				}
			}
			const contenu = [texteRiche(corps).trim(), enfants(b, options)].filter(Boolean).join('\n\n')
			const ouverture = titre ? `<Callout title="${attribut(titre)}">` : '<Callout>'
			return `${ouverture}\n\n${contenu}\n\n</Callout>`
		}
		case 'toggle':
			return `<details class="depliable">\n<summary>${html(texteSimple(c.rich_text).trim())}</summary>\n\n${enfants(b, options)}\n\n</details>`
		case 'divider':
			return '<hr />'
		case 'image': {
			const src = images[b.id]
			if (!src) {
				avertir(`image ${b.id} non téléchargée : ignorée`)
				return ''
			}
			const legende = texteSimple(c.caption).trim()
			return `![${echapper(legende || 'Illustration')}](${src})`
		}
		case 'table':
			return tableau(b)
		case 'column_list':
			return (b.children ?? [])
				.map((/** @type {Bloc} */ col) => enfants(col, options))
				.filter(Boolean)
				.join('\n\n')
		case 'bookmark':
		case 'link_preview':
			return c.url && LIEN_SUR.test(c.url) ? `[${echapper(c.url)}](${c.url})` : ''
		default:
			avertir(`bloc « ${b.type} » non pris en charge : ignoré`)
			return ''
	}
}

/**
 * Tableau -> liste : la première colonne en gras, les autres en sous-points.
 * @param {Bloc} b
 */
function tableau(b) {
	/** @type {Bloc[]} */
	const lignes = (b.children ?? []).filter((/** @type {Bloc} */ r) => r.type === 'table_row')
	if (!lignes.length) return ''
	const entete = b.table?.has_column_header ? lignes[0].table_row.cells.map(texteSimple) : null
	const corps = entete ? lignes.slice(1) : lignes
	return corps
		.map((r) => {
			/** @type {Riche[][]} */
			const [premiere, ...autres] = r.table_row.cells
			const sous = autres
				.map((/** @type {Riche[]} */ cell, /** @type {number} */ k) => {
					const t = texteRiche(cell).trim()
					if (!t) return ''
					const nom = entete?.[k + 1]?.trim()
					return `  - ${nom ? `**${echapper(nom)}** : ` : ''}${t}`
				})
				.filter(Boolean)
			return [
				`- **${texteSimple(premiere).trim() ? echapper(texteSimple(premiere).trim()) : '—'}**`,
				...sous
			].join('\n')
		})
		.join('\n')
}

/**
 * Assemble le fichier final : l'en-tête (frontmatter et import de Callout) est
 * repris du fichier existant, pour que titre, description et chapô restent
 * éditables dans le dépôt ; seul le corps vient de Notion.
 * @param {string} fichierActuel
 * @param {string} corps
 */
export function assembler(fichierActuel, corps) {
	const m = /^(---\n[\s\S]*?\n---\n)([\s\S]*?<\/script>\n)?/.exec(fichierActuel)
	const frontmatter = m?.[1] ?? '---\ntitle: Guide de sensibilisation\n---\n'
	const script =
		m?.[2] ?? "\n<script>\n\timport Callout from '$components/Callout.svelte'\n</script>\n"
	const avertissement =
		'\n<!-- Corps généré depuis Notion par scripts/guide-notion.mjs : modifier le guide dans Notion, pas ici. -->\n'
	return `${frontmatter}${script}${avertissement}\n${corps.trim()}\n`
}

/**
 * Le premier paragraphe de Notion reprend souvent le chapô, déjà affiché en tête
 * de page (frontmatter `chapo`) : on ne l'affiche pas deux fois.
 * @param {Bloc[]} blocs
 * @param {string} chapo
 * @returns {Bloc[]}
 */
export function retirerChapo(blocs, chapo) {
	if (!chapo) return blocs
	const norm = (/** @type {string} */ t) =>
		t
			.normalize('NFKC')
			.replace(/[’']/g, "'")
			.replace(/[^\p{L}\p{N}]+/gu, ' ')
			.trim()
			.toLowerCase()
	const debut = norm(chapo).slice(0, 60)
	const i = blocs.findIndex(
		(/** @type {Bloc} */ b) => b.type === 'paragraph' && texteSimple(b.paragraph?.rich_text).trim()
	)
	if (i >= 0 && debut && norm(texteSimple(blocs[i].paragraph.rich_text)).startsWith(debut)) {
		return [...blocs.slice(0, i), ...blocs.slice(i + 1)]
	}
	return blocs
}

/**
 * Le chapô du frontmatter existant (entre apostrophes ou guillemets).
 * @param {string} fichierActuel
 */
export function lireChapo(fichierActuel) {
	const m = /^chapo:\s*(['"])([\s\S]*?)\1\s*$/m.exec(fichierActuel)
	return m ? m[2].replace(/''/g, "'") : ''
}
