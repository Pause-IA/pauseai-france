#!/usr/bin/env node
/**
 * Génère src/lib/data/eurodeputes.json : les 81 député·es européen·nes élu·es
 * en France, pour l'outil « Écrire à vos élus ».
 *
 *   node scripts/generate-eurodeputes.mjs      (ou pnpm run generate-eurodeputes)
 *
 * Source : le service de données ouvertes du Parlement européen
 * (data.europarl.europa.eu, API v2), le même que le CRM
 * (utils/extract_eurodeputes.py). Il publie l'adresse électronique de chaque
 * élu·e (`hasEmail`) : rien n'est deviné d'après une convention de nommage.
 *
 * Un appel pour la liste des élu·es en exercice (`meps/show-current`), puis un
 * appel de détail seulement pour celles et ceux qu'on ne connaît pas encore :
 * l'adresse et la civilité ne changent pas, on les reprend du fichier existant.
 * L'API limite le débit (HTTP 429) : pause entre deux appels, et reprises.
 *
 * Sortie canonique (ordre stable) et `generatedAt` conservé tant que le
 * contenu ne change pas : le fichier ne bouge que si un·e élu·e change, comme
 * elus.json (voir src/lib/data/README-elus.md).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'src/lib/data/eurodeputes.json')
const API = 'https://data.europarl.europa.eu/api/v2'
const PAUSE_MS = 1000
const ESSAIS = 6

/**
 * @typedef {{ givenName?: string, familyName?: string, hasEmail?: unknown, hasGender?: string }} Detail
 * @typedef {{ id: string, nom: string, civ: string | null, groupe: string | null, email: string | null, contactUrl: string, photo: string }} Fiche
 */

/** @type {Record<string, string>} */
const CIV = {
	'http://publications.europa.eu/resource/authority/human-sex/MALE': 'M',
	'http://publications.europa.eu/resource/authority/human-sex/FEMALE': 'Mme'
}

const attendre = (/** @type {number} */ ms) => new Promise((r) => setTimeout(r, ms))

/**
 * @param {string} path
 * @param {Record<string, string>} [params]
 * @returns {Promise<any>}
 */
async function get(path, params = {}) {
	const url = `${API}/${path}${Object.keys(params).length ? '?' + new URLSearchParams(params) : ''}`
	let derniere
	for (let i = 0; i < ESSAIS; i++) {
		try {
			const res = await fetch(url, { headers: { Accept: 'application/ld+json' } })
			if (res.status === 204) return { data: [] }
			if (res.status === 429) {
				const ra = Number(res.headers.get('retry-after')) || 0
				await attendre(Math.max(ra * 1000, 3000 * 2 ** i))
				derniere = new Error('HTTP 429')
				continue
			}
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			const texte = (await res.text()).trim()
			if (!texte) throw new Error('réponse vide')
			return JSON.parse(texte)
		} catch (e) {
			derniere = e
			await attendre(1000 * 2 ** i)
		}
	}
	throw derniere
}

/**
 * `hasEmail` : une chaîne, une liste ou des objets JSON-LD ; on préfère @europarl.europa.eu.
 * @param {unknown} valeur
 * @returns {string | null}
 */
export function adresse(valeur) {
	const brutes = typeof valeur === 'string' ? [valeur] : Array.isArray(valeur) ? valeur : []
	const adresses = brutes
		.map((b) => (b && typeof b === 'object' ? b.id || b.value || '' : b))
		.filter((b) => typeof b === 'string')
		.map((b) =>
			b
				.trim()
				.replace(/^mailto:/, '')
				.trim()
		)
		.filter(Boolean)
	return adresses.find((a) => a.endsWith('@europarl.europa.eu')) ?? adresses[0] ?? null
}

const fiche = (/** @type {string} */ id) => `https://www.europarl.europa.eu/meps/fr/${id}`
const portrait = (/** @type {string} */ id) => `https://www.europarl.europa.eu/mepphoto/${id}.jpg`

async function main() {
	const ancien = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : null
	/** @type {Map<string, Fiche>} */
	const cache = new Map(
		(ancien?.eurodeputes ?? [])
			.filter((/** @type {Fiche} */ e) => e.email)
			.map((/** @type {Fiche} */ e) => [e.id, e])
	)

	const liste = (await get('meps/show-current', { 'country-of-representation': 'FR' })).data ?? []
	if (!liste.length)
		throw new Error('Aucun·e élu·e renvoyé·e pour FR : le point d’accès a-t-il changé ?')
	console.log(`${liste.length} élu·es en exercice (${cache.size} déjà connu·es)`)

	/** @type {Fiche[]} */
	const sortie = []
	/** @type {string[]} */
	const sansEmail = []
	for (const m of liste) {
		const id = String(m.identifier)
		const groupe = m['api:political-group'] ?? null
		const connu = cache.get(id)
		if (connu) {
			// Le groupe peut changer en cours de mandat : on le relit toujours.
			sortie.push({ ...connu, groupe, contactUrl: fiche(id), photo: portrait(id) })
			continue
		}
		/** @type {Detail} */
		let detail = {}
		try {
			detail = (await get(`meps/${id}`)).data?.[0] ?? {}
		} catch (e) {
			console.warn(
				`  ! ${m.label ?? id} : détail indisponible (${e instanceof Error ? e.message : e})`
			)
		}
		const prenom = detail.givenName ?? m.givenName ?? ''
		const nom = detail.familyName ?? m.familyName ?? ''
		const email = adresse(detail.hasEmail)
		if (!email) sansEmail.push(`${prenom} ${nom}`)
		sortie.push({
			id,
			nom: `${prenom} ${nom}`.trim(),
			civ: (detail.hasGender && CIV[detail.hasGender]) || null,
			groupe,
			email,
			contactUrl: fiche(id),
			photo: portrait(id)
		})
		console.log(`  + ${prenom} ${nom}`)
		await attendre(PAUSE_MS)
	}

	// Un passage étranglé par l'API rendrait un fichier dégradé : on garde l'ancien.
	if (sansEmail.length > liste.length / 4) {
		throw new Error(
			`${sansEmail.length}/${liste.length} sans adresse : l’API a sans doute limité le débit. Fichier inchangé, relancer plus tard.`
		)
	}

	const cle = (/** @type {Fiche} */ e) => e.nom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
	sortie.sort((a, b) => cle(a).localeCompare(cle(b)))
	const eurodeputes = sortie.map((e) => ({
		civ: e.civ ?? null,
		contactUrl: e.contactUrl,
		email: e.email ?? null,
		groupe: e.groupe ?? null,
		id: e.id,
		nom: e.nom,
		photo: e.photo
	}))
	const inchange = ancien && JSON.stringify(ancien.eurodeputes) === JSON.stringify(eurodeputes)
	const donnees = {
		eurodeputes,
		generatedAt: inchange ? ancien.generatedAt : new Date().toISOString().slice(0, 10),
		source: `${API}/meps/show-current?country-of-representation=FR`
	}
	writeFileSync(OUT, JSON.stringify(donnees, null, '\t') + '\n')
	console.log(`${inchange ? 'Inchangé' : 'Écrit'} : ${OUT} (${eurodeputes.length} élu·es)`)
	if (sansEmail.length) console.log(`  Sans adresse : ${sansEmail.join(', ')}`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	main().catch((e) => {
		console.error(e.message)
		process.exit(1)
	})
}
