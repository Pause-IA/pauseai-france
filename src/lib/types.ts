export type Categories = 'sveltekit' | 'svelte'

export interface Post {
	title: string
	/** Path in URL from root */
	slug: string
	/** Meta description for SEO */
	description: string
	/**
	 * Date in YYYY-MM-DD format
	 */
	date: string
	categories: Categories[]
}

/** Testimonial from Notion for emploi-ia page */
export interface Testimonial {
	testimony: string
	name?: string
	age?: string
	job?: string
	date?: string
}

/** Article showcase item from Notion for emploi-ia page */
export interface ArticleShowcaseItem {
	title: string
	url: string
	summary?: string
	date?: string
	category?: string
	image?: string
}
