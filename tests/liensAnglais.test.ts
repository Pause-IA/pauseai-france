import { describe, expect, it } from 'vitest'
import { estEnAnglais, HOTES_ANGLOPHONES } from '../src/lib/liensAnglais'

describe('estEnAnglais', () => {
	it('reconnaît un domaine de la liste', () => {
		expect(estEnAnglais('https://arxiv.org/abs/2001.08361')).toBe(true)
		expect(estEnAnglais('https://www.safe.ai/work/statement-on-ai-risk')).toBe(true)
		expect(estEnAnglais('https://pauseai.info/building-the-pause-button')).toBe(true)
	})

	it('ignore la casse et le « www. »', () => {
		expect(estEnAnglais('https://WWW.ArXiv.org/abs/1')).toBe(true)
	})

	it('laisse tranquille un domaine absent de la liste', () => {
		expect(estEnAnglais('https://www.lemonde.fr/article')).toBe(false)
		expect(estEnAnglais('https://cesia.org/fr/publications/')).toBe(false)
		// Sites bilingues volontairement hors liste : les signaler serait faux.
		expect(estEnAnglais('https://www.un.org/global-dialogue-ai-governance/fr')).toBe(false)
		expect(estEnAnglais('https://www.unesco.org/en/articles/x')).toBe(false)
	})

	it('ne signale pas la version française d’un site anglophone', () => {
		expect(estEnAnglais('https://pauseai.info/fr/statement')).toBe(false)
		expect(estEnAnglais('https://pauseai.info/fr')).toBe(false)
	})

	it('ne signale ni les liens internes, ni mailto, ni une adresse invalide', () => {
		expect(estEnAnglais('/fr/propositions')).toBe(false)
		expect(estEnAnglais('mailto:contact@pauseia.fr')).toBe(false)
		expect(estEnAnglais('#ancre')).toBe(false)
		expect(estEnAnglais('')).toBe(false)
	})

	it('refuse un protocole autre que http(s)', () => {
		expect(estEnAnglais('javascript:alert(1)//arxiv.org')).toBe(false)
	})

	it('la liste ne contient ni « www. », ni majuscule, ni chemin', () => {
		for (const hote of HOTES_ANGLOPHONES) {
			expect(hote).toBe(hote.toLowerCase())
			expect(hote.startsWith('www.')).toBe(false)
			expect(hote).not.toContain('/')
		}
	})
})
