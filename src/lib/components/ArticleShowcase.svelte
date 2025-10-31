<script lang="ts">
	import { onMount } from 'svelte'
	import CarouselNavigation from '$components/CarouselNavigation.svelte'
	import ArticleTeaserCard from '$components/ArticleTeaserCard.svelte'
	import type { ArticleShowcaseItem } from '$lib/types'

	const ALL_CATEGORY = 'Toutes'

	export let articles: ArticleShowcaseItem[] = []

	let activeCategory: string = ALL_CATEGORY
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

	$: categories = Array.from(
		new Set<string>(
			articles.map((article) => article.category).filter((cat): cat is string => !!cat)
		)
	)
	$: tabs = [ALL_CATEGORY, ...categories]
	$: filteredArticles =
		activeCategory === ALL_CATEGORY
			? articles
			: articles.filter((article) => article.category === activeCategory)
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
		label: `Aller à la page ${String(index + 1)}`
	}))
</script>

<section id="showcase">
	<div class="header">
		<span class="label">Rubrique :</span>
		<div class="tabs" role="tablist" aria-label="Choisir une catégorie d'article">
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
					/>
				</div>
			{/each}
		{:else}
			<p class="empty">Aucun article pour cette catégorie pour le moment.</p>
		{/if}
	</div>

	<CarouselNavigation
		items={navItems}
		current={currentPage}
		ariaLabel="Navigation parmi les pages d'articles"
		previousLabel="Page précédente"
		nextLabel="Page suivante"
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

	.header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

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
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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
