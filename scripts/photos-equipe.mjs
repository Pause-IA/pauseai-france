/**
 * Télécharge, redimensionne et versionne les photos de l'équipe.
 *
 *   pnpm run photos-equipe
 *
 * Pourquoi ce script existe
 * -------------------------
 * Notion ne sert pas les fichiers à une adresse stable : `file.file.url` est
 * une URL S3 SIGNÉE, qui expire au bout d'une heure environ. Tant que la page
 * était rendue à chaque visite, ça marchait — au prix d'un appel à l'API Notion
 * par visite, et d'images servies à leur taille d'origine, soit plusieurs méga-
 * octets pour une photo de téléphone affichée en 160 pixels. Et dès que quoi
 * que ce soit met la page en cache, les images cassent une heure plus tard.
 *
 * Les photos sont donc téléchargées une fois, compressées, et versionnées dans
 * le dépôt. Le site n'appelle plus Notion pour les images, ni au build ni à
 * l'exécution.
 *
 * Quand le lancer
 * ---------------
 * Quand une photo change dans Notion. Les fichiers inchangés ne sont pas
 * retéléchargés : la clé de comparaison est le chemin S3 du fichier, stable
 * pour un même téléversement même si la signature change à chaque requête.
 *
 * Il faut NOTION_API_KEY et NOTION_TEAM_DATABASE_ID : le script lit le .env
 * du dépôt (option --env-file-if-exists de Node, voir package.json).
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, readdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

const RACINE = fileURLToPath(new URL('..', import.meta.url))
const DOSSIER = join(RACINE, 'static/equipe')
const MANIFESTE = join(RACINE, 'src/lib/data/photos-equipe.json')

// Affichage à 10 rem, soit 160 px ; 320 pour les écrans à haute densité.
const COTE = 320
const QUALITE = 82

const CLE = process.env.NOTION_API_KEY
const BASE = process.env.NOTION_TEAM_DATABASE_ID

/**
 * Nom de fichier lisible, pour que le dépôt reste consultable à l'œil.
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
			.replace(/^-|-$/g, '') || 'sans-nom'
	)
}

/**
 * Clé de changement : le chemin de l'objet S3, sans la signature. Il ne bouge
 * que si le fichier est remplacé dans Notion. `last_edited_time` ne conviendrait
 * pas : il change dès qu'on modifie n'importe quelle propriété de la fiche.
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
 * @param {any} propriete propriété Notion de type « files » ou « url »
 * @returns {string}
 */
function urlPhoto(propriete) {
	if (!propriete) return ''
	const f = propriete.files?.[0]
	if (f?.type === 'file' && f.file?.url) return f.file.url
	if (f?.type === 'external' && f.external?.url) return f.external.url
	return propriete.url || ''
}

/**
 * @param {any} propriete propriété Notion de type « title » ou « rich_text »
 * @returns {string}
 */
function texte(propriete) {
	if (!propriete) return ''
	const t = propriete.title ?? propriete.rich_text
	return Array.isArray(t) ? t.map((x) => x.plain_text).join('') : ''
}

/** @returns {Promise<any[]>} les pages de la base d'équipe, toutes pages confondues */
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

async function main() {
	if (!CLE || !BASE) {
		console.error(
			'NOTION_API_KEY ou NOTION_TEAM_DATABASE_ID manquant. Les photos déjà versionnées\n' +
				'restent en place : le site ne dépend pas de ce script pour fonctionner.'
		)
		process.exitCode = 1
		return
	}

	await mkdir(DOSSIER, { recursive: true })
	/** @typedef {{ nom: string, fichier: string, cle: string }} Entree */
	/** @type {Record<string, Entree>} */
	const ancien = existsSync(MANIFESTE) ? JSON.parse(await readFile(MANIFESTE, 'utf-8')) : {}
	/** @type {Record<string, Entree>} */
	const nouveau = {}
	let telecharges = 0
	let conserves = 0

	for (const page of await fiches()) {
		if (page.properties?.Visible?.checkbox === false) continue
		const nom = texte(page.properties?.Nom)
		const url = urlPhoto(page.properties?.Photo)
		if (!nom || !url) continue

		const cle = cleDuFichier(url)
		const fichier = `/equipe/${slug(nom)}.webp`
		const chemin = join(RACINE, 'static', fichier)
		const precedent = ancien[page.id]

		if (precedent?.cle === cle && precedent.fichier === fichier && existsSync(chemin)) {
			nouveau[page.id] = precedent
			conserves++
			continue
		}

		const reponse = await fetch(url)
		if (!reponse.ok) {
			console.warn(`  ! ${nom} : téléchargement impossible (${reponse.status}), photo conservée`)
			if (precedent && existsSync(join(RACINE, 'static', precedent.fichier))) {
				nouveau[page.id] = precedent
			}
			continue
		}
		const source = Buffer.from(await reponse.arrayBuffer())
		await sharp(source)
			.resize(COTE, COTE, { fit: 'cover', position: 'attention' })
			.webp({ quality: QUALITE })
			.toFile(chemin)
		nouveau[page.id] = { nom, fichier, cle }
		telecharges++
		console.log(`  + ${nom} → ${fichier}`)
	}

	// Les photos des personnes retirées de Notion n'ont plus de raison d'être
	// dans le dépôt.
	const gardes = new Set(Object.values(nouveau).map((v) => v.fichier.replace('/equipe/', '')))
	for (const f of await readdir(DOSSIER)) {
		if (f.endsWith('.webp') && !gardes.has(f)) {
			await unlink(join(DOSSIER, f))
			console.log(`  - ${f} (plus dans Notion)`)
		}
	}

	await writeFile(MANIFESTE, JSON.stringify(nouveau, null, '\t') + '\n')
	console.log(
		`\n${telecharges} photo(s) mise(s) à jour, ${conserves} inchangée(s).\n` +
			'Pensez à versionner static/equipe/ et src/lib/data/photos-equipe.json.'
	)
}

// Exécuté en ligne de commande seulement : le fichier est aussi importé par
// les tests, qui ne doivent pas déclencher d'appel réseau.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	main().catch((e) => {
		console.error('Échec :', e.message)
		process.exitCode = 1
	})
}
