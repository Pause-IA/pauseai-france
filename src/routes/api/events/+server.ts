import { json } from '@sveltejs/kit'
import { getLocalEvents } from '$lib/notion'
import type { RequestHandler } from './$types'

// Non prérendu : récupéré côté client pour que l'agenda reste à jour entre deux
// déploiements (les actions passées disparaissent, les nouvelles apparaissent).
export const prerender = false

export const GET: RequestHandler = async () => {
	const events = await getLocalEvents()
	return json(events)
}
