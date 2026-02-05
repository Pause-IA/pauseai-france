<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Hero from '$components/home/hero.svelte'
	import Lead from '$components/home/lead.svelte'
	import Risks from '$components/home/risks.svelte'
	import Articles from '$components/home/articles.svelte'
	import NewsletterCta from '$components/home/newsletter-cta.svelte'
	import Faq from '$components/home/faq.svelte'
	import Videos from '$components/home/videos.svelte'
	import Supporters from '$components/home/supporters.svelte'
	import Inserts from '$components/home/inserts.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const title = 'Exigeons une Pause IA'
	const description = "Ne laissons pas l'IA nous détruire, agissons maintenant"
</script>

<PostMeta {title} {description} />

<Hero />

<Lead />

<Risks />

<Videos videos={data.videos} />

<Inserts reports={data.reports} />

<Articles articles={data.articles} />

<NewsletterCta />

<Supporters />

<Faq />
