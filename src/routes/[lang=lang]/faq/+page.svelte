<script lang="ts">
	// Page FAQ dédiée : la référence pour les moteurs de recherche (une ancre
	// /fr#faq ne se positionne pas seule). Elle porte les données structurées
	// FAQPage ; l'accueil n'en montre qu'un aperçu, sans données structurées,
	// pour ne pas dupliquer le contenu ni le balisage.
	import PostMeta from '$components/PostMeta.svelte'
	import FaqList from '$components/FaqList.svelte'
	import Button from '$components/Button.svelte'
	import { Page } from '$components/ui'
	import { parseFaq, flattenFaq, faqJsonLd } from '$lib/faq'
	import { jsonLdTag } from '$lib/jsonLd'
	import faqRaw from '$posts/faq.md?raw'
	import faqRawEn from '$posts/en/faq.md?raw'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = `/${data.lang}`
	$: categories = parseFaq(isEn ? faqRawEn : faqRaw)
	$: jsonLdScript = jsonLdTag(faqJsonLd(flattenFaq(categories)))

	const t = {
		fr: {
			title: 'Foire aux questions | Pause IA',
			desc: "Questions fréquentes sur Pause IA et les risques de l'intelligence artificielle : qui nous sommes, notre financement, pourquoi un moratoire sur l'IA, ce que nous demandons et comment s'impliquer.",
			heading: 'Foire aux questions',
			intro:
				'Des questions ? Voici les réponses aux interrogations les plus fréquentes de nos visiteurs, journalistes et soutiens.',
			search: 'Rechercher une question…',
			searchLabel: 'Rechercher dans la FAQ',
			result: (n: number) => `${n} résultat${n > 1 ? 's' : ''}`,
			noResults: (query: string) =>
				`Aucun résultat pour « ${query} ». Essayez avec d’autres mots-clés.`,
			more: 'Vous ne trouvez pas votre réponse ?',
			contact: 'Écrivez-nous'
		},
		en: {
			title: 'Frequently asked questions | Pause IA',
			desc: 'Frequently asked questions about Pause IA and the risks of artificial intelligence: who we are, how we are funded, why an AI moratorium, what we demand and how to get involved.',
			heading: 'Frequently asked questions',
			intro:
				'Have questions? Here are the answers to the questions most often asked by our visitors, journalists and supporters.',
			search: 'Search a question…',
			searchLabel: 'Search the FAQ',
			result: (n: number) => `${n} result${n > 1 ? 's' : ''}`,
			noResults: (query: string) => `No results for “${query}”. Try other keywords.`,
			more: 'Can’t find your answer?',
			contact: 'Write to us'
		}
	}
	$: tr = isEn ? t.en : t.fr

	const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
	let query = ''
	$: q = norm(query.trim())
	$: searching = q.length >= 2
	$: filtered = searching
		? categories
				.map((c) => ({
					...c,
					items: c.items.filter((i) => norm(`${i.question} ${i.answerText}`).includes(q))
				}))
				.filter((c) => c.items.length > 0)
		: categories
	$: resultCount = filtered.reduce((n, c) => n + c.items.length, 0)
</script>

<PostMeta title={tr.title} description={tr.desc} />

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>

<Page
	as="article"
	width="content"
	eyebrow={isEn ? 'About' : 'À propos'}
	title={tr.heading}
	lede={tr.intro}
>
	<div class="search">
		<svg
			class="search-icon"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
			<path d="M16 16L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<input
			type="search"
			bind:value={query}
			placeholder={tr.search}
			aria-label={tr.searchLabel}
			autocomplete="off"
		/>
	</div>

	{#if searching}
		<p class="result-count" aria-live="polite">{tr.result(resultCount)}</p>
	{/if}

	{#if resultCount === 0}
		<p class="no-results">{tr.noResults(query)}</p>
	{:else}
		<FaqList categories={filtered} open={searching} />
	{/if}

	<aside class="more">
		<p>{tr.more}</p>
		<Button href="mailto:contact@pauseia.fr">{tr.contact}</Button>
		<a href="{prefix}/qui-sommes-nous">{isEn ? 'Who are we?' : 'Qui sommes-nous ?'}</a>
	</aside>
</Page>

<style>
	.search {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.search-icon {
		position: absolute;
		left: 0.85rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search input {
		inline-size: 100%;
		padding: 0.7rem 0.85rem 0.7rem 2.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font: inherit;
		background: var(--bg);
		color: var(--text);
	}

	.result-count {
		font-size: 0.9rem;
		color: var(--text-2);
		margin: 0 0 1rem;
	}

	.no-results {
		text-align: center;
		color: var(--text-2);
		padding: 2rem 1rem;
		font-style: italic;
	}

	.more {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}

	.more p {
		margin: 0;
		font-weight: 600;
	}

	@media (max-width: 600px) {
	}
</style>
