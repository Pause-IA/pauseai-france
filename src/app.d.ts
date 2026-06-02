// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	// Injected at build time by vite.config.ts — last commit date of
	// src/lib/data/resources.ts in YYYY-MM-DD format.
	const __RESOURCES_UPDATED__: string
}
declare module '*.md' {
	import type { SvelteComponent } from 'svelte'

	export default class Comp extends SvelteComponent {}

	export interface PostMetadata {
		title?: string
		date?: string
		description?: string
		image?: string
		original?: {
			title: string
			url: string
		}
		[key: string]: unknown
	}

	export const metadata: PostMetadata
}
