<script lang="ts">
	import { jsonLdTag } from '$lib/jsonLd'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import PostMeta from '$components/PostMeta.svelte'
	import { PageHero } from '$components/ui'
	import { url as siteUrl } from '$config'
	import {
		Lightbulb,
		AlertTriangle,
		FileText,
		Book,
		BookOpen,
		Mail,
		MoveUpRight,
		Search,
		X
	} from 'lucide-svelte'
	import type { ComponentType } from 'svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'
	import {
		resources,
		localized,
		CATEGORY_ORDER,
		RESOURCES_LAST_UPDATED,
		MEDIA_TYPE_ORDER,
		type Category,
		type Lang,
		type Resource,
		type MediaType
	} from '$lib/data/resources'

	export let data: PageData
	$: lang = data.lang
	$: t = getT(lang).liens_utiles_page
	$: nav = getT(lang).nav

	$: title = t.meta_title
	$: description = t.meta_desc

	interface CategoryMeta {
		label: string
		icon: ComponentType
		intro?: string
	}
	$: CATEGORIES = {
		'pause-ia': { label: t.cat_pause_ia, icon: BookOpen, intro: t.pause_ia_intro },
		livres: { label: t.cat_livres, icon: Book, intro: t.livres_intro },
		comprendre: { label: t.cat_comprendre, icon: Lightbulb, intro: t.comprendre_intro },
		risques: { label: t.cat_risques, icon: AlertTriangle },
		declarations: { label: t.cat_declarations, icon: FileText, intro: t.declarations_intro },
		newsletters: { label: t.cat_newsletters, icon: Mail, intro: t.newsletters_intro }
	} as Record<Category, CategoryMeta>

	$: SUBGROUP_LABELS = {
		essentiels: t.sg_essentiels,
		recommandes: t.sg_recommandes,
		demarrer: t.sg_demarrer,
		'vue-ensemble': t.sg_vue_ensemble,
		'aller-plus-loin': t.sg_aller_plus_loin,
		general: t.sg_general,
		'recherche-alignement': t.sg_recherche_alignement
	} as Record<string, string>

	$: MEDIA_TYPE_LABELS = {
		book: t.mt_book,
		paper: t.mt_paper,
		article: t.mt_article,
		video: t.mt_video,
		podcast: t.mt_podcast,
		newsletter: t.mt_newsletter,
		org: t.mt_org,
		declaration: t.mt_declaration,
		tool: t.mt_tool,
		site: t.mt_site
	} as Record<MediaType, string>

	// Subgroup ordering inside each category
	const SUBGROUP_ORDER: Record<string, string[]> = {
		livres: ['essentiels', 'recommandes'],
		comprendre: ['demarrer', 'vue-ensemble', 'aller-plus-loin'],
		risques: ['general', 'recherche-alignement']
	}

	// ─── State (also synced with ?query params, see below) ──────
	let query = ''
	let langFilter: Lang[] = []
	let categoryFilter: Category[] = []
	let typeFilter: MediaType[] = []

	function toggleLang(l: Lang) {
		langFilter = langFilter.includes(l) ? langFilter.filter((x) => x !== l) : [...langFilter, l]
	}
	function toggleCategory(c: Category) {
		categoryFilter = categoryFilter.includes(c)
			? categoryFilter.filter((x) => x !== c)
			: [...categoryFilter, c]
	}
	function toggleType(t: MediaType) {
		typeFilter = typeFilter.includes(t) ? typeFilter.filter((x) => x !== t) : [...typeFilter, t]
	}

	// ─── URL <-> state sync ─────────────────────────────────────
	// Read initial filter state from the URL on first browser load. This
	// lets users bookmark / share specific views (e.g. ?lang=fr&type=book).
	let initialized = false
	onMount(() => {
		const u = new URL(window.location.href)
		query = u.searchParams.get('q') ?? ''
		const splitParam = (k: string) =>
			(u.searchParams.get(k) ?? '').split(',').filter((x) => x.length > 0)
		langFilter = splitParam('lang') as Lang[]
		categoryFilter = splitParam('cat') as Category[]
		typeFilter = splitParam('type') as MediaType[]
		initialized = true
	})

	// Push state changes back into the URL (replace, no history bloat).
	// Skipped until initialized so the onMount read doesn't fight with this.
	$: if (browser && initialized) {
		const params = new URLSearchParams()
		if (query.trim()) params.set('q', query.trim())
		if (langFilter.length) params.set('lang', langFilter.join(','))
		if (categoryFilter.length) params.set('cat', categoryFilter.join(','))
		if (typeFilter.length) params.set('type', typeFilter.join(','))
		const qs = params.toString()
		const target = qs ? `${$page.url.pathname}?${qs}` : $page.url.pathname
		if (target !== $page.url.pathname + $page.url.search) {
			void goto(target, { replaceState: true, keepFocus: true, noScroll: true })
		}
	}

	// Normalize for search: lowercase + strip accents + collapse whitespace.
	// "Bénézet" → "benezet", "à l'écosystème" → "a l ecosysteme"
	function normalize(s: string): string {
		return s
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/['']/g, ' ')
	}

	// Synonyms / aliases so that searches in either language find the
	// same resources. Searching "alignment" surfaces French "alignement"
	// content and vice-versa ; "AGI" finds "IAG", etc.
	const SYNONYMS: Record<string, string[]> = {
		alignement: ['alignment'],
		alignment: ['alignement'],
		agi: ['iag', 'intelligence artificielle generale', 'superintelligence', 'asi'],
		iag: ['agi', 'intelligence artificielle generale'],
		superintelligence: ['asi', 'agi', 'iag'],
		extinction: ['xrisk', 'p(doom)', 'risque existentiel'],
		risque: ['danger', 'risk'],
		llm: ['large language model', 'modele de langage'],
		paper: ['papier', 'article scientifique', 'recherche'],
		livre: ['book'],
		book: ['livre'],
		newsletter: ['lettre', 'infolettre'],
		video: ['videos', 'youtube', 'chaine'],
		podcast: ['podcasts']
	}

	function expandSynonyms(text: string): string {
		// Append the synonyms of any token already in the text. Idempotent.
		const tokens = text.split(/\s+/)
		const extras: string[] = []
		for (const t of tokens) {
			const syns = SYNONYMS[t] as string[] | undefined
			if (syns) extras.push(...syns.map(normalize))
		}
		return extras.length > 0 ? text + ' ' + extras.join(' ') : text
	}

	// Pre-compute searchable haystack for each resource. Includes title,
	// description, category, subgroup, date AND synonym expansion so that
	// "alignment" / "alignement", "AGI" / "IAG", "book" / "livre", etc.
	// all find the same content.
	// Concat the bilingual fields in BOTH languages so users searching
	// "alignement" find resources whose EN description happens to contain
	// "alignment" too, and vice-versa.
	const haystacks = new Map<string, string>()
	for (const r of resources) {
		const parts: string[] = [
			localized(r.title, 'fr'),
			localized(r.title, 'en'),
			localized(r.description, 'fr'),
			localized(r.description, 'en'),
			r.category,
			r.type
		]
		if (r.subgroup) parts.push(r.subgroup)
		if (r.date) parts.push(r.date)
		haystacks.set(r.id, expandSynonyms(normalize(parts.join(' '))))
	}

	// Reactive filtering. IMPORTANT: keep the expression inline so Svelte's
	// compiler picks up `langFilter`, `categoryFilter` and `query` as deps.
	// (Wrapping it in a helper function broke reactivity in the previous
	// version.)
	$: filtered = (() => {
		// Expand the query the same way we expanded the haystacks. Searching
		// "livre" still matches haystacks that only contain "book" (and the
		// reverse), without us having to enumerate every variant in both
		// directions in the data.
		const tokens = expandSynonyms(normalize(query.trim()))
			.split(/\s+/)
			.filter((t) => t.length > 0)
		return resources.filter((r) => {
			if (langFilter.length > 0 && !r.langs.some((l) => langFilter.includes(l))) return false
			if (categoryFilter.length > 0 && !categoryFilter.includes(r.category)) return false
			if (typeFilter.length > 0 && !typeFilter.includes(r.type)) return false
			if (tokens.length === 0) return true
			const hay = haystacks.get(r.id) ?? ''
			// Each query token (or its synonym) must appear somewhere in the
			// haystack ; AND semantic across tokens, OR within synonyms.
			return tokens.every((t) => hay.includes(t))
		})
	})()

	$: byCategory = (() => {
		const m: Record<string, Resource[]> = {}
		for (const r of filtered) {
			m[r.category] ??= []
			m[r.category].push(r)
		}
		return m
	})()

	function groupBySubgroup(list: Resource[], category: string) {
		const m: Record<string, Resource[]> = {}
		for (const r of list) {
			const key = r.subgroup ?? '__no_subgroup__'
			m[key] ??= []
			m[key].push(r)
		}
		const order = SUBGROUP_ORDER[category] ?? []
		const keys = Object.keys(m).sort((a, b) => {
			if (a === '__no_subgroup__') return -1
			if (b === '__no_subgroup__') return 1
			return order.indexOf(a) - order.indexOf(b) || a.localeCompare(b)
		})
		return keys.map((k) => ({ key: k, label: SUBGROUP_LABELS[k] ?? '', items: m[k] }))
	}

	function flagSrc(l: Lang) {
		return l === 'fr' ? '/flags/fr.svg' : '/flags/gb.svg'
	}
	function flagAlt(l: Lang) {
		return l === 'fr' ? 'FR' : 'EN'
	}

	// Format the auto-injected YYYY-MM-DD update date in a human, localised way.
	const MONTHS_FR = [
		'janvier',
		'février',
		'mars',
		'avril',
		'mai',
		'juin',
		'juillet',
		'août',
		'septembre',
		'octobre',
		'novembre',
		'décembre'
	]
	const MONTHS_EN = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]
	function formatUpdated(iso: string, l: Lang): string {
		const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/)
		if (!m) return iso
		const [, year, month, day] = m
		const d = parseInt(day, 10)
		const mi = parseInt(month, 10) - 1
		if (l === 'en') {
			return `${MONTHS_EN[mi]} ${d}, ${year}`
		}
		return `${d} ${MONTHS_FR[mi]} ${year}`
	}

	function clearFilters() {
		query = ''
		langFilter = []
		categoryFilter = []
		typeFilter = []
	}

	const totalCount = resources.length
	$: visibleCount = filtered.length
	$: hasActiveFilter =
		query.trim() !== '' ||
		langFilter.length > 0 ||
		categoryFilter.length > 0 ||
		typeFilter.length > 0

	// Track the category section currently in the viewport so the side TOC
	// can highlight it. Uses IntersectionObserver, far cheaper than scroll
	// listeners and triggers exactly when a section header crosses the top
	// 30% of the viewport.
	let activeSection: Category | '' = ''
	onMount(() => {
		const sections = CATEGORY_ORDER.map((c) => document.getElementById(c)).filter(
			(el): el is HTMLElement => el !== null
		)
		if (sections.length === 0) return

		const observer = new IntersectionObserver(
			(entries) => {
				// Pick the topmost entry currently intersecting. If several are
				// visible, prefer the one closest to the top of the viewport.
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
				if (visible[0]) {
					activeSection = visible[0].target.id as Category
				}
			},
			{ rootMargin: '-15% 0px -70% 0px', threshold: 0 }
		)
		sections.forEach((s) => {
			observer.observe(s)
		})
		return () => {
			observer.disconnect()
		}
	})

	// Map our internal media types to Schema.org @type values for the
	// JSON-LD payload. Kept conservative: when no good fit exists we
	// fall back to CreativeWork.
	const SCHEMA_TYPE: Record<MediaType, string> = {
		book: 'Book',
		paper: 'ScholarlyArticle',
		article: 'Article',
		video: 'VideoObject',
		podcast: 'PodcastSeries',
		newsletter: 'CreativeWork',
		org: 'Organization',
		declaration: 'CreativeWork',
		tool: 'WebApplication',
		site: 'WebSite'
	}

	// Build a CollectionPage + ItemList JSON-LD payload describing every
	// resource on the page. Helps Google understand this is a curated
	// list (potential rich-results in search) and gives each item a
	// typed entry rather than a generic link.
	$: jsonLd = (() => {
		const pageUrl = `${siteUrl}/${lang}/ressources`
		const items = resources.map((r, i) => {
			const itemUrl = r.internal ? `${siteUrl}${r.url}` : r.url
			const node: Record<string, unknown> = {
				'@type': (SCHEMA_TYPE as Record<string, string | undefined>)[r.type] ?? 'CreativeWork',
				name: localized(r.title, lang),
				description: localized(r.description, lang),
				url: itemUrl,
				inLanguage: r.langs
			}
			if (r.date) node.datePublished = r.date
			return {
				'@type': 'ListItem',
				position: i + 1,
				item: node
			}
		})
		return {
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: t.hero_title,
			description: t.meta_desc,
			url: pageUrl,
			inLanguage: lang,
			isPartOf: {
				'@type': 'WebSite',
				name: 'Pause IA',
				url: siteUrl
			},
			mainEntity: {
				'@type': 'ItemList',
				numberOfItems: items.length,
				itemListElement: items
			}
		}
	})()

	// Pre-filled mailto so the user lands in their mail client with a
	// ready-to-send template. Universal and reliable across browsers /
	// extensions ; localized in the active UI language.
	$: SUGGEST_URL =
		'mailto:contact@pauseia.fr' +
		'?subject=' +
		encodeURIComponent(t.mail_subject) +
		'&body=' +
		encodeURIComponent(
			[
				t.mail_body_intro,
				'',
				t.mail_body_line1,
				'',
				t.mail_body_title,
				t.mail_body_url,
				t.mail_body_lang,
				t.mail_body_cat,
				t.mail_body_desc,
				'',
				t.mail_body_why,
				'',
				''
			].join('\n')
		)
	$: jsonLdScript = jsonLdTag(jsonLd)
</script>

<PostMeta {title} {description} />

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdScript}
</svelte:head>

<div class="layout">
	<!-- Side TOC : sticky on desktop, hidden on mobile (top filter pills
	     already act as quick category jump on small screens). -->
	<aside class="toc" aria-label={t.toc_title}>
		<p class="toc-title">{t.toc_title}</p>
		<ul>
			{#each CATEGORY_ORDER as cat}
				{@const items = byCategory[cat] ?? []}
				{#if items.length > 0}
					<li>
						<a href={'#' + cat} class="toc-link" class:active={activeSection === cat}>
							<svelte:component this={CATEGORIES[cat].icon} size={14} />
							<span class="toc-label">{CATEGORIES[cat].label}</span>
							<span class="toc-count">{items.length}</span>
						</a>
					</li>
				{/if}
			{/each}
		</ul>
	</aside>

	<article class="ressources-page">
		<!-- Hero -->
		<PageHero eyebrow={nav.comprendre} lede={t.hero_desc}>{t.hero_title}</PageHero>

		<!-- Controls -->
		<section class="controls">
			<div class="search">
				<Search size={16} class="search-icon" />
				<input
					type="search"
					placeholder={t.search_placeholder}
					bind:value={query}
					aria-label={t.search_placeholder}
				/>
				{#if query}
					<button class="clear-btn" on:click={() => (query = '')} aria-label={t.search_clear}>
						<X size={14} />
					</button>
				{/if}
			</div>

			<div class="filter-row">
				<div class="filter-group" aria-label={t.filter_lang}>
					<button
						class="pill"
						class:active={langFilter.includes('fr')}
						on:click={() => {
							toggleLang('fr')
						}}
						aria-pressed={langFilter.includes('fr')}
					>
						<img src="/flags/fr.svg" alt="" width="16" /> FR
					</button>
					<button
						class="pill"
						class:active={langFilter.includes('en')}
						on:click={() => {
							toggleLang('en')
						}}
						aria-pressed={langFilter.includes('en')}
					>
						<img src="/flags/gb.svg" alt="" width="16" /> EN
					</button>
				</div>

				<div class="filter-group" aria-label={t.filter_category}>
					{#each CATEGORY_ORDER as cat}
						<button
							class="pill"
							class:active={categoryFilter.includes(cat)}
							on:click={() => {
								toggleCategory(cat)
							}}
							aria-pressed={categoryFilter.includes(cat)}
						>
							<svelte:component this={CATEGORIES[cat].icon} size={14} />
							<span>{CATEGORIES[cat].label}</span>
						</button>
					{/each}
				</div>

				<div class="filter-group" aria-label={t.filter_type}>
					{#each MEDIA_TYPE_ORDER as mt}
						<button
							class="pill pill-type"
							class:active={typeFilter.includes(mt)}
							on:click={() => {
								toggleType(mt)
							}}
							aria-pressed={typeFilter.includes(mt)}
						>
							{MEDIA_TYPE_LABELS[mt]}
						</button>
					{/each}
				</div>
			</div>

			<div class="meta-row">
				<p class="count">
					<strong>{visibleCount}</strong>
					{visibleCount === 1 ? t.count_singular : t.count_plural}
					{#if hasActiveFilter}
						<span class="count-total">{t.count_total} {totalCount}</span>
						<button class="reset-btn" on:click={clearFilters}>{t.reset}</button>
					{/if}
				</p>
				<p class="updated">{t.updated} {formatUpdated(RESOURCES_LAST_UPDATED, lang)}</p>
			</div>
		</section>

		<!-- Sections -->
		{#if visibleCount === 0}
			<p class="empty">{t.empty}</p>
		{/if}

		{#each CATEGORY_ORDER as cat}
			{@const items = byCategory[cat] ?? []}
			{#if items.length > 0}
				<section id={cat} class="res-section">
					<header class="res-section-header">
						<div class="section-icon" aria-hidden="true">
							<svelte:component this={CATEGORIES[cat].icon} size="1.2em" />
						</div>
						<div>
							<h2>{CATEGORIES[cat].label}</h2>
							{#if CATEGORIES[cat].intro}
								<p class="section-intro">{CATEGORIES[cat].intro}</p>
							{/if}
						</div>
					</header>

					{#each groupBySubgroup(items, cat) as group}
						<div class="res-group">
							{#if group.label}
								<h3 class="res-subtitle">{group.label}</h3>
							{/if}
							<ul class="res-list">
								{#each group.items as entry}
									<li class="res-entry">
										<a
											class="res-card"
											href={entry.url}
											target={entry.internal ? undefined : '_blank'}
											rel={entry.internal ? undefined : 'noopener noreferrer'}
										>
											<div class="res-card-main">
												<div class="res-card-header">
													<h3 class="res-title">{localized(entry.title, lang)}</h3>
													<MoveUpRight class="res-arrow" size={16} aria-hidden="true" />
												</div>
												<p class="res-desc">{localized(entry.description, lang)}</p>
											</div>
											<div class="res-card-meta">
												<span class="res-flags">
													{#each entry.langs as l}
														<span class="res-flag">
															<img src={flagSrc(l)} alt="" aria-hidden="true" />
															<span class="res-flag-label">{flagAlt(l)}</span>
														</span>
													{/each}
												</span>
												{#if entry.date}<span class="res-date">{entry.date}</span>{/if}
											</div>
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</section>
			{/if}
		{/each}

		<!-- Bottom CTA -->
		<section class="cta-card">
			<h3>{t.cta_title}</h3>
			<p>{t.cta_desc}</p>
			<a class="cta-btn" href={SUGGEST_URL}>
				<Mail size={16} />
				<span>{t.cta_button}</span>
			</a>
		</section>
	</article>
</div>

<style>
	/* ─── Page layout : sticky TOC on the left, content on the right ── */
	.layout {
		display: grid;
		grid-template-columns: 1fr;
		max-width: 72rem;
		margin: 3rem auto 0;
		padding: 0 1.25rem;
		gap: 2.5rem;
	}

	.ressources-page {
		min-width: 0; /* allow grid item to shrink */
		max-inline-size: var(--width-content);
		padding: 0 0 4rem;
		margin: 0 auto;
	}

	/* ─── Side TOC ────────────────────────────────────────── */
	.toc {
		display: none; /* hidden on mobile, see media query below */
	}

	.toc-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin: 0 0 0.6rem;
		padding-left: 0.75rem;
	}

	.toc ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.toc-link {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.75rem;
		border-radius: var(--radius-sm);
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 0.85rem;
		color: var(--text-secondary);
		text-decoration: none;
		border-left: 2px solid transparent;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
	}

	.toc-link:hover {
		background: rgba(var(--brand-rgb), 0.08);
		color: var(--brand-subtle);
	}

	.toc-link.active {
		background: rgba(var(--brand-rgb), 0.1);
		color: var(--brand-subtle);
		border-left-color: var(--brand-subtle);
		font-weight: 600;
	}

	:global([data-theme='dark']) .toc-link:hover,
	:global([data-theme='dark']) .toc-link.active {
		background: rgba(var(--brand-rgb), 0.12);
		color: var(--brand-subtle);
	}

	.toc-label {
		flex: 1;
		min-width: 0;
	}

	.toc-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.3rem;
		height: 1.3rem;
		padding: 0 0.35rem;
		border-radius: var(--radius-pill);
		background: rgba(var(--ink-rgb), 0.06);
		color: var(--text-secondary);
		font-size: 0.7rem;
		font-weight: 600;
	}

	.toc-link.active .toc-count {
		background: var(--brand);
		color: var(--on-brand);
	}

	:global([data-theme='dark']) .toc-count {
		background: rgba(var(--on-dark-rgb), 0.08);
	}

	@media (min-width: 1024px) {
		.layout {
			grid-template-columns: 14rem minmax(0, 1fr);
		}
		.toc {
			display: block;
			position: sticky;
			top: 5.5rem;
			align-self: start;
			max-height: calc(100vh - 7rem);
			overflow-y: auto;
		}
		.ressources-page {
			margin: 0;
		}
	}

	/* ─── Controls ─────────────────────────────────────────── */
	.controls {
		margin-bottom: 2rem;
	}

	.search {
		position: relative;
		margin-bottom: 0.85rem;
	}

	.search :global(.search-icon) {
		position: absolute;
		left: 0.85rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search input {
		width: 100%;
		padding: 0.7rem 2.25rem 0.7rem 2.4rem;
		font-family: var(--font-body);
		font-size: 1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--bg);
		color: var(--text);
		transition:
			border-color 0.18s,
			box-shadow 0.18s;
	}

	.search input:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(var(--brand-rgb), 0.15);
	}

	.clear-btn {
		position: absolute;
		right: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: none;
		background: rgba(var(--ink-rgb), 0.06);
		color: var(--text-secondary);
		cursor: pointer;
	}

	.clear-btn:hover {
		background: rgba(var(--ink-rgb), 0.12);
		color: var(--text);
	}

	:global([data-theme='dark']) .clear-btn {
		background: rgba(var(--on-dark-rgb), 0.08);
	}

	.filter-row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.filter-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.75rem;
		border-radius: var(--radius-pill);
		border: 1px solid var(--border);
		background: var(--bg);
		color: var(--text-secondary);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.pill:hover {
		border-color: var(--brand);
		color: var(--brand-subtle);
	}

	.pill.active {
		background: var(--brand);
		border-color: var(--brand);
		color: var(--on-brand);
	}

	.pill img {
		display: block;
		border-radius: 2px;
	}

	:global([data-theme='dark']) .pill:hover {
		color: var(--brand-subtle);
	}

	.meta-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.count {
		margin: 0;
	}

	.count strong {
		color: var(--text);
	}

	.count-total {
		margin-left: 0.3rem;
		opacity: 0.7;
	}

	.reset-btn {
		margin-left: 0.5rem;
		padding: 0.2rem 0.55rem;
		font-size: 0.78rem;
		font-family: var(--font-heading);
		font-weight: 600;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
	}

	.reset-btn:hover {
		border-color: var(--brand);
		color: var(--brand-subtle);
	}

	.updated {
		margin: 0;
		font-style: italic;
	}

	.empty {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary);
	}

	/* ─── Sections ──────────────────────────────────────────── */
	.res-section {
		margin-bottom: 2.5rem;
		scroll-margin-top: 5rem;
	}

	.res-section-header {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		margin-bottom: 1.25rem;
	}

	.section-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: var(--radius-md);
		background: var(--brand-light);
		color: var(--brand-subtle);
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	:global([data-theme='dark']) .section-icon {
		background: rgba(var(--brand-rgb), 0.15);
		color: var(--brand-subtle);
	}

	.res-section-header h2 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.4rem;
		line-height: 1.2;
		margin: 0;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.section-intro {
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin: 0.35rem 0 0;
	}

	.res-group {
		margin-top: 1.5rem;
	}

	.res-group:first-of-type {
		margin-top: 0;
	}

	.res-subtitle {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--text-secondary);
		margin: 0 0 0.7rem;
	}

	/* ─── Entries ──────────────────────────────────────────── */
	.res-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.65rem;
	}

	.res-entry {
		margin: 0;
	}

	.res-card {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		justify-content: space-between;
		padding: 1rem 1.1rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--text);
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.res-card:hover {
		border-color: var(--brand);
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(var(--ink-rgb), 0.05);
	}

	:global([data-theme='dark']) .res-card {
		background: rgba(var(--on-dark-rgb), 0.02);
	}

	:global([data-theme='dark']) .res-card:hover {
		box-shadow: 0 4px 14px rgba(var(--ink-rgb), 0.35);
	}

	.res-card-main {
		flex: 1;
		min-width: 0;
	}

	.res-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
		margin-bottom: 0.25rem;
	}

	.res-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.35;
		margin: 0;
		color: var(--brand-subtle);
	}

	:global([data-theme='dark']) .res-title {
		color: var(--brand-subtle);
	}

	:global(.res-arrow) {
		color: var(--text-secondary);
		flex-shrink: 0;
		margin-top: 0.15rem;
		transition:
			transform 0.2s ease,
			color 0.2s ease;
	}

	.res-card:hover :global(.res-arrow) {
		color: var(--brand-subtle);
		transform: translate(2px, -2px);
	}

	.res-desc {
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text);
		margin: 0;
	}

	.res-card-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.res-flags {
		display: inline-flex;
		gap: 0.25rem;
	}

	.res-flag {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
	}

	.res-flag img {
		width: 1rem;
		height: auto;
		display: block;
		border-radius: 2px;
		box-shadow: 0 0 0 1px var(--border);
	}

	.res-flag-label {
		display: inline-block;
	}

	.res-date {
		font-style: italic;
		color: var(--text-secondary);
		font-size: 0.8rem;
		white-space: nowrap;
	}

	/* ─── CTA ──────────────────────────────────────────────── */
	.cta-card {
		margin-top: 3rem;
		padding: 1.75rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		text-align: center;
		box-shadow: 0 4px 6px rgba(var(--ink-rgb), 0.04);
	}

	.cta-card h3 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		margin: 0 0 0.5rem;
		color: var(--text);
	}

	.cta-card p {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin: 0 0 1.25rem;
		line-height: 1.55;
	}

	.cta-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.6rem 1.15rem;
		border-radius: var(--radius-sm);
		background: var(--brand);
		color: var(--on-brand);
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.95rem;
		transition:
			opacity 0.18s,
			transform 0.18s;
	}

	.cta-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	/* ─── Responsive ───────────────────────────────────────── */
	@media (max-width: 640px) {
		.res-card {
			flex-direction: column;
			gap: 0.65rem;
			padding: 0.9rem 1rem;
		}
		.res-card-meta {
			flex-direction: row;
			align-items: center;
			align-self: flex-start;
		}
	}
</style>
