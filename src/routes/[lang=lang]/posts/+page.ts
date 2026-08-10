import { getPosts } from '$lib/api'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
	const lang = params.lang as 'fr' | 'en'
	// La FAQ a sa propre page (/faq) : exclue du blog (contenu dupliqué).
	const posts = getPosts('', lang).filter(
		(p) =>
			p.slug !== 'faq' && p.slug !== 'financements' && p.slug !== 'incident-openai-hugging-face'
	)
	return { posts }
}
