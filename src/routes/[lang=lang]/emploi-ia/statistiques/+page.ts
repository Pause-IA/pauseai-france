import type { PageLoad, EntryGenerator } from './$types'

export const prerender = true

export const entries: EntryGenerator = () => [{ lang: 'fr' }, { lang: 'en' }]

export const load: PageLoad = ({ params }) => {
	return { lang: params.lang }
}
