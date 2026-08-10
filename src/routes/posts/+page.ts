import { getPosts } from '$lib/api'

export function load() {
	// La FAQ a sa propre page (/faq) : on l'exclut de la liste du blog pour
	// éviter le contenu dupliqué et un lien /faq (racine) redondant.
	const posts = getPosts('', 'fr').filter(
		(p) =>
			p.slug !== 'faq' && p.slug !== 'financements' && p.slug !== 'incident-openai-hugging-face'
	)
	return { posts }
}
