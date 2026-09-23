import { describe, expect, it } from 'vitest'
import { countryKey, countryLabel } from '../src/lib/countries'

describe('pays', () => {
	it.each([
		['France', 'FR'],
		['france ', 'FR'],
		['Germany', 'DE'],
		['Allemagne', 'DE'],
		['United States', 'US'],
		['USA', 'US'],
		['United Kingdom', 'GB'],
		['UK', 'GB'],
		['The Netherlands', 'NL'],
		['Côte d’Ivoire', 'CI']
	])('%s → %s', (name, code) => {
		expect(countryKey(name)).toBe(code)
	})

	it('pays inconnu : conservé tel quel', () => {
		expect(countryKey('Atlantis')).toBe('Atlantis')
		expect(countryKey('')).toBeUndefined()
	})

	it('libellés traduits', () => {
		expect(countryLabel('DE', 'fr')).toBe('Allemagne')
		expect(countryLabel('DE', 'en')).toBe('Germany')
		expect(countryLabel('Atlantis', 'fr')).toBe('Atlantis')
	})
})
