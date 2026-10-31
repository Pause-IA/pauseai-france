<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FaqList from '$components/FaqList.svelte'
	import Fly from '$components/Fly.svelte'
	import Button from '$components/Button.svelte'
	import { parseFaq, flattenFaq } from '$lib/faq'
	import type { Lang } from '$lib/i18n'
	import faqRaw from '$posts/faq.md?raw'
	import faqRawEn from '$posts/en/faq.md?raw'

	export let lang: Lang = 'fr'

	const label_id = 'faq-title'
	$: isEn = lang === 'en'
	$: prefix = `/${lang}`
	$: all = parseFaq(isEn ? faqRawEn : faqRaw)
	// Aperçu : six questions clés en liste simple (même ordre dans les deux
	// langues). La FAQ complète et ses données structurées FAQPage vivent sur
	// /[lang]/faq, la page que les moteurs doivent positionner : pas de
	// doublon ici.
	const PREVIEW = [0, 6, 10, 12, 2, 13]
	$: flatItems = flattenFaq(all)
	$: total = flatItems.length
	$: preview = [
		{
			category: '',
			items: PREVIEW.map((i) => flatItems[i]).filter(Boolean)
		}
	]
</script>

<section id="faq" class="faq" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>F.A.Q.</UnderlinedTitle>
	</Fly>

	<p class="faq-intro">
		{#if isEn}
			Have questions? Here are the answers to the questions most often asked by our visitors,
			journalists and supporters.
		{:else}
			Des questions ? Voici les réponses aux interrogations les plus fréquentes de nos visiteurs,
			journalistes et soutiens.
		{/if}
	</p>

	<FaqList categories={preview} flat />

	<div class="more">
		<Button href="{prefix}/faq">
			{isEn ? `See all ${total} questions` : `Voir les ${total} questions`}
		</Button>
	</div>
</section>

<style>
	.faq-intro {
		margin: 0 0 2rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.more {
		margin-top: 1.5rem;
	}
</style>
