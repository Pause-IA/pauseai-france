// import { AIRTABLE_API_KEY } from '$env/static/private'
import type { Post } from '$lib/types'
// import { outcomesMeta } from '$routes/outcomes/meta'
// import { communitiesMeta } from '$routes/communities/communities'
// import { meta as pdoomMeta } from '$routes/pdoom/meta'
// import { meta as quotesMeta } from '$routes/quotes/meta'
// import { meta as emailBuilderMeta } from '$routes/email-builder/meta'
// import { meta as peopleMeta } from '$routes/people/meta'
// import { meta as teamsMeta } from '$routes/teams/meta'

/** When adding an extra route, make sure to add the metadata here for SEO purposes */
const hardCodedPages: Post[] = [
	// outcomesMeta,
	// communitiesMeta,
	// pdoomMeta,
	// quotesMeta,
	// emailBuilderMeta,
	// peopleMeta,
	// teamsMeta
]

// if (!AIRTABLE_API_KEY && import.meta.env.MODE == 'production') {
// 	throw new Error('AIRTABLE_API_KEY is missing from .env')
// }

/** Fetch options for getting data from Airtable */
// export const options = {
// 	method: 'GET',
// 	headers: {
// 		Authorization: `Bearer ${AIRTABLE_API_KEY}`,
// 		'Content-Type': 'application/json'
// 	}
// }

/**
 * Une page de démonstration ou de travail porte `brouillon: true` dans son
 * frontmatter. Elle reste dans le dépôt mais sort des listes et du sitemap :
 * le prérendu ne génère que les pages atteignables, donc une page listée mais
 * non liée était annoncée aux moteurs de recherche et répondait 404.
 */
const estBrouillon = (m: Partial<Post> & { brouillon?: boolean }) => m.brouillon === true

export function getPosts(subpath = '', lang: 'fr' | 'en' = 'fr') {
	let posts: Post[] = []

	const paths = import.meta.glob('/src/posts/**/*.md', { eager: true })

	for (const path in paths) {
		const file = paths[path]

		if (lang === 'en') {
			// English posts live in /src/posts/en/
			const slug = path.match(`^/src/posts/en(${subpath}/.*).md$`)?.[1].slice(1)
			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const metadata = file.metadata as Omit<Post, 'slug'>
				if (estBrouillon(metadata)) continue
				// Use slug without 'en/' prefix since the lang prefix is handled by the URL structure
				const post = { ...metadata, slug } satisfies Post
				posts.push(post)
			}
		} else {
			// French posts - exclude the /en/ directory
			if (path.includes('/src/posts/en/')) continue
			const slug = path.match(`^/src/posts(${subpath}/.*).md$`)?.[1].slice(1)
			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const metadata = file.metadata as Omit<Post, 'slug'>
				if (estBrouillon(metadata)) continue
				const post = { ...metadata, slug } satisfies Post
				posts.push(post)
			}
		}
	}

	if (!subpath) {
		posts.push(...hardCodedPages)
	}

	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	)

	return posts
}
