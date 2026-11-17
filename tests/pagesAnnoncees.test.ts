import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/* Le prérendu ne génère que les pages que le robot atteint en suivant les
   liens depuis l'accueil, ou que svelte.config.js liste dans
   prerender.entries. Une page non atteinte n'existe pas : elle répond 404.

   Le sitemap, lui, est construit à partir des fichiers de src/posts. Quatre
   pages s'y trouvaient donc annoncées aux moteurs de recherche alors qu'elles
   répondaient 404, dont « videos », vers laquelle une redirection 301
   pointait encore.

   Le test calcule l'accessibilité de proche en proche : on part du menu et du
   pied de page, puis on ajoute les pages liées depuis une page déjà atteinte.
   Sans cela, trois pages de démonstration qui se citent l'une l'autre se
   déclaraient accessibles entre elles, en cercle, sans que rien n'y mène. */

const RACINE = 'src/posts'
const CONFIG = readFileSync('svelte.config.js', 'utf-8')
const DEPARTS = ['src/lib/components/Header.svelte', 'src/lib/components/Footer.svelte'].filter(
	existsSync
)

const pages = readdirSync(RACINE)
	.filter((f) => f.endsWith('.md'))
	.map((f) => ({ slug: f.replace(/\.md$/, ''), source: readFileSync(join(RACINE, f), 'utf-8') }))

const cite = (texte: string, slug: string) =>
	texte.includes(`/${slug}"`) || texte.includes(`/${slug})`) || texte.includes(`/${slug}'`)

/** Pages atteintes depuis le menu, puis de proche en proche. */
function atteignables(): Set<string> {
	const vus = new Set<string>()
	let textes = DEPARTS.map((f) => readFileSync(f, 'utf-8'))
	for (;;) {
		const nouveaux = pages.filter((p) => !vus.has(p.slug) && textes.some((t) => cite(t, p.slug)))
		if (nouveaux.length === 0) return vus
		for (const p of nouveaux) vus.add(p.slug)
		textes = nouveaux.map((p) => p.source)
	}
}

const joignables = atteignables()

describe('pages annoncées et pages réellement générées', () => {
	it('il existe des pages à vérifier', () => {
		expect(pages.length).toBeGreaterThan(0)
	})

	it('le menu mène bien quelque part', () => {
		expect(joignables.size).toBeGreaterThan(3)
	})

	it.each(pages)('« $slug » est atteignable, prérendue ou brouillon', ({ slug, source }) => {
		const brouillon = /^brouillon:\s*true\s*$/m.test(source)
		const prerendue = CONFIG.includes(`'/fr/${slug}'`)
		expect(
			brouillon || prerendue || joignables.has(slug),
			`« ${slug} » n'est atteignable par aucun lien depuis le menu et n'est pas dans ` +
				`prerender.entries : elle sera annoncée dans le sitemap et répondra 404. Ajoutez-la ` +
				`au menu, à prerender.entries, ou marquez-la « brouillon: true ».`
		).toBe(true)
	})
})
