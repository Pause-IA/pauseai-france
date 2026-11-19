import { describe, expect, it } from 'vitest'
import { compile as mdsvex } from 'mdsvex'
import { compile as svelte } from 'svelte/compiler'

import {
	assembler,
	echapper,
	lireChapo,
	retirerChapo,
	texteRiche,
	versMarkdown
} from '../scripts/guide-notion/convertir.mjs'

// Petits constructeurs de blocs, au format de l'API Notion.
type Ann = { bold?: boolean; italic?: boolean; code?: boolean }
const t = (plain_text: string, annotations: Ann = {}, href?: string) => ({
	plain_text,
	annotations,
	href: href ?? null
})
let n = 0
const bloc = (type: string, contenu: object, children?: object[]) => ({
	id: `b${n++}`,
	type,
	[type]: contenu,
	...(children ? { has_children: true, children } : {})
})
const p = (...rich: object[]) => bloc('paragraph', { rich_text: rich })
const h = (niveau: 1 | 2 | 3, texte: string, extra = {}) =>
	bloc(`heading_${niveau}`, { rich_text: [t(texte, { bold: true })], ...extra })

describe('texte riche', () => {
	it('gras, italique, code, liens ; espaces sortis des marques', () => {
		expect(
			texteRiche([
				t('Simple '),
				t(' gras ', { bold: true }),
				t('ital', { italic: true }),
				t(' — '),
				t('lien', {}, 'https://pauseia.fr/agir')
			])
		).toBe('Simple  **gras** _ital_ — [lien](https://pauseia.fr/agir)')
	})

	it('échappe ce que Svelte ou le Markdown interpréteraient', () => {
		expect(echapper('a {b} <c> *d* _e_')).toBe('a &#123;b&#125; &lt;c&gt; \\*d\\* \\_e\\_')
	})

	it('refuse les liens qui ne mènent pas à une page web', () => {
		expect(texteRiche([t('x', {}, 'javascript:alert(1)')])).toBe('x')
	})
})

describe('blocs', () => {
	it('titres : « Introduction » sauté, ancres stables pour les autres pages', () => {
		const md = versMarkdown([
			h(1, 'Introduction'),
			h(2, 'Principes de la sensibilisation'),
			h(3, 'Outil 1: la cartographie de votre réseau')
		])
		expect(md).not.toContain('Introduction')
		expect(md).toContain('<span id="les-principes-de-la-sensibilisation"></span>')
		expect(md).toContain('## Principes de la sensibilisation')
		expect(md).toContain('<span id="outil-1-la-cartographie-de-votre-réseau"></span>')
		expect(md).toContain('### Outil 1: la cartographie de votre réseau')
	})

	it('encadré : première ligne en gras -> titre', () => {
		const md = versMarkdown([
			bloc('callout', {
				rich_text: [t('Il y a urgence', { bold: true }), t('\n\nLes capacités doublent.')]
			})
		])
		expect(md).toBe('<Callout title="Il y a urgence">\n\nLes capacités doublent.\n\n</Callout>')
	})

	it('encadré sans titre, avec des blocs enfants', () => {
		const md = versMarkdown([bloc('callout', { rich_text: [t('Note')] }, [p(t('Détail'))])])
		expect(md).toBe('<Callout>\n\nNote\n\nDétail\n\n</Callout>')
	})

	it('encadré : l’emoji Notion est repris, pas une icône image', () => {
		const emoji = versMarkdown([
			bloc('callout', {
				icon: { type: 'emoji', emoji: 'ℹ️' },
				rich_text: [t('Deux parties', { bold: true }), t('\nCorps')]
			})
		])
		expect(emoji).toBe('<Callout title="Deux parties" icon="ℹ️">\n\nCorps\n\n</Callout>')
		const image = versMarkdown([
			bloc('callout', {
				icon: { type: 'external', external: { url: 'https://x/i.png' } },
				rich_text: [t('Note')]
			})
		])
		expect(image).toBe('<Callout>\n\nNote\n\n</Callout>')
	})

	it('blocs dépliables -> <details class="depliable">, texte en HTML', () => {
		const md = versMarkdown([
			bloc('toggle', { rich_text: [t("Voir l'exemple : ici")] }, [p(t('Caché'))])
		])
		expect(md).toBe(
			'<details class="depliable">\n<summary>Voir l’exemple\u00A0: ici</summary>\n<div class="depliable-contenu">\n\nCaché\n\n</div>\n</details>'
		)
	})

	it('titre dépliable : le titre ouvre la partie, avec son ancre', () => {
		const md = versMarkdown([
			h(3, 'Outil 2: Dialogue authentique', { is_toggleable: true }),
			bloc('heading_3', { rich_text: [t('Autre <titre>')], is_toggleable: true }, [p(t('Dedans'))])
		])
		expect(md).toContain(
			'<summary><h3 id="outil-2-le-dialogue-authentique">Outil 2\u00A0: Dialogue authentique</h3></summary>'
		)
		expect(md).toContain('<h3 id="autre-titre">Autre &lt;titre&gt;</h3>')
		expect(md).toContain('Dedans\n\n</div>\n</details>')
		expect(md).not.toContain('Afficher')
	})

	it('lien dont le texte est l’adresse : affiché sans https://', () => {
		expect(texteRiche([t('https://pauseia.fr/fr/agir', {}, 'https://pauseia.fr/fr/agir')])).toBe(
			'[pauseia.fr/fr/agir](https://pauseia.fr/fr/agir)'
		)
	})

	it('listes regroupées, numérotées, imbriquées', () => {
		const md = versMarkdown([
			bloc('numbered_list_item', { rich_text: [t('un')] }),
			bloc('numbered_list_item', { rich_text: [t('deux')] }, [
				bloc('bulleted_list_item', { rich_text: [t('sous')] })
			]),
			p(t('fin'))
		])
		expect(md).toBe('1. un\n2. deux\n\n   - sous\n\nfin')
	})

	it('citation sur plusieurs lignes', () => {
		expect(versMarkdown([bloc('quote', { rich_text: [t('Léa…\nElle a réalisé.')] })])).toBe(
			'> Léa…<br />Elle a réalisé.'
		)
	})

	it('tableau -> tableau Markdown dans un conteneur qui défile', () => {
		const ligne = (...cells: string[]) => bloc('table_row', { cells: cells.map((c) => [t(c)]) })
		const md = versMarkdown([
			bloc('table', { has_column_header: true }, [
				ligne('Préoccupation', 'Pont'),
				ligne('Emploi', 'L’IA a | b\nsuite'),
				ligne('Seule')
			])
		])
		expect(md).toBe(
			'<div class="tableau-guide">\n\n| Préoccupation | Pont |\n| --- | --- |\n| Emploi | L’IA a \\| b<br />suite |\n| Seule |  |\n\n</div>'
		)
	})

	it('images : seulement le fichier téléchargé, jamais l’URL Notion', () => {
		const img = bloc('image', {
			type: 'file',
			file: { url: 'https://s3/x.png?X-Amz-Signature=1' },
			caption: []
		})
		const avert: string[] = []
		expect(versMarkdown([img], { avertir: (m) => avert.push(m) })).toBe('')
		expect(avert[0]).toMatch(/non téléchargée/)
		expect(versMarkdown([img], { images: { [img.id]: '/guides/notion-a.webp' } })).toBe(
			'![Illustration](/guides/notion-a.webp)'
		)
	})

	it('bloc inconnu : ignoré et signalé', () => {
		const avert: string[] = []
		expect(versMarkdown([bloc('child_database', {})], { avertir: (m) => avert.push(m) })).toBe('')
		expect(avert).toHaveLength(1)
	})
})

describe('fichier final', () => {
	const actuel = `---
title: Guide de sensibilisation
chapo: 'Vous vous demandez peut-être comment, individuellement, vous pourriez infléchir la trajectoire.'
---

<script>
	import Callout from '$components/Callout.svelte'
</script>

Ancien corps.
`
	it('garde l’en-tête du dépôt, remplace le corps', () => {
		const f = assembler(actuel, 'Nouveau corps.')
		expect(f).toContain('title: Guide de sensibilisation')
		expect(f).toContain('import Callout')
		expect(f).toContain('Nouveau corps.')
		expect(f).not.toContain('Ancien corps.')
	})

	it('le chapô n’est pas répété dans le corps', () => {
		const blocs = [
			h(1, 'Introduction'),
			p(
				t(
					'Vous vous demandez peut-être comment, individuellement, vous pourriez infléchir la trajectoire d’une technologie.'
				)
			),
			p(t('Suite.'))
		]
		const reste = retirerChapo(blocs, lireChapo(actuel))
		expect(reste).toHaveLength(2)
		expect(versMarkdown(reste)).toBe('Suite.')
	})

	it('le fichier produit se compile (mdsvex puis Svelte)', async () => {
		const corps = versMarkdown([
			h(2, 'Principes de la sensibilisation'),
			p(t('Texte avec {accolades} et <balises> et un " guillemet.')),
			bloc('callout', { rich_text: [t('Titre "cité"', { bold: true }), t('\nCorps')] }),
			bloc('toggle', { rich_text: [t('Plus')] }, [p(t('Dedans'))]),
			bloc('quote', { rich_text: [t('Citation')] })
		])
		const source = assembler(actuel, corps)
		const rendu = await mdsvex(source, { extensions: ['.md'] })
		expect(rendu?.code).toBeTruthy()
		expect(() =>
			svelte(rendu!.code, { filename: 'guide.svelte', generate: 'server' })
		).not.toThrow()
	})
})
