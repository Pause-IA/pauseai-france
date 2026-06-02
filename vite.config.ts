import { sveltekit } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { viteTypographyPlugin } from './src/lib/typographyPlugin'
import { execSync } from 'node:child_process'

// Last commit date of the resources data file, injected at build time so the
// /ressources page can show "Mise à jour : YYYY-MM-DD" without anyone having
// to bump a constant. Falls back to today if `git` isn't available.
let resourcesUpdated: string
try {
	resourcesUpdated = execSync('git log -1 --format=%cs -- src/lib/data/resources.ts', {
		encoding: 'utf8'
	}).trim()
	if (!resourcesUpdated) throw new Error('empty')
} catch {
	resourcesUpdated = new Date().toISOString().slice(0, 10)
}

const config = {
	server: {
		port: 37572
	},
	plugins: [enhancedImages(), sveltekit(), viteTypographyPlugin],
	define: {
		__RESOURCES_UPDATED__: JSON.stringify(resourcesUpdated)
	},
	test: {
		chaiConfig: {
			truncateThreshold: 0
		}
	}
}

export default config
