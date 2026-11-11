// Lien « changer de langue » : même page dans l'autre langue. Partagé par le
// menu et le pied de page.

// Les pages « Dangers » n'ont pas le même slug dans les deux langues.
const DANGER_SLUGS: Record<'fr' | 'en', string[]> = {
	fr: ['economiques-et-materiels', 'pour-les-individus', 'pour-la-societe', "pour-l'humanite"],
	en: ['economic-and-material', 'for-individuals', 'for-society', 'for-humanity']
}

export function switchLangHref(pathname: string, current: 'fr' | 'en', other: 'fr' | 'en') {
	const dangerMatch = pathname.match(new RegExp(`^/${current}/dangers/(.+)$`))
	if (dangerMatch) {
		const idx = DANGER_SLUGS[current].indexOf(dangerMatch[1])
		if (idx >= 0) return `/${other}/dangers/${DANGER_SLUGS[other][idx]}`
	}
	return pathname.replace(`/${current}`, `/${other}`) || `/${other}`
}
