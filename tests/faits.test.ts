import { afterEach, describe, expect, it, vi } from 'vitest'

const env: Record<string, string | undefined> = {}
vi.mock('$env/dynamic/private', () => ({ env }))

const {
	COLONNES,
	chargerDeclarations,
	chargerSondages,
	dateCourte,
	versDeclaration,
	versDemission,
	versSondage
} = await import('../src/lib/server/faits')

// Fabrique une ligne Notion à partir de { colonne: valeur }.
const titre = (t: string) => ({ type: 'title', title: [{ plain_text: t }] })
const txt = (t: string) => ({ type: 'rich_text', rich_text: [{ plain_text: t }] })
const choix = (t: string) => ({ type: 'select', select: { name: t } })
const lien = (u: string) => ({ type: 'url', url: u })
const jour = (d: string) => ({ type: 'date', date: { start: d } })
const ligne = (properties: Record<string, unknown>) =>
	({ id: 'page-1', properties }) as Parameters<typeof versDemission>[0]

const source = {
	[COLONNES.sourceTitre]: txt('Axios, septembre 2025'),
	[COLONNES.sourceLien]: lien('https://www.axios.com/x')
}

afterEach(() => {
	vi.restoreAllMocks()
	for (const k of Object.keys(env)) env[k] = undefined
})

describe('dateCourte', () => {
	it('garde le mois d’une colonne Date, ou l’année seule si permis', () => {
		expect(dateCourte(jour('2025-09-17'), true)).toBe('2025-09')
		expect(dateCourte(txt('1951'), false)).toBe('1951')
		expect(dateCourte(txt('1951'), true)).toBe('')
		expect(dateCourte(txt('sept. 2025'), false)).toBe('')
	})
})

describe('conversion des lignes Notion', () => {
	it('démission complète', () => {
		const d = versDemission(
			ligne({
				Nom: titre('Jan Leike'),
				Labo: choix('OpenAI'),
				Poste: txt('Co-responsable Superalignment'),
				Date: jour('2024-05-17'),
				Citation: txt('La sécurité est passée au second plan.'),
				'Photo – auteur': txt('X'),
				...source
			})
		)
		expect(d?.date).toBe('2024-05')
		expect(d?.photo).toBeNull() // photo sans lien ni licence : pas de photo
		expect(d?.statut).toBe('valide')
	})

	it('écarte une ligne sans source, avec un avertissement', () => {
		const alerte = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		const d = versDemission(
			ligne({
				Nom: titre('A'),
				Labo: choix('B'),
				Poste: txt('C'),
				Date: jour('2024-05-01'),
				Citation: txt('D')
			})
		)
		expect(d).toBeNull()
		expect(alerte).toHaveBeenCalledWith(expect.stringContaining('source incomplète'))
	})

	it('refuse un lien qui n’est pas https', () => {
		vi.spyOn(console, 'warn').mockImplementation(() => undefined)
		const s = versSondage(
			ligne({
				Titre: titre('Enquête'),
				Organisme: txt('AI Impacts'),
				Date: jour('2024-01-05'),
				Répondants: txt('2 778 chercheurs'),
				Chiffre: txt('5 %'),
				Résultat: txt('Probabilité médiane…'),
				[COLONNES.sourceTitre]: txt('arXiv'),
				[COLONNES.sourceLien]: lien('javascript:alert(1)')
			})
		)
		expect(s).toBeNull()
	})

	it('déclaration : catégorie lue sans tenir compte des accents', () => {
		const d = versDeclaration(
			ligne({
				Auteur: titre('Dario Amodei'),
				Type: choix('Voix individuelle'),
				Fonction: txt('Directeur général d’Anthropic'),
				Catégorie: choix('Dirigeants de labos'),
				Date: txt('2025-09'),
				Citation: txt('Il y a 25 % de chances…'),
				...source
			})
		)
		expect(d?.type).toBe('individuel')
		expect(d?.categorie).toBe('labos')
	})

	it('texte collectif : pas besoin de catégorie', () => {
		const d = versDeclaration(
			ligne({
				Auteur: titre('Déclaration sur les risques de l’IA'),
				Type: choix('Texte collectif'),
				Fonction: txt('Signée par des centaines de chercheurs'),
				Date: txt('2023-05'),
				Citation: txt('Réduire le risque d’extinction…'),
				...source
			})
		)
		expect(d?.type).toBe('collectif')
		expect(d?.categorie).toBeUndefined()
	})
})

describe('repli sur les fichiers JSON du dépôt', () => {
	it('sans table configurée : le JSON, fiches validées seulement', async () => {
		const liste = await chargerSondages(false)
		expect(liste.length).toBeGreaterThan(0)
		expect(liste.every((s) => s.statut === 'valide')).toBe(true)
	})

	it('Notion en panne : le JSON, sans planter', async () => {
		env.NOTION_API_KEY = 'cle-de-test'
		env.NOTION_FAITS_DECLARATIONS_DATABASE_ID = 'base'
		vi.spyOn(console, 'error').mockImplementation(() => undefined)
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('boom', { status: 500 })))
		const liste = await chargerDeclarations(false)
		expect(liste.some((d) => d.auteur === 'Dario Amodei')).toBe(true)
		vi.unstubAllGlobals()
	})

	it('Notion répond : ses lignes remplacent le JSON, triées par date', async () => {
		env.NOTION_API_KEY = 'cle-de-test'
		env.NOTION_FAITS_SONDAGES_DATABASE_ID = 'base'
		const page = (id: string, date: string) => ({
			id,
			properties: {
				Titre: titre(`Sondage ${id}`),
				Organisme: txt('Org'),
				Date: jour(date),
				Répondants: txt('100 experts'),
				Chiffre: txt('10 %'),
				Résultat: txt('Résultat'),
				...source
			}
		})
		const appel = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					results: [page('a', '2020-01-01'), page('b', '2024-06-01')],
					has_more: false,
					next_cursor: null
				})
			)
		)
		vi.stubGlobal('fetch', appel)
		const liste = await chargerSondages(false)
		expect(liste.map((s) => s.id)).toEqual(['b', 'a'])
		// Seules les lignes cochées « Visible » sont demandées à Notion.
		const corps = JSON.parse((appel.mock.calls[0] as [string, { body: string }])[1].body) as {
			filter: unknown
		}
		expect(corps.filter).toEqual({ property: 'Visible', checkbox: { equals: true } })
		vi.unstubAllGlobals()
	})
})
