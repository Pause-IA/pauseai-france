/**
 * Format a date string using French locale
 * @param value - ISO date string or any date-parseable string
 * @returns Formatted date string (e.g., "31/10/2025") or original value if invalid
 */
export function formatFrenchDate(value: string): string {
	const parsed = new Date(value)

	if (Number.isNaN(parsed.getTime())) {
		return value
	}

	return new Intl.DateTimeFormat('fr-FR').format(parsed)
}

/**
 * Format a date string using the specified language locale
 * @param value - ISO date string or any date-parseable string
 * @param lang - Target language ('fr' or 'en')
 * @returns Formatted date string
 */
export function formatDate(value: string, lang: 'fr' | 'en'): string {
	const parsed = new Date(value)

	if (Number.isNaN(parsed.getTime())) {
		return value
	}

	const locale = lang === 'fr' ? 'fr-FR' : 'en-US'
	return new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(parsed)
}
