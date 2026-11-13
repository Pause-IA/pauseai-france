import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { slug, cleDuFichier } from '../scripts/photos-evenements.mjs'

describe('photos des actions locales', () => {
	it('fabrique un nom de fichier lisible et sans accent', () => {
		expect(slug('Manifestation à Lyon')).toBe('manifestation-a-lyon')
		expect(slug('Tractage — gare de l’Est')).toBe('tractage-gare-de-l-est')
		expect(slug('   ')).toBe('action')
	})

	// Le point central, comme pour l'équipe : Notion resigne l'URL à chaque
	// requête. Une clé qui inclurait la signature ferait retélécharger toutes
	// les photos à chaque build.
	it('ignore la signature S3, qui change à chaque requête', () => {
		const base = 'https://prod-files-secure.s3.us-west-2.amazonaws.com/ws/abc/manif.jpg'
		expect(cleDuFichier(`${base}?X-Amz-Signature=aaa&X-Amz-Date=1`)).toBe(
			cleDuFichier(`${base}?X-Amz-Signature=bbb&X-Amz-Date=2`)
		)
	})

	it('change de clé quand le fichier téléversé change', () => {
		const a = 'https://prod-files-secure.s3.amazonaws.com/ws/abc/manif.jpg?X-Amz-Signature=x'
		const b = 'https://prod-files-secure.s3.amazonaws.com/ws/def/manif.jpg?X-Amz-Signature=x'
		expect(cleDuFichier(a)).not.toBe(cleDuFichier(b))
	})

	it('ne jette pas sur une URL mal formée', () => {
		expect(cleDuFichier('pas-une-url')).toMatch(/^[0-9a-f]{16}$/)
	})

	// La page demande au plus 1100 px au CDN : au-delà on versionnerait des
	// pixels invisibles, dans un dépôt git.
	it('ramène une grande photo à 1200 px de large et allège le fichier', async () => {
		const grande = await sharp({
			create: { width: 4000, height: 3000, channels: 3, background: '#ff9416' }
		})
			.jpeg({ quality: 100 })
			.toBuffer()

		const reduite = await sharp(grande)
			.rotate()
			.resize({ width: 1200, withoutEnlargement: true })
			.webp({ quality: 72 })
			.toBuffer()

		const meta = await sharp(reduite).metadata()
		expect(meta.width).toBe(1200)
		expect(meta.format).toBe('webp')
		expect(reduite.byteLength).toBeLessThan(grande.byteLength / 4)
	})

	it("n'agrandit pas une photo déjà petite", async () => {
		const petite = await sharp({
			create: { width: 600, height: 400, channels: 3, background: '#0e2433' }
		})
			.jpeg()
			.toBuffer()

		const sortie = await sharp(petite)
			.rotate()
			.resize({ width: 1200, withoutEnlargement: true })
			.webp({ quality: 72 })
			.toBuffer()

		expect((await sharp(sortie).metadata()).width).toBe(600)
	})
})

describe('instantané des actions locales', () => {
	const lire = async () =>
		JSON.parse(await readFile(new URL('../src/lib/data/evenements.json', import.meta.url), 'utf-8'))
			.evenements

	// Cet instantané est le repli servi quand Notion ne répond pas. Un fichier
	// mal formé ne se verrait qu'au moment d'une panne, c'est-à-dire au pire
	// moment.
	it('a la forme attendue par getLocalEvents()', async () => {
		const actions = await lire()
		expect(Array.isArray(actions)).toBe(true)

		for (const a of actions) {
			expect(typeof a.id).toBe('string')
			expect(a.title).toBeTruthy()
			// isValidLocalEvent() refuse une action sans date : l'instantané ne
			// doit pas en contenir, sinon le repli serait plus pauvre que Notion.
			expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}/)
			expect(typeof a.city).toBe('string')
			expect(typeof a.featured).toBe('boolean')
			expect(typeof a.volunteers).toBe('number')
			expect(Array.isArray(a.images)).toBe(true)
			// Une photo citée mais absente du dépôt s'afficherait cassée.
			for (const image of a.images) {
				expect(image).toMatch(/^\/evenements\/[a-z0-9./-]+\.webp$/)
				expect(existsSync(new URL('../static' + image, import.meta.url))).toBe(true)
			}
		}
	})

	it("n'a pas deux fois la même action ni le même fichier", async () => {
		const actions = await lire()
		const ids = actions.map((a: { id: string }) => a.id)
		expect(new Set(ids).size).toBe(ids.length)

		const images = actions.flatMap((a: { images: string[] }) => a.images)
		expect(new Set(images).size).toBe(images.length)
	})
})
