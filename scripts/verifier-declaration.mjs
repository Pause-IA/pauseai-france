#!/usr/bin/env node
// Vérifie que la liste des signataires affichée sur pauseia.fr/declaration
// correspond à celle de PauseAI Global (pauseai.info/statement).
//
//   node scripts/verifier-declaration.mjs                  # compare avec https://pauseia.fr
//   node scripts/verifier-declaration.mjs https://<aperçu>.netlify.app
//
// Node 18+ requis (fetch intégré), aucune dépendance. Les données comparées sont
// publiques (celles des deux pages), rien d'autre n'est lu.

const SITE = (process.argv[2] || 'https://pauseia.fr').replace(/\/+$/, '')
// GLOBAL_URL : uniquement pour tester le script contre un faux serveur.
const GLOBAL = process.env.GLOBAL_URL || 'https://pauseai.info/api/signatories'

const norm = (s) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : '')
const isAnon = (s) => s.private === true || !norm(s.name) || /^anonymous$/i.test(norm(s.name))
// Clé d'un signataire : nom affiché (vide si anonyme), pays brut, message.
const key = (name, country, bio) => JSON.stringify([name, norm(country), norm(bio)])

async function getJson(url) {
	const res = await fetch(url, { headers: { accept: 'application/json' } })
	if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
	return res.json()
}

function diff(a, b) {
	const count = new Map()
	for (const k of a) count.set(k, (count.get(k) ?? 0) + 1)
	for (const k of b) count.set(k, (count.get(k) ?? 0) - 1)
	const onlyA = [],
		onlyB = []
	for (const [k, n] of count) {
		for (let i = 0; i < n; i++) onlyA.push(k)
		for (let i = 0; i < -n; i++) onlyB.push(k)
	}
	return { onlyA, onlyB }
}

function compare(label, globalData, ours) {
	const theirs = globalData.signatories.map((s) =>
		key(isAnon(s) ? '' : norm(s.name), s.country, s.bio)
	)
	const mine = ours.signatories.map((s) => key(s.anonymous ? '' : s.name, s.country, s.bio))
	const { onlyA, onlyB } = diff(theirs, mine)
	const ok = globalData.totalCount === ours.totalCount && onlyA.length === 0 && onlyB.length === 0
	console.log(`\n── ${label}`)
	console.log(`   total Global : ${globalData.totalCount}   total chez nous : ${ours.totalCount}`)
	console.log(`   signataires  : ${theirs.length} chez Global, ${mine.length} chez nous`)
	if (onlyA.length)
		console.log(
			`   ✗ ${onlyA.length} absents chez nous, ex. :`,
			onlyA.slice(0, 5).map((k) => JSON.parse(k))
		)
	if (onlyB.length)
		console.log(
			`   ✗ ${onlyB.length} en trop chez nous, ex. :`,
			onlyB.slice(0, 5).map((k) => JSON.parse(k))
		)
	console.log(ok ? '   ✓ Listes identiques' : '   ✗ Écarts détectés')
	return ok
}

const globalData = await getJson(GLOBAL)
console.log(`Source : ${GLOBAL}`)
console.log(`Site   : ${SITE}`)

const live = await getJson(`${SITE}/api/declaration`)
let ok = true
if (!live.global) {
	console.log(
		'\n── Liste servie par /api/declaration\n   ✗ Global absent de la réponse (API de Global injoignable depuis Netlify ?)'
	)
	ok = false
} else {
	ok =
		compare('Liste servie par /api/declaration (affichée sur la page)', globalData, live.global) &&
		ok
}

const snap = await getJson(`${SITE}/api/declaration/global.json`)
if (!snap.totalCount) {
	console.log(
		'\n── Copie de secours (global.json)\n   ✗ Vide : Global était injoignable pendant le dernier déploiement'
	)
	ok = false
} else {
	console.log(
		`\n   (copie de secours prise le ${snap.fetchedAt} : de nouvelles signatures ont pu arriver depuis)`
	)
	compare('Copie de secours /api/declaration/global.json', globalData, snap)
}

console.log(
	`\nCompteur « dans le monde » affiché : ${live.global ? live.global.totalCount + (live.local?.count ?? 0) : '—'} = ${live.global?.totalCount ?? '—'} (Global) + ${live.local?.count ?? '—'} (pauseia.fr)`
)
process.exit(ok ? 0 : 1)
