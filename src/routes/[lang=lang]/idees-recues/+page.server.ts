import { chargerIdeesRecues, CATEGORIES } from '$lib/server/idees-recues'
import type { PageServerLoad } from './$types'

// Lu à chaque visite : une ligne cochée « Visible » dans Notion apparaît sans
// reconstruire le site.
export const prerender = false

export const load: PageServerLoad = async () => ({
	idees: await chargerIdeesRecues(),
	categories: CATEGORIES
})
