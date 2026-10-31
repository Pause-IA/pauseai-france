import * as config from '$config'
import { getPosts } from '$lib/api'
import { getStaticRoutes } from '$lib/routes'

export const prerender = true

export function GET() {
	// Les articles ne sont plus servis qu'avec un préfixe de langue.
	const postsFr = getPosts('', 'fr')
	const postsEn = getPosts('', 'en')
	const website = config.url

	// La racine est émise à part ci-dessous : on l'enlève de la liste pour ne
	// pas la déclarer deux fois.
	const staticRoutes = getStaticRoutes().filter((route) => route !== '/')
	// Un post dont l'adresse est déjà une page dédiée (ex. faq.md, lu par
	// /[lang]/faq) ne doit pas apparaître deux fois.
	const isStatic = (path: string) => staticRoutes.includes(path)

	const headers = { 'Content-Type': 'application/xml' }

	const xml = `
<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
		<url>
			<loc>${website}</loc>
			<changefreq>daily</changefreq>
			<priority>0.7</priority>
		</url>
		  ${staticRoutes
				.map(
					(route) =>
						`<url>
							<loc>${website}${route === '/' ? '' : route}</loc>
							<changefreq>weekly</changefreq>
							<priority>0.6</priority>
						</url>`
				)
				.join('')}
		  ${[...postsFr.map((p) => `fr/${p.slug}`), ...postsEn.map((p) => `en/${p.slug}`)]
				.filter((path) => !isStatic(`/${path}`))
				.map(
					(path) =>
						`<url>
							<loc>${website}/${path}</loc>
							<changefreq>daily</changefreq>
							<priority>0.7</priority>
						</url>`
				)
				.join('')}
	</urlset>
	`.trim()

	return new Response(xml, { headers })
}
