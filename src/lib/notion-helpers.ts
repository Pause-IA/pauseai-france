import type { PageObjectResponse } from '@notionhq/client'

type PropertyMap = PageObjectResponse['properties']
type Property = PropertyMap[string]

/**
 * Type-safe helpers for extracting Notion property values.
 * These handle the discriminated union types and optional chaining.
 */

export function getCheckbox(prop: Property | undefined): boolean | undefined {
	return prop?.type === 'checkbox' ? prop.checkbox : undefined
}

export function getRichTextContent(prop: Property | undefined): string | undefined {
	return prop?.type === 'rich_text' ? prop.rich_text[0]?.plain_text : undefined
}

export function getTitleContent(prop: Property | undefined): string | undefined {
	return prop?.type === 'title' ? prop.title[0]?.plain_text : undefined
}

export function getDateStart(prop: Property | undefined): string | undefined {
	return prop?.type === 'date' ? prop.date?.start : undefined
}

export function getUrl(prop: Property | undefined): string | undefined {
	return prop?.type === 'url' ? (prop.url ?? undefined) : undefined
}

export function getSelectName(prop: Property | undefined): string | undefined {
	return prop?.type === 'select' ? prop.select?.name : undefined
}

export function getEmail(prop: Property | undefined): string | undefined {
	return prop?.type === 'email' ? (prop.email ?? undefined) : undefined
}
