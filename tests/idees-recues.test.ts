import { afterEach, describe, expect, it, vi } from 'vitest'

const env: Record<string, string | undefined> = {}
vi.mock('$env/dynamic/private', () => ({ env }))

const { chargerArgumentaire, chargerIdeesRecues, versBlocs, versIdeeRecue } = await import(
	'../src/lib/server/idees-recues'
)

const titre = (t: string) => ({ title: [{ plain_text: t }] })
const txt = (t: string) => ({ rich_text: [{ plain_text: t }] })
const choix = (t: string) => ({ select: { name: t } })
const ligne = (id: string, slug: string, numero: string, extra: Record<string, unknown> = {}) => ({
	id,
	properties: {
		Objection: titre('Il suffirait de la débrancher…'),
		Slug: txt(slug),
		Numéro: txt(numero),
		Catégorie: choix('Contrôle technique'),
		'Réponse courte': txt('L’IA est déjà présente dans des milliers de systèmes.'),
		...extra
	}
})
const reponse = (corps: unknown) => new Response(JSON.stringify(corps))

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
	for (const k of Object.keys(env)) env[k] = undefined
})

describe('conversion d’une ligne Notion', () => {
	it('ligne complète : points de suspension retirés, apostrophe typographique', () => {
		const i = versIdeeRecue(
			ligne('p1', 'il-suffirait-de-la-debrancher', '2-1', {
				Catégorie: choix("Nature de l'IA")
			})
		)
		expect(i?.objection).toBe('Il suffirait de la débrancher')
		expect(i?.categorie).toBe('Nature de l’IA')
	})

	it('écarte une ligne sans réponse courte ou au slug mal formé', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		expect(versIdeeRecue(ligne('p1', 'ok', '1-1', { 'Réponse courte': txt('') }))).toBeNull()
		expect(versIdeeRecue(ligne('p2', 'Avec espaces et accents é', '1-1'))).toBeNull()
		expect(versIdeeRecue(ligne('p3', '../admin', '1-1'))).toBeNull()
	})
})

describe('corps de la page (argumentaire)', () => {
	it('titres, paragraphes, listes regroupées ; liens https seulement', () => {
		const blocs = versBlocs([
			{ type: 'heading_3', heading_3: { rich_text: [{ plain_text: 'Argument 1 (technique)' }] } },
			{
				type: 'paragraph',
				paragraph: {
					rich_text: [
						{ plain_text: 'Voir ', annotations: { bold: true } },
						{ plain_text: 'cette étude', href: 'https://exemple.org/etude' },
						{ plain_text: ' et ', href: null },
						{ plain_text: 'ceci', href: 'javascript:alert(1)' }
					]
				}
			},
			{
				type: 'bulleted_list_item',
				bulleted_list_item: { rich_text: [{ plain_text: 'Source A' }] }
			},
			{
				type: 'bulleted_list_item',
				bulleted_list_item: { rich_text: [{ plain_text: 'Source B' }] }
			},
			{ type: 'image', image: {} },
			{ type: 'paragraph', paragraph: { rich_text: [] } }
		])
		expect(blocs.map((b) => b.type)).toEqual(['titre', 'paragraphe', 'liste'])
		const para = blocs[1] as { segments: { texte: string; lien?: string; gras?: boolean }[] }
		expect(para.segments[0].gras).toBe(true)
		expect(para.segments[1].lien).toBe('https://exemple.org/etude')
		expect(para.segments[3].lien).toBeUndefined() // « javascript: » jamais cliquable
		expect((blocs[2] as { elements: unknown[] }).elements).toHaveLength(2)
	})
})

describe('lecture de la table', () => {
	it('sans table configurée : aucune idée reçue, sans erreur', async () => {
		expect(await chargerIdeesRecues()).toEqual([])
	})

	it('lignes « Visible » seulement, triées par numéro, doublons de slug écartés', async () => {
		env.NOTION_API_KEY = 'cle-de-test'
		env.NOTION_IDEES_RECUES_DATABASE_ID = 'base'
		vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		const appel = vi.fn().mockResolvedValue(
			reponse({
				results: [
					ligne('a', 'dix', '10-1'),
					ligne('b', 'deux', '2-1'),
					ligne('c', 'deux', '3-1'),
					ligne('d', 'un', '1-6')
				],
				has_more: false,
				next_cursor: null
			})
		)
		vi.stubGlobal('fetch', appel)
		const idees = await chargerIdeesRecues()
		expect(idees.map((i) => i.slug)).toEqual(['un', 'deux', 'dix'])
		const corps = JSON.parse((appel.mock.calls[0] as [string, { body: string }])[1].body) as {
			filter: unknown
		}
		expect(corps.filter).toEqual({ property: 'Visible', checkbox: { equals: true } })
	})

	it('Notion en panne : page vide plutôt qu’une erreur', async () => {
		env.NOTION_API_KEY = 'cle-de-test'
		env.NOTION_IDEES_RECUES_DATABASE_ID = 'base'
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 502 })))
		expect(await chargerIdeesRecues()).toEqual([])
		expect(await chargerArgumentaire('page')).toEqual([])
	})

	it('argumentaire sur plusieurs pages de résultats Notion', async () => {
		env.NOTION_API_KEY = 'cle-de-test'
		const para = (t: string) => ({
			type: 'paragraph',
			paragraph: { rich_text: [{ plain_text: t }] }
		})
		const appel = vi
			.fn()
			.mockResolvedValueOnce(reponse({ results: [para('1')], has_more: true, next_cursor: 'c2' }))
			.mockResolvedValueOnce(reponse({ results: [para('2')], has_more: false, next_cursor: null }))
		vi.stubGlobal('fetch', appel)
		expect(await chargerArgumentaire('page')).toHaveLength(2)
		expect(appel.mock.calls[1][0]).toContain('start_cursor=c2')
	})
})
