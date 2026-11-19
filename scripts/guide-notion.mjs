/**
 * Le guide de sensibilisation, lu dans Notion à chaque déploiement.
 *
 *   pnpm run guide-notion
 *
 * Pourquoi
 * --------
 * Antonin tient le guide dans Notion et le fait évoluer. Recopié à la main sur le
 * site le 13/11/2026, il en divergeait dès le 17/11 (histoire de Léa, encadré
 * « Pourquoi ça marche ? »). Ce script réécrit le corps de
 * src/posts/guide-sensibilisation.md à partir de la page Notion ; l'en-tête du
 * fichier (titre, description, chapô) reste celui du dépôt.
 *
 * Fonctionnement
 * --------------
 * - Lancé par `pnpm build` (--build) : une modification dans Notion est en ligne
 *   au déploiement suivant. Pas à chaque visite : la page reste pré-rendue.
 * - Images : téléchargées, réduites à 1200 px en WebP dans static/guides/
 *   (notion-*.webp). Jamais l'URL Notion, signée et valable une heure.
 * - En mode --build, le script n'échoue jamais : si Notion ne répond pas, si la
 *   page n'est pas partagée avec l'intégration ou si le résultat paraît vide,
 *   le fichier versionné reste tel quel.
 * - Conversion : scripts/guide-notion/convertir.mjs (testée).
 *
 * Il faut NOTION_API_KEY, et que la page soit connectée à l'intégration du site
 * (dans Notion : ··· > Connexions). Identifiant de la page : NOTION_GUIDE_PAGE_ID,
 * par défaut celui du guide.
 */
import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

import { assembler, lireChapo, retirerChapo, versMarkdown } from './guide-notion/convertir.mjs'

const RACINE = fileURLToPath(new URL('..', import.meta.url))
const FICHIER = join(RACINE, 'src/posts/guide-sensibilisation.md')
const IMAGES = join(RACINE, 'static/guides')
const PUBLIC = '/guides'
const LARGEUR = 1200
// En dessous, le résultat est jugé suspect (page vidée, mauvaise page…) : on
// garde la version versionnée plutôt que de publier une page presque vide.
const TAILLE_MINIMALE = 3000

const BUILD = process.argv.includes('--build')
const CLE = process.env.NOTION_API_KEY
const PAGE = (process.env.NOTION_GUIDE_PAGE_ID || '40828fc94b778093ab62d61088ce63bd').replace(
	/-/g,
	''
)

async function notion(chemin) {
	const r = await fetch(`https://api.notion.com/v1/${chemin}`, {
		headers: { Authorization: `Bearer ${CLE}`, 'Notion-Version': '2022-06-28' }
	})
	if (!r.ok) throw new Error(`Notion ${r.status} sur ${chemin.split('?')[0]}`)
	return r.json()
}

/** Tous les blocs enfants (pagination), avec leurs propres enfants. */
async function blocs(id, profondeur = 0) {
	if (profondeur > 6) return []
	const tous = []
	let curseur
	do {
		const page = await notion(
			`blocks/${id}/children?page_size=100${curseur ? `&start_cursor=${curseur}` : ''}`
		)
		tous.push(...page.results)
		curseur = page.has_more ? page.next_cursor : undefined
	} while (curseur)
	for (const b of tous) {
		if (b.has_children && b.type !== 'child_page' && b.type !== 'child_database') {
			b.children = await blocs(b.id, profondeur + 1)
		}
	}
	return tous
}

function images(liste, sortie = []) {
	for (const b of liste) {
		if (b.type === 'image') sortie.push(b)
		if (b.children) images(b.children, sortie)
	}
	return sortie
}

/** Télécharge les images ; renvoie { idBloc: adresse publique }. */
async function telecharger(blocsImage) {
	await mkdir(IMAGES, { recursive: true })
	const adresses = {}
	const gardees = new Set()
	for (const b of blocsImage) {
		const url = b.image?.file?.url ?? b.image?.external?.url
		if (!url) continue
		// Clé stable : l'adresse sans la signature (qui change à chaque requête).
		const cle = createHash('sha256').update(url.split('?')[0]).digest('hex').slice(0, 16)
		const nom = `notion-${cle}.webp`
		gardees.add(nom)
		if (!existsSync(join(IMAGES, nom))) {
			const r = await fetch(url)
			if (!r.ok) throw new Error(`image ${r.status}`)
			const tampon = Buffer.from(await r.arrayBuffer())
			await sharp(tampon)
				.resize({ width: LARGEUR, withoutEnlargement: true })
				.webp({ quality: 82 })
				.toFile(join(IMAGES, nom))
		}
		adresses[b.id] = `${PUBLIC}/${nom}`
	}
	return { adresses, gardees }
}

/**
 * Supprime les images qui ne sont plus dans le guide.
 *
 * Appelé seulement APRÈS l'écriture du fichier : si la conversion échoue ou si
 * le garde-fou de taille se déclenche, le Markdown conservé est l'ancien, et il
 * référence encore ces images. Les supprimer avant l'écriture laissait la page
 * de repli avec des images mortes.
 *
 * @param {Set<string>} gardees
 */
async function nettoyer(gardees) {
	for (const f of await readdir(IMAGES)) {
		if (f.startsWith('notion-') && !gardees.has(f)) await unlink(join(IMAGES, f))
	}
}

async function main() {
	if (!CLE) {
		console.log('[guide-notion] NOTION_API_KEY absente : version versionnée conservée.')
		return
	}
	const actuel = await readFile(FICHIER, 'utf8')
	const liste = retirerChapo(await blocs(PAGE), lireChapo(actuel))
	const avertissements = []
	const { adresses, gardees } = await telecharger(images(liste))
	const corps = versMarkdown(liste, {
		images: adresses,
		avertir: (m) => avertissements.push(m)
	})
	for (const m of new Set(avertissements)) console.warn(`[guide-notion] ${m}`)
	if (corps.length < TAILLE_MINIMALE) {
		throw new Error(`résultat trop court (${corps.length} caractères), page vide ?`)
	}
	const nouveau = assembler(actuel, corps)
	if (nouveau === actuel) {
		await nettoyer(gardees)
		console.log('[guide-notion] guide inchangé.')
		return
	}
	await writeFile(FICHIER, nouveau)
	await nettoyer(gardees)
	console.log(
		`[guide-notion] guide mis à jour depuis Notion (${corps.length} caractères).` +
			// Le Markdown versionné sert de repli quand Notion ne répond pas : il
			// faut que les images qu'il cite soient dans le dépôt, comme pour les
			// photos de l'équipe et des actions locales.
			(BUILD ? '' : '\nPensez à versionner src/posts/guide-sensibilisation.md et static/guides/.')
	)
}

main().catch((e) => {
	console.error(`[guide-notion] ${e.message} : version versionnée conservée.`)
	if (!BUILD) process.exitCode = 1
})
