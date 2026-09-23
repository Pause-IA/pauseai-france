// Signataires de la déclaration PauseAI recueillis par PauseAI Global
// (pauseai.info/statement). Leur API est publique mais n'accepte pas les
// appels depuis un navigateur d'un autre domaine : on la lit côté serveur.

import { countryKey } from '$lib/countries'

export const GLOBAL_SIGNATORIES_URL = 'https://pauseai.info/api/signatories'

export interface GlobalSignatory {
	name: string
	country?: string
	bio?: string
	/** Signataire anonyme (Global l'affiche lui aussi, sous « Anonymous »). */
	anonymous?: boolean
}

export interface GlobalSignatories {
	totalCount: number
	/** Signatures en France, anonymes comprises (absent des anciennes copies). */
	franceCount?: number
	/**
	 * Tous les signataires publiés par Global, anonymes compris (comme sur
	 * pauseai.info/statement), du plus récent au plus ancien. Aucun n'est écarté
	 * ni tronqué : la liste doit correspondre à la leur.
	 */
	signatories: GlobalSignatory[]
	/** Date de récupération (ISO). */
	fetchedAt: string
}

interface RawSignatory {
	name?: unknown
	country?: unknown
	bio?: unknown
	date?: unknown
	private?: unknown
}

const str = (v: unknown, max: number) =>
	typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''

// Garde-fous de taille seulement (bien au-delà de ce que le formulaire de
// Global accepte) : rien n'est coupé en pratique.
const MAX_NAME = 300
const MAX_BIO = 10000

/** Lit et normalise la liste de Global. Lève une erreur si elle est inexploitable. */
export async function fetchGlobalSignatories(
	fetchFn: typeof fetch,
	timeoutMs = 5000
): Promise<GlobalSignatories> {
	const controller = new AbortController()
	const timer = setTimeout(() => {
		controller.abort()
	}, timeoutMs)
	try {
		const res = await fetchFn(GLOBAL_SIGNATORIES_URL, { signal: controller.signal })
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		const data = (await res.json()) as { totalCount?: unknown; signatories?: unknown }
		// Leur API renvoie un total à 0 quand leur Airtable est injoignable.
		if (typeof data.totalCount !== 'number' || data.totalCount <= 0) {
			throw new Error('Empty or invalid response')
		}
		const raw = Array.isArray(data.signatories) ? (data.signatories as RawSignatory[]) : []
		const signatories = raw
			.map((s) => {
				const anonymous = s.private === true
				return {
					date: typeof s.date === 'string' ? Date.parse(s.date) || 0 : 0,
					name: anonymous ? '' : str(s.name, MAX_NAME),
					country: str(s.country, 60) || undefined,
					bio: str(s.bio, MAX_BIO) || undefined,
					anonymous
				}
			})
			.map((s) => ({ ...s, anonymous: s.anonymous || !s.name || /^anonymous$/i.test(s.name) }))
			.sort((a, b) => b.date - a.date)
			.map(({ name, country, bio, anonymous }) =>
				anonymous ? { name: '', country, bio, anonymous } : { name, country, bio }
			)
		const franceCount = signatories.filter((s) => countryKey(s.country) === 'FR').length
		return {
			totalCount: data.totalCount,
			franceCount,
			signatories,
			fetchedAt: new Date().toISOString()
		}
	} finally {
		clearTimeout(timer)
	}
}
