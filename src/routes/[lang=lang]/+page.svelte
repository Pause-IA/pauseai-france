<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Hero from '$components/home/hero.svelte'
	import LocalGroupsCta from '$components/home/local-groups-cta.svelte'
	import Lead from '$components/home/lead.svelte'
	import Campaigns from '$components/home/campaigns.svelte'
	import Risks from '$components/home/risks.svelte'
	import Articles from '$components/home/articles.svelte'
	import NewsletterCta from '$components/home/newsletter-cta.svelte'
	import Faq from '$components/home/faq.svelte'
	import Videos from '$components/home/videos.svelte'
	import Inserts from '$components/home/inserts.svelte'
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

<LocalGroupsCta {lang} />

<Lead {lang} />

<Campaigns {lang} />

<Risks {lang} />

<NewsletterCta {lang} />

<Videos videos={data.videos} {lang} />

<Inserts reports={data.reports} {lang} />

<Articles articles={data.articles} {lang} />

<Faq {lang} />
