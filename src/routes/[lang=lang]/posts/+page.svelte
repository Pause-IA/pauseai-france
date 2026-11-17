<script lang="ts">
	/**
	 * Modèle « liste » : gabarit Page, grille partagée (LinkGrid) et carte
	 * partagée (ArticleCard). Cette page avait sa propre mise en page, son
	 * propre titre souligné et sa propre liste : elle ne ressemblait à aucune
	 * autre liste du site, et n'avait pas de PostMeta, donc ni description ni
	 * image au partage.
	 */
	import { getT } from '$lib/i18n'
	import PostMeta from '$components/PostMeta.svelte'
	import ArticleCard from '$components/ArticleCard.svelte'
	import { Page, LinkGrid } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)
	$: prefix = `/${lang}`
	$: posts = data.posts
</script>

<PostMeta title={t.posts.meta_title} description={t.posts.meta_desc} />

<Page width="wide" eyebrow={t.nav.actualites} title={t.posts.title} lede={t.posts.lede}>
	<LinkGrid min="22rem">
		{#each posts as { slug, title, description, date } (slug)}
			<ArticleCard {title} blurb={description} {date} {lang} url="{prefix}/{slug}" />
		{/each}
	</LinkGrid>
</Page>
