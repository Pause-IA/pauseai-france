<script lang="ts">
	import type { PageData } from './$types'
	import PostMeta from '$components/PostMeta.svelte'
	import { Page } from '$components/ui'
	import { getT } from '$lib/i18n'

	import { title as siteName } from '$config'

	export let data: PageData

	const { metadata, slug, content } = data
	const { title = slug, date, description, image, original, chapo } = metadata

	$: t = getT(data.lang)
	$: dateLabel = date
		? new Intl.DateTimeFormat(data.lang === 'en' ? 'en-GB' : 'fr-FR', {
				day: 'numeric',
				month: 'long',
				year: 'numeric'
			}).format(new Date(date))
		: undefined
	$: eyebrow = [t.nav.article, dateLabel].filter(Boolean).join(' · ')
</script>

<PostMeta title={`${title} | ${siteName}`} {description} {date} {image} />

<Page {title} {eyebrow} lede={chapo ? String(chapo) : undefined} width="text" as="article">
	<div class="prose">
		<svelte:component this={content} />
	</div>
	{#if original}
		<footer>
			Adaptée de '<a href={original.url}>{original.title}</a>' par PauseAI, sous
			<a href="https://creativecommons.org/licenses/by/4.0/deed.fr">licence CC BY 4.0</a>.
		</footer>
	{/if}
</Page>

<style>
	footer {
		color: var(--text-secondary);
		font-size: 0.8rem;
		margin-top: 4rem;
	}
</style>
