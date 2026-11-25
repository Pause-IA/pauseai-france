import { describe, it, expect } from 'vitest'
import { localGroups } from '../src/lib/data/local-groups'

/* Règle : une ville en création n'a pas de référent sur place, donc personne
   pour répondre. Son adresse n'est pas dans la table Notion et ne doit pas
   apparaître sur le site — publier une adresse sans destinataire, c'est
   laisser un message sans réponse. Un test plutôt qu'un commentaire : la
   règle ne tient que si elle est vérifiée. Le jour où quelqu'un ajoute
   « forming: true » en gardant l'adresse, la CI le dit.

   Quand un référent arrive, on retire « forming » ET on ajoute l'adresse,
   dans le même changement. */

const ADRESSE = /^[a-z0-9-]+@pauseia\.fr$/

describe('groupes locaux', () => {
	it('il y a des groupes à vérifier', () => {
		expect(localGroups.length).toBeGreaterThan(0)
	})

	it.each(localGroups.filter((g) => g.forming).map((g) => ({ nom: g.name, email: g.email })))(
		'$nom est en création, donc sans adresse de contact',
		({ email }) => {
			expect(email).toBeUndefined()
		}
	)

	it.each(localGroups.filter((g) => !g.forming && !g.inactif).map((g) => ({ nom: g.name, g })))(
		'$nom est un groupe actif, donc joignable',
		({ g }) => {
			expect(g.email).toBeTruthy()
		}
	)

	it.each(localGroups.filter((g) => g.email).map((g) => ({ nom: g.name, email: g.email })))(
		'$nom : $email est une adresse de groupe, pas une adresse personnelle',
		({ email }) => {
			expect(email).toMatch(ADRESSE)
		}
	)

	it('les villes sont uniques', () => {
		const noms = localGroups.map((g) => g.name)
		expect(new Set(noms).size).toBe(noms.length)
	})

	it('les adresses sont uniques', () => {
		const mails = localGroups.map((g) => g.email).filter(Boolean)
		expect(new Set(mails).size).toBe(mails.length)
	})
})

describe('instantané versionné', () => {
	it('chaque ville a des coordonnées utilisables', () => {
		for (const g of localGroups) {
			expect(Number.isFinite(g.lat), g.name).toBe(true)
			expect(Number.isFinite(g.lon), g.name).toBe(true)
			// France métropolitaine, grossièrement : une coordonnée oubliée à 0
			// placerait la ville dans le golfe de Guinée.
			expect(g.lat, g.name).toBeGreaterThan(41)
			expect(g.lat, g.name).toBeLessThan(52)
			expect(g.lon, g.name).toBeGreaterThan(-6)
			expect(g.lon, g.name).toBeLessThan(10)
		}
	})
})
