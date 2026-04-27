<script lang="ts">
	import { onMount } from 'svelte'
	import CarouselNavigation from '$components/CarouselNavigation.svelte'
	import ArticleTeaserCard from '$components/ArticleTeaserCard.svelte'
	import type { ArticleShowcaseItem } from '$lib/types'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let articles: ArticleShowcaseItem[] = []
	export let lang: Lang = 'fr'

	$: t = getT(lang)
	$: ALL_CATEGORY = t.emploi_ia.articles_all_category
	$: ALL_LANG = t.emploi_ia.articles_lang_all

	let activeCategory: string = 'Toutes'
	let activeLanguage: string = 'Toutes'
	let currentPage = 0
	let categories: string[] = []
	let tabs: string[] = []
	let filteredArticles: ArticleShowcaseItem[] = []
	let totalPages = 1
	let pageArticles: ArticleShowcaseItem[] = []
	let navItems: { label: string }[] = []
	let itemsPerPage = 6

	// Read page size from CSS custom property
	function getPageSize(): number {
		if (typeof window === 'undefined') return 6
		const value = getComputedStyle(document.documentElement).getPropertyValue(
			'--articles-page-size'
		)
		return parseInt(value, 10) || 6
	}

	function updatePageSize() {
		const newSize = getPageSize()
		if (newSize !== itemsPerPage) {
			// Keep the first visible item stable when size changes
			const firstIndex = currentPage * itemsPerPage
			currentPage = Math.floor(firstIndex / newSize)
			itemsPerPage = newSize
		}
	}

	onMount(() => {
		updatePageSize()

		const mediaQuery = window.matchMedia('(min-width: 768px)')
		mediaQuery.addEventListener('change', updatePageSize)

		return () => {
			mediaQuery.removeEventListener('change', updatePageSize)
		}
	})

	const goTo = (index: number) => {
		if (!totalPages) {
			return
		}

		currentPage = ((index % totalPages) + totalPages) % totalPages
	}

	const nextPage = () => {
		goTo(currentPage + 1)
	}

	const previousPage = () => {
		goTo(currentPage - 1)
	}

	const handleSelect = (event: CustomEvent<{ index: number }>) => {
		goTo(event.detail.index)
		event.preventDefault()
	}

	const switchCategory = (category: string) => {
		activeCategory = category
		currentPage = 0
	}

	const switchLanguage = (langId: string) => {
		activeLanguage = langId
		currentPage = 0
	}

	$: categories = Array.from(
		new Set<string>(
			articles.map((article) => article.category).filter((cat): cat is string => !!cat)
		)
	)
	$: tabs = [ALL_CATEGORY, ...categories]

	// Reset active category/lang if it's the old 'Toutes' and we switched lang, or just keep it synced with the current language's 'All'
	$: if (activeCategory === 'Toutes' || activeCategory === 'All') {
		activeCategory = ALL_CATEGORY
	}
	$: if (activeLanguage === 'Toutes' || activeLanguage === 'All') {
		activeLanguage = ALL_LANG
	}

	$: languages = [
		{ id: ALL_LANG, label: ALL_LANG },
		{ id: 'FR', label: t.emploi_ia.articles_lang_fr },
		{ id: 'EN', label: t.emploi_ia.articles_lang_en }
	]

	$: filteredArticles = articles.filter((article) => {
		const matchesCategory = activeCategory === ALL_CATEGORY || article.category === activeCategory
		const matchesLanguage =
			activeLanguage === ALL_LANG ||
			(article.langue && article.langue.toUpperCase() === activeLanguage.toUpperCase())
		return matchesCategory && matchesLanguage
	})
	$: totalPages = filteredArticles.length ? Math.ceil(filteredArticles.length / itemsPerPage) : 1
	$: {
		if (currentPage > totalPages - 1) {
			currentPage = 0
		}
	}
	$: pageArticles = filteredArticles.slice(
		currentPage * itemsPerPage,
		currentPage * itemsPerPage + itemsPerPage
	)
	$: navItems = Array.from({ length: totalPages }, (_, index) => ({
		label: `${t.emploi_ia.articles_go_to} ${String(index + 1)}`
	}))
</script>

<section id="showcase">
	<div class="header">
		<!-- Compact segmented control for language -->
		<div class="lang-filter" role="group" aria-label={t.emploi_ia.articles_lang_label}>
			<span class="lang-label">{t.emploi_ia.articles_lang_label}</span>
			<div class="segmented">
				{#each languages as language, i}
					<button
						type="button"
						class="seg-btn"
						class:seg-btn--active={language.id === activeLanguage}
						class:seg-btn--first={i === 0}
						class:seg-btn--last={i === languages.length - 1}
						aria-pressed={language.id === activeLanguage}
						on:click={() => switchLanguage(language.id)}
					>
						{language.label}
					</button>
				{/each}
			</div>
		</div>

		<div class="filter-group">
			<span class="label">{t.emploi_ia.articles_label}</span>
			<div class="tabs" role="tablist" aria-label={t.emploi_ia.articles_tabs_aria}>
				{#each tabs as tab}
					<button
						type="button"
						role="tab"
						class:tab--active={tab === activeCategory}
						aria-selected={tab === activeCategory}
						on:click={() => {
							switchCategory(tab)
						}}
					>
						{tab}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="grid" role="list">
		{#if pageArticles.length}
			{#each pageArticles as article, index (index)}
				<div role="listitem">
					<ArticleTeaserCard
						category={article.category}
						image={article.image}
						date={article.date}
						title={article.title}
						summary={article.summary}
						url={article.url}
						langue={article.langue}
					/>
				</div>
			{/each}
		{:else}
			<p class="empty">{t.emploi_ia.articles_empty}</p>
		{/if}
	</div>

	<CarouselNavigation
		items={navItems}
		current={currentPage}
		ariaLabel={t.emploi_ia.articles_nav_aria}
		previousLabel={t.emploi_ia.articles_prev}
		nextLabel={t.emploi_ia.articles_next}
		showArrows={totalPages > 1}
		showDots={totalPages > 1}
		on:previous={previousPage}
		on:next={nextPage}
		on:select={handleSelect}
	/>
</section>

<style>
	:root {
		--articles-page-size: 4;
	}

	@media (min-width: 768px) {
		:root {
			--articles-page-size: 6;
		}
	}

	#showcase {
		margin: 3rem 0 5rem;
		padding-top: 2rem;
	}

	/* ---- Header: lang toggle + category tabs on one row, wrapping gracefully ---- */
	.header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	/* ---- Language segmented control ---- */
	.lang-filter {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.lang-label {
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--carousel-text, #414042);
		white-space: nowrap;
	}

	.segmented {
		display: flex;
		border: 1px solid var(--carousel-border, #d9c7b0);
		border-radius: 8px;
		overflow: hidden;
	}

	.seg-btn {
		background: var(--white);
		border: none;
		border-left: 1px solid var(--carousel-border, #d9c7b0);
		padding: 0.3rem 0.75rem;
		color: var(--carousel-text, #414042);
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease;
		line-height: 1.4;
		white-space: nowrap;
	}

	.seg-btn--first {
		border-left: none;
	}

	.seg-btn:hover,
	.seg-btn:focus-visible {
		background: var(--brand-light, #fff7ed);
		outline: none;
	}

	.seg-btn--active {
		background: var(--carousel-accent, var(--brand));
		color: var(--white);
	}

	.seg-btn--active:hover {
		background: var(--carousel-accent, var(--brand));
	}

	/* ---- Category tabs ---- */

	.label {
		font-weight: 600;
		color: var(--carousel-text, #414042);
	}

	.tabs {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	button[role='tab'] {
		border-radius: 999px;
		border: 1px solid var(--carousel-border, #d9c7b0);
		background: var(--white);
		padding: 0.5rem 1.3rem;
		color: var(--carousel-text, #414042);
		cursor: pointer;
		transition:
			background 180ms ease,
			color 180ms ease,
			border-color 180ms ease,
			transform 150ms ease;
	}

	button[role='tab']:hover,
	button[role='tab']:focus-visible {
		border-color: var(--carousel-accent, var(--brand));
		outline: none;
		transform: translateY(-2px);
	}

	button[role='tab'].tab--active {
		background: var(--carousel-accent, var(--brand));
		color: var(--white);
		border-color: var(--carousel-accent, var(--brand));
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(240px, 100%), 1fr));
		gap: 1.5rem;
	}

	.empty {
		margin: 0;
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	@media (max-width: 880px) {
		#showcase {
			padding: 2.5rem 1.5rem;
		}
	}

	@media (max-width: 600px) {
		#showcase {
			border-radius: 22px;
		}

		button[role='tab'] {
			padding: 0.45rem 1.05rem;
		}
	}
</style>
