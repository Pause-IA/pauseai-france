<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Hero from '$components/home/hero.svelte'
	import Lead from '$components/home/lead.svelte'
	import WriteAction from '$components/home/write-action.svelte'
	import Campaigns from '$components/home/campaigns.svelte'
	import LocalGroups from '$components/home/local-groups.svelte'
	import Articles from '$components/home/articles.svelte'
	import NewsletterCta from '$components/home/newsletter-cta.svelte'
	import Bande from '$components/home/Bande.svelte'
	import Videos from '$components/home/videos.svelte'
	import { bannerStore } from '$lib/stores/banner'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)

	// Update banner store if we got data from Notion
	$: if (data.banner) {
		bannerStore.set(data.banner)
	}
</script>

<PostMeta title={t.home.meta_title} description={t.home.meta_desc} />

<Hero {lang} />

<Lead {lang} />

<!-- Deux ensembles plutôt que neuf blocs de poids égal : « agir » d’un côté,
     « s’informer » de l’autre. La séparation se fait par un filet, et non plus
     par un aplat crème : le crème est sorti de la charte. -->
<Bande titre={t.home.bande_agir_titre}>
	<WriteAction {lang} />
	<Campaigns {lang} />
	<LocalGroups {lang} />
</Bande>

<Bande titre={t.home.bande_informer_titre}>
	<NewsletterCta {lang} />
	<Videos videos={data.videos} {lang} />
	<Articles articles={data.articles} {lang} />
</Bande>
