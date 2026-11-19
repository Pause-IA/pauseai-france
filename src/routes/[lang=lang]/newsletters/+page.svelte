<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { LinkGrid, Page } from '$components/ui'
	import NewsletterCard from '$components/NewsletterCard.svelte'
	import Button from '$components/Button.svelte'
	import { Search, X, Mail, ChevronLeft, ChevronRight, Rss } from 'lucide-svelte'
	import type { Article } from '$lib/notion'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)

	// Fallback newsletters if Notion data is not available
	const fallbackNewsletters: Article[] = [
		{
			id: '1',
			title: 'Newsletter Pause IA - Janvier 2025',
			slug: 'newsletter-pause-ia---janvier-2025',
			description:
				"Pourquoi l'IA est notre priorité absolue ; Action au sommet pour l'action sur l'IA ; Nouvelles du front ; Les actus du mois.",
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=88&reset=1',
			type: 'Newsletter' as const,
			order: 1,
			visible: true,
			date: '2025-01-15'
		},
		{
			id: '2',
			title: 'Newsletter Pause IA - Décembre 2024',
			slug: 'newsletter-pause-ia---decembre-2024',
			description:
				'Retour sur le colloque au Sénat ; Notre roadmap pour 2025 ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=85&reset=1',
			type: 'Newsletter' as const,
			order: 2,
			visible: true,
			date: '2024-12-15'
		},
		{
			id: '3',
			title: 'Newsletter Pause IA - Novembre 2024',
			slug: 'newsletter-pause-ia---novembre-2024',
			description:
				'Colloque au Sénat - programme et inscription ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=82&reset=1',
			type: 'Newsletter' as const,
			order: 3,
			visible: true,
			date: '2024-11-15'
		},
		{
			id: '4',
			title: 'Newsletter Pause IA - Octobre 2024',
			slug: 'newsletter-pause-ia---octobre-2024',
			description:
				'Retour sur nos actions de rentrée ; Annonce du colloque au Sénat ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=78&reset=1',
			type: 'Newsletter' as const,
			order: 4,
			visible: true,
			date: '2024-10-15'
		}
	]

	$: newsletters = data.newsletters.length > 0 ? data.newsletters : fallbackNewsletters

	// Search
	let searchQuery = ''

	$: filteredNewsletters = searchQuery.trim()
		? newsletters.filter((n) => {
				const query = searchQuery.toLowerCase()
				return (
					n.title.toLowerCase().includes(query) ||
					n.description.toLowerCase().includes(query) ||
					n.date?.includes(query)
				)
			})
		: newsletters

	// Pagination
	const PAGE_SIZE = 12
	let currentPage = 1

	// Revenir à la première page dès que la recherche change
	$: if (searchQuery || !searchQuery) currentPage = 1

	$: totalPages = Math.max(1, Math.ceil(filteredNewsletters.length / PAGE_SIZE))
	$: paginatedNewsletters = filteredNewsletters.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	)

	function goToPage(page: number) {
		currentPage = page
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	function clearSearch() {
		searchQuery = ''
	}

	// Newsletter subscription form
	let email = ''
	let isSubmitting = false
	let message = ''
	let isError = false

	interface ApiResponse {
		success?: boolean
		message?: string
		error?: string
	}

	async function handleSubscribe(event: Event) {
		event.preventDefault()
		message = ''
		isError = false

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			message = t.newsletters.invalid_email
			isError = true
			return
		}

		isSubmitting = true

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribeNewsletter: true,
					subscribeSubstack: false,
					source: 'newsletters-page'
				})
			})

			const result = (await response.json()) as ApiResponse

			if (response.ok) {
				message = t.newsletters.subscribe_success
				isError = false
				email = ''
			} else {
				message = result.error ?? t.newsletters.subscribe_error
				isError = true
			}
		} catch {
			message = t.newsletters.connection_error
			isError = true
		} finally {
			isSubmitting = false
		}
	}

	// Quick access helpers
	function formatDateShort(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		const locale = lang === 'en' ? 'en-GB' : 'fr-FR'
		return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
	}
</script>

<PostMeta title={t.newsletters.meta_title} description={t.newsletters.meta_desc} />

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="Pause IA - Newsletters"
		href="/rss/newsletters.xml"
	/>
</svelte:head>

<Page
	width="wide"
	eyebrow={t.nav.actualites}
	title={t.newsletters.title}
	lede={t.newsletters.subtitle}
>
	<div class="search-bar">
		<a href="/rss/newsletters.xml" class="rss-link" target="_blank" rel="noopener noreferrer">
			<Rss size="1rem" />
			{lang === 'en' ? 'RSS Feed' : 'Flux RSS'}
		</a>
		<label for="newsletter-search" class="search-label">{t.newsletters.search_label}</label>
		<div class="search-input-wrapper">
			<span class="search-icon"><Search size="1rem" /></span>
			<input
				id="newsletter-search"
				type="text"
				bind:value={searchQuery}
				placeholder={t.newsletters.search_placeholder}
				aria-label={t.newsletters.search_aria}
				autocomplete="off"
			/>
			{#if searchQuery}
				<button class="clear-btn" on:click={clearSearch} aria-label={t.newsletters.clear_search}>
					<X size="1rem" />
				</button>
			{/if}
		</div>
	</div>

	{#if filteredNewsletters.length > 0}
		<p class="results-count" id="newsletters-top">
			{filteredNewsletters.length}
			{filteredNewsletters.length === 1
				? t.newsletters.result_singular
				: t.newsletters.result_plural}
			{#if searchQuery.trim()}
				{t.newsletters.result_for} «&nbsp;{searchQuery.trim()}&nbsp;»
			{/if}
		</p>

		<div class="newsletter-list">
			<LinkGrid min="20rem">
				{#each paginatedNewsletters as newsletter (newsletter.id)}
					<div id="nl-{newsletter.id}">
						<NewsletterCard
							title={newsletter.title}
							description={newsletter.description}
							url={newsletter.url}
							slug={newsletter.slug}
							date={newsletter.date || ''}
							image={newsletter.image || ''}
						/>
					</div>
				{/each}
			</LinkGrid>

			{#if totalPages > 1}
				<nav class="pagination" aria-label={t.newsletters.pagination_label}>
					<button
						class="pagination-btn"
						disabled={currentPage === 1}
						on:click={() => {
							goToPage(currentPage - 1)
						}}
						aria-label={t.newsletters.prev_page}
					>
						<ChevronLeft size="1.25rem" />
					</button>
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
						<button
							class="pagination-btn"
							class:active={page === currentPage}
							on:click={() => {
								goToPage(page)
							}}
							aria-label={`${t.newsletters.page} ${page}`}
							aria-current={page === currentPage ? 'page' : undefined}
						>
							{page}
						</button>
					{/each}
					<button
						class="pagination-btn"
						disabled={currentPage === totalPages}
						on:click={() => {
							goToPage(currentPage + 1)
						}}
						aria-label={t.newsletters.next_page}
					>
						<ChevronRight size="1.25rem" />
					</button>
				</nav>
			{/if}
		</div>
	{:else}
		<div class="empty-state">
			<p>{t.newsletters.no_results}</p>
			<Button on:click={clearSearch}>{t.newsletters.clear_search}</Button>
		</div>
	{/if}

	<!-- L'inscription passe après la liste : la page sert d’abord à lire les
	     numéros parus. En tête, elle repoussait les premières cartes de tout
	     un écran, avec le lien RSS et la recherche. -->
	<div class="subscribe-bar">
		<div class="subscribe-icon">
			<Mail size="1.25rem" />
		</div>
		<form on:submit={handleSubscribe} class="subscribe-form">
			<div class="subscribe-input-group">
				<input
					type="email"
					bind:value={email}
					placeholder={t.newsletters.email_placeholder}
					disabled={isSubmitting}
					aria-label={t.newsletters.email_label}
				/>
				<button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}...{:else}{t.newsletters.subscribe_btn}{/if}
				</button>
			</div>
			{#if message}
				<p class="subscribe-message" class:error={isError} class:success={!isError}>
					{message}
				</p>
			{/if}
		</form>
	</div>
</Page>

<style>
	.rss-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		transition:
			color 0.2s,
			border-color 0.2s,
			background 0.2s;
	}

	.rss-link:hover {
		color: var(--accent);
		border-color: var(--brand);
		background: var(--brand-light);
	}

	/* Subscribe bar */
	/* Posé en fin de page : il lui faut sa propre respiration au-dessus. */
	.subscribe-bar {
		margin-top: 3rem;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		max-width: 36rem;
		margin: 0 0 2rem;
		padding: 1rem 1.25rem;
		background: var(--panneau-bg);
		border: 1px solid rgba(var(--brand-rgb), 0.2);
		border-radius: var(--radius-md);
	}

	.subscribe-icon {
		color: var(--brand);
		flex-shrink: 0;
		margin-top: 0.5rem;
	}

	.subscribe-form {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.subscribe-input-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.subscribe-form input[type='email'] {
		flex: 1;
		min-width: 160px;
		padding: 0.5rem 0.75rem;
		border: 1.5px solid rgba(var(--ink-rgb), 0.12);
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
		font-family: inherit;
		background: var(--white);
		color: var(--text);
		transition: border-color 0.2s;
	}

	.subscribe-form input[type='email']:focus {
		outline: none;
		border-color: var(--brand);
	}

	.subscribe-form input[type='email']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.subscribe-form button {
		padding: 0.5rem 1rem;
		background: var(--brand);
		color: var(--on-brand);
		border: none;
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.2s;
		white-space: nowrap;
	}

	.subscribe-form button:hover:not(:disabled) {
		opacity: 0.85;
	}

	.subscribe-form button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.subscribe-message {
		margin: 0;
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.subscribe-message.success {
		color: var(--success);
	}

	.subscribe-message.error {
		color: var(--error);
	}

	/* Search bar, matches press page combobox style */
	.search-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 36rem;
		margin: 0 0 2rem;
		flex-wrap: wrap;
	}

	.search-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text);
		white-space: nowrap;
	}

	.search-input-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background-color: var(--white);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.search-input-wrapper:focus-within {
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(var(--brand-rgb), 0.1);
	}

	.search-icon {
		display: flex;
		align-items: center;
		padding-left: 0.75rem;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.search-input-wrapper input {
		flex: 1;
		padding: 0.5rem 0.5rem;
		font-size: 0.9rem;
		font-family: var(--font-body, inherit);
		border: none;
		background: transparent;
		color: var(--text);
		outline: none;
		min-width: 0;
	}

	.search-input-wrapper input::placeholder {
		color: var(--text-secondary);
		opacity: 0.7;
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.375rem;
		margin-right: 0.375rem;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		border-radius: 0.25rem;
		transition:
			color 0.15s ease,
			background-color 0.15s ease;
	}

	.clear-btn:hover {
		color: var(--text);
		background-color: rgba(var(--ink-rgb), 0.06);
	}

	/* Results count */
	.results-count {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
	}

	/* Mobile dropdown quick access, hidden on desktop */

	/* Newsletter list (right side) */
	.newsletter-list {
		flex-grow: 1;
		min-width: 0;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 4rem 1rem;
		color: var(--text-secondary);
	}

	.empty-state p {
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.375rem;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
	}

	.pagination-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--white);
		color: var(--text);
		font-size: 0.875rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.pagination-btn:hover:not(:disabled):not(.active) {
		background-color: var(--bg-subtle);
		border-color: var(--brand);
	}

	.pagination-btn.active {
		background-color: var(--brand);
		border-color: var(--brand);
		color: var(--on-brand);
	}

	.pagination-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	/* Mobile */
	@media (max-width: 768px) {
	}

	@media (min-width: 640px) {
		.search-bar {
			margin-bottom: 2.5rem;
		}
	}

	@media (min-width: 1024px) {
	}
</style>
