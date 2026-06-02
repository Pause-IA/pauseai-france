import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client'
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

function isPageWithProperties(result: PageObjectResponse | any): result is PageObjectResponse {
	return result.object === 'page' && 'properties' in result
}

export const prerender = false

async function queryAllResults(dataSourceId: string) {
	const results: any[] = []
	let cursor: string | undefined = undefined

	do {
		// @ts-ignore
		const response: any = await notion.dataSources.query({
			data_source_id: dataSourceId,
			...(cursor ? { start_cursor: cursor } : {})
		})
		results.push(...response.results)
		cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined
	} while (cursor)

	return results
}

export async function load() {
	try {
		const testimonialsResults = await queryAllResults(process.env.TESTIMONIALS_ID as string)
		const articleShowcaseResults = await queryAllResults(process.env.ARTICLE_SHOWCASE_ID as string)

		const testimonials = testimonialsResults
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

		const articleShowcaseItems = articleShowcaseResults
			.filter(isPageWithProperties)
			.filter((item) => getCheckbox(item.properties.Afficher))
			.map((item) => ({
				title: getTitleContent(item.properties.Titre),
				summary: getRichTextContent(item.properties.Résumé),
				date: getDateStart(item.properties.Date),
				url: getUrl(item.properties.URL),
				category: getSelectName(item.properties.Catégorie),
				image: getUrl(item.properties.Image),
				langue: getSelectName(item.properties.Langue)
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
