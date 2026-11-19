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

	it('blocs dépliables -> <details>', () => {
		const md = versMarkdown([bloc('toggle', { rich_text: [t('Voir plus')] }, [p(t('Caché'))])])
		expect(md).toBe('<details>\n<summary>Voir plus</summary>\n\nCaché\n\n</details>')
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

	it('tableau -> liste lisible sur téléphone', () => {
		const ligne = (...cells: string[]) => bloc('table_row', { cells: cells.map((c) => [t(c)]) })
		const md = versMarkdown([
			bloc('table', { has_column_header: true }, [
				ligne('Préoccupation', 'Pont'),
				ligne('Emploi', 'L’IA remplace des métiers')
			])
		])
		expect(md).toBe('- **Emploi**\n  - **Pont** : L’IA remplace des métiers')
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
