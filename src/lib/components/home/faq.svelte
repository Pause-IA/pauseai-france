<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FAQ from '$posts/faq.md'
	import FAQ_EN from '$posts/faq.en.md'
	import Fly from '$components/Fly.svelte'
	import { faqBulkAction } from '$lib/stores/faq'
	import { tick } from 'svelte'
	import type { Lang } from '$lib/i18n'
	// @ts-ignore - Vite raw import
	import faqRaw from '$posts/faq.md?raw'
	// @ts-ignore - Vite raw import
	import faqRawEn from '$posts/faq.en.md?raw'

	export let lang: Lang = 'fr'

	$: isEn = lang === 'en'

	// UI strings, localized
	$: t =
		lang === 'en'
			? {
					searchPlaceholder: 'Search a question...',
					searchLabel: 'Search the FAQ',
					expandAll: 'Expand all',
					collapseAll: 'Collapse all',
					result: (n: number) => `${n} result${n !== 1 ? 's' : ''}`,
					noResults: (q: string) => `No result for "${q}". Try other keywords.`
				}
			: {
					searchPlaceholder: 'Rechercher une question...',
					searchLabel: 'Rechercher dans la FAQ',
					expandAll: 'Tout déplier',
					collapseAll: 'Tout replier',
					result: (n: number) => `${n} résultat${n !== 1 ? 's' : ''}`,
					noResults: (q: string) => `Aucun résultat pour « ${q} ». Essayez avec d'autres mots-clés.`
				}

	const label_id = 'faq-title'

	let searchQuery = ''
	let faqContainer: HTMLElement
	let searchInput: HTMLInputElement
	let allExpanded = false
	let showSuggestions = false
	let selectedIndex = -1
	let resultCount = -1

	interface FaqItem {
		id: string
		question: string
		answer: string
		category: string
	}

	interface Suggestion {
		item: FaqItem
		matchType: 'title' | 'content'
		snippet?: string
	}

	// Extract FAQ Q&A pairs from raw markdown for JSON-LD and search
	function extractFaqData(raw: string): FaqItem[] {
		const lines = raw.split('\n')
		const faqs: FaqItem[] = []
		let currentQuestion = ''
		let currentAnswer = ''
		let currentCategory = ''
		let accordionCount = 0

		for (const line of lines) {
			if (line.startsWith('## ')) {
				// Category header — close current Q/A if any
				if (currentQuestion) {
					accordionCount++
					faqs.push({
						id: `accordion${accordionCount}`,
						question: currentQuestion,
						answer: stripMarkdown(currentAnswer.trim()),
						category: currentCategory
					})
					currentQuestion = ''
					currentAnswer = ''
				}
				currentCategory = line.replace('## ', '')
			} else if (line.startsWith('### ')) {
				if (currentQuestion) {
					accordionCount++
					faqs.push({
						id: `accordion${accordionCount}`,
						question: currentQuestion,
						answer: stripMarkdown(currentAnswer.trim()),
						category: currentCategory
					})
				}
				currentQuestion = line.replace('### ', '')
				currentAnswer = ''
			} else if (currentQuestion) {
				currentAnswer += line + '\n'
			}
		}
		if (currentQuestion) {
			accordionCount++
			faqs.push({
				id: `accordion${accordionCount}`,
				question: currentQuestion,
				answer: stripMarkdown(currentAnswer.trim()),
				category: currentCategory
			})
		}
		return faqs
	}

	function stripMarkdown(text: string) {
		return text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url) → links
			.replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** → bold
			.replace(/_([^_]+)_/g, '$1') // _italic_ → italic
			.replace(/^- /gm, '• ') // list markers
			.replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
			.trim()
	}

	$: faqData = extractFaqData(isEn ? faqRawEn : faqRaw)

	$: jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqData.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	})

	// -- Suggestions engine --

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
	}

	function highlightMatch(escapedText: string, query: string): string {
		if (!query || query.trim().length < 2) return escapedText
		const escapedQuery = escapeHtml(query.trim()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		const regex = new RegExp(`(${escapedQuery})`, 'gi')
		return escapedText.replace(regex, '<mark>$1</mark>')
	}

	function getSuggestions(query: string): Suggestion[] {
		const normalized = query.toLowerCase().trim()
		if (normalized.length < 2) return []

		const titleMatches: Suggestion[] = []
		const contentMatches: Suggestion[] = []

		for (const item of faqData) {
			if (item.question.toLowerCase().includes(normalized)) {
				titleMatches.push({ item, matchType: 'title' })
			} else if (item.answer.toLowerCase().includes(normalized)) {
				const idx = item.answer.toLowerCase().indexOf(normalized)
				const start = Math.max(0, idx - 30)
				const end = Math.min(item.answer.length, idx + normalized.length + 30)
				const snippet =
					(start > 0 ? '…' : '') +
					item.answer.slice(start, end) +
					(end < item.answer.length ? '…' : '')
				contentMatches.push({ item, matchType: 'content', snippet })
			}
		}

		return [...titleMatches, ...contentMatches]
	}

	$: suggestions = getSuggestions(searchQuery)

	// Navigate to an accordion when a suggestion is selected
	async function selectSuggestion(suggestion: Suggestion) {
		showSuggestions = false
		selectedIndex = -1
		searchQuery = ''
		await tick()

		const el = faqContainer?.querySelector(`#${suggestion.item.id}`)
		if (!el) return

		const btn = el.querySelector('button.header') as HTMLButtonElement | null
		if (btn?.getAttribute('aria-expanded') !== 'true') {
			btn?.click()
		}

		await tick()
		el.scrollIntoView({ behavior: 'smooth', block: 'center' })
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!showSuggestions || suggestions.length === 0) {
			if (e.key === 'Escape' && searchQuery) {
				searchQuery = ''
				e.preventDefault()
			}
			return
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				selectedIndex = (selectedIndex + 1) % suggestions.length
				break
			case 'ArrowUp':
				e.preventDefault()
				selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1
				break
			case 'Enter':
				if (selectedIndex >= 0) {
					e.preventDefault()
					selectSuggestion(suggestions[selectedIndex])
				}
				break
			case 'Escape':
				e.preventDefault()
				showSuggestions = false
				selectedIndex = -1
				break
		}
	}

	function handleInput() {
		const sug = getSuggestions(searchQuery)
		if (searchQuery.trim().length >= 2 && sug.length > 0) {
			showSuggestions = true
			selectedIndex = -1
		} else {
			showSuggestions = false
			selectedIndex = -1
		}
	}

	function handleFocus() {
		const sug = getSuggestions(searchQuery)
		if (searchQuery.trim().length >= 2 && sug.length > 0) {
			showSuggestions = true
		}
	}

	function handleBlur() {
		setTimeout(() => {
			showSuggestions = false
		}, 150)
	}

	// -- Search filtering via DOM (enhanced: title + content) --

	function filterFaq(query: string) {
		if (!faqContainer) return
		const normalizedQuery = query.toLowerCase().trim()
		const accordions = faqContainer.querySelectorAll<HTMLElement>('.accordion')
		const categories = faqContainer.querySelectorAll<HTMLElement>('.faq-category')

		if (!normalizedQuery) {
			// Show everything
			accordions.forEach((el) => {
				const wrapper = el.closest<HTMLElement>('div.inView') || el.parentElement
				if (wrapper) wrapper.style.display = ''
			})
			categories.forEach((el) => (el.style.display = ''))
			resultCount = -1
			return
		}

		let count = 0

		// Hide/show each accordion based on title OR content match
		accordions.forEach((el) => {
			const title = el.querySelector('.title')?.textContent?.toLowerCase() || ''
			const faqItem = faqData.find((f) => f.id === el.id)
			const answer = faqItem?.answer.toLowerCase() || ''
			const matches = title.includes(normalizedQuery) || answer.includes(normalizedQuery)
			const wrapper = el.closest<HTMLElement>('div.inView') || el.parentElement
			if (wrapper) wrapper.style.display = matches ? '' : 'none'
			if (matches) count++
		})

		resultCount = count

		// Hide categories that have no visible accordions after them
		categories.forEach((cat) => {
			let sibling = cat.nextElementSibling as HTMLElement | null
			let hasVisibleAccordion = false

			while (sibling && !sibling.classList.contains('faq-category')) {
				if (sibling.style.display !== 'none') {
					hasVisibleAccordion = true
					break
				}
				sibling = sibling.nextElementSibling as HTMLElement | null
			}
			cat.style.display = hasVisibleAccordion ? '' : 'none'
		})
	}

	$: if (faqContainer) filterFaq(searchQuery)

	function expandAll() {
		allExpanded = true
		faqBulkAction.set({ action: 'expand', ts: Date.now() })
	}

	function collapseAll() {
		allExpanded = false
		faqBulkAction.set({ action: 'collapse', ts: Date.now() })
	}
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<section class="faq" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>F.A.Q.</UnderlinedTitle>
	</Fly>

	<div class="faq-toolbar">
		<div class="search-wrapper" class:suggestions-open={showSuggestions && suggestions.length > 0}>
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
				bind:value={searchQuery}
				bind:this={searchInput}
				on:input={handleInput}
				on:keydown={handleKeydown}
				on:focus={handleFocus}
				on:blur={handleBlur}
				placeholder={t.searchPlaceholder}
				aria-label={t.searchLabel}
				role="combobox"
				aria-expanded={showSuggestions && suggestions.length > 0}
				aria-controls="faq-suggestions"
				aria-autocomplete="list"
				aria-activedescendant={selectedIndex >= 0 ? `faq-suggestion-${selectedIndex}` : undefined}
				autocomplete="off"
			/>

			{#if showSuggestions && suggestions.length > 0}
				<ul id="faq-suggestions" class="suggestions" role="listbox">
					{#each suggestions as suggestion, i}
						<li
							id="faq-suggestion-{i}"
							role="option"
							aria-selected={i === selectedIndex}
							class="suggestion"
							class:selected={i === selectedIndex}
							on:mousedown|preventDefault={() => selectSuggestion(suggestion)}
							on:mouseenter={() => (selectedIndex = i)}
						>
							<span class="suggestion-category">{suggestion.item.category}</span>
							<span class="suggestion-question">
								{@html highlightMatch(escapeHtml(suggestion.item.question), searchQuery)}
							</span>
							{#if suggestion.matchType === 'content' && suggestion.snippet}
								<span class="suggestion-snippet">
									{@html highlightMatch(escapeHtml(suggestion.snippet), searchQuery)}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="bulk-actions">
			{#if resultCount >= 0}
				<span class="result-count">
					{t.result(resultCount)}
				</span>
			{/if}
			{#if allExpanded}
				<button class="bulk-btn" on:click={collapseAll}>{t.collapseAll}</button>
			{:else}
				<button class="bulk-btn" on:click={expandAll}>{t.expandAll}</button>
			{/if}
		</div>
	</div>

	{#if resultCount === 0}
		<p class="no-results">
			{t.noResults(searchQuery)}
		</p>
	{/if}

	<div class="faq-content" bind:this={faqContainer}>
		{#if isEn}
			<FAQ_EN />
		{:else}
			<FAQ />
		{/if}
	</div>
</section>

<style>
	.faq-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 2rem;
	}

	.search-wrapper {
		position: relative;
		flex: 1;
		min-width: 200px;
	}

	.search-icon {
		position: absolute;
		left: 0.85rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
		z-index: 1;
	}

	.search-wrapper input {
		width: 100%;
		padding: 0.7rem 0.85rem 0.7rem 2.75rem;
		border: 2px solid var(--border);
		border-radius: 0.625rem;
		font-size: 1rem;
		font-family: inherit;
		background: var(--bg);
		color: var(--text);
		transition: border-color 0.2s;
	}

	.search-wrapper.suggestions-open input {
		border-radius: 0.625rem 0.625rem 0 0;
		border-color: var(--brand);
	}

	.search-wrapper input:focus {
		outline: none;
		border-color: var(--brand);
	}

	.search-wrapper input::placeholder {
		color: var(--text-secondary);
	}

	/* -- Suggestions dropdown -- */

	.suggestions {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--bg);
		border: 2px solid var(--brand);
		border-top: 1px solid var(--border);
		border-radius: 0 0 0.625rem 0.625rem;
		max-height: 340px;
		overflow-y: auto;
		list-style: none;
		margin: 0;
		padding: 0;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.suggestion {
		padding: 0.6rem 1rem;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		border-bottom: 1px solid var(--border);
		transition: background-color 0.1s;
	}

	.suggestion:last-child {
		border-bottom: none;
	}

	.suggestion:hover,
	.suggestion.selected {
		background: rgba(255, 148, 22, 0.08);
	}

	.suggestion-category {
		font-size: 0.7rem;
		color: var(--brand);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	.suggestion-question {
		font-size: 0.92rem;
		color: var(--text);
		line-height: 1.3;
	}

	.suggestion-snippet {
		font-size: 0.78rem;
		color: var(--text-secondary);
		font-style: italic;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.4;
	}

	.suggestions :global(mark) {
		background: rgba(255, 200, 60, 0.25);
		color: inherit;
		padding: 0 1px;
		border-radius: 2px;
		font-weight: 600;
	}

	/* -- Result count & no results -- */

	.bulk-actions {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.result-count {
		font-size: 0.85rem;
		color: var(--text-secondary, #676e7a);
		white-space: nowrap;
	}

	.no-results {
		text-align: center;
		color: var(--text-secondary, #676e7a);
		padding: 2rem 1rem;
		font-style: italic;
	}

	.bulk-btn {
		padding: 0.7rem 1.25rem;
		border: 2px solid var(--border);
		border-radius: 0.625rem;
		background: var(--bg);
		font-size: 0.9rem;
		font-family: inherit;
		cursor: pointer;
		color: var(--text-secondary, #676e7a);
		transition:
			border-color 0.2s,
			color 0.2s;
		white-space: nowrap;
	}

	.bulk-btn:hover {
		border-color: var(--brand);
		color: var(--text);
	}

	/* Category headings rendered by faqPlugin */
	.faq-content :global(.faq-category) {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--brand);
		margin-top: 2.5rem;
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--brand);
	}

	.faq-content :global(.faq-category:first-child) {
		margin-top: 0;
	}
</style>
