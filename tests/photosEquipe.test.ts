import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { slug, cleDuFichier } from '../scripts/photos-equipe.mjs'

describe('photos d’équipe', () => {
	it('fabrique un nom de fichier lisible et sans accent', () => {
		expect(slug('Clémence Peyrot')).toBe('clemence-peyrot')
		expect(slug('Moïri Gamboni')).toBe('moiri-gamboni')
		expect(slug('Orlando H.')).toBe('orlando-h')
		expect(slug('   ')).toBe('sans-nom')
	})

	// Le point central : Notion resigne l'URL à chaque requête. Si la clé de
	// comparaison incluait la signature, toutes les photos seraient considérées
	// comme modifiées à chaque exécution et retéléchargées pour rien.
	it('ignore la signature S3, qui change à chaque requête', () => {
		const base = 'https://prod-files-secure.s3.us-west-2.amazonaws.com/ws/abc/photo.jpg'
		expect(cleDuFichier(`${base}?X-Amz-Signature=aaa&X-Amz-Date=1`)).toBe(
			cleDuFichier(`${base}?X-Amz-Signature=bbb&X-Amz-Date=2`)
		)
	})

	it('change de clé quand le fichier téléversé change', () => {
		const a = 'https://prod-files-secure.s3.amazonaws.com/ws/abc/photo.jpg?X-Amz-Signature=x'
		const b = 'https://prod-files-secure.s3.amazonaws.com/ws/def/photo.jpg?X-Amz-Signature=x'
		expect(cleDuFichier(a)).not.toBe(cleDuFichier(b))
	})

	it('ne jette pas sur une URL mal formée', () => {
		expect(cleDuFichier('pas-une-url')).toMatch(/^[0-9a-f]{16}$/)
	})

	// La compression est la seconde raison d'être du script : une photo de
	// téléphone pèse plusieurs méga-octets pour un affichage en 160 pixels.
	it('réduit une grande photo à 320 px et allège nettement le fichier', async () => {
		const grande = await sharp({
			create: { width: 2400, height: 1600, channels: 3, background: '#ff9416' }
		})
			.jpeg({ quality: 100 })
			.toBuffer()

		const reduite = await sharp(grande)
			.resize(320, 320, { fit: 'cover', position: 'attention' })
			.webp({ quality: 82 })
			.toBuffer()

		const meta = await sharp(reduite).metadata()
		expect(meta.width).toBe(320)
		expect(meta.height).toBe(320)
		expect(meta.format).toBe('webp')
		expect(reduite.byteLength).toBeLessThan(grande.byteLength / 4)
	})
})

describe("instantané de l'équipe", () => {
	// Cet instantané est le repli servi quand Notion ne répond pas pendant un
	// build. Un fichier mal formé ne se verrait qu'au moment d'une panne, c'est-
	// à-dire au pire moment : on en vérifie la forme ici.
	it('a la forme attendue par getTeamMembers()', async () => {
		const { membres } = JSON.parse(
			await readFile(new URL('../src/lib/data/equipe.json', import.meta.url), 'utf-8')
		)
		expect(Array.isArray(membres)).toBe(true)

		for (const m of membres) {
			expect(typeof m.id).toBe('string')
			expect(m.name).toBeTruthy()
			expect(typeof m.role).toBe('string')
			expect(typeof m.profession).toBe('string')
			expect(['Direction', 'Conseil scientifique', 'Membre']).toContain(m.category)
			expect(typeof m.order).toBe('number')
			// Une fiche peut ne pas avoir de photo ; si elle en a une, le fichier
			// doit exister, sinon la page afficherait une image cassée.
			if (m.image) {
				expect(m.image).toMatch(/^\/equipe\/[a-z0-9-]+\.webp$/)
				expect(existsSync(new URL('../static' + m.image, import.meta.url))).toBe(true)
			}
		}
	})

	it("n'a pas deux fois la même personne ni le même fichier", async () => {
		const { membres } = JSON.parse(
			await readFile(new URL('../src/lib/data/equipe.json', import.meta.url), 'utf-8')
		)
		const ids = membres.map((m: { id: string }) => m.id)
		expect(new Set(ids).size).toBe(ids.length)

		const images = membres.map((m: { image: string }) => m.image).filter(Boolean)
		expect(new Set(images).size).toBe(images.length)
	})
})
