/**
 * Versionne les actions des groupes locaux : les photos, et l'instantané des
 * fiches.
 *
 *   pnpm run photos-evenements
 *
 * Même problème, même remède que pour les photos de l'équipe
 * (scripts/photos-equipe.mjs) : Notion ne sert ses fichiers que derrière une
 * URL S3 SIGNÉE, qui expire au bout d'une heure environ. La page « groupes
 * locaux » passait ces URL au CDN d'images de Netlify ; tant qu'une variante
 * est en cache elle s'affiche, mais la première demande faite après
 * l'expiration échoue, et le repli `data-raw` pointe sur la même URL morte.
 * Une photo d'action finissait donc par disparaître sans que personne n'ait
 * rien touché.
 *
 * Les photos sont donc téléchargées une fois, redimensionnées, et versionnées
 * dans static/evenements/. Le site les sert depuis son propre domaine, et le
 * CDN Netlify continue de les compresser à la volée — il le fait tout aussi
 * bien sur un chemin local, sans dépendre de remote_images.
 *
 * Le script écrit aussi un instantané complet des fiches dans
 * src/lib/data/evenements.json : sans cela, une panne de Notion vide la page.
 * `getLocalEvents()` y retombe.
 *
 * Quand le lancer
 * ---------------
 * Jamais à la main en temps normal : `pnpm build` le lance (--build), donc une
 * photo ajoutée dans Notion est reprise au déploiement suivant. En mode build
 * il n'échoue jamais : ce qui est versionné sert de repli.
 *
 * Il faut NOTION_API_KEY et NOTION_EVENTS_DATABASE_ID : le script lit le .env
 * du dépôt (option --env-file-if-exists de Node, voir package.json).
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, readdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

// Même échappatoire que pour l'équipe : permet de lancer le script depuis un
// dossier qui a `sharp` d'installé quand le dépôt lui-même ne l'a pas.
const RACINE = process.env.PHOTOS_EQUIPE_RACINE
	? resolve(process.env.PHOTOS_EQUIPE_RACINE)
	: fileURLToPath(new URL('..', import.meta.url))
const DOSSIER = join(RACINE, 'static/evenements')
const MANIFESTE = join(RACINE, 'src/lib/data/evenements.json')

// La page demande au plus `w=1100` au CDN. Au-delà, on versionnerait des pixels
// que personne ne voit, dans un dépôt git. En dessous, la galerie des actions à
// la une serait floue. La qualité est basse à dessein : le CDN recompresse,
// c'est donc une source, pas un rendu final.
const LARGEUR = 1200
const QUALITE = 72

const BUILD = process.argv.includes('--build')

const CLE = process.env.NOTION_API_KEY
const BASE = process.env.NOTION_EVENTS_DATABASE_ID

/**
 * @param {string} nom
 * @returns {string}
 */
export function slug(nom) {
	return (
		nom
			.normalize('NFD')
			.replace(/[̀-ͯ]/g, '')
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '') || 'action'
	)
}

/**
 * Clé de changement : le chemin de l'objet S3, sans la signature. Il ne bouge
 * que si le fichier est remplacé dans Notion.
 * @param {string} url
 * @returns {string}
 */
export function cleDuFichier(url) {
	try {
		const u = new URL(url)
		return createHash('sha1')
			.update(u.origin + u.pathname)
			.digest('hex')
			.slice(0, 16)
	} catch {
		return createHash('sha1').update(url).digest('hex').slice(0, 16)
	}
}

/**
 * Toutes les URL d'une propriété Notion de type « files ».
 * @param {any} propriete
 * @returns {string[]}
 */
function urlsFichiers(propriete) {
	const fichiers = propriete?.files
	if (!Array.isArray(fichiers)) return []
	return fichiers
		.map((/** @type {any} */ f) => {
			if (f?.type === 'file' && f.file?.url) return f.file.url
			if (f?.type === 'external' && f.external?.url) return f.external.url
			return ''
		})
		.filter(Boolean)
}

/**
 * @param {any} propriete propriété Notion de type « title » ou « rich_text »
 * @returns {string}
 */
function texte(propriete) {
	if (!propriete) return ''
	const t = propriete.title ?? propriete.rich_text
	return Array.isArray(t) ? t.map((/** @type {any} */ x) => x.plain_text).join('') : ''
}

/** @param {any} p @returns {string} */
function choix(p) {
	return p?.select?.name ?? ''
}

/** @param {any} p @returns {string} */
function date(p) {
	return p?.date?.start ?? ''
}

/** @param {any} p @returns {string} */
function lien(p) {
	return p?.url ?? ''
}

/** @param {any} p @returns {number} */
function nombre(p) {
	return typeof p?.number === 'number' ? p.number : 0
}

/** @param {any} p @returns {boolean} */
function coche(p) {
	return p?.checkbox === true
}

/** @returns {Promise<any[]>} les pages de la base d'actions, toutes pages confondues */
async function fiches() {
	/** @type {any[]} */
	const pages = []
	/** @type {string | undefined} */
	let curseur
	do {
		const reponse = await fetch(`https://api.notion.com/v1/databases/${BASE}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${CLE}`,
				'Notion-Version': '2022-06-28',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(curseur ? { start_cursor: curseur } : {})
		})
		if (!reponse.ok) throw new Error(`Notion a répondu ${reponse.status} ${reponse.statusText}`)
		const data = await reponse.json()
		pages.push(...data.results)
		curseur = data.has_more ? data.next_cursor : undefined
	} while (curseur)
	return pages
}

/**
 * @typedef {{ id: string, title: string, date: string, city: string, type: string,
 *   url: string, time: string, place: string, description: string, images: string[],
 *   cles: string[], featured: boolean, volunteers: number }} Action
 */

async function main() {
	if (!CLE || !BASE) {
		console.error(
			'NOTION_API_KEY ou NOTION_EVENTS_DATABASE_ID manquant. Les photos déjà versionnées\n' +
				'restent en place : le site ne dépend pas de ce script pour fonctionner.'
		)
		if (!BUILD) process.exitCode = 1
		return
	}

	await mkdir(DOSSIER, { recursive: true })
	/** @type {Action[]} */
	const anciennes = existsSync(MANIFESTE)
		? (JSON.parse(await readFile(MANIFESTE, 'utf-8')).evenements ?? [])
		: []
	const ancienne = new Map(anciennes.map((/** @type {Action} */ a) => [a.id, a]))
	/** @type {Action[]} */
	const nouvelles = []
	let telecharges = 0
	let conserves = 0

	const pages = await fiches()

	// Une base vide est anormale : il y a toujours eu des actions passées.
	// Plutôt qu'une page sans rien, on garde ce qui est versionné.
	if (pages.length === 0) {
		console.error("Notion ne renvoie aucune action : l'instantané versionné est conservé.")
		if (!BUILD) process.exitCode = 1
		return
	}

	for (const page of pages) {
		if (!coche(page.properties?.Visible)) continue
		const titre = texte(page.properties?.Titre)
		const quand = date(page.properties?.Date)
		// Mêmes règles que isValidLocalEvent() : une fiche sans titre ni date
		// n'est pas affichable.
		if (!titre || !quand) continue

		/** @type {Action} */
		const action = {
			id: page.id,
			title: titre,
			date: quand,
			city: texte(page.properties?.Ville),
			type: choix(page.properties?.Type),
			url: lien(page.properties?.URL),
			time: texte(page.properties?.Heure),
			place: texte(page.properties?.Lieu),
			description: texte(page.properties?.Description),
			images: [],
			cles: [],
			featured: coche(page.properties?.['À la une']),
			volunteers: nombre(page.properties?.['Bénévoles'])
		}
		nouvelles.push(action)

		const precedente = ancienne.get(page.id)
		const urls = urlsFichiers(page.properties?.Image)

		for (const [i, url] of urls.entries()) {
			const cle = cleDuFichier(url)
			// Le rang est dans le nom : deux photos d'une même action ne peuvent
			// pas se recouvrir, et le dossier reste lisible à l'œil.
			const fichier = `/evenements/${quand}-${slug(titre)}-${i + 1}.webp`
			const chemin = join(RACINE, 'static', fichier)

			if (precedente?.cles?.[i] === cle && precedente.images[i] === fichier && existsSync(chemin)) {
				action.images.push(fichier)
				action.cles.push(cle)
				conserves++
				continue
			}

			const reponse = await fetch(url)
			if (!reponse.ok) {
				console.warn(
					`  ! ${titre} (photo ${i + 1}) : téléchargement impossible (${reponse.status})`
				)
				// On garde la photo déjà versionnée si elle existe ; sinon on saute
				// celle-ci plutôt que d'annoncer un fichier absent.
				const repli = precedente?.images?.[i]
				if (repli && existsSync(join(RACINE, 'static', repli))) {
					action.images.push(repli)
					action.cles.push(precedente.cles?.[i] ?? '')
				}
				continue
			}

			const source = Buffer.from(await reponse.arrayBuffer())
			await sharp(source)
				// `.rotate()` sans angle applique l'orientation EXIF : une photo
				// prise au téléphone en portrait arrivait couchée.
				.rotate()
				// `withoutEnlargement` : une photo déjà plus petite que 1200 px
				// n'est pas agrandie, ce qui ne ferait qu'alourdir le dépôt.
				.resize({ width: LARGEUR, withoutEnlargement: true })
				.webp({ quality: QUALITE })
				.toFile(chemin)
			action.images.push(fichier)
			action.cles.push(cle)
			telecharges++
			console.log(`  + ${titre} (${i + 1}/${urls.length}) → ${fichier}`)
		}
	}

	nouvelles.sort((a, b) => a.date.localeCompare(b.date))

	// Les photos des actions retirées de Notion n'ont plus de raison d'être.
	const gardees = new Set(
		nouvelles.flatMap((a) => a.images).map((f) => f.replace('/evenements/', ''))
	)
	for (const f of await readdir(DOSSIER)) {
		if (f.endsWith('.webp') && !gardees.has(f)) {
			await unlink(join(DOSSIER, f))
			console.log(`  - ${f} (plus dans Notion)`)
		}
	}

	await writeFile(MANIFESTE, JSON.stringify({ evenements: nouvelles }, null, '\t') + '\n')
	console.log(
		`\n${nouvelles.length} action(s), ${telecharges} photo(s) mise(s) à jour, ` +
			`${conserves} inchangée(s).` +
			(BUILD ? '' : '\nPensez à versionner static/evenements/ et src/lib/data/evenements.json.')
	)
}

// Exécuté en ligne de commande seulement : le fichier est aussi importé par
// les tests, qui ne doivent pas déclencher d'appel réseau.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((e) => {
		console.error('Échec :', e.message)
		if (!BUILD) process.exitCode = 1
	})
}
