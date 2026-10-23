import { error } from '@sveltejs/kit'
import { chargerArgumentaire, chargerIdeesRecues, dateEnFrancais } from '$lib/server/idees-recues'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const idee = (await chargerIdeesRecues()).find((i) => i.slug === params.slug)
	if (!idee) error(404, 'Cette idée reçue n’existe pas (ou plus).')
	return {
		idee,
		argumentaire: await chargerArgumentaire(idee.id),
		// Mises en forme ici : dateEnFrancais vit dans $lib/server, qu'un composant
		// client ne peut pas importer sans emporter la clé d'API dans le navigateur.
		publieLe: dateEnFrancais(idee.publieLe),
		misAJourLe: dateEnFrancais(idee.misAJourLe)
	}
}
