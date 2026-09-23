import { describe, expect, it, vi } from 'vitest'
import { countryKey } from '../src/lib/countries'
import { counts, toEntries } from '../src/lib/declaration'
import { fetchGlobalSignatories } from '../src/lib/server/declarationGlobal'

// Correspondance avec pauseai.info/statement : chaque signataire publié par
// l'API de Global doit se retrouver exactement une fois dans notre liste, avec
// le même nom (ou « Anonyme » s'il est anonyme chez eux), le même pays et le
// message complet — et le total de la liste doit égaler le compteur.

vi.mock('$env/dynamic/private', () => ({ env: {} }))

interface Raw {
	name: string
	country?: string
	bio?: string
	date?: string
	private?: boolean
}

const LONG = 'Why I sign. '.repeat(400) // ~4 800 caractères
const raw: Raw[] = [
	{
		name: 'jane doe',
		country: 'United States',
		bio: 'Line one\nLine two',
		date: '2025-06-01T10:00:00.000Z',
		private: false
	},
	{
		name: 'Anonymous',
		country: 'France',
		bio: 'Anonymous but with a message',
		date: '2025-06-02T10:00:00.000Z',
		private: true
	},
	{ name: 'Élodie Ñúñez', country: 'france', date: '2025-06-03T10:00:00.000Z', private: false },
	{
		name: 'Long Writer',
		country: 'UK',
		bio: LONG,
		date: '2025-06-04T10:00:00.000Z',
		private: false
	},
	{ name: 'No Country', date: '2025-06-05T10:00:00.000Z', private: false },
	{ name: '', country: 'Germany', date: '2025-06-06T10:00:00.000Z', private: false },
	{ name: 'Undated', country: 'Atlantis' },
	...Array.from({ length: 2000 }, (_, i) => ({
		name: `Person ${i}`,
		country: ['Germany', 'USA', 'France', 'Netherlands'][i % 4],
		bio: i % 2 ? `Message ${i}` : undefined,
		date: new Date(Date.UTC(2025, 0, 1) + i * 60000).toISOString(),
		private: i % 10 === 0
	}))
]

const fetchGlobal = () =>
	fetchGlobalSignatories((() =>
		Promise.resolve(Response.json({ totalCount: raw.length, signatories: raw }))) as typeof fetch)

describe('correspondance avec la liste de PauseAI Global', () => {
	it('chaque signataire de Global apparaît exactement une fois, à l’identique', async () => {
		const global = await fetchGlobal()
		expect(global.signatories).toHaveLength(raw.length)

		const entries = toEntries({ local: null, global, globalFromSnapshot: false })
		const fromGlobal = entries.filter((e) => !e.local)
		expect(fromGlobal).toHaveLength(raw.length)

		// Multiensembles identiques : (nom affiché, pays, message).
		const key = (name: string, country: string | undefined, bio: string | undefined) =>
			JSON.stringify([name, countryKey(country), (bio ?? '').replace(/\s+/g, ' ').trim()])
		const expected = raw
			.map((s) => {
				const anon = s.private === true || !s.name || /^anonymous$/i.test(s.name)
				return key(anon ? '' : s.name, s.country, s.bio)
			})
			.sort()
		const got = fromGlobal.map((e) => key(e.anonymous ? '' : e.name, e.country, e.comment)).sort()
		expect(got).toEqual(expected)
	})

	it('aucun message tronqué (même ~5 000 caractères)', async () => {
		const global = await fetchGlobal()
		const long = global.signatories.find((s) => s.name === 'Long Writer')
		expect(long?.bio).toBe(LONG.trim())
	})

	it('anonymes : affichés comme chez Global, avec pays et message', async () => {
		const global = await fetchGlobal()
		const anon = global.signatories.filter((s) => s.anonymous)
		expect(anon).toHaveLength(raw.filter((s) => s.private === true || !s.name).length)
		expect(
			anon.some((s) => s.bio === 'Anonymous but with a message' && s.country === 'France')
		).toBe(true)
		// Le nom « Anonymous » n'est jamais montré tel quel : la page affiche « Anonyme ».
		expect(anon.every((s) => s.name === '')).toBe(true)
	})

	it('le total de la liste égale le compteur (Global + pauseia.fr)', async () => {
		const global = await fetchGlobal()
		const d = {
			local: { count: 12, signatories: [{ name: 'Ada Lovelace' }, { name: 'Alan Turing' }] },
			global,
			globalFromSnapshot: false
		}
		const entries = toEntries(d)
		expect(entries).toHaveLength(counts(d).worldCount ?? -1)
		// Nos 10 signataires non publics : « Anonyme », en France, sans message.
		const hidden = entries.filter((e) => e.local && e.anonymous)
		expect(hidden).toHaveLength(10)
		expect(hidden.every((e) => e.country === 'FR' && !e.comment)).toBe(true)
		// « En France » = nos 12 + tous les Français de Global (anonymes compris).
		const frGlobal = raw.filter((s) => countryKey(s.country) === 'FR').length
		expect(counts(d).franceCount).toBe(12 + frGlobal)
		expect(entries.filter((e) => e.country === 'FR')).toHaveLength(12 + frGlobal)
	})

	it('plus récents d’abord, sans perdre les signataires non datés', async () => {
		const global = await fetchGlobal()
		// Le plus récent : l'entrée sans nom du 6 juin (affichée « Anonyme »).
		expect(global.signatories[0]).toMatchObject({ anonymous: true, country: 'Germany' })
		expect(global.signatories[1].name).toBe('No Country')
		expect(global.signatories.at(-1)?.name).toBe('Undated')
	})
})
