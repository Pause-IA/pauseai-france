<script lang="ts">
	import type { PageData } from './$types'
	import PostMeta from '$components/PostMeta.svelte'
	import { Page } from '$components/ui'

	import { title as siteName } from '$config'

	export let data: PageData

	const { metadata, slug, content } = data
	const { title = slug, date, description, image } = metadata
</script>

<PostMeta title={`${title} | ${siteName}`} {description} {date} {image} />

<!-- Modèle « note » : un article des dangers est un texte long, comme les
     pages Markdown de la rubrique. Il avait jusqu'ici son titre souligné et
     aucune largeur de lecture : la ligne courait sur toute la page. -->
<Page
	{title}
	eyebrow={data.lang === 'en' ? 'Understand' : 'Comprendre'}
	width="text"
	variant="note"
	as="article"
>
	<div class="prose">
		<svelte:component this={content} />
	</div>
</Page>
