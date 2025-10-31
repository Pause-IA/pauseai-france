import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client'
import type { Actions } from './$types'
import { error as svelteKitError } from '@sveltejs/kit'
import {
	getCheckbox,
	getRichTextContent,
	getTitleContent,
	getDateStart,
	getUrl,
	getSelectName
} from '$lib/notion-helpers'

const notion = new Client({
	auth: process.env.NOTION_TOKEN as string
})

// Type guard to check if result is a full page with properties
function isPageWithProperties(result: PageObjectResponse | any): result is PageObjectResponse {
	return result.object === 'page' && 'properties' in result
}

export const prerender = false

export async function load() {
	try {
		const testimonials_datasource = await notion.dataSources.query({
			data_source_id: process.env.TESTIMONIALS_ID as string
		})

		const articleShowcase_datasource = await notion.dataSources.query({
			data_source_id: process.env.ARTICLE_SHOWCASE_ID as string
		})

		const testimonials = testimonials_datasource.results
			.filter(isPageWithProperties)
			.filter(
				(item) =>
					getCheckbox(item.properties.Afficher) && getRichTextContent(item.properties.Témoignage)
			)
			.map((item) => ({
				name:
					getCheckbox(item.properties.Consentement) && getTitleContent(item.properties.Prenom)
						? getTitleContent(item.properties.Prenom)
						: undefined,
				age: getRichTextContent(item.properties.Age),
				job: getRichTextContent(item.properties.Profession),
				date: getDateStart(item.properties.Date),
				testimony: getRichTextContent(item.properties.Témoignage)
			}))

		const articleShowcaseItems = articleShowcase_datasource.results
			.filter(isPageWithProperties)
			.filter((item) => getCheckbox(item.properties.Afficher))
			.map((item) => ({
				title: getTitleContent(item.properties.Titre),
				summary: getRichTextContent(item.properties.Résumé),
				date: getDateStart(item.properties.Date),
				url: getUrl(item.properties.URL),
				category: getSelectName(item.properties.Catégorie),
				image: getUrl(item.properties.Image)
			}))

		return {
			testimonials: testimonials,
			articleShowcaseItems: articleShowcaseItems
		}
	} catch (err) {
		console.error('Error loading emploi-ia page data:', {
			error: err instanceof Error ? err.message : String(err),
			timestamp: new Date().toISOString()
		})
		throw svelteKitError(500, 'Unable to load page data. Please try again later.')
	}
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const avis = formData.get('avis')

		if (typeof avis !== 'string' || avis.length === 0) {
			return { success: false, error: 'Le champ avis est requis.' }
		}

		try {
			const page = await notion.pages.create({
				parent: { data_source_id: process.env.FEEDBACK_ID as string },

				properties: {
					Avis: {
						title: [
							{
								text: { content: avis.length > 200 ? avis.slice(0, 200) : avis }
							}
						]
					}
				}
			})

			return { success: true, pageId: page.id }
		} catch (err) {
			console.error('Error submitting feedback:', {
				error: err instanceof Error ? err.message : String(err),
				timestamp: new Date().toISOString()
			})
			return { success: false, error: 'Une erreur est survenue.' }
		}
	}
} satisfies Actions
