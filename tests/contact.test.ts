import { describe, expect, it } from 'vitest'
import { CATEGORIES, categorie } from '$lib/contact'
import { DESTINATAIRES, courriel, valider } from '$lib/server/contact'

const base = {
	categorie: 'technique',
	email: 'Ada@Example.org',
	message: 'Le site ne charge plus.'
}

describe('catégories de la page Contact', () => {
	it('chaque catégorie à formulaire a une adresse, et seulement elles', () => {
		for (const c of CATEGORIES) {
			expect(Boolean(DESTINATAIRES[c.cle]), c.cle).toBe(c.formulaire)
		}
	})

	it('les adresses sont celles du cahier des charges', () => {
		expect(DESTINATAIRES).toEqual({
			fresque: 'contact@pauseia.fr',
			local: 'initiatives@pauseia.fr',
			benevolat: 'benevoles@pauseia.fr',
			elu: 'plaidoyer@pauseia.fr',
			technique: 'tech@pauseia.fr',
			presse: 'presse@pauseia.fr'
		})
	})

	it('aucune adresse e-mail dans les données envoyées au navigateur', () => {
		expect(JSON.stringify(CATEGORIES)).not.toMatch(/@pauseia\.fr/)
	})

	it('clés uniques', () => {
		const cles = CATEGORIES.map((c) => c.cle)
		expect(new Set(cles).size).toBe(cles.length)
		expect(categorie('inconnue')).toBeUndefined()
	})
})

describe('valider', () => {
	it('accepte une demande et la nettoie', () => {
		const d = valider({ ...base, discord: '@bob_d', telephone: ' 06 12 ' })
		expect(d).toMatchObject({
			destinataire: 'tech@pauseia.fr',
			email: 'ada@example.org',
			discord: 'bob_d',
			telephone: '06 12'
		})
	})

	it('refuse une catégorie sans formulaire ou inventée', () => {
		expect(valider({ ...base, categorie: 'alignement' })).toHaveProperty('erreur')
		expect(valider({ ...base, categorie: 'question' })).toHaveProperty('erreur')
		expect(valider({ ...base, categorie: 'contact@pirate.example' })).toHaveProperty('erreur')
	})

	it('refuse un e-mail invalide ou un message vide', () => {
		expect(valider({ ...base, email: 'pas-un-mail' })).toHaveProperty('erreur')
		expect(valider({ ...base, message: '  ' })).toHaveProperty('erreur')
	})
})

describe('courriel', () => {
	it('répond à la personne et échappe le HTML', () => {
		const d = valider({ ...base, message: '<script>alert(1)</script> bonjour' })
		if ('erreur' in d) throw new Error(d.erreur)
		const m = courriel(d)
		expect(m.to).toBe('tech@pauseia.fr')
		expect(m.replyTo).toBe('ada@example.org')
		expect(m.html).not.toContain('<script>')
		expect(m.text).toContain('Téléphone : —')
	})
})
