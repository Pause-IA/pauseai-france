import { error } from '@sveltejs/kit'
import { chargerArgumentaire, chargerIdeesRecues } from '$lib/server/idees-recues'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const idee = (await chargerIdeesRecues()).find((i) => i.slug === params.slug)
	if (!idee) error(404, 'Cette idée reçue n’existe pas (ou plus).')
	return { idee, argumentaire: await chargerArgumentaire(idee.id) }
}
