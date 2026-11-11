/**
 * Versionne l'équipe : les photos, et l'instantané des fiches.
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
 * Le script écrit aussi les noms, rôles, catégories et ordre d'affichage dans
 * src/lib/data/equipe.json. Sans cela, une panne de Notion pendant un
 * déploiement produisait une page « Qui sommes-nous » entièrement vide : les
 * photos survivaient, mais il n'y avait plus personne à qui les attacher.
 * `getTeamMembers()` retombe sur cet instantané.
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
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import sharp from 'sharp'

// Normalement la racine du dépôt, déduite de l'emplacement du script. Peut être
// forcée par PHOTOS_EQUIPE_RACINE, pour lancer le script depuis un dossier qui
// a `sharp` d'installé quand le dépôt lui-même ne l'a pas (node_modules
// impossible à installer sur un lecteur réseau ou synchronisé, par exemple).
const RACINE = process.env.PHOTOS_EQUIPE_RACINE
	? resolve(process.env.PHOTOS_EQUIPE_RACINE)
	: fileURLToPath(new URL('..', import.meta.url))
const DOSSIER = join(RACINE, 'static/equipe')
const MANIFESTE = join(RACINE, 'src/lib/data/equipe.json')

// Affichage à 10 rem, soit 160 px ; 320 pour les écrans à haute densité.
const COTE = 320
const QUALITE = 82

// --build : lancé pendant `pnpm build`, pour que les photos se mettent à jour
// toutes seules à chaque déploiement. Dans ce mode le script ne fait jamais
// échouer le build : les photos versionnées dans le dépôt servent de repli.
const BUILD = process.argv.includes('--build')

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

/**
 * @param {any} propriete propriété Notion de type « select »
 * @returns {string}
 */
function choix(propriete) {
	return propriete?.select?.name ?? ''
}

/**
 * @param {any} propriete propriété Notion de type « number »
 * @returns {number}
 */
function nombre(propriete) {
	return typeof propriete?.number === 'number' ? propriete.number : 0
}

// Doit rester aligné sur TEAM_CATEGORIES dans src/lib/notion.ts : la catégorie
// vient d'une liste déroulante Notion, qu'on valide au lieu de la présumer.
const CATEGORIES = ['Direction', 'Conseil scientifique', 'Membre']

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
		if (!BUILD) process.exitCode = 1
		return
	}

	await mkdir(DOSSIER, { recursive: true })
	/**
	 * @typedef {{ id: string, name: string, role: string, profession: string,
	 *   category: string, image: string, order: number, cle: string }} Membre
	 */
	/** @type {Membre[]} */
	const anciens = existsSync(MANIFESTE)
		? (JSON.parse(await readFile(MANIFESTE, 'utf-8')).membres ?? [])
		: []
	const ancien = new Map(anciens.map((/** @type {Membre} */ m) => [m.id, m]))
	/** @type {Membre[]} */
	const nouveau = []
	let telecharges = 0
	let conserves = 0

	const pages = await fiches()

	// Une base vide est forcément anormale : l'équipe compte toujours quelqu'un.
	// Plutôt qu'un site sans aucune photo, on garde ce qui est versionné.
	if (pages.length === 0) {
		console.error("Notion ne renvoie aucune fiche : l'instantané versionné est conservé.")
		if (!BUILD) process.exitCode = 1
		return
	}

	for (const page of pages) {
		// Comme dans getTeamMembers() : une case à cocher non renseignée ne vaut
		// pas « visible ».
		if (page.properties?.Visible?.checkbox !== true) continue
		const nom = texte(page.properties?.Nom)
		if (!nom) continue

		const categorie = choix(page.properties?.['Catégorie'])
		/** @type {Membre} */
		const membre = {
			id: page.id,
			name: nom,
			role: texte(page.properties?.['Rôle']),
			profession: texte(page.properties?.Profession),
			category: CATEGORIES.includes(categorie) ? categorie : 'Membre',
			image: '',
			order: nombre(page.properties?.Ordre),
			cle: ''
		}
		nouveau.push(membre)

		const url = urlPhoto(page.properties?.Photo)
		// Une fiche sans photo reste dans l'instantané : c'est la liste des
		// personnes qui compte, l'illustration est secondaire.
		if (!url) continue

		const cle = cleDuFichier(url)
		const fichier = `/equipe/${slug(nom)}.webp`
		const chemin = join(RACINE, 'static', fichier)
		const precedent = ancien.get(page.id)
		membre.image = fichier
		membre.cle = cle

		if (precedent?.cle === cle && precedent.image === fichier && existsSync(chemin)) {
			conserves++
			continue
		}

		const reponse = await fetch(url)
		if (!reponse.ok) {
			console.warn(`  ! ${nom} : téléchargement impossible (${reponse.status}), photo conservée`)
			// On garde la photo déjà versionnée si elle existe, sinon on n'annonce
			// pas une image absente.
			if (precedent?.image && existsSync(join(RACINE, 'static', precedent.image))) {
				membre.image = precedent.image
				membre.cle = precedent.cle
			} else {
				membre.image = ''
				membre.cle = ''
			}
			continue
		}
		const source = Buffer.from(await reponse.arrayBuffer())
		await sharp(source)
			.resize(COTE, COTE, { fit: 'cover', position: 'attention' })
			.webp({ quality: QUALITE })
			.toFile(chemin)
		telecharges++
		console.log(`  + ${nom} → ${fichier}`)
	}

	nouveau.sort((a, b) => a.order - b.order)

	// Les photos des personnes retirées de Notion n'ont plus de raison d'être
	// dans le dépôt.
	const gardes = new Set(nouveau.filter((m) => m.image).map((m) => m.image.replace('/equipe/', '')))
	for (const f of await readdir(DOSSIER)) {
		if (f.endsWith('.webp') && !gardes.has(f)) {
			await unlink(join(DOSSIER, f))
			console.log(`  - ${f} (plus dans Notion)`)
		}
	}

	await writeFile(MANIFESTE, JSON.stringify({ membres: nouveau }, null, '\t') + '\n')
	console.log(
		`\n${nouveau.length} fiche(s), ${telecharges} photo(s) mise(s) à jour, ` +
			`${conserves} inchangée(s).` +
			(BUILD ? '' : '\nPensez à versionner static/equipe/ et src/lib/data/equipe.json.')
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
