#!/usr/bin/env node
/**
 * Génère src/lib/data/elus.json : la liste des députés et sénateurs français
 * avec leurs emails, indexés par circonscription / département, plus une table
 * code postal → circonscription(s) pour la recherche côté page.
 *
 * ⚠️  Ce script doit être exécuté depuis un environnement avec accès réseau
 *     ouvert (machine d'un mainteneur ou CI). Les hôtes utilisés
 *     (data.gouv.fr, data.senat.fr, geo.api.gouv.fr) sont parfois bloqués
 *     par des proxies d'entreprise / environnements sandboxés.
 *
 * Usage :
 *     node scripts/generate-elus.js              # génération complète
 *     node scripts/generate-elus.js --report     # affiche aussi le rapport de qualité
 *
 * Redondance / fiabilité des emails :
 *   On croise plusieurs sources pour chaque élu et on attribue un niveau de
 *   confiance à l'email retenu :
 *     - "high"   : l'email apparaît à l'identique dans ≥ 2 sources
 *                  (NosDéputés/NosSénateurs ET le motif institutionnel officiel).
 *     - "medium" : une seule source fournit un email, cohérent avec le motif.
 *     - "low"    : email présent mais incohérent entre sources (à vérifier),
 *                  ou seulement déduit du motif institutionnel.
 *   Quand aucun email fiable n'est disponible, on retombe sur `contactUrl`
 *   (formulaire officiel de l'Assemblée / du Sénat) que la page proposera à la
 *   place du `mailto:`.
 *
 * Sources :
 *   - Députés : CSV « Députés actifs de l'Assemblée nationale » (data.gouv,
 *     législature en cours) — nom/prénom, département, circonscription, mail.
 *   - Sénateurs : open data officiel du Sénat (ODSEN) — emails publics.
 *   - Motif institutionnel : prenom.nom@assemblee-nationale.fr (repli députés).
 *   - geo.api.gouv.fr (Etalab) : code postal → communes (INSEE) → département.
 *
 * Si une source change de format, adapter `fetchDeputes` / `fetchSenateurs`.
 * Le reste du pipeline est agnostique.
 */

import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../src/lib/data')
const OUT_FILE = resolve(OUT_DIR, 'elus.json')
const CP_FILE = resolve(OUT_DIR, 'code-postal-circo.json')

const SOURCES = {
	// API data.gouv du jeu « Députés actifs de l'Assemblée nationale » (CSV à jour,
	// avec nom/prénom, departementCode, circo, groupe et mail). On résout l'URL du
	// CSV dynamiquement pour ne pas dépendre d'une URL datée. NosDéputés n'est plus
	// à jour depuis la dissolution de 2024.
	deputes:
		'https://www.data.gouv.fr/api/1/datasets/deputes-actifs-de-lassemblee-nationale-informations-et-statistiques/',
	// Open data officiel du Sénat (ODSEN). CSV latin1, préambule en lignes « % »,
	// contient tous les sénateurs depuis 1959 (filtrer État = ACTIF) avec une
	// colonne « Courrier électronique » publique.
	senateurs: 'https://data.senat.fr/data/senateurs/ODSEN_GENERAL.csv',
	// Toutes les communes : code INSEE, codes postaux et centre (pour le point-dans-polygone).
	communes: 'https://geo.api.gouv.fr/communes?fields=code,codesPostaux,centre'
}

// Correspondance commune (INSEE) → circonscriptions, fichier statique committé.
// Construit à partir de la table officielle commune↔circonscription (découpage
// inchangé depuis 2012). Une commune découpée (grandes villes) a plusieurs
// circonscriptions. Voir scripts/build-commune-circo.py pour le régénérer.
const CIRCO_FILE = resolve(OUT_DIR, 'commune-circo.json')

/** Déduit le code département d'un code commune INSEE (3 chiffres en outre-mer). */
function deptFromInsee(insee) {
	return insee.startsWith('97') || insee.startsWith('98') ? insee.slice(0, 3) : insee.slice(0, 2)
}

const REPORT = process.argv.includes('--report')

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────────────────────

const UA = { 'User-Agent': 'pauseia.fr elus generator (contact: campagne@pauseia.fr)' }

async function fetchJson(url) {
	const res = await fetch(url, { headers: UA })
	if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`)
	return res.json()
}

async function fetchText(url) {
	const res = await fetch(url, { headers: UA })
	if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`)
	return res.text()
}

/**
 * Construit la table code postal → liste de circonscriptions { departement, circo }.
 * Croise le fichier statique commune→circos (CIRCO_FILE, table officielle) avec
 * les codes postaux des communes (geo.api.gouv.fr). Une commune découpée
 * (grande ville) apporte plusieurs circonscriptions : la page affiche alors les
 * députés candidats, sans jamais en désigner un faux. Renvoie null si le fichier
 * n'est pas disponible.
 */
async function buildCodePostalToCirco() {
	let communeCirco
	try {
		communeCirco = JSON.parse(await readFile(CIRCO_FILE, 'utf8'))
	} catch {
		console.warn(`⚠️  ${CIRCO_FILE} introuvable → géocodage fin ignoré.`)
		return null
	}

	console.log('→ Téléchargement des communes (geo.api.gouv.fr)…')
	const communes = await fetchJson(SOURCES.communes)

	// code postal → circos (dédupliquées via clé "dept-circo")
	const cpMap = {}
	for (const c of communes) {
		const circos = communeCirco[c.code]
		if (!circos) continue
		const departement = deptFromInsee(c.code)
		for (const circo of circos) {
			for (const cp of c.codesPostaux || []) {
				;(cpMap[cp] ||= new Map()).set(`${departement}-${circo}`, { departement, circo })
			}
		}
	}

	const out = {}
	for (const [cp, m] of Object.entries(cpMap)) {
		out[cp] = [...m.values()].sort((a, b) => a.circo - b.circo)
	}
	console.log(`  ${Object.keys(out).length} codes postaux mappés`)
	return Object.keys(out).length ? out : null
}

/** Enlève accents, met en minuscule, garde [a-z0-9] → pour les emails déduits. */
function slugifyName(s) {
	return (s || '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/['']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/** Motif institutionnel d'email : prenom.nom@domaine */
function institutionalEmail(prenom, nom, domain) {
	const p = slugifyName(prenom).replace(/-/g, '')
	const n = slugifyName(nom).replace(/-/g, '')
	if (!p || !n) return null
	return `${slugifyName(prenom)}.${slugifyName(nom)}@${domain}`
}

/**
 * Choisit l'email final + niveau de confiance en croisant les candidats.
 * @param {string[]} sourced  emails fournis par des sources externes (NosDéputés…)
 * @param {string|null} pattern email déduit du motif institutionnel
 */
function reconcileEmail(sourced, pattern) {
	const clean = [...new Set(sourced.map((e) => (e || '').trim().toLowerCase()).filter(Boolean))]
	const patternLc = pattern ? pattern.toLowerCase() : null

	if (clean.length === 0) {
		// Aucune source : on n'a que le motif déduit → confiance faible.
		return pattern
			? { email: pattern, confidence: 'low', emailSources: ['pattern'] }
			: { email: null, confidence: 'none', emailSources: [] }
	}

	// Email confirmé par le motif institutionnel → haute confiance.
	if (patternLc && clean.includes(patternLc)) {
		return { email: patternLc, confidence: 'high', emailSources: ['source', 'pattern'] }
	}

	// Plusieurs sources concordent entre elles → haute confiance.
	if (clean.length === 1) {
		return { email: clean[0], confidence: 'medium', emailSources: ['source'] }
	}

	// Sources divergentes : on retient la première mais on signale (low).
	return { email: clean[0], confidence: 'low', emailSources: ['source'], conflict: clean }
}

// ─────────────────────────────────────────────────────────────────────────────
// Députés : CSV « députés actifs » (data.gouv, législature en cours)
// ─────────────────────────────────────────────────────────────────────────────

/** Parse complet d'un CSV (gère les champs entre guillemets contenant des virgules). */
function parseCsvRows(text) {
	const rows = []
	let field = ''
	let record = []
	let inQuotes = false
	for (let i = 0; i < text.length; i++) {
		const ch = text[i]
		if (inQuotes) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					field += '"'
					i++
				} else inQuotes = false
			} else field += ch
		} else if (ch === '"') {
			inQuotes = true
		} else if (ch === ',') {
			record.push(field)
			field = ''
		} else if (ch === '\r') {
			// ignoré
		} else if (ch === '\n') {
			record.push(field)
			rows.push(record)
			record = []
			field = ''
		} else field += ch
	}
	if (field !== '' || record.length) {
		record.push(field)
		rows.push(record)
	}
	return rows
}

/** Numéro de circonscription → libellé ordinal (« 1re circonscription », « 4e… »). */
function circoLabel(deptNom, circo) {
	if (!deptNom || !Number.isFinite(circo)) return null
	return `${deptNom} (${circo}${circo === 1 ? 're' : 'e'} circonscription)`
}

/** Télécharge le CSV des députés en exercice et le normalise. */
async function fetchDeputes() {
	// Résout l'URL du CSV via l'API data.gouv (évite de dépendre d'une URL datée).
	const meta = await fetchJson(SOURCES.deputes)
	const res = (meta.resources || []).find(
		(r) => r.format === 'csv' && /deputes-active/i.test(`${r.url || ''}${r.title || ''}`)
	)
	if (!res) throw new Error('Ressource CSV « deputes-active » introuvable sur data.gouv')
	const rows = parseCsvRows(await fetchText(res.latest || res.url))
	if (rows.length < 2) return []
	const header = rows[0].map((h) => h.trim())
	const idx = Object.fromEntries(header.map((h, i) => [h, i]))
	const get = (r, name) => (r[idx[name]] ?? '').trim()

	const out = []
	for (const r of rows.slice(1)) {
		const nom = get(r, 'nom')
		const prenom = get(r, 'prenom')
		if (!nom) continue

		const mail = get(r, 'mail')
		const pattern = institutionalEmail(prenom, nom, 'assemblee-nationale.fr')
		const { email, confidence, emailSources, conflict } = reconcileEmail(
			mail ? [mail] : [],
			pattern
		)

		let dept = get(r, 'departementCode')
		if (/^\d$/.test(dept)) dept = `0${dept}` // 1 → 01
		const circo = Number(get(r, 'circo'))
		const anId = get(r, 'id')

		out.push({
			id: anId || slugifyName(`${prenom} ${nom}`),
			nom: `${prenom} ${nom}`.trim(),
			civ: /mme/i.test(get(r, 'civ')) ? 'Mme' : 'M',
			role: 'depute',
			departement: dept,
			circo: Number.isFinite(circo) ? circo : null,
			nomCirco: circoLabel(get(r, 'departementNom'), circo),
			groupe: get(r, 'groupeAbrev') || get(r, 'groupe') || null,
			email,
			emailConfidence: confidence,
			emailSources,
			contactUrl: anId ? `https://www.assemblee-nationale.fr/dyn/deputes/${anId}` : null,
			photo: anId
				? `https://www.assemblee-nationale.fr/dyn/static/tribun/17/photos/carre/${anId.replace(/^PA/, '')}.jpg`
				: null,
			...(conflict ? { _conflict: conflict } : {})
		})
	}
	return out
}

// ── Sénateurs : open data du Sénat (ODSEN) ──

const normDept = (s) =>
	(s || '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()

/** Table « nom de département » → code, pour indexer les sénateurs par code. */
const DEPT_NAME_TO_CODE = (() => {
	const list = [
		['01', 'Ain'],
		['02', 'Aisne'],
		['03', 'Allier'],
		['04', 'Alpes-de-Haute-Provence'],
		['05', 'Hautes-Alpes'],
		['06', 'Alpes-Maritimes'],
		['07', 'Ardèche'],
		['08', 'Ardennes'],
		['09', 'Ariège'],
		['10', 'Aube'],
		['11', 'Aude'],
		['12', 'Aveyron'],
		['13', 'Bouches-du-Rhône'],
		['14', 'Calvados'],
		['15', 'Cantal'],
		['16', 'Charente'],
		['17', 'Charente-Maritime'],
		['18', 'Cher'],
		['19', 'Corrèze'],
		['21', "Côte-d'Or"],
		['22', "Côtes-d'Armor"],
		['23', 'Creuse'],
		['24', 'Dordogne'],
		['25', 'Doubs'],
		['26', 'Drôme'],
		['27', 'Eure'],
		['28', 'Eure-et-Loir'],
		['29', 'Finistère'],
		['2A', 'Corse-du-Sud'],
		['2B', 'Haute-Corse'],
		['30', 'Gard'],
		['31', 'Haute-Garonne'],
		['32', 'Gers'],
		['33', 'Gironde'],
		['34', 'Hérault'],
		['35', 'Ille-et-Vilaine'],
		['36', 'Indre'],
		['37', 'Indre-et-Loire'],
		['38', 'Isère'],
		['39', 'Jura'],
		['40', 'Landes'],
		['41', 'Loir-et-Cher'],
		['42', 'Loire'],
		['43', 'Haute-Loire'],
		['44', 'Loire-Atlantique'],
		['45', 'Loiret'],
		['46', 'Lot'],
		['47', 'Lot-et-Garonne'],
		['48', 'Lozère'],
		['49', 'Maine-et-Loire'],
		['50', 'Manche'],
		['51', 'Marne'],
		['52', 'Haute-Marne'],
		['53', 'Mayenne'],
		['54', 'Meurthe-et-Moselle'],
		['55', 'Meuse'],
		['56', 'Morbihan'],
		['57', 'Moselle'],
		['58', 'Nièvre'],
		['59', 'Nord'],
		['60', 'Oise'],
		['61', 'Orne'],
		['62', 'Pas-de-Calais'],
		['63', 'Puy-de-Dôme'],
		['64', 'Pyrénées-Atlantiques'],
		['65', 'Hautes-Pyrénées'],
		['66', 'Pyrénées-Orientales'],
		['67', 'Bas-Rhin'],
		['68', 'Haut-Rhin'],
		['69', 'Rhône'],
		['70', 'Haute-Saône'],
		['71', 'Saône-et-Loire'],
		['72', 'Sarthe'],
		['73', 'Savoie'],
		['74', 'Haute-Savoie'],
		['75', 'Paris'],
		['76', 'Seine-Maritime'],
		['77', 'Seine-et-Marne'],
		['78', 'Yvelines'],
		['79', 'Deux-Sèvres'],
		['80', 'Somme'],
		['81', 'Tarn'],
		['82', 'Tarn-et-Garonne'],
		['83', 'Var'],
		['84', 'Vaucluse'],
		['85', 'Vendée'],
		['86', 'Vienne'],
		['87', 'Haute-Vienne'],
		['88', 'Vosges'],
		['89', 'Yonne'],
		['90', 'Territoire de Belfort'],
		['91', 'Essonne'],
		['92', 'Hauts-de-Seine'],
		['93', 'Seine-Saint-Denis'],
		['94', 'Val-de-Marne'],
		['95', "Val-d'Oise"],
		['971', 'Guadeloupe'],
		['972', 'Martinique'],
		['973', 'Guyane'],
		['974', 'La Réunion'],
		['976', 'Mayotte'],
		['975', 'Saint-Pierre-et-Miquelon'],
		['977', 'Saint-Barthélemy'],
		['978', 'Saint-Martin'],
		['986', 'Wallis-et-Futuna'],
		['987', 'Polynésie française'],
		['988', 'Nouvelle-Calédonie']
	]
	const m = new Map(list.map(([code, name]) => [normDept(name), code]))
	m.set(normDept('Réunion'), '974') // alias
	m.set(normDept('Iles Wallis et Futuna'), '986') // alias ODSEN
	return m
})()

/** Slug pour les URLs de fiche du Sénat : minuscules, sans accents, séparé par « _ ». */
function senatSlug(s) {
	return (s || '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
}

/** Télécharge et parse le CSV ODSEN, ne garde que les sénateurs en exercice. */
async function fetchSenateurs() {
	const res = await fetch(SOURCES.senateurs, { headers: UA })
	if (!res.ok) throw new Error(`HTTP ${res.status} pour ${SOURCES.senateurs}`)
	// ODSEN est encodé en latin1.
	const text = new TextDecoder('latin1').decode(await res.arrayBuffer())
	// Ignorer le préambule (« % … ») ; la 1re ligne restante est l'en-tête.
	const lines = text.split(/\r?\n/).filter((l) => l && !l.startsWith('%'))
	if (lines.length < 2) return []
	const header = lines[0].split(',')
	const col = (name) => header.indexOf(name)
	const iMat = col('Matricule')
	const iNom = col('Nom usuel')
	const iPre = col('Prénom usuel')
	const iEtat = col('État')
	const iGrp = col('Groupe politique')
	const iCirco = col('Circonscription')
	const iMail = col('Courrier électronique')
	const iQual = col('Qualité')

	const out = []
	let unmappedDept = 0
	for (const line of lines.slice(1)) {
		// Les colonnes utiles (0..12) ne contiennent pas de virgule interne :
		// un simple split convient (les champs entre guillemets sont après).
		const c = line.split(',')
		if ((c[iEtat] || '').trim() !== 'ACTIF') continue

		const prenom = (c[iPre] || '').trim()
		const nom = (c[iNom] || '').trim()
		const circo = (c[iCirco] || '').trim()
		const mat = (c[iMat] || '').trim().toLowerCase()
		const mailRaw = (c[iMail] || '').trim()
		const email = mailRaw.includes('@') ? mailRaw.toLowerCase() : null
		const dept = DEPT_NAME_TO_CODE.get(normDept(circo)) || ''
		if (!dept) unmappedDept++

		out.push({
			id: mat || slugifyName(`${prenom} ${nom}`),
			nom: `${prenom} ${nom}`.trim(),
			civ: /mme/i.test(c[iQual] || '') ? 'Mme' : 'M',
			role: 'senateur',
			departement: dept,
			nomDept: circo || null,
			groupe: (c[iGrp] || '').trim() || null,
			email,
			emailConfidence: email ? 'high' : 'none',
			emailSources: email ? ['senat'] : [],
			// Fiche officielle du sénateur (motif nom_prenom + matricule).
			contactUrl: mat
				? `https://www.senat.fr/senateur/${senatSlug(nom)}_${senatSlug(prenom)}${mat}.html`
				: 'https://www.senat.fr/vos-senateurs.html',
			// Portrait officiel (même slug, suffixe _carre).
			photo: mat
				? `https://www.senat.fr/senimg/${senatSlug(nom)}_${senatSlug(prenom)}${mat}_carre.jpg`
				: null
		})
	}
	if (unmappedDept) {
		console.warn(`⚠️  ${unmappedDept} sénateur(s) sans code département (ex. hors de France).`)
	}
	return out
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
	console.log('→ Téléchargement des députés (data.gouv, AN)…')
	const deputes = await fetchDeputes()

	console.log('→ Téléchargement des sénateurs (Sénat open data)…')
	const senateurs = await fetchSenateurs()

	// Tri déterministe : la sortie ne dépend pas de l'ordre des sources, donc le
	// fichier ne change que si un contact change réellement (pas de PR inutile).
	deputes.sort((a, b) => a.id.localeCompare(b.id))
	senateurs.sort((a, b) => a.id.localeCompare(b.id))

	// ── Garde-fous : si une source est cassée/tronquée, on échoue SANS rien
	// écrire (les données committées restent en ligne). 577 députés / 348
	// sénateurs officiellement ; on garde une marge pour les sièges vacants.
	const depWithEmail = deputes.filter((d) => d.email).length
	const depWithCirco = deputes.filter((d) => d.circo).length
	const senWithEmail = senateurs.filter((s) => s.email).length
	const checks = [
		[
			deputes.length >= 555 && deputes.length <= 585,
			`nombre de députés suspect : ${deputes.length}`
		],
		[
			senateurs.length >= 335 && senateurs.length <= 360,
			`nombre de sénateurs suspect : ${senateurs.length}`
		],
		[
			depWithEmail >= deputes.length * 0.95,
			`trop de députés sans email (${depWithEmail}/${deputes.length})`
		],
		[
			depWithCirco >= deputes.length * 0.95,
			`trop de députés sans circonscription (${depWithCirco}/${deputes.length})`
		],
		[
			senWithEmail >= senateurs.length * 0.8,
			`trop de sénateurs sans email (${senWithEmail}/${senateurs.length})`
		]
	]
	const failed = checks.filter(([ok]) => !ok).map(([, msg]) => msg)
	if (failed.length) {
		throw new Error(`Garde-fous échoués, rien n'est écrit : ${failed.join(' ; ')}`)
	}

	const data = {
		generatedAt: new Date().toISOString().slice(0, 10),
		sources: SOURCES,
		// indexés pour la recherche : département → sénateurs / députés
		senateursParDept: groupBy(senateurs, (s) => s.departement),
		deputesParDept: groupBy(
			[...deputes].sort((a, b) => (a.circo ?? 0) - (b.circo ?? 0)),
			(d) => d.departement
		),
		deputes,
		senateurs
	}

	await mkdir(OUT_DIR, { recursive: true })
	await writeStableJson(OUT_FILE, data, 'generatedAt')
	console.log(`  ${deputes.length} députés, ${senateurs.length} sénateurs`)

	// Table code postal → circonscription (géocodage fin, optionnel).
	const cpToCirco = await buildCodePostalToCirco().catch((err) => {
		console.warn(`⚠️  Géocodage ignoré : ${err.message}`)
		return null
	})
	if (cpToCirco && Object.keys(cpToCirco).length >= 4000) {
		await writeStableJson(CP_FILE, cpToCirco)
	} else if (cpToCirco) {
		// Résultat anormalement faible : on garde le fichier existant plutôt que
		// d'écraser un bon géocodage par un partiel.
		console.warn(
			`⚠️  Géocodage suspect (${Object.keys(cpToCirco).length} codes postaux) → fichier conservé.`
		)
	}

	if (REPORT) printReport(deputes, senateurs)
}

/** Sérialise en JSON canonique (clés triées) pour une sortie reproductible. */
function canonicalStringify(obj, indent) {
	return JSON.stringify(
		obj,
		(_k, v) =>
			v && typeof v === 'object' && !Array.isArray(v)
				? Object.fromEntries(
						Object.keys(v)
							.sort()
							.map((k) => [k, v[k]])
					)
				: v,
		indent
	)
}

/**
 * Écrit `data` en JSON canonique, mais seulement si le contenu réel a changé.
 * `volatileKey` (ex. "generatedAt") est ignoré dans la comparaison et conserve
 * sa valeur précédente quand rien d'autre n'a bougé → aucun diff, donc aucune PR
 * tant que les contacts n'ont pas changé.
 */
async function writeStableJson(file, data, volatileKey) {
	let previous = null
	try {
		previous = JSON.parse(await readFile(file, 'utf8'))
	} catch {
		previous = null
	}

	if (previous && volatileKey) {
		const withoutVolatile = (o) => canonicalStringify({ ...o, [volatileKey]: null })
		if (withoutVolatile(data) === withoutVolatile(previous)) {
			// Contenu identique : on garde l'ancienne valeur volatile → fichier inchangé.
			data = { ...data, [volatileKey]: previous[volatileKey] }
		}
	}

	const next = canonicalStringify(data, '\t') + '\n'
	const current = previous ? canonicalStringify(previous, '\t') + '\n' : null
	if (next === current) {
		console.log(`= ${file} inchangé`)
		return
	}
	await writeFile(file, next)
	console.log(`✓ Écrit ${file}`)
}

function groupBy(arr, keyFn) {
	const out = {}
	for (const item of arr) {
		const k = keyFn(item)
		;(out[k] ||= []).push(item)
	}
	return out
}

function printReport(deputes, senateurs) {
	const all = [...deputes, ...senateurs]
	const byConf = groupBy(all, (e) => e.emailConfidence)
	console.log('\n── Rapport qualité emails ──')
	for (const lvl of ['high', 'medium', 'low', 'none']) {
		console.log(`  ${lvl.padEnd(7)}: ${(byConf[lvl] || []).length}`)
	}
	const conflicts = all.filter((e) => e._conflict)
	if (conflicts.length) {
		console.log(`\n⚠️  ${conflicts.length} emails divergents entre sources (à vérifier) :`)
		for (const c of conflicts.slice(0, 20)) {
			console.log(`   ${c.nom} (${c.role}) : ${c._conflict.join(' | ')}`)
		}
	}
	const noEmail = all.filter((e) => !e.email)
	if (noEmail.length) {
		console.log(`\nℹ️  ${noEmail.length} élus sans email → fallback formulaire de contact`)
	}
}

main().catch((err) => {
	console.error('✗ Échec de la génération :', err.message)
	process.exit(1)
})
