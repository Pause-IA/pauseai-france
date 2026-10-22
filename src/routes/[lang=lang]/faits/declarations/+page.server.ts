import { dev } from '$app/environment'
import { chargerDeclarations } from '$lib/server/faits'
import type { PageServerLoad } from './$types'

// Lu à chaque visite (comme la revue de presse) : une ligne cochée « Visible »
// dans Notion apparaît sans reconstruire le site.
export const prerender = false

export const load: PageServerLoad = async () => ({ declarations: await chargerDeclarations(dev) })
