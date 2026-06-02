<script lang="ts">
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { browser } from '$app/environment'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import {
		Brain,
		AlertTriangle,
		FileText,
		Megaphone,
		BookMarked,
		BookOpen,
		Mail,
		MoveUpRight,
		Search,
		X,
		Map as MapIcon
	} from 'lucide-svelte'
	import type { ComponentType } from 'svelte'
	import {
		resources,
		SUBGROUPS,
		CATEGORY_ORDER,
		RESOURCES_LAST_UPDATED,
		MEDIA_TYPE_ORDER,
		MEDIA_TYPE_LABELS,
		FEATURED_IDS,
		type Category,
		type Lang,
		type Resource,
		type MediaType
	} from '$lib/data/resources'

	// Resolve the curated starter pack from the data file. We keep the
	// declared order (it's the suggested reading order, not alphabetical).
	const resById = new Map(resources.map((r) => [r.id, r]))
	const featured: Resource[] = FEATURED_IDS.map((id) => resById.get(id)).filter(
		(r): r is Resource => r !== undefined
	)

	const title = 'Ressources - Pause IA'
	const description =
		"Ressources, références et liens utiles : une base de connaissances sur l'IA, ses risques existentiels et le problème de l'alignement."

	type CategoryMeta = { label: string; icon: ComponentType; intro?: string }
	const CATEGORIES: Record<Category, CategoryMeta> = {
		'pause-ia': { label: 'Ressources Pause IA', icon: BookMarked },
		livres: { label: 'Livres', icon: BookOpen },
		comprendre: { label: "Mieux comprendre l'IA", icon: Brain },
		risques: {
			label: 'Risques existentiels',
			icon: AlertTriangle,
			intro: "Perte de contrôle, menaces d'extinction et recherche en alignement."
		},
		declarations: { label: "Déclarations et appel à l'action", icon: FileText },
		newsletters: { label: "Suivre l'actualité", icon: Mail },
		agir: { label: 'Faire entendre votre voix', icon: Megaphone }
	}

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
			goto(target, { replaceState: true, keepFocus: true, noScroll: true })
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
			const syns = SYNONYMS[t]
			if (syns) extras.push(...syns.map(normalize))
		}
		return extras.length > 0 ? text + ' ' + extras.join(' ') : text
	}

	// Pre-compute searchable haystack for each resource. Includes title,
	// description, category, subgroup, date AND synonym expansion so that
	// "alignment" / "alignement", "AGI" / "IAG", "book" / "livre", etc.
	// all find the same content.
	const haystacks = new Map<string, string>()
	for (const r of resources) {
		const parts = [r.title, r.description, r.category, r.type]
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
			if (!m[r.category]) m[r.category] = []
			m[r.category].push(r)
		}
		return m
	})()

	function groupBySubgroup(list: Resource[], category: string) {
		const m: Record<string, Resource[]> = {}
		for (const r of list) {
			const key = r.subgroup ?? '__no_subgroup__'
			if (!m[key]) m[key] = []
			m[key].push(r)
		}
		const order = SUBGROUP_ORDER[category] ?? []
		const keys = Object.keys(m).sort((a, b) => {
			if (a === '__no_subgroup__') return -1
			if (b === '__no_subgroup__') return 1
			return order.indexOf(a) - order.indexOf(b) || a.localeCompare(b)
		})
		return keys.map((k) => ({ key: k, label: SUBGROUPS[k] ?? '', items: m[k] }))
	}

	function flagSrc(l: Lang) {
		return l === 'fr' ? '/flags/fr.svg' : '/flags/gb.svg'
	}
	function flagAlt(l: Lang) {
		return l === 'fr' ? 'FR' : 'EN'
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
	// can highlight it. Uses IntersectionObserver — far cheaper than scroll
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
		sections.forEach((s) => observer.observe(s))
		return () => observer.disconnect()
	})

	// Pre-filled mailto so the user lands in their mail client with a
	// ready-to-send template. Universal (works without any GitHub auth)
	// and reliable across browsers / extensions.
	const SUGGEST_URL =
		'mailto:contact@pauseia.fr' +
		'?subject=' +
		encodeURIComponent('Suggestion de ressource pour /ressources') +
		'&body=' +
		encodeURIComponent(
			[
				'Bonjour,',
				'',
				'Je vous propose la ressource suivante pour la page /ressources :',
				'',
				'- Titre : ',
				'- URL : ',
				'- Langue : FR / EN',
				'- Catégorie : (pause-ia / livres / comprendre / risques / declarations / newsletters / agir)',
				'- Description courte : ',
				'',
				'Pourquoi elle est utile :',
				'',
				''
			].join('\n')
		)
</script>

<PostMeta {title} {description} />

<div class="layout">
	<!-- Side TOC : sticky on desktop, hidden on mobile (top filter pills
	     already act as quick category jump on small screens). -->
	<aside class="toc" aria-label="Sommaire des sections">
		<p class="toc-title">Sections</p>
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
		<section class="hero">
			<UnderlinedTitle as="h1">Ressources</UnderlinedTitle>
			<p class="hero-description">
				Une base de connaissances curée sur l'IA, ses risques existentiels et le problème de
				l'alignement.
			</p>

			<a href="/carte" class="map-link">
				<MapIcon size={16} />
				<span>Voir l'écosystème en vue cartographique</span>
			</a>
		</section>

		<!-- Onboarding : si vous découvrez le sujet, commencez ici -->
		<section class="onboarding" aria-label="Pour bien commencer">
			<h2 class="onboarding-title">Vous découvrez le sujet ? Commencez ici.</h2>
			<p class="onboarding-intro">
				Quatre ressources soigneusement choisies pour comprendre l'essentiel, dans l'ordre suggéré
				de lecture.
			</p>
			<ol class="onboarding-list">
				{#each featured as entry, i}
					<li>
						<a
							class="onboarding-card"
							href={entry.url}
							target={entry.internal ? undefined : '_blank'}
							rel={entry.internal ? undefined : 'noopener noreferrer'}
						>
							<span class="onboarding-num">{i + 1}</span>
							<div class="onboarding-body">
								<div class="onboarding-row">
									<h3 class="onboarding-card-title">{entry.title}</h3>
									<span class="onboarding-meta">
										{#each entry.langs as l}
											<img class="res-flag" src={flagSrc(l)} alt={flagAlt(l)} />
										{/each}
										<span class="onboarding-type">{MEDIA_TYPE_LABELS[entry.type]}</span>
									</span>
								</div>
								<p class="onboarding-desc">{entry.description}</p>
							</div>
							<MoveUpRight class="res-arrow" size={16} aria-hidden="true" />
						</a>
					</li>
				{/each}
			</ol>
		</section>

		<!-- Controls -->
		<section class="controls" aria-label="Filtres">
			<div class="search">
				<Search size={16} class="search-icon" />
				<input
					type="search"
					placeholder="Rechercher une ressource…"
					bind:value={query}
					aria-label="Rechercher"
				/>
				{#if query}
					<button class="clear-btn" on:click={() => (query = '')} aria-label="Effacer la recherche">
						<X size={14} />
					</button>
				{/if}
			</div>

			<div class="filter-row">
				<div class="filter-group" aria-label="Langue (multi-sélection)">
					<button
						class="pill"
						class:active={langFilter.includes('fr')}
						on:click={() => toggleLang('fr')}
						aria-pressed={langFilter.includes('fr')}
					>
						<img src="/flags/fr.svg" alt="" width="16" /> FR
					</button>
					<button
						class="pill"
						class:active={langFilter.includes('en')}
						on:click={() => toggleLang('en')}
						aria-pressed={langFilter.includes('en')}
					>
						<img src="/flags/gb.svg" alt="" width="16" /> EN
					</button>
				</div>

				<div class="filter-group" aria-label="Catégorie (multi-sélection)">
					{#each CATEGORY_ORDER as cat}
						<button
							class="pill"
							class:active={categoryFilter.includes(cat)}
							on:click={() => toggleCategory(cat)}
							aria-pressed={categoryFilter.includes(cat)}
						>
							<svelte:component this={CATEGORIES[cat].icon} size={14} />
							<span>{CATEGORIES[cat].label}</span>
						</button>
					{/each}
				</div>

				<div class="filter-group" aria-label="Type de média (multi-sélection)">
					{#each MEDIA_TYPE_ORDER as mt}
						<button
							class="pill pill-type"
							class:active={typeFilter.includes(mt)}
							on:click={() => toggleType(mt)}
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
					{visibleCount === 1 ? 'ressource' : 'ressources'}
					{#if hasActiveFilter}
						<span class="count-total">sur {totalCount}</span>
						<button class="reset-btn" on:click={clearFilters}>Réinitialiser</button>
					{/if}
				</p>
				<p class="updated">Mise à jour : {RESOURCES_LAST_UPDATED}</p>
			</div>
		</section>

		<!-- Sections -->
		{#if visibleCount === 0}
			<p class="empty">Aucune ressource ne correspond à votre recherche.</p>
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
													<h4 class="res-title">{entry.title}</h4>
													<MoveUpRight class="res-arrow" size={16} aria-hidden="true" />
												</div>
												<p class="res-desc">{entry.description}</p>
											</div>
											<div class="res-card-meta">
												<span class="res-flags">
													{#each entry.langs as l}
														<img class="res-flag" src={flagSrc(l)} alt={flagAlt(l)} />
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
			<h3>Une ressource à suggérer&nbsp;?</h3>
			<p>
				Vous connaissez une référence francophone ou internationale qui devrait figurer ici&nbsp;?
				Écrivez-nous avec le modèle pré-rempli ; votre client mail s'ouvrira directement avec tous
				les champs prêts.
			</p>
			<a class="cta-btn" href={SUGGEST_URL}>
				<Mail size={16} />
				<span>Suggérer une ressource</span>
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
		margin: 2rem auto 0;
		padding: 0 1.25rem;
		gap: 2.5rem;
	}

	.ressources-page {
		min-width: 0; /* allow grid item to shrink */
		max-inline-size: 52rem;
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
		border-radius: 8px;
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
		background: rgba(255, 148, 22, 0.08);
		color: var(--brand-subtle, var(--brand));
	}

	.toc-link.active {
		background: rgba(255, 148, 22, 0.1);
		color: var(--brand-subtle, var(--brand));
		border-left-color: var(--brand);
		font-weight: 600;
	}

	:global([data-theme='dark']) .toc-link:hover,
	:global([data-theme='dark']) .toc-link.active {
		background: rgba(255, 148, 22, 0.12);
		color: var(--brand);
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
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.06);
		color: var(--text-secondary);
		font-size: 0.7rem;
		font-weight: 600;
	}

	.toc-link.active .toc-count {
		background: var(--brand);
		color: white;
	}

	:global([data-theme='dark']) .toc-count {
		background: rgba(255, 255, 255, 0.08);
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

	/* ─── Onboarding (starter pack) ────────────────────────── */
	.onboarding {
		margin-bottom: 2.5rem;
		padding: 1.5rem 1.5rem 1.25rem;
		border: 1px solid rgba(255, 148, 22, 0.35);
		background: linear-gradient(180deg, rgba(255, 148, 22, 0.08), rgba(255, 148, 22, 0.02));
		border-radius: 12px;
	}

	:global([data-theme='dark']) .onboarding {
		background: linear-gradient(180deg, rgba(255, 148, 22, 0.1), rgba(255, 148, 22, 0.03));
	}

	.onboarding-title {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		margin: 0 0 0.25rem;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.onboarding-intro {
		font-family: var(--font-body);
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin: 0 0 1rem;
	}

	.onboarding-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.55rem;
		counter-reset: onboarding;
	}

	.onboarding-card {
		display: flex;
		gap: 0.85rem;
		align-items: flex-start;
		padding: 0.85rem 1rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		text-decoration: none;
		color: var(--text);
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.onboarding-card:hover {
		border-color: var(--brand);
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
	}

	:global([data-theme='dark']) .onboarding-card {
		background: rgba(255, 255, 255, 0.02);
	}

	.onboarding-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.85rem;
		height: 1.85rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--brand);
		color: white;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.95rem;
		margin-top: 0.1rem;
	}

	.onboarding-body {
		flex: 1;
		min-width: 0;
	}

	.onboarding-row {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
		margin-bottom: 0.2rem;
	}

	.onboarding-card-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.35;
		margin: 0;
		color: var(--brand-subtle, var(--brand));
	}

	:global([data-theme='dark']) .onboarding-card-title {
		color: var(--brand);
	}

	.onboarding-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.onboarding-type {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
		padding: 0.15rem 0.5rem;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.06);
	}

	:global([data-theme='dark']) .onboarding-type {
		background: rgba(255, 255, 255, 0.08);
	}

	.onboarding-desc {
		font-family: var(--font-body);
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--text);
		margin: 0;
	}

	.onboarding-card :global(.res-arrow) {
		color: var(--text-secondary);
		flex-shrink: 0;
		margin-top: 0.5rem;
		transition:
			transform 0.2s ease,
			color 0.2s ease;
	}

	.onboarding-card:hover :global(.res-arrow) {
		color: var(--brand);
		transform: translate(2px, -2px);
	}

	@media (max-width: 640px) {
		.onboarding {
			padding: 1.1rem 1rem 1rem;
		}
		.onboarding-row {
			flex-direction: column;
			gap: 0.25rem;
		}
	}

	/* ─── Hero ─────────────────────────────────────────────── */
	.hero {
		text-align: center;
		margin-bottom: 2rem;
		background: var(--bg);
		padding: 2rem 1.5rem 1.75rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
	}

	.hero-description {
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--text-secondary);
		max-width: 38rem;
		margin: 0 auto 1.25rem;
	}

	.map-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--brand);
		color: var(--brand-subtle, var(--brand));
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.9rem;
		transition:
			background 0.18s,
			color 0.18s,
			transform 0.18s;
	}

	.map-link:hover {
		background: var(--brand);
		color: white;
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .map-link {
		color: var(--brand);
	}

	:global([data-theme='dark']) .map-link:hover {
		color: white;
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
		border-radius: 10px;
		background: var(--bg);
		color: var(--text);
		transition:
			border-color 0.18s,
			box-shadow 0.18s;
	}

	.search input:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(255, 148, 22, 0.15);
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
		background: rgba(0, 0, 0, 0.06);
		color: var(--text-secondary);
		cursor: pointer;
	}

	.clear-btn:hover {
		background: rgba(0, 0, 0, 0.12);
		color: var(--text);
	}

	:global([data-theme='dark']) .clear-btn {
		background: rgba(255, 255, 255, 0.08);
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
		border-radius: 999px;
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
		color: var(--brand-subtle, var(--brand));
	}

	.pill.active {
		background: var(--brand);
		border-color: var(--brand);
		color: white;
	}

	.pill img {
		display: block;
		border-radius: 2px;
	}

	:global([data-theme='dark']) .pill:hover {
		color: var(--brand);
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
		border-radius: 999px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
	}

	.reset-btn:hover {
		border-color: var(--brand);
		color: var(--brand-subtle, var(--brand));
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
		border-radius: 10px;
		background: var(--brand-light, #fff5e8);
		color: var(--brand-subtle, var(--brand));
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	:global([data-theme='dark']) .section-icon {
		background: rgba(255, 148, 22, 0.15);
		color: var(--brand);
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
		border-radius: 10px;
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
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .res-card {
		background: rgba(255, 255, 255, 0.02);
	}

	:global([data-theme='dark']) .res-card:hover {
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
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
		color: var(--brand-subtle, var(--brand));
	}

	:global([data-theme='dark']) .res-title {
		color: var(--brand);
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
		color: var(--brand);
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
		width: 1.25rem;
		height: auto;
		display: block;
		border-radius: 2px;
		box-shadow: 0 0 0 1px var(--border);
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
		border-radius: 12px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
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
		border-radius: 8px;
		background: var(--brand);
		color: white;
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
		.hero {
			padding: 1.5rem 1rem 1.5rem;
		}
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
