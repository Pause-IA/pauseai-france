import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { env } = vi.hoisted(() => ({ env: {} as Record<string, string> }))
vi.mock('$env/dynamic/private', () => ({ env }))

import { trouverDepartement } from '$lib/departements'
import {
	construireMessage,
	echapperDiscord,
	messageDepuisNotion
} from '$lib/server/bienvenueGroupeLocal'
import { POST } from '../src/routes/api/bienvenue-groupe-local/+server'

const PSEUDO = "Sur discord, quel est votre nom d'utilisateur ?"
const DEPT = 'Numéro du département'

/** Forme probable d'un envoi Notion (page complète sous `data`). */
const notion = (pseudo: string, dept: string) => ({
	source: { type: 'automation' },
	data: {
		object: 'page',
		id: 'abc',
		properties: {
			Nom: { id: 'title', type: 'title', title: [{ plain_text: 'Dupont' }] },
			Email: { id: 'x', type: 'rich_text', rich_text: [{ plain_text: 'bob@example.org' }] },
			[PSEUDO]: { id: 'p', type: 'rich_text', rich_text: [{ plain_text: pseudo }] },
			[DEPT]: { id: 'd', type: 'rich_text', rich_text: [{ plain_text: dept }] }
		}
	}
})

describe('trouverDepartement', () => {
	it.each([
		['01', '01', 'Ain'],
		['1', '01', 'Ain'],
		[' 75 ', '75', 'Paris'],
		['2a', '2A', 'Corse-du-Sud'],
		['2B', '2B', 'Haute-Corse'],
		['974', '974', 'La Réunion'],
		['33 - Gironde', '33', 'Gironde'],
		['75011', '75', 'Paris'],
		['97400', '974', 'La Réunion'],
		['20000', '2A', 'Corse-du-Sud'],
		['20200', '2B', 'Haute-Corse'],
		['Bouches du Rhone', '13', 'Bouches-du-Rhône'],
		['Réunion', '974', 'La Réunion']
	])('%s → %s', (saisie, code, nom) => {
		expect(trouverDepartement(saisie)).toEqual({ code, nom })
	})

	it('renvoie null pour une saisie inconnue', () => {
		expect(trouverDepartement('')).toBeNull()
		expect(trouverDepartement('20')).toBeNull()
		expect(trouverDepartement('Atlantide')).toBeNull()
	})
})

describe('message', () => {
	it('format attendu par Antonin', () => {
		expect(construireMessage('bob.dupont', '1')).toBe(
			'bob.dupont souhaite rejoindre un groupe local dans le département "Ain" (01)'
		)
	})

	it('neutralise la mise en forme Discord', () => {
		expect(echapperDiscord('bob_dupont')).toBe('bob\\_dupont')
		expect(echapperDiscord('**gras**\n# titre')).toBe('\\*\\*gras\\*\\* \\# titre')
	})

	it('retire un @ initial', () => {
		expect(construireMessage('@bob', '75')).toMatch(/^bob souhaite/)
	})

	it('sans pseudo ni département connu', () => {
		expect(construireMessage('', 'Atlantide')).toBe(
			'Une personne (pas de pseudo Discord indiqué) souhaite rejoindre un groupe local dans le département "Atlantide"'
		)
		expect(construireMessage('bob', '')).toBe('bob souhaite rejoindre un groupe local')
	})

	it('lit un envoi Notion et ignore les autres champs', () => {
		const m = messageDepuisNotion(notion('bob_dupont', '01'))
		expect(m).toBe('bob\\_dupont souhaite rejoindre un groupe local dans le département "Ain" (01)')
		expect(m).not.toContain('example.org')
		expect(m).not.toContain('Dupont')
	})

	it('accepte des propriétés simples ou au premier niveau', () => {
		expect(messageDepuisNotion({ properties: { [PSEUDO]: 'bob', [DEPT]: '75' } })).toBe(
			'bob souhaite rejoindre un groupe local dans le département "Paris" (75)'
		)
		expect(
			messageDepuisNotion({
				data: {
					properties: {
						[DEPT]: { type: 'number', number: 6 },
						[PSEUDO]: { type: 'select', select: { name: 'bob' } }
					}
				}
			})
		).toBe('bob souhaite rejoindre un groupe local dans le département "Alpes-Maritimes" (06)')
	})

	it("renvoie null quand ce n'est pas une inscription", () => {
		expect(messageDepuisNotion({})).toBeNull()
		expect(messageDepuisNotion({ data: { properties: { Nom: 'x' } } })).toBeNull()
	})
})

describe('POST /api/bienvenue-groupe-local', () => {
	const fetchMock = vi.fn()
	const appel = (body: unknown, secret?: string) =>
		POST({
			request: new Request('https://pauseia.fr/api/bienvenue-groupe-local', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(secret ? { 'X-PauseIA-Secret': secret } : {})
				},
				body: typeof body === 'string' ? body : JSON.stringify(body)
			})
		} as never) as Promise<Response>

	beforeEach(() => {
		env.NOTION_BIENVENUE_SECRET = 'le-secret'
		env.DISCORD_BIENVENUE_WEBHOOK_URL = 'https://discord.test/webhook'
		fetchMock.mockReset().mockResolvedValue(new Response(null, { status: 204 }))
		vi.stubGlobal('fetch', fetchMock)
		vi.spyOn(console, 'log').mockImplementation(() => {})
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
	})

	it('poste dans Discord sans mention possible', async () => {
		const res = await appel(notion('bob_dupont', '01'), 'le-secret')
		expect(res.status).toBe(200)
		expect(fetchMock).toHaveBeenCalledOnce()
		const [url, init] = fetchMock.mock.calls[0]
		expect(url).toBe('https://discord.test/webhook')
		expect(JSON.parse(init.body)).toEqual({
			content: 'bob\\_dupont souhaite rejoindre un groupe local dans le département "Ain" (01)',
			allowed_mentions: { parse: [] }
		})
	})

	it('refuse un mauvais secret ou son absence', async () => {
		expect((await appel(notion('bob', '01'), 'faux')).status).toBe(401)
		expect((await appel(notion('bob', '01'))).status).toBe(401)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('503 si non configuré', async () => {
		env.DISCORD_BIENVENUE_WEBHOOK_URL = ''
		expect((await appel(notion('bob', '01'), 'le-secret')).status).toBe(503)
	})

	it('ignore (200) un message vide ou illisible, pour ne pas mettre Notion en pause', async () => {
		expect((await appel({ data: {} }, 'le-secret')).status).toBe(200)
		expect((await appel('pas du json', 'le-secret')).status).toBe(200)
		expect(fetchMock).not.toHaveBeenCalled()
	})

	it('502 si Discord refuse', async () => {
		fetchMock.mockResolvedValue(new Response(null, { status: 404 }))
		expect((await appel(notion('bob', '01'), 'le-secret')).status).toBe(502)
	})

	it('ne journalise aucune donnée personnelle', async () => {
		await appel(notion('bob_dupont', '01'), 'le-secret')
		const journaux = [console.log, console.warn, console.error]
			.flatMap((f) => (f as unknown as { mock: { calls: unknown[][] } }).mock.calls.flat())
			.join(' ')
		expect(journaux).not.toMatch(/bob|Ain/)
	})
})
