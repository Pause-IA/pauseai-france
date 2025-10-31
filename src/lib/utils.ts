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
