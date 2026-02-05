import { getVideos, getArticles, getReports } from '$lib/notion'
import type { PageServerLoad } from './$types'

// Disable prerendering for this page since it uses dynamic environment variables
export const prerender = false

export const load: PageServerLoad = async () => {
	const [videos, articles, reports] = await Promise.all([getVideos(), getArticles(), getReports()])

	return {
		videos,
		articles,
		reports
	}
}
