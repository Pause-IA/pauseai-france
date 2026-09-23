// Utility to enumerate public static routes for sitemap generation
// Excludes API endpoints, dynamic parameterized routes, and non-page server endpoints

/**
 * Routes à ne pas référencer dans les sitemaps, en chemin sans préfixe de
 * langue. Les gabarits de page n'ont rien à faire dans l'index des moteurs.
 */
const EXCLUDED = ['/campagne-modele', '/declaration/confirmer']

/**
 * Chemins sans préfixe de langue redirigés en 301 par static/_redirects : un
 * sitemap ne doit lister que des URL canoniques, pas des sources de
 * redirection. À tenir à jour avec ce fichier.
 */
const REDIRECTED = ['/campagnes']

/** Langues du site : le segment [lang=lang] n'accepte que celles-ci. */
const LANGS = ['fr', 'en']

export function getStaticRoutes(): string[] {
	// Match top-level and nested +page.svelte under src/routes, excluding api and parameterized folders
	// Using eager true to get keys synchronously
	const pageModules = import.meta.glob('/src/routes/**/+page.svelte', { eager: true })

	const routes = Object.keys(pageModules)
		.map((absolutePath) => {
			// Strip prefix and filename to get a route path
			// e.g., /src/routes/rejoindre/+page.svelte -> /rejoindre
			// e.g., /src/routes/+page.svelte -> /
			const routePath =
				absolutePath.replace(/^\/src\/routes/, '').replace(/\/\+page\.svelte$/, '') || '/'

			return routePath === '' ? '/' : routePath
		})
		.flatMap((routePath) => {
			// Exclude private/non-public segments
			if (routePath.startsWith('/api')) return []
			if (routePath.startsWith('/sitemap')) return []

			// Le segment de langue n'est pas un paramètre libre : il vaut « fr » ou
			// « en ». On le développe plutôt que d'écarter la route, sinon aucune
			// page localisée (campagnes, FAQ, pages de campagne…) n'est référencée.
			if (routePath.startsWith('/[lang=lang]')) {
				const suffix = routePath.replace('/[lang=lang]', '')
				if (suffix.includes('[')) return [] // params libres, ex. [slug]
				if (EXCLUDED.includes(suffix)) return []
				return LANGS.map((lang) => `/${lang}${suffix}`)
			}

			if (routePath.includes('[')) return [] // dynamic params
			if (EXCLUDED.includes(routePath)) return []
			if (REDIRECTED.includes(routePath)) return []
			return [routePath]
		})

	// Deduplicate and sort for stability
	const unique = Array.from(new Set(routes)).sort()
	return unique
}
