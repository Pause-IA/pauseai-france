/** Convert any Notion property value to a plain string. */
export function extractValue(property: any): string {
	if (!property) return ''

	switch (property.type) {
		case 'title':
			return property.title.map((t: any) => t.plain_text).join('')
		case 'rich_text':
			return property.rich_text.map((t: any) => t.plain_text).join('')
		case 'number':
			return property.number !== null && property.number !== undefined
				? String(property.number)
				: ''
		case 'select':
			return property.select?.name ?? ''
		case 'multi_select':
			return property.multi_select.map((s: any) => s.name).join(' | ')
		case 'status':
			return property.status?.name ?? ''
		case 'date':
			return property.date
				? property.date.end
					? `${property.date.start} → ${property.date.end}`
					: property.date.start
				: ''
		case 'checkbox':
			return property.checkbox ? 'true' : 'false'
		case 'url':
			return property.url ?? ''
		case 'email':
			return property.email ?? ''
		case 'phone_number':
			return property.phone_number ?? ''
		case 'people':
			return property.people.map((p: any) => p.name ?? p.id).join(' | ')
		case 'files':
			return property.files.map((f: any) => f.file?.url ?? f.external?.url ?? f.name).join(' | ')
		case 'relation':
			return property.relation.map((r: any) => r.id).join(' | ')
		case 'formula': {
			const f = property.formula
			if (f.type === 'string') return f.string ?? ''
			if (f.type === 'number') return f.number !== null ? String(f.number) : ''
			if (f.type === 'boolean') return String(f.boolean)
			if (f.type === 'date') return f.date?.start ?? ''
			return ''
		}
		case 'rollup': {
			const r = property.rollup
			if (r.type === 'number') return r.number !== null ? String(r.number) : ''
			if (r.type === 'date') return r.date?.start ?? ''
			if (r.type === 'array') return r.array.map((item: any) => extractValue(item)).join(' | ')
			return ''
		}
		case 'created_time':
			return property.created_time ?? ''
		case 'last_edited_time':
			return property.last_edited_time ?? ''
		case 'created_by':
			return property.created_by?.name ?? property.created_by?.id ?? ''
		case 'last_edited_by':
			return property.last_edited_by?.name ?? property.last_edited_by?.id ?? ''
		default:
			return ''
	}
}

function normalizeComparable(value: string): string {
	return value
		.trim()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
}

export function find_pourcentage(
	values: any[],
	allowedValues?: string[]
): { value: any; percentage: string }[] {
	const result: { value: any; count: number }[] = []
	const allowedMap = new Map(
		(allowedValues ?? []).map((value) => [normalizeComparable(value), value] as const)
	)

	const processValue = (val: any) => {
		if (!val) return
		if (typeof val === 'string') {
			val = val.trim()
		}
		if (val === '' || val === '"' || val === '""' || val === '"""') return

		// If allowedValues is provided and the value is not in it, map to "Autre"
		let effectiveValue = val
		if (allowedValues && allowedValues.length > 0) {
			const normalized = normalizeComparable(val)
			effectiveValue = allowedMap.get(normalized) ?? 'Autre'
		}

		const existing = result.find((item) => item.value === effectiveValue)
		if (existing) {
			existing.count += 1
		} else {
			result.push({ value: effectiveValue, count: 1 })
		}
	}

	for (const value of values) {
		if (!value) continue

		if (typeof value === 'string' && (value.includes('\n') || value.includes(' | '))) {
			const splitValues = value.split(/\n| \| /)
			for (const splitValue of splitValues) {
				processValue(splitValue)
			}
			continue
		}

		processValue(value)
	}

	let total = 0
	for (const item of result) {
		total += item.count
	}
	if (total === 0) return []

	// Sort so "Autre" is often at the end or based on count, but keep logic consistent
	return result
		.sort((a, b) => b.count - a.count)
		.map((item) => ({
			value: item.value,
			percentage: ((item.count / total) * 100).toFixed(2) + '%'
		}))
}

export function find_pourcentage_by_groupe(
	items: any[],
	groupKey: string,
	valueKey: string
): {
	group: string
	values: { value: any; percentage: string }[]
}[] {
	const grouped: Record<string, any[]> = {}

	// Grouper les items
	for (const item of items) {
		const groupValueRaw = extractValue(item.properties?.[groupKey]).trim()
		const targetValue = extractValue(item.properties?.[valueKey]).trim()

		if (!groupValueRaw) continue

		const groups = groupValueRaw.split(/\n| \| /)
		for (const g of groups) {
			const groupValue = g.trim()
			if (!groupValue) continue

			if (!grouped[groupValue]) {
				grouped[groupValue] = []
			}

			grouped[groupValue].push(targetValue)
		}
	}

	// Calcul des pourcentages pour chaque groupe
	const result = Object.entries(grouped).map(([group, values]) => ({
		group,
		values: find_pourcentage(values)
	}))

	return result
}

export function find_impact_rankings(
	items: any[],
	groupKey: string,
	valueKey: string,
	targetValue: string,
	minCount: number = 3
): { label: string; value: number; count: number }[] {
	const grouped: Record<string, string[]> = {}

	for (const item of items) {
		const groupValueRaw = extractValue(item.properties?.[groupKey]).trim()
		const targetVal = extractValue(item.properties?.[valueKey]).trim()

		if (!groupValueRaw) continue

		const groups = groupValueRaw.split(/\n| \| /)
		for (const g of groups) {
			const groupValue = g.trim()
			if (!groupValue) continue

			if (!grouped[groupValue]) {
				grouped[groupValue] = []
			}
			grouped[groupValue].push(targetVal)
		}
	}

	const rankings = Object.entries(grouped)
		.map(([group, values]) => {
			const total = values.length
			const targetCount = values.filter((v) => v === targetValue).length
			return {
				label: group,
				value: total > 0 ? parseFloat(((targetCount / total) * 100).toFixed(2)) : 0,
				count: total
			}
		})
		.filter((item) => item.value > 0 && item.count >= minCount)
		.sort((a, b) => b.value - a.value)

	return rankings
}

export function find_impact_rankings_by_age(
	items: any[],
	ageKey: string,
	valueKey: string,
	targetValue: string,
	minCount: number = 3
): { label: string; value: number; count: number }[] {
	const grouped: Record<string, string[]> = {}

	for (const item of items) {
		const rawAge = extractValue(item.properties?.[ageKey]).trim()
		const targetVal = extractValue(item.properties?.[valueKey]).trim()

		const match = rawAge.match(/\d+/)
		if (!match || !targetVal) continue

		const age = parseInt(match[0])
		const min = Math.floor(age / 10) * 10
		const ageGroup = `${min}-${min + 9} ans`

		if (!grouped[ageGroup]) {
			grouped[ageGroup] = []
		}
		grouped[ageGroup].push(targetVal)
	}

	const rankings = Object.entries(grouped)
		.map(([group, values]) => {
			const total = values.length
			const targetCount = values.filter((v) => v === targetValue).length
			return {
				label: group,
				value: total > 0 ? parseFloat(((targetCount / total) * 100).toFixed(2)) : 0,
				count: total
			}
		})
		.filter((item) => item.value > 0 && item.count >= minCount)
		.sort((a, b) => b.value - a.value)

	return rankings
}

export function find_pourcentage_by_groupe_age_tens(
	items: any[],
	groupKey: string,
	valueKey: string
): {
	group: string
	values: { value: any; percentage: string }[]
}[] {
	const grouped: Record<string, string[]> = {}

	for (const item of items) {
		const groupValue = extractValue(item.properties?.[groupKey]).trim()

		const rawAge = extractValue(item.properties?.[valueKey]).trim()

		const match = rawAge.match(/\d+/)

		if (!groupValue || !match) continue

		const age = parseInt(match[0])

		const tens = Math.floor(age / 10) * 10

		const ageRange = `${tens}-${tens + 9}`

		if (!grouped[groupValue]) {
			grouped[groupValue] = []
		}

		grouped[groupValue].push(ageRange)
	}

	return Object.entries(grouped).map(([group, values]) => ({
		group,
		values: find_pourcentage(values)
	}))
}

export function impact_by_age_tens(
	items: any[],
	ageKey: string,
	valueKey: string
): {
	group: string
	values: { value: any; percentage: string }[]
}[] {
	const grouped: Record<string, string[]> = {}

	for (const item of items) {
		const rawAge = extractValue(item.properties?.[ageKey]).trim()
		const value = extractValue(item.properties?.[valueKey]).trim()

		const match = rawAge.match(/\d+/)
		if (!match || !value) continue

		const age = parseInt(match[0])

		const min = Math.floor(age / 10) * 10
		const max = min + 9

		const ageGroup = `${min}-${max} ans`

		if (!grouped[ageGroup]) {
			grouped[ageGroup] = []
		}

		grouped[ageGroup].push(value)
	}

	return Object.entries(grouped)
		.map(([group, values]) => ({
			group,
			values: find_pourcentage(values)
		}))
		.sort((a, b) => {
			// tri par âge
			const aMin = parseInt(a.group)
			const bMin = parseInt(b.group)
			return aMin - bMin
		})
}

export function mean(values: number[]): number {
	if (values.length === 0) return 0
	return values.reduce((a, b) => a + b, 0) / values.length
}

export function statistics_by_tens(values: number[]): { value: number; percentage: string }[] {
	const result: { value: number; count: number }[] = []
	for (const value of values) {
		if (!value) continue
		const tens = Math.floor(value / 10) * 10
		const existing = result.find((item) => item.value === tens)
		if (existing) {
			existing.count += 1
		} else {
			result.push({ value: tens, count: 1 })
		}
	}
	return result
		.sort((a, b) => b.count - a.count)
		.map((item) => ({
			value: item.value,
			percentage: (values.length > 0 ? ((item.count / values.length) * 100).toFixed(2) : '0') + '%'
		}))
}
