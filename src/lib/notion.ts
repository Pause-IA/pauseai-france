import { env } from '$env/dynamic/private'

const NOTION_API_VERSION = '2022-06-28'

interface NotionRichText {
	plain_text: string
}

interface NotionProperty {
	type: string
	title?: NotionRichText[]
	rich_text?: NotionRichText[]
	url?: string
	number?: number
	checkbox?: boolean
	select?: { name: string }
}

interface NotionPage {
	id: string
	properties: Record<string, NotionProperty>
}

interface NotionQueryResponse {
	results: NotionPage[]
	has_more: boolean
	next_cursor: string | null
}

// Types for our content
export interface Video {
	id: string
	title: string
	youtubeId: string
	order: number
	visible: boolean
}

export interface Article {
	id: string
	title: string
	description: string
	url: string
	type: 'Article' | 'Newsletter'
	order: number
	visible: boolean
}

export interface Report {
	id: string
	title: string
	description: string
	url: string
	image: string
	order: number
	visible: boolean
}

// Helper to extract text from Notion rich_text or title
function getText(property: NotionProperty | undefined): string {
	if (!property) return ''
	if (property.title && property.title.length > 0) {
		return property.title.map((t) => t.plain_text).join('')
	}
	if (property.rich_text && property.rich_text.length > 0) {
		return property.rich_text.map((t) => t.plain_text).join('')
	}
	return ''
}

// Helper to extract URL
function getUrl(property: NotionProperty | undefined): string {
	if (!property) return ''
	return property.url || ''
}

// Helper to extract number
function getNumber(property: NotionProperty | undefined): number {
	if (!property) return 0
	return property.number || 0
}

// Helper to extract checkbox
function getCheckbox(property: NotionProperty | undefined): boolean {
	if (!property) return false
	return property.checkbox || false
}

// Helper to extract select
function getSelect(property: NotionProperty | undefined): string {
	if (!property) return ''
	return property.select?.name || ''
}

async function queryDatabase<T>(databaseId: string, mapper: (page: NotionPage) => T): Promise<T[]> {
	const apiKey = env.NOTION_API_KEY
	if (!apiKey || !databaseId) {
		console.warn('Notion API key or database ID not configured')
		return []
	}

	try {
		const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Notion-Version': NOTION_API_VERSION,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sorts: [{ property: 'Ordre', direction: 'ascending' }]
			})
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(`Notion API error: ${response.status} - ${errorText}`)
			return []
		}

		const data = (await response.json()) as NotionQueryResponse
		return data.results.map(mapper).filter((item) => item !== null)
	} catch (error) {
		console.error('Failed to fetch from Notion:', error)
		return []
	}
}

export async function getVideos(): Promise<Video[]> {
	const databaseId = env.NOTION_VIDEOS_DATABASE_ID
	if (!databaseId) return []

	const videos = await queryDatabase<Video | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		return {
			id: page.id,
			title: getText(page.properties['Titre']),
			youtubeId: getText(page.properties['YouTube ID']),
			order: getNumber(page.properties['Ordre']),
			visible
		}
	})

	return videos.filter((v): v is Video => v !== null)
}

export async function getArticles(): Promise<Article[]> {
	const databaseId = env.NOTION_ARTICLES_DATABASE_ID
	if (!databaseId) return []

	const articles = await queryDatabase<Article | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		const typeValue = getSelect(page.properties['Type'])

		return {
			id: page.id,
			title: getText(page.properties['Titre']),
			description: getText(page.properties['Description']),
			url: getUrl(page.properties['URL']),
			type: typeValue === 'Newsletter' ? 'Newsletter' : 'Article',
			order: getNumber(page.properties['Ordre']),
			visible
		}
	})

	return articles.filter((a): a is Article => a !== null)
}

export async function getReports(): Promise<Report[]> {
	const databaseId = env.NOTION_REPORTS_DATABASE_ID
	if (!databaseId) return []

	const reports = await queryDatabase<Report | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		return {
			id: page.id,
			title: getText(page.properties['Titre']),
			description: getText(page.properties['Description']),
			url: getUrl(page.properties['URL']),
			image: getUrl(page.properties['Image']),
			order: getNumber(page.properties['Ordre']),
			visible
		}
	})

	return reports.filter((r): r is Report => r !== null)
}
