<script lang="ts">
	/**
	 * Page d'accueil.
	 *
	 * Ordre voulu : la crédibilité avant l'action. Un visiteur arrivait sur un
	 * manifeste de cinq paragraphes, puis sur « voici comment agir », sans avoir
	 * jamais lu de quoi juger si ces gens sont sérieux. Il voit maintenant, dans
	 * l'ordre : les médias qui nous citent, trois chiffres vérifiables, le fait
	 * marquant (la tribune du Monde), puis ce que nous demandons — et seulement
	 * ensuite comment agir.
	 *
	 * Le manifeste (ancien composant `lead`) est retiré : son contenu est le
	 * propos de /pourquoi et des pages « dangers », à un clic.
	 *
	 * Rien ici ne doit citer le nombre de rencontres d'élus, la proposition de
	 * loi ni les projets de résolution : ce sont des informations réservées,
	 * sous confidentialité.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import Hero from '$components/home/hero.svelte'
	import VuDans from '$components/home/VuDans.svelte'
	import Preuves from '$components/home/Preuves.svelte'
	import TribuneVedette from '$components/home/TribuneVedette.svelte'
	import Demandes from '$components/home/Demandes.svelte'
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

<VuDans {lang} />

<Bande titre={t.home.bande_bilan_titre}>
	<Preuves {lang} />
	<TribuneVedette {lang} />
</Bande>

<Bande titre={t.home.bande_demandes_titre}>
	<Demandes {lang} />
</Bande>

<Bande titre={t.home.bande_agir_titre}>
	<WriteAction {lang} />
	<Campaigns {lang} />
	<LocalGroups {lang} />
</Bande>

<Bande titre={t.home.bande_informer_titre}>
	<Videos videos={data.videos} {lang} />
	<Articles articles={data.articles} {lang} />
</Bande>

<NewsletterCta {lang} />
