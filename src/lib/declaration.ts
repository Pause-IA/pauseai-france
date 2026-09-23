// Données de la déclaration PauseAI, côté navigateur : partagées par la page
// /[lang]/declaration et la liste complète /[lang]/declaration/signataires.

import type { DeclarationStats } from '../routes/api/declaration/+server'
import type { GlobalSignatories } from '$lib/server/declarationGlobal'
import { countryKey, countryLabel } from '$lib/countries'

export interface Entry {
	name: string
	title?: string
	comment?: string
	/** Code ISO du pays (ou nom brut s'il n'est pas reconnu). */
	country?: string
	/** Signataire recueilli sur pauseia.fr (et non par PauseAI Global). */
	local: boolean
	/** Signataire anonyme (nom non publié), affiché « Anonyme » comme chez Global. */
	anonymous?: boolean
	/** Texte de recherche normalisé (nom, titre, message, pays en FR et EN). */
	haystack: string
}

export interface DeclarationData {
	local: DeclarationStats['local']
	global: GlobalSignatories | null
	/** Liste de Global issue de la copie figée au déploiement (API injoignable). */
	globalFromSnapshot: boolean
}

export async function loadDeclaration(): Promise<DeclarationData> {
	const data: DeclarationData = { local: null, global: null, globalFromSnapshot: false }
	try {
		const res = await fetch('/api/declaration')
		if (res.ok) Object.assign(data, (await res.json()) as DeclarationStats)
	} catch {
		/* compteur indisponible : la page et le formulaire restent fonctionnels */
	}
	if (!data.global) {
		try {
			const res = await fetch('/api/declaration/global.json')
			const snapshot = res.ok ? ((await res.json()) as GlobalSignatories) : null
			if (snapshot && snapshot.totalCount > 0) {
				data.global = snapshot
				data.globalFromSnapshot = true
			}
		} catch {
			/* pas de copie de secours : on affiche seulement nos signataires */
		}
	}
	return data
}

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function entry(e: Omit<Entry, 'haystack'>): Entry {
	return {
		...e,
		haystack: norm(
			[
				e.anonymous ? 'anonyme anonymous' : e.name,
				e.title,
				e.comment,
				e.country && countryLabel(e.country, 'fr'),
				e.country && countryLabel(e.country, 'en')
			]
				.filter(Boolean)
				.join(' ')
		)
	}
}

/**
 * Tous les signataires, pour que la liste corresponde au compteur :
 *   1. nos signataires publics ;
 *   2. nos signataires qui n'ont pas souhaité apparaître, en « Anonyme · France »
 *      (le formulaire ne demande pas le pays), sans message ;
 *   3. ceux de Global, tels que pauseai.info/statement les affiche (anonymes
 *      compris, avec leur pays et leur message).
 */
export function toEntries(d: DeclarationData): Entry[] {
	const pub = d.local?.signatories ?? []
	const hidden = Math.max(0, (d.local?.count ?? 0) - pub.length)
	return [
		...pub.map((s) => entry({ ...s, country: 'FR', local: true })),
		...Array.from({ length: hidden }, () =>
			entry({ name: '', country: 'FR', local: true, anonymous: true })
		),
		...(d.global?.signatories ?? []).map((s) =>
			entry({
				name: s.name,
				comment: s.bio,
				country: countryKey(s.country),
				local: false,
				anonymous: s.anonymous
			})
		)
	]
}

export function counts(d: DeclarationData) {
	const localCount = d.local?.count ?? 0
	const worldCount = d.global ? d.global.totalCount + localCount : null
	// Anonymes compris quand l'API les fournit ; sinon, les signataires nommés.
	const globalFrance =
		d.global?.franceCount ??
		d.global?.signatories.filter((s) => countryKey(s.country) === 'FR').length ??
		0
	const franceCount = localCount + globalFrance
	return { localCount, worldCount, franceCount }
}
