import { env } from '$env/dynamic/private'

const NOTION_API_VERSION = '2022-06-28'

interface NotionRichText {
	plain_text: string
}

interface NotionFile {
	type: 'file' | 'external'
	file?: { url: string; expiry_time?: string }
	external?: { url: string }
}

interface NotionProperty {
	type: string
	title?: NotionRichText[]
	rich_text?: NotionRichText[]
	url?: string
	number?: number
	checkbox?: boolean
	select?: { name: string }
	date?: { start: string; end?: string | null }
	files?: NotionFile[]
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
	slug: string
	description: string
	url: string
	type: 'Article' | 'Newsletter'
	order: number
	visible: boolean
	image?: string
	date?: string
}

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/[^a-z0-9\s-]/g, '') // Remove special chars
		.replace(/\s+/g, '-') // Spaces to hyphens
		.replace(/-+/g, '-') // Collapse multiple hyphens
		.replace(/^-|-$/g, '') // Trim hyphens
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

export interface Banner {
	id: string
	message: string
	linkText: string
	linkUrl: string
	visible: boolean
}

export interface PressRelease {
	id: string
	title: string
	slug: string
	date: string
	url: string
	description: string
	order: number
	visible: boolean
}

export interface LocalPressRelease {
	id: string
	title: string
	slug: string
	date: string
	url: string
	description: string
	department: string
	order: number
	visible: boolean
}

export interface PressCoverage {
	id: string
	title: string
	source: string
	date: string
	url: string
	order: number
	visible: boolean
}

// Événements / actions des groupes locaux (manifestations, tractages…)
export interface LocalEvent {
	id: string
	title: string
	/** Date de l'action (YYYY-MM-DD). */
	date: string
	city: string
	/** Type d'action (Manifestation, Tractage, Conférence…). Facultatif. */
	type: string
	/** Lien d'inscription pour un événement à venir, ou article de presse pour une action passée. Facultatif. */
	url: string
	/** Heure (texte libre, ex. « 18h »). Affichée pour les actions à venir. */
	time: string
	/** Lieu précis (ex. « Turbine.Coop »). Affiché pour les actions à venir. */
	place: string
	description: string
	/** Une ou plusieurs photos (la colonne Notion « Image » accepte plusieurs fichiers). */
	images: string[]
	/** Action « à la une » : affichée plus grande, avec galerie. */
	featured: boolean
	/** Nombre de bénévoles présents (facultatif, affiché si > 0). */
	volunteers: number
	visible: boolean
}

function isValidLocalEvent(e: LocalEvent): boolean {
	if (!e.title) {
		console.warn(`Invalid event: missing title`)
		return false
	}
	if (!e.date) {
		console.warn(`Invalid event: missing date for "${e.title}"`)
		return false
	}
	return true
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

// Helper to extract date
function getDate(property: NotionProperty | undefined): string {
	if (!property) return ''
	return property.date?.start || ''
}

// Helper to extract file URL from Notion files/attachments
function getFileUrl(property: NotionProperty | undefined): string {
	if (!property) return ''
	// Support both "files" type (attachments) and "url" type
	if (property.files && property.files.length > 0) {
		const file = property.files[0]
		if (file.type === 'file' && file.file?.url) return file.file.url
		if (file.type === 'external' && file.external?.url) return file.external.url
	}
	return property.url || ''
}

// Helper to extract ALL file URLs (Notion "files" property with several files)
function getFileUrls(property: NotionProperty | undefined): string[] {
	if (!property || !property.files) return []
	return property.files
		.map((f) => (f.type === 'file' ? (f.file?.url ?? '') : (f.external?.url ?? '')))
		.filter((u) => u !== '')
}

// Validation helpers
function isValidVideo(video: Video): boolean {
	// YouTube ID must be present and look valid (11 characters)
	if (!video.youtubeId || video.youtubeId.length < 5) {
		console.warn(`Invalid video: missing or invalid YouTube ID for "${video.title}"`)
		return false
	}
	if (!video.title) {
		console.warn(`Invalid video: missing title for YouTube ID "${video.youtubeId}"`)
		return false
	}
	return true
}

function isValidArticle(article: Article): boolean {
	if (!article.title) {
		console.warn(`Invalid article: missing title`)
		return false
	}
	if (!article.url) {
		console.warn(`Invalid article: missing URL for "${article.title}"`)
		return false
	}
	return true
}

function isValidReport(report: Report): boolean {
	if (!report.title) {
		console.warn(`Invalid report: missing title`)
		return false
	}
	if (!report.url) {
		console.warn(`Invalid report: missing URL for "${report.title}"`)
		return false
	}
	return true
}

function isValidBanner(banner: Banner): boolean {
	if (!banner.message) {
		console.warn(`Invalid banner: missing message`)
		return false
	}
	return true
}

function isValidPressRelease(pr: PressRelease): boolean {
	if (!pr.title) {
		console.warn(`Invalid press release: missing title`)
		return false
	}
	if (!pr.url) {
		console.warn(`Invalid press release: missing URL for "${pr.title}"`)
		return false
	}
	return true
}

function isValidLocalPressRelease(pr: LocalPressRelease): boolean {
	if (!pr.title) {
		console.warn(`Invalid local press release: missing title`)
		return false
	}
	if (!pr.url) {
		console.warn(`Invalid local press release: missing URL for "${pr.title}"`)
		return false
	}
	if (!pr.department) {
		console.warn(`Invalid local press release: missing department for "${pr.title}"`)
		return false
	}
	return true
}

function isValidPressCoverage(pc: PressCoverage): boolean {
	if (!pc.title) {
		console.warn(`Invalid press coverage: missing title`)
		return false
	}
	if (!pc.url) {
		console.warn(`Invalid press coverage: missing URL for "${pc.title}"`)
		return false
	}
	if (!pc.source) {
		console.warn(`Invalid press coverage: missing source for "${pc.title}"`)
		return false
	}
	return true
}

async function queryDatabase<T>(
	databaseId: string,
	mapper: (page: NotionPage) => T,
	options?: { sortBy?: string; sortDirection?: 'ascending' | 'descending' }
): Promise<T[]> {
	const apiKey = env.NOTION_API_KEY
	if (!apiKey || !databaseId) {
		console.warn('Notion API key or database ID not configured')
		return []
	}

	try {
		const body: { sorts?: Array<{ property: string; direction: string }> } = {}
		if (options?.sortBy) {
			body.sorts = [{ property: options.sortBy, direction: options.sortDirection ?? 'ascending' }]
		}

		const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Notion-Version': NOTION_API_VERSION,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
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

	const videos = await queryDatabase<Video | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const video: Video = {
				id: page.id,
				title: getText(page.properties['Titre']),
				youtubeId: getText(page.properties['YouTube ID']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			// Validate before returning
			return isValidVideo(video) ? video : null
		},
		{ sortBy: 'Ordre' }
	)

	return videos.filter((v): v is Video => v !== null)
}

export async function getArticles(): Promise<Article[]> {
	const databaseId = env.NOTION_ARTICLES_DATABASE_ID
	if (!databaseId) return []

	const articles = await queryDatabase<Article | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const typeValue = getSelect(page.properties['Type'])

			const title = getText(page.properties['Titre'])
			const article: Article = {
				id: page.id,
				title,
				slug: generateSlug(title),
				description: getText(page.properties['Description']),
				url: getUrl(page.properties['URL']),
				type: typeValue === 'Newsletter' ? 'Newsletter' : 'Article',
				order: getNumber(page.properties['Ordre']),
				visible,
				image: getFileUrl(page.properties['Image']) || undefined,
				date: getDate(page.properties['Date de publication']) || undefined
			}

			// Validate before returning
			return isValidArticle(article) ? article : null
		},
		{ sortBy: 'Date de publication', sortDirection: 'descending' }
	)

	return articles.filter((a): a is Article => a !== null)
}

export async function getNewsletters(): Promise<Article[]> {
	const articles = await getArticles()
	return articles.filter((a) => a.type === 'Newsletter')
}

export async function getNewsletterBySlug(slug: string): Promise<Article | null> {
	const newsletters = await getNewsletters()
	return newsletters.find((n) => n.slug === slug) || null
}

/**
 * Fetches newsletter HTML content from a CiviCRM mailing URL and extracts the body.
 * Returns cleaned HTML string, or null if fetch fails.
 */
export async function fetchNewsletterContent(url: string): Promise<string | null> {
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				Accept: 'text/html,application/xhtml+xml'
			}
		})

		if (!response.ok) {
			console.error(`[Newsletter] HTTP ${response.status} for ${url}`)
			return null
		}

		const html = await response.text()

		const content = extractMailingContent(html)

		// Check if extracted content has meaningful text (strip tags and check length)
		const textOnly = content.replace(/<[^>]*>/g, '').trim()

		if (textOnly.length < 100) {
			console.warn(
				`[Newsletter] Content too short (${textOnly.length} chars text), raw HTML preview:`
			)
			console.warn(html.substring(0, 2000))
			console.warn('--- end preview ---')
		}

		return content
	} catch (error) {
		console.error('[Newsletter] Failed to fetch content:', error)
		return null
	}
}

/**
 * Extracts the newsletter body from a CiviCRM mailing view HTML page.
 * Tries multiple strategies to find the content.
 */
function extractMailingContent(html: string): string {
	// Strategy 1: Look for CiviCRM mailing body wrapper
	const bodyPatterns = [
		// CiviCRM mailing body container
		/<div[^>]*class="[^"]*crm-mailing-body[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div[^>]*class="[^"]*crm-mailing-footer|$)/i,
		// The actual email content is often in a centered table
		/(<table[^>]*width="[56]\d{2}"[^>]*>[\s\S]*?<\/table>)\s*(?:<\/(?:div|td|body)>)/i,
		// CiviCRM view-content wrapper
		/<div[^>]*class="[^"]*view-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
		// Generic content wrapper in CiviCRM pages
		/<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|<div[^>]*id="footer)/i
	]

	for (const pattern of bodyPatterns) {
		const match = html.match(pattern)
		if (match && match[1]) {
			const cleaned = cleanContent(match[1])
			const textOnly = cleaned.replace(/<[^>]*>/g, '').trim()
			if (textOnly.length > 100) {
				return cleaned
			}
		}
	}

	// Strategy 2: Extract full <body> content and clean it
	const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
	if (bodyMatch && bodyMatch[1]) {
		return cleanContent(bodyMatch[1])
	}

	// Strategy 3: If no body tag, the response might already be the content
	if (html.length > 200 && !html.includes('<!DOCTYPE')) {
		return cleanContent(html)
	}

	console.warn(`[Newsletter] No extraction strategy matched`)
	return html
}

/**
 * Cleans extracted HTML content by removing CiviCRM chrome,
 * scripts, and fixing relative URLs.
 * IMPORTANT: Inline styles are preserved to maintain email layout integrity.
 */
function cleanContent(html: string): string {
	let cleaned = html

	// Remove script tags
	cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

	// Remove style tags (global CSS, not inline styles)
	cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

	// Remove HTML comments
	cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')

	// Remove head tag content if present
	cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')

	// Remove link, meta tags
	cleaned = cleaned.replace(/<(?:link|meta)[^>]*\/?>/gi, '')

	// Remove CiviCRM navigation/chrome elements
	cleaned = cleaned.replace(/<div[^>]*id="[^"]*crm-navigation[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
	cleaned = cleaned.replace(/<div[^>]*class="[^"]*crm-breadcrumb[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')

	// Remove unsubscribe/opt-out links section
	cleaned = cleaned.replace(/<[^>]*class="[^"]*opt-out[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, '')

	// Remove CiviCRM form elements
	cleaned = cleaned.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')

	// Remove hidden elements
	cleaned = cleaned.replace(
		/<[^>]*style="[^"]*display\s*:\s*none[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi,
		''
	)

	// --- Remove CiviCRM mailing footer ---
	// Strategy: find the LAST occurrence of known footer markers and cut there.
	// Use indexOf on the plain text to find positions, then cut the HTML.
	const footerCandidates = [
		{ text: 'Gérer mes préférences', minPosition: 0.5 },
		{ text: 'G\u00e9rer mes pr\u00e9f\u00e9rences', minPosition: 0.5 },
		{ text: '32 boulevard de Strasbourg', minPosition: 0.5 },
		{ text: 'Pause IA — 32', minPosition: 0.5 }
	]

	// Find the earliest footer marker that appears after minPosition
	let footerCutIndex = -1
	for (const candidate of footerCandidates) {
		const minIdx = Math.floor(cleaned.length * candidate.minPosition)
		const idx = cleaned.indexOf(candidate.text, minIdx)
		if (idx > 0 && (footerCutIndex === -1 || idx < footerCutIndex)) {
			footerCutIndex = idx
		}
	}

	if (footerCutIndex > 0) {
		// Walk back to find a clean cut point (opening tag boundary)
		const before = cleaned.substring(0, footerCutIndex)
		// Look for "Soutenir Pause IA" section that typically precedes the footer
		const soutenirIdx = before.lastIndexOf('Soutenir Pause IA')
		// Only use this cut point if it's reasonably close to the footer (within 2000 chars)
		if (soutenirIdx > 0 && footerCutIndex - soutenirIdx < 2000) {
			cleaned = cleaned.substring(0, soutenirIdx)
		} else {
			cleaned = before
		}
	}

	// Remove specific standalone links (unsubscribe, view in browser) without truncating
	cleaned = cleaned.replace(
		/<a[^>]*>[^<]{0,100}(?:voir[^<]{0,30}navigateur|view[^<]{0,30}browser|lire[^<]{0,30}navigateur)[^<]{0,50}<\/a>/gi,
		''
	)
	cleaned = cleaned.replace(
		/<a[^>]*>[^<]{0,100}(?:d[eé]sinscri|unsubscribe|opt.?out)[^<]{0,50}<\/a>/gi,
		''
	)

	// Fix relative URLs to CiviCRM
	cleaned = cleaned.replace(
		/(?:src|href)="(?!http|mailto|#|data:)([^"]*)"/gi,
		(_match, path: string) => {
			const attr = _match.startsWith('src') ? 'src' : 'href'
			return `${attr}="https://civicrm.pauseia.fr/${path.replace(/^\//, '')}"`
		}
	)

	// --- Minimal spacing cleanup ---
	// Only remove completely empty table rows
	cleaned = cleaned.replace(/<tr[^>]*>\s*<\/tr>/gi, '')

	// Remove chains of 4+ consecutive br tags
	cleaned = cleaned.replace(/(<br\s*\/?\s*>\s*){4,}/gi, '<br><br>')

	return cleaned.trim()
}

export async function getReports(): Promise<Report[]> {
	const databaseId = env.NOTION_REPORTS_DATABASE_ID
	if (!databaseId) return []

	const reports = await queryDatabase<Report | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const report: Report = {
				id: page.id,
				title: getText(page.properties['Titre']),
				description: getText(page.properties['Description']),
				url: getUrl(page.properties['URL']),
				image: getUrl(page.properties['Image']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			// Validate before returning
			return isValidReport(report) ? report : null
		},
		{ sortBy: 'Ordre' }
	)

	return reports.filter((r): r is Report => r !== null)
}

export async function getBanner(): Promise<Banner | null> {
	const databaseId = env.NOTION_BANNER_DATABASE_ID
	if (!databaseId) return null

	const banners = await queryDatabase<Banner | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		const banner: Banner = {
			id: page.id,
			message: getText(page.properties['Message']),
			linkText: getText(page.properties['Texte du lien']),
			linkUrl: getUrl(page.properties['URL du lien']),
			visible
		}

		// Validate before returning
		return isValidBanner(banner) ? banner : null
	})

	// Return the first visible banner
	return banners.find((b): b is Banner => b !== null) || null
}

export async function getPressReleases(): Promise<PressRelease[]> {
	const databaseId = env.NOTION_PRESS_DATABASE_ID
	if (!databaseId) return []

	const pressReleases = await queryDatabase<PressRelease | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const title = getText(page.properties['Titre'])
			const pr: PressRelease = {
				id: page.id,
				title,
				slug: generateSlug(title),
				date: getDate(page.properties['Date']),
				url: getUrl(page.properties['URL']),
				description: getText(page.properties['Description']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidPressRelease(pr) ? pr : null
		},
		{ sortBy: 'Date', sortDirection: 'descending' }
	)

	return pressReleases.filter((pr): pr is PressRelease => pr !== null)
}

export async function getPressReleaseBySlug(slug: string): Promise<PressRelease | null> {
	const releases = await getPressReleases()
	return releases.find((pr) => pr.slug === slug) || null
}

export async function getLocalPressReleases(): Promise<LocalPressRelease[]> {
	const databaseId = env.NOTION_LOCAL_PRESS_DATABASE_ID
	if (!databaseId) return []

	const pressReleases = await queryDatabase<LocalPressRelease | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const title = getText(page.properties['Titre'])
			const pr: LocalPressRelease = {
				id: page.id,
				title,
				slug: generateSlug(title),
				date: getDate(page.properties['Date']),
				url: getUrl(page.properties['URL']),
				description: getText(page.properties['Description']),
				department: getText(page.properties['Département']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidLocalPressRelease(pr) ? pr : null
		},
		{ sortBy: 'Date', sortDirection: 'descending' }
	)

	return pressReleases.filter((pr): pr is LocalPressRelease => pr !== null)
}

export async function getLocalPressReleaseBySlug(slug: string): Promise<LocalPressRelease | null> {
	const releases = await getLocalPressReleases()
	return releases.find((pr) => pr.slug === slug) || null
}

/**
 * Fetches press release HTML content from a CiviCRM URL and extracts the body.
 * Reuses the same extraction logic as newsletters since both use CiviCRM mailings.
 * Returns null for PDF URLs (which should be handled differently).
 */
export async function fetchPressReleaseContent(url: string): Promise<string | null> {
	// PDF URLs should not be fetched as HTML
	if (url.toLowerCase().endsWith('.pdf')) {
		return null
	}
	return fetchNewsletterContent(url)
}

export async function getPressCoverage(): Promise<PressCoverage[]> {
	const databaseId = env.NOTION_PRESS_COVERAGE_DATABASE_ID
	if (!databaseId) return []

	const items = await queryDatabase<PressCoverage | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const pc: PressCoverage = {
				id: page.id,
				title: getText(page.properties['Titre']),
				source: getText(page.properties['Source']),
				date: getDate(page.properties['Date']),
				url: getUrl(page.properties['URL']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidPressCoverage(pc) ? pc : null
		},
		{ sortBy: 'Date', sortDirection: 'descending' }
	)

	return items.filter((pc): pc is PressCoverage => pc !== null)
}

export async function getLocalEvents(): Promise<LocalEvent[]> {
	const databaseId = env.NOTION_EVENTS_DATABASE_ID
	if (!databaseId) return []

	const events = await queryDatabase<LocalEvent | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const event: LocalEvent = {
				id: page.id,
				title: getText(page.properties['Titre']),
				date: getDate(page.properties['Date']),
				city: getText(page.properties['Ville']),
				type: getSelect(page.properties['Type']),
				url: getUrl(page.properties['URL']),
				time: getText(page.properties['Heure']),
				place: getText(page.properties['Lieu']),
				description: getText(page.properties['Description']),
				images: getFileUrls(page.properties['Image']),
				featured: getCheckbox(page.properties['À la une']),
				volunteers: getNumber(page.properties['Bénévoles']),
				visible
			}

			return isValidLocalEvent(event) ? event : null
		},
		{ sortBy: 'Date', sortDirection: 'ascending' }
	)

	return events.filter((e): e is LocalEvent => e !== null)
}

// Team members
export type TeamCategory = 'Direction' | 'Conseil scientifique' | 'Membre'

export interface TeamMember {
	id: string
	name: string
	role: string
	profession: string
	category: TeamCategory
	image: string
	order: number
	visible: boolean
}

function isValidTeamMember(member: TeamMember): boolean {
	if (!member.name) {
		console.warn(`Invalid team member: missing name`)
		return false
	}
	if (!member.category) {
		console.warn(`Invalid team member: missing category for "${member.name}"`)
		return false
	}
	return true
}

export async function getTeamMembers(): Promise<TeamMember[]> {
	const databaseId = env.NOTION_TEAM_DATABASE_ID
	if (!databaseId) return []

	const members = await queryDatabase<TeamMember | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const categoryValue = getSelect(page.properties['Catégorie'])

			const member: TeamMember = {
				id: page.id,
				name: getText(page.properties['Nom']),
				role: getText(page.properties['Rôle']),
				profession: getText(page.properties['Profession']),
				category: (categoryValue as TeamCategory) || 'Membre',
				image: getFileUrl(page.properties['Photo']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidTeamMember(member) ? member : null
		},
		{ sortBy: 'Ordre' }
	)

	return members.filter((m): m is TeamMember => m !== null)
}
