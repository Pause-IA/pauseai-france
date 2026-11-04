import { url } from '$config'
import { getPosts } from '$lib/api'
import { getStaticRoutes } from '$lib/routes'

export const prerender = true

export function GET() {
	// Les articles ne sont plus servis qu'avec un préfixe de langue.
	const postsFr = getPosts('', 'fr')
	const postsEn = getPosts('', 'en')
	const website = url

	// La racine est émise à part ci-dessous : on l'enlève de la liste pour ne
	// pas la déclarer deux fois.
	const staticRoutes = getStaticRoutes().filter((route) => route !== '/')
	// Un post dont l'adresse est déjà une page dédiée (ex. faq.md, lu par
	// /[lang]/faq) ne doit pas apparaître deux fois.
	const isStatic = (path: string) => staticRoutes.includes(path)

	const headers = { 'Content-Type': 'text/plain' }

	const lines: string[] = []
	lines.push(website)
	for (const route of staticRoutes) {
		lines.push(`${website}${route === '/' ? '' : route}`)
	}
	for (const path of [
		...postsFr.map((p) => `/fr/${p.slug}`),
		...postsEn.map((p) => `/en/${p.slug}`)
	]) {
		if (!isStatic(path)) lines.push(`${website}${path}`)
	}

	const sitemap = lines.join('\n')

	return new Response(sitemap, { headers })
}
