import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { sommaire, essentiel } from '../src/lib/data/ressources-decideurs'

const page = readFileSync(
	new URL('../src/routes/[lang=lang]/ressources-decideurs/+page.svelte', import.meta.url),
	'utf-8'
)

describe('note de synthèse pour les décideurs', () => {
	// Le sommaire est écrit à la main dans le fichier de données : si une
	// section est renommée ou supprimée, l'ancre reste et ne mène nulle part.
	// Le lecteur clique, rien ne bouge, et rien ne le signale.
	it('chaque entrée du sommaire pointe sur une ancre qui existe', () => {
		for (const { id } of sommaire) {
			expect(page, `l'ancre #${id} du sommaire n'existe pas dans la page`).toContain(`id="${id}"`)
		}
	})

	it('le sommaire couvre toutes les sections titrées de la page', () => {
		const ancres = [...page.matchAll(/<SectionTitle id="([^"]+)"/g)].map((m) => m[1])
		const manquantes = ancres.filter((a) => !sommaire.some((e) => e.id === a))
		expect(manquantes, `sections absentes du sommaire : ${manquantes.join(', ')}`).toEqual([])
	})

	it("l'essentiel tient en trois points", () => {
		expect(essentiel).toHaveLength(3)
		for (const point of essentiel) {
			expect(point.fort.length).toBeGreaterThan(20)
			expect(point.suite.length).toBeGreaterThan(20)
		}
	})
})
