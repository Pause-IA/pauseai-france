/**
 * Versionne les groupes locaux depuis la table Notion.
 *
 *   pnpm run groupes-locaux-notion
 *
 * La carte de /{lang}/groupes-locaux, ses compteurs et la liste d'adresses en
 * dessous viennent tous de src/lib/data/local-groups.json, que ce script
 * réécrit depuis Notion. La table Notion devient donc la source : ajouter une
 * ville, passer un groupe de « en création » à « actif » ou renseigner son
 * adresse se fait là-bas, et le site suit au déploiement suivant.
 *
 * Quand le lancer
 * ---------------
 * Jamais à la main en temps normal : `pnpm build` le lance (--build). En mode
 * build il n'échoue jamais — sans clé, si Notion ne répond pas, ou si la base
 * revient vide, l'instantané versionné reste en ligne plutôt que de vider la
 * carte. À lancer à la main seulement pour rafraîchir le dépôt sans attendre
 * un déploiement, puis committer src/lib/data/local-groups.json.
 *
 * Pour que la mise à jour soit vraiment automatique, une automatisation Notion
 * « Send webhook » peut appeler un build hook Netlify à chaque modification de
 * la table : le site se redéploie seul.
 *
 * Il faut NOTION_API_KEY et NOTION_GROUPES_LOCAUX_DATABASE_ID : le script lit
 * le .env du dépôt (option --env-file-if-exists de Node, voir package.json).
 * L'intégration du site doit être connectée à la table (menu ••• de la page,
 * Connexions) ; sinon Notion répond 404 sur une base qui existe pourtant.
 *
 * Deux règles sont appliquées ICI, et pas seulement dans Notion
 * -------------------------------------------------------------
 * 1. Un groupe en création n'a PAS d'adresse publiée, même si la case est
 *    remplie dans Notion. Pas de référent sur place veut dire personne pour
 *    répondre, et une adresse sans destinataire laisse un message sans
 *    réponse. C'est le défaut qui avait été signalé en novembre 2026.
 * 2. Seules les adresses de groupe `ville@pauseia.fr` sont retenues. Une
 *    adresse personnelle de référent saisie par erreur dans Notion ne doit
 *    jamais se retrouver sur le site.
 *
 * Les coordonnées, elles, ne viennent pas de Notion : personne n'a à
 * manipuler une latitude dans un tableau. Elles sont tenues dans
 * src/lib/data/villes-coordonnees.json, et une ville de Notion absente de ce
 * fichier est signalée nommément.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const RACINE = fileURLToPath(new URL('..', import.meta.url))
const INSTANTANE = join(RACINE, 'src/lib/data/local-groups.json')
const COORDONNEES = join(RACINE, 'src/lib/data/villes-coordonnees.json')

const BUILD = process.argv.includes('--build')
const CLE = process.env.NOTION_API_KEY
const BASE = process.env.NOTION_GROUPES_LOCAUX_DATABASE_ID

/** Adresse de groupe acceptable. Tout le reste est écarté. */
const ADRESSE_DE_GROUPE = /^[a-z0-9-]+@pauseia\.fr$/

/**
 * Nom de colonne ramené à l'essentiel : sans accents, sans ponctuation, sans
 * casse. Le nom exact des colonnes Notion n'a ainsi pas à être deviné, et une
 * colonne renommée « Ville » en « ville » ne casse rien.
 * @param {string} nom
 * @returns {string}
 */
export function cleColonne(nom) {
	return (nom ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '')
}

/**
 * Valeur texte d'une propriété Notion, quel que soit son type.
 * @param {any} p
 * @returns {string}
 */
export function valeur(p) {
	if (!p) return ''
	if (typeof p === 'string') return p.trim()
	if (Array.isArray(p.title)) return p.title.map((/** @type {any} */ x) => x.plain_text).join('')
	if (Array.isArray(p.rich_text))
		return p.rich_text.map((/** @type {any} */ x) => x.plain_text).join('')
	if (p.select?.name) return String(p.select.name)
	if (p.status?.name) return String(p.status.name)
	if (typeof p.email === 'string') return p.email
	if (typeof p.url === 'string') return p.url
	if (typeof p.phone_number === 'string') return p.phone_number
	if (typeof p.checkbox === 'boolean') return p.checkbox ? 'oui' : ''
	return ''
}

/**
 * Première propriété dont le nom correspond à l'un des candidats.
 * @param {Record<string, any>} proprietes
 * @param {string[]} candidats
 * @returns {any}
 */
export function propriete(proprietes, candidats) {
	const vise = candidats.map(cleColonne)
	for (const [nom, p] of Object.entries(proprietes ?? {})) {
		if (vise.includes(cleColonne(nom))) return p
	}
	return undefined
}

/**
 * Nom de ville tel qu'on le cherche dans les coordonnées. Notion contient
 * parfois une adresse complète plutôt qu'un nom de ville
 * (« Grenoble, Auvergne-Rhone-Alpes, France ») : on ne garde que ce qui
 * précède la première virgule.
 * @param {string} brut
 * @returns {string}
 */
export function nomDeVille(brut) {
	return (brut ?? '').split(',')[0].trim()
}

/**
 * Un statut est-il « en création » ? Tout ce qui n'est pas reconnu comme actif
 * est traité comme en création : mieux vaut ne pas publier une adresse que
 * d'en publier une sans destinataire.
 * @param {string} statut
 * @returns {boolean}
 */
export function enCreation(statut) {
	const s = cleColonne(statut)
	if (!s) return true
	if (/(encreation|creation|enlancement|lancement|encours|demarrage)/.test(s)) return true
	return !/(actif|active|lance|ouvert|existant)/.test(s)
}

/**
 * Un statut est-il « en sommeil » ? Ces groupes restent sur la carte mais ne
 * sont pas comptés comme actifs.
 * @param {string} statut
 * @returns {boolean}
 */
export function enSommeil(statut) {
	return /(sommeil|inactif|pause|suspendu|dormant)/.test(cleColonne(statut))
}

/**
 * Transforme les fiches Notion en groupes, applique les deux règles, et
 * rapporte ce qui a été écarté.
 * @param {any[]} pages
 * @param {Record<string, [number, number]>} coordonnees
 * @returns {{ groupes: any[], alertes: string[] }}
 */
export function construire(pages, coordonnees) {
	/** @type {any[]} */
	const groupes = []
	/** @type {string[]} */
	const alertes = []
	const vues = new Set()

	for (const page of pages) {
		const props = page?.properties ?? {}
		const nom = nomDeVille(
			valeur(propriete(props, ['ville', 'nom', 'groupe', 'groupelocal', 'name']))
		)
		if (!nom) continue

		if (vues.has(nom)) {
			alertes.push(`${nom} apparaît deux fois dans Notion : la seconde fiche est ignorée.`)
			continue
		}
		vues.add(nom)

		const coord = coordonnees[nom]
		if (!coord) {
			alertes.push(
				`${nom} n'a pas de coordonnées : ajoutez-la dans src/lib/data/villes-coordonnees.json, ` +
					`sinon elle n'apparaît pas sur la carte.`
			)
			continue
		}

		const statut = valeur(propriete(props, ['statut', 'etat', 'status'])).trim()
		const forming = enCreation(statut)
		const sommeil = enSommeil(statut)

		// Un statut non reconnu est traité comme « en création », ce qui est le
		// défaut prudent mais peut masquer une valeur Notion simplement absente
		// de la liste des mots acceptés. On la cite donc dans le journal : sans
		// elle, un groupe actif passe en création sans qu'on sache pourquoi.
		if (
			forming &&
			!sommeil &&
			statut &&
			!/creation|cours|demarrage|lancement/.test(cleColonne(statut))
		) {
			alertes.push(
				`${nom} : statut « ${statut} » non reconnu comme actif, le groupe est traité comme en création. ` +
					`Ajoutez ce mot à enCreation() dans scripts/groupes-locaux-notion.mjs si le groupe est actif.`
			)
		}

		/** @type {{ name: string, lat: number, lon: number, forming?: boolean, inactif?: boolean, email?: string }} */
		const groupe = { name: nom, lat: coord[0], lon: coord[1] }
		if (forming && !sommeil) groupe.forming = true
		if (sommeil) groupe.inactif = true

		const brut = valeur(
			propriete(props, [
				'email',
				'adresse',
				'adressemail',
				'adresseemail',
				'adresseelectronique',
				'adressedecontact',
				'emailgroupe',
				'courriel',
				'mail',
				'contact'
			])
		)
			.trim()
			.toLowerCase()

		if (brut && !ADRESSE_DE_GROUPE.test(brut)) {
			// Volontairement sans l'adresse dans le message : les journaux de
			// déploiement ne doivent pas contenir de donnée personnelle.
			alertes.push(
				`${nom} : l'adresse saisie n'est pas une adresse de groupe ville@pauseia.fr, elle est ignorée.`
			)
		} else if (brut && groupe.forming) {
			alertes.push(
				`${nom} : groupe en création, son adresse n'est pas publiée (pas de référent pour répondre).`
			)
		} else if (brut) {
			groupe.email = brut
		}

		groupes.push(groupe)
	}

	groupes.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
	return { groupes, alertes }
}

/** @returns {Promise<any[]>} toutes les fiches de la base, pagination comprise */
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
		if (!reponse.ok) {
			const aide =
				reponse.status === 404
					? " (base introuvable : l'intégration du site est-elle connectée à la table ?)"
					: ''
			throw new Error(`Notion a répondu ${reponse.status} ${reponse.statusText}${aide}`)
		}
		const data = await reponse.json()
		pages.push(...data.results)
		curseur = data.has_more ? data.next_cursor : undefined
	} while (curseur)
	return pages
}

async function main() {
	if (!CLE || !BASE) {
		console.error(
			'NOTION_API_KEY ou NOTION_GROUPES_LOCAUX_DATABASE_ID manquant.\n' +
				"L'instantané versionné reste en place : la carte ne dépend pas de ce script."
		)
		if (!BUILD) process.exitCode = 1
		return
	}

	const coordonnees = JSON.parse(await readFile(COORDONNEES, 'utf-8')).villes
	const ancien = JSON.parse(await readFile(INSTANTANE, 'utf-8'))
	const pages = await fiches()
	const { groupes, alertes } = construire(pages, coordonnees)

	// Une base vide est anormale : il y a toujours eu des groupes. Plutôt
	// qu'une carte sans marqueur, on garde ce qui est versionné.
	if (groupes.length === 0) {
		console.error(
			`Notion n'a renvoyé aucun groupe exploitable (${pages.length} fiche(s) lue(s)).\n` +
				`L'instantané versionné (${ancien.groupes.length} groupes) est conservé.`
		)
		for (const a of alertes) console.error(`  ! ${a}`)
		if (!BUILD) process.exitCode = 1
		return
	}

	// Une ville ou une adresse qui disparaît est signalée, jamais supprimée en
	// silence : c'est la règle posée avec Romain en novembre 2026. Le script
	// n'empêche pas le changement, il le rend visible dans le journal.
	const avant = new Map(ancien.groupes.map((/** @type {any} */ g) => [g.name, g]))
	const apres = new Map(groupes.map((g) => [g.name, g]))
	for (const [nom, g] of avant) {
		if (!apres.has(nom)) {
			alertes.push(
				`${nom} était sur le site et n'est plus dans Notion : la ville disparaît de la carte.`
			)
		} else if (g.email && !apres.get(nom).email) {
			alertes.push(`${nom} avait une adresse publiée, elle ne l'est plus.`)
		}
	}
	for (const nom of apres.keys()) {
		if (!avant.has(nom)) alertes.push(`${nom} est nouvelle : elle apparaît sur la carte.`)
	}

	for (const a of alertes) console.warn(`  ! ${a}`)

	await writeFile(INSTANTANE, JSON.stringify({ ...ancien, groupes }, null, '\t') + '\n')

	const actifs = groupes.filter((g) => !g.forming && !g.inactif).length
	const adresses = groupes.filter((g) => g.email).length
	console.log(
		`${groupes.length} groupe(s) : ${actifs} actif(s), ` +
			`${groupes.length - actifs} en création ou en sommeil, ${adresses} adresse(s) publiée(s).` +
			(BUILD ? '' : '\nPensez à versionner src/lib/data/local-groups.json.')
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
