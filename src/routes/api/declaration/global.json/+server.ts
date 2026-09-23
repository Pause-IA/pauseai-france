import { json } from '@sveltejs/kit'
import { fetchGlobalSignatories, type GlobalSignatories } from '$lib/server/declarationGlobal'
import type { RequestHandler } from './$types'

// Copie de secours de la liste de PauseAI Global, figée à chaque déploiement.
// La page /declaration s'en sert si l'API de Global ne répond plus : on
// affiche alors la dernière liste connue plutôt que rien.
export const prerender = true

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		return json(await fetchGlobalSignatories(fetch, 20000))
	} catch (e) {
		// Pas de quoi faire échouer le déploiement : la copie est simplement vide.
		console.warn('[declaration] copie de la liste de Global impossible :', e)
		const empty: GlobalSignatories = { totalCount: 0, signatories: [], fetchedAt: '' }
		return json(empty)
	}
}
