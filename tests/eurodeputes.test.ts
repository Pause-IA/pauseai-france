import { describe, expect, it } from 'vitest'
import data from '../src/lib/data/eurodeputes.json'
import {
	GROUPES_EUROPEENS,
	eurodeputes,
	eurodeputesDuGroupe,
	groupesPresents
} from '$lib/data/eurodeputes'
import { adresse } from '../scripts/generate-eurodeputes.mjs'

describe('eurodeputes.json', () => {
	it('les élu·es français·es, chacun·e avec une adresse officielle', () => {
		expect(data.eurodeputes.length).toBeGreaterThanOrEqual(70)
		for (const e of data.eurodeputes) {
			expect(e.email, e.nom).toMatch(/@(europarl|ep)\.europa\.eu$/)
			expect(e.contactUrl).toBe(`https://www.europarl.europa.eu/meps/fr/${e.id}`)
		}
	})

	it('identifiants uniques', () => {
		const ids = data.eurodeputes.map((e) => e.id)
		expect(new Set(ids).size).toBe(ids.length)
	})
})

describe('groupes', () => {
	it('chaque élu·e est dans un groupe proposé, et les totaux concordent', () => {
		const groupes = groupesPresents()
		expect(groupes.reduce((n, g) => n + g.nombre, 0)).toBe(eurodeputes.length)
		for (const g of groupes) expect(eurodeputesDuGroupe(g.sigle).length).toBe(g.nombre)
	})

	it('dans l’ordre de l’hémicycle, un sigle inconnu en dernier', () => {
		const ordre = GROUPES_EUROPEENS.map((g) => g.sigle)
		const connus = groupesPresents()
			.map((g) => g.sigle)
			.filter((s) => ordre.includes(s))
		expect(connus).toEqual([...connus].sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b)))
	})
})

describe('adresse (hasEmail de l’API)', () => {
	it('chaîne, liste ou objets JSON-LD ; préfère @europarl.europa.eu', () => {
		expect(adresse('mailto:a.b@europarl.europa.eu')).toBe('a.b@europarl.europa.eu')
		expect(adresse(['mailto:a@ep.europa.eu', 'mailto:a@europarl.europa.eu'])).toBe(
			'a@europarl.europa.eu'
		)
		expect(adresse([{ id: 'mailto:x@ep.europa.eu' }])).toBe('x@ep.europa.eu')
		expect(adresse(undefined)).toBeNull()
		expect(adresse(42)).toBeNull()
	})
})
