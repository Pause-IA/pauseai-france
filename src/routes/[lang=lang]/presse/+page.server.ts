import { getPressReleases, getLocalPressReleases, getPressCoverage } from '$lib/notion'
import { staticPressCoverage } from '$lib/press-coverage-static'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const [pressReleases, localPressReleases, notionCoverage] = await Promise.all([
		getPressReleases(),
		getLocalPressReleases(),
		getPressCoverage()
	])

	// Revue de presse : Notion en priorité, repli sur le fichier statique du dépôt
	// si la base Notion n'est pas configurée ou est vide (aucune régression).
	return {
		pressReleases,
		localPressReleases,
		pressCoverage: notionCoverage.length > 0 ? notionCoverage : staticPressCoverage
	}
}
