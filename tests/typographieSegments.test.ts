import { describe, expect, it } from 'vitest'

import { typographierSegments, typographierTexte } from '../src/lib/typographieSegments'

const NB = ' ' // insécable
const FINE = ' ' // insécable fine

describe('typographie des textes venus de Notion', () => {
	it('guillemets droits ou anglais -> « … » avec insécables', () => {
		expect(typographierTexte('On parle de "boîte noire" ici.')).toBe(
			`On parle de «${NB}boîte noire${NB}» ici.`
		)
		expect(typographierTexte('“Débrancher” n’est plus simple')).toBe(
			`«${NB}Débrancher${NB}» n’est plus simple`
		)
	})

	it('espaces insécables avant : ; ! ? et %', () => {
		expect(typographierTexte('Attention: vraiment? Oui! 10%; fin')).toBe(
			`Attention${NB}: vraiment${FINE}? Oui${FINE}! 10${FINE}%${FINE}; fin`
		)
	})

	it('apostrophes typographiques', () => {
		expect(typographierTexte("l'IA n'est pas")).toBe('l’IA n’est pas')
	})

	it('les adresses web restent intactes', () => {
		expect(typographierTexte('https://exemple.org:8080/page?x=1')).toBe(
			'https://exemple.org:8080/page?x=1'
		)
		expect(typographierTexte('Voir https://exemple.org/a?b=1 : merci')).toBe(
			`Voir https://exemple.org/a?b=1${NB}: merci`
		)
	})

	it('heures et numéros non touchés par les deux-points', () => {
		expect(typographierTexte('À 10:30 précises')).toBe('À 10:30 précises')
	})

	it('idempotent : appliquer deux fois ne change rien', () => {
		const une = typographierTexte('Il dit "non" : vraiment ? 5 %')
		expect(typographierTexte(une)).toBe(une)
	})

	it('un guillemet ouvert dans un segment se ferme dans le suivant', () => {
		const segs = typographierSegments([
			{ texte: 'Ils disent "', gras: false },
			{ texte: 'ce n’est que du code', gras: true },
			{ texte: '" et passent.', gras: false }
		])
		expect(segs.map((s) => s.texte)).toEqual([
			`Ils disent «${NB}`,
			'ce n’est que du code',
			`${NB}» et passent.`
		])
		expect(segs[1].gras).toBe(true) // la mise en forme est conservée
	})

	it('pas de double espace devant un « : » qui commence un segment', () => {
		const segs = typographierSegments([{ texte: 'Le danger ' }, { texte: ': réel' }])
		expect(segs.map((s) => s.texte).join('')).toBe(`Le danger${NB}: réel`)
	})

	it('guillemets déjà français : espaces normalisées', () => {
		expect(typographierTexte('« bonjour »')).toBe(`«${NB}bonjour${NB}»`)
	})
})
