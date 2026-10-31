<script lang="ts">
	import { MoveUpRight, ChevronLeft, ChevronRight, Search, X, Newspaper } from 'lucide-svelte'
	import type { PressRelease, LocalPressRelease, PressCoverage } from '$lib/notion'
	import { getT } from '$lib/i18n'
	import { Page } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData & {
		pressReleases: PressRelease[]
		localPressReleases: LocalPressRelease[]
		pressCoverage: PressCoverage[]
	}

	$: lang = data.lang
	$: t = getT(lang)
	$: prefix = `/${lang}`

	$: pressCoverage = [...data.pressCoverage].sort((a, b) => {
		if (!a.date && !b.date) return 0
		if (!a.date) return 1
		if (!b.date) return -1
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	})

	$: coverageByYear = pressCoverage.reduce<Record<string, PressCoverage[]>>((acc, item) => {
		const year = item.date ? item.date.slice(0, 4) : '?'
		acc[year] ??= []
		acc[year].push(item)
		return acc
	}, {})
	$: coverageYears = Object.keys(coverageByYear).sort((a, b) => b.localeCompare(a))

	// Controlled open/close state for year groups
	let openYears = new Set<string>()
	let coverageInitialized = false
	$: if (coverageYears.length > 0 && !coverageInitialized) {
		openYears = new Set([coverageYears[0]])
		coverageInitialized = true
	}
	$: allOpen = coverageYears.length > 0 && coverageYears.every((y) => openYears.has(y))

	function toggleYear(year: string, e: Event) {
		const el = e.currentTarget as HTMLDetailsElement
		if (el.open) openYears.add(year)
		else openYears.delete(year)
		openYears = openYears
	}

	function toggleAll() {
		openYears = allOpen ? new Set() : new Set(coverageYears)
	}

	const PER_PAGE = 15

	const fallbackPressReleases: PressRelease[] = [
		{
			id: '1',
			title: 'Forum des solutions pour une IA compatible avec l\u2019humanit\u00e9',
			slug: 'forum-des-solutions-pour-une-ia-compatible-avec-lhumanite',
			date: '2024-11-21',
			url: '/pdfs/communique_de_presse_forum_des_solutions.pdf',
			description:
				'Communiqu\u00e9 de presse pour le forum des solutions organis\u00e9 au S\u00e9nat.',
			order: 1,
			visible: true
		}
	]

	// Mapping des numéros de département vers leurs noms
	const DEPT_NAMES: Record<string, string> = {
		'01': 'Ain',
		'02': 'Aisne',
		'03': 'Allier',
		'04': 'Alpes-de-Haute-Provence',
		'05': 'Hautes-Alpes',
		'06': 'Alpes-Maritimes',
		'07': 'Ardèche',
		'08': 'Ardennes',
		'09': 'Ariège',
		'10': 'Aube',
		'11': 'Aude',
		'12': 'Aveyron',
		'13': 'Bouches-du-Rhône',
		'14': 'Calvados',
		'15': 'Cantal',
		'16': 'Charente',
		'17': 'Charente-Maritime',
		'18': 'Cher',
		'19': 'Corrèze',
		'2A': 'Corse-du-Sud',
		'2B': 'Haute-Corse',
		'21': "Côte-d'Or",
		'22': "Côtes-d'Armor",
		'23': 'Creuse',
		'24': 'Dordogne',
		'25': 'Doubs',
		'26': 'Drôme',
		'27': 'Eure',
		'28': 'Eure-et-Loir',
		'29': 'Finistère',
		'30': 'Gard',
		'31': 'Haute-Garonne',
		'32': 'Gers',
		'33': 'Gironde',
		'34': 'Hérault',
		'35': 'Ille-et-Vilaine',
		'36': 'Indre',
		'37': 'Indre-et-Loire',
		'38': 'Isère',
		'39': 'Jura',
		'40': 'Landes',
		'41': 'Loir-et-Cher',
		'42': 'Loire',
		'43': 'Haute-Loire',
		'44': 'Loire-Atlantique',
		'45': 'Loiret',
		'46': 'Lot',
		'47': 'Lot-et-Garonne',
		'48': 'Lozère',
		'49': 'Maine-et-Loire',
		'50': 'Manche',
		'51': 'Marne',
		'52': 'Haute-Marne',
		'53': 'Mayenne',
		'54': 'Meurthe-et-Moselle',
		'55': 'Meuse',
		'56': 'Morbihan',
		'57': 'Moselle',
		'58': 'Nièvre',
		'59': 'Nord',
		'60': 'Oise',
		'61': 'Orne',
		'62': 'Pas-de-Calais',
		'63': 'Puy-de-Dôme',
		'64': 'Pyrénées-Atlantiques',
		'65': 'Hautes-Pyrénées',
		'66': 'Pyrénées-Orientales',
		'67': 'Bas-Rhin',
		'68': 'Haut-Rhin',
		'69': 'Rhône',
		'70': 'Haute-Saône',
		'71': 'Saône-et-Loire',
		'72': 'Sarthe',
		'73': 'Savoie',
		'74': 'Haute-Savoie',
		'75': 'Paris',
		'76': 'Seine-Maritime',
		'77': 'Seine-et-Marne',
		'78': 'Yvelines',
		'79': 'Deux-Sèvres',
		'80': 'Somme',
		'81': 'Tarn',
		'82': 'Tarn-et-Garonne',
		'83': 'Var',
		'84': 'Vaucluse',
		'85': 'Vendée',
		'86': 'Vienne',
		'87': 'Haute-Vienne',
		'88': 'Vosges',
		'89': 'Yonne',
		'90': 'Territoire de Belfort',
		'91': 'Essonne',
		'92': 'Hauts-de-Seine',
		'93': 'Seine-Saint-Denis',
		'94': 'Val-de-Marne',
		'95': "Val-d'Oise",
		'971': 'Guadeloupe',
		'972': 'Martinique',
		'973': 'Guyane',
		'974': 'La Réunion',
		'976': 'Mayotte'
	}

	function getDeptLabel(code: string): string {
		const name = DEPT_NAMES[code]
		return name ? `${code} · ${name}` : code
	}

	$: pressReleases = data.pressReleases.length > 0 ? data.pressReleases : fallbackPressReleases
	$: localPressReleases = data.localPressReleases

	// Tabs
	type Tab = 'national' | 'local'
	let activeTab: Tab = 'national'

	function switchTab(tab: Tab) {
		activeTab = tab
		currentPage = 1
		localCurrentPage = 1
		selectedDepartment = ''
		deptSearchQuery = ''
		deptDropdownOpen = false
	}

	// --- National pagination ---
	let currentPage = 1
	$: totalPages = Math.ceil(pressReleases.length / PER_PAGE)
	$: startIndex = (currentPage - 1) * PER_PAGE
	$: paginatedReleases = pressReleases.slice(startIndex, startIndex + PER_PAGE)

	function goToPage(page: number) {
		currentPage = page
		const section = document.getElementById('press-releases-top')
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	// --- Local (departmental) filtering & pagination ---
	let selectedDepartment = ''
	$: departments = [
		...new Set(localPressReleases.map((pr) => pr.department).filter(Boolean))
	].sort()
	$: filteredLocalReleases = selectedDepartment
		? localPressReleases.filter((pr) => pr.department === selectedDepartment)
		: localPressReleases

	// --- Department search combobox ---
	let deptSearchQuery = ''
	let deptDropdownOpen = false
	let highlightedIndex = -1
	let deptInputEl: HTMLInputElement

	function normalize(str: string): string {
		return str
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
	}

	$: filteredDepartments = (() => {
		if (!deptSearchQuery.trim()) return departments
		const q = normalize(deptSearchQuery.trim())
		return departments.filter((code) => {
			const name = DEPT_NAMES[code] || ''
			return code.startsWith(q) || normalize(name).includes(q)
		})
	})()

	function selectDepartment(code: string) {
		selectedDepartment = code
		deptSearchQuery = getDeptLabel(code)
		deptDropdownOpen = false
		highlightedIndex = -1
		localCurrentPage = 1
	}

	function clearDepartment() {
		selectedDepartment = ''
		deptSearchQuery = ''
		deptDropdownOpen = false
		highlightedIndex = -1
		localCurrentPage = 1
		deptInputEl.focus()
	}

	function onDeptInputFocus() {
		deptDropdownOpen = true
		if (selectedDepartment) {
			deptSearchQuery = ''
			selectedDepartment = ''
			localCurrentPage = 1
		}
	}

	function onDeptInputBlur() {
		// Delay to allow click on dropdown item
		setTimeout(() => {
			deptDropdownOpen = false
			if (!selectedDepartment) {
				deptSearchQuery = ''
			}
		}, 200)
	}

	function onDeptKeydown(e: KeyboardEvent) {
		if (!deptDropdownOpen && e.key !== 'Escape') {
			deptDropdownOpen = true
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			highlightedIndex = Math.min(highlightedIndex + 1, filteredDepartments.length - 1)
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			highlightedIndex = Math.max(highlightedIndex - 1, 0)
		} else if (e.key === 'Enter') {
			e.preventDefault()
			if (highlightedIndex >= 0 && highlightedIndex < filteredDepartments.length) {
				selectDepartment(filteredDepartments[highlightedIndex])
			}
		} else if (e.key === 'Escape') {
			deptDropdownOpen = false
			deptInputEl.blur()
		}
	}

	let localCurrentPage = 1
	$: localTotalPages = Math.ceil(filteredLocalReleases.length / PER_PAGE)
	$: localStartIndex = (localCurrentPage - 1) * PER_PAGE
	$: paginatedLocalReleases = filteredLocalReleases.slice(
		localStartIndex,
		localStartIndex + PER_PAGE
	)

	function goToLocalPage(page: number) {
		localCurrentPage = page
		const section = document.getElementById('press-releases-top')
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	// --- Shared helpers ---
	function formatDate(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function formatDateShort(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	}

	function scrollToCard(id: string) {
		const el = document.getElementById(`pr-${id}`)
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	function onMobileSelect(event: Event) {
		const select = event.target as HTMLSelectElement
		const id = select.value
		if (id) {
			scrollToCard(id)
			select.value = ''
		}
	}
</script>

<svelte:head>
	<title>{t.presse.title} - Pause IA</title>
	<meta name="description" content={t.presse.subtitle} />
</svelte:head>

<Page width="wide" eyebrow={t.nav.actualites} title={t.presse.title} lede={t.presse.subtitle}>
	<section class="contact-section">
		<div class="contact-card">
			<h2>{t.presse.contact_title}</h2>
			<p class="contact-note">{t.presse.contact_note}</p>
			<div class="contact-info">
				<div class="contact-email-main">
					<strong>{t.presse.email_label}</strong>
					<a href="mailto:presse@pauseia.fr">presse@pauseia.fr</a>
				</div>
				<div class="contact-persons">
					<div class="contact-person">
						<p class="contact-name">Clémence Peyrot</p>
						<p class="contact-role">Directrice exécutive de Pause IA</p>
						<p>
							<strong>Email :</strong>
							<a href="mailto:clemence@pauseia.fr">clemence@pauseia.fr</a>
						</p>
						<p>
							<strong>Tél. :</strong>
							<a href="tel:+33645513415">06 45 51 34 15</a>
						</p>
					</div>
					<div class="contact-person">
						<p class="contact-name">Maxime Fournes</p>
						<p class="contact-role">Co-fondateur de Pause IA</p>
						<p>
							<strong>Tél. :</strong>
							<a href="tel:+33743155617">07 43 15 56 17</a>
						</p>
					</div>
				</div>
			</div>
			<p class="redirect">
				{t.presse.redirect_non_journalist}
				<a href="{prefix}/qui-sommes-nous">{t.presse.redirect_link}</a>
				{t.presse.redirect_suffix}
			</p>
		</div>
	</section>

	<section class="press-releases-section">
		<h2 id="press-releases-top">{t.presse.releases_title}</h2>

		<!-- Tabs -->
		<div class="tabs" role="tablist">
			<button
				class="tab"
				class:active={activeTab === 'national'}
				on:click={() => {
					switchTab('national')
				}}
				role="tab"
				aria-selected={activeTab === 'national'}
			>
				<span class="tab-label">{t.presse.tab_national}</span>
				{#if pressReleases.length > 0}
					<span class="tab-count">{pressReleases.length}</span>
				{/if}
			</button>
			<button
				class="tab"
				class:active={activeTab === 'local'}
				on:click={() => {
					switchTab('local')
				}}
				role="tab"
				aria-selected={activeTab === 'local'}
			>
				<span class="tab-label">{t.presse.tab_local}</span>
				{#if localPressReleases.length > 0}
					<span class="tab-count">{localPressReleases.length}</span>
				{/if}
			</button>
		</div>

		<!-- ===== NATIONAL TAB ===== -->
		{#if activeTab === 'national'}
			<!-- Mobile: dropdown navigation -->
			<div class="mobile-nav">
				<label class="mobile-nav-label" for="mobile-select-national">{t.presse.quick_access}</label>
				<select id="mobile-select-national" class="mobile-select" on:change={onMobileSelect}>
					<option value="" disabled selected>{t.presse.mobile_choose}</option>
					{#each paginatedReleases as pr (pr.id)}
						<option value={pr.id}>
							{pr.title} ({formatDateShort(pr.date)})
						</option>
					{/each}
				</select>
			</div>

			<div class="press-layout">
				<!-- Desktop: sidebar navigation -->
				<nav class="press-sidebar">
					<h3 class="sidebar-title">{t.presse.quick_access}</h3>
					<ul class="sidebar-list">
						{#each paginatedReleases as pr (pr.id)}
							<li>
								<button
									class="sidebar-item"
									on:click={() => {
										scrollToCard(pr.id)
									}}
								>
									<span class="sidebar-item-title">{pr.title}</span>
									{#if pr.date}
										<time class="sidebar-item-date" datetime={pr.date}
											>{formatDateShort(pr.date)}</time
										>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
					{#if totalPages > 1}
						<div class="sidebar-page-info">
							{t.presse.page}
							{currentPage} / {totalPages}
						</div>
					{/if}
				</nav>

				<!-- Press releases list -->
				<div class="press-releases-list">
					{#each paginatedReleases as pr (pr.id)}
						<a
							id="pr-{pr.id}"
							class="press-release-card"
							href={pr.slug ? `${prefix}/presse/national/${pr.slug}` : pr.url}
							target={pr.slug ? undefined : '_blank'}
							rel={pr.slug ? undefined : 'noopener noreferrer'}
						>
							<div class="pr-content">
								<h3>{pr.title}</h3>
								{#if pr.description}
									<p class="pr-description">{pr.description}</p>
								{/if}
							</div>
							<div class="pr-footer">
								{#if pr.date}
									<time datetime={pr.date}>{formatDate(pr.date)}</time>
								{/if}
								<span class="read-link">
									{t.presse.read_release}
									<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
								</span>
							</div>
						</a>
					{/each}

					{#if totalPages > 1}
						<nav class="pagination" aria-label={t.presse.pagination_national}>
							<button
								class="pagination-btn"
								disabled={currentPage === 1}
								on:click={() => {
									goToPage(currentPage - 1)
								}}
								aria-label={t.presse.prev_page}
							>
								<ChevronLeft size="1.25rem" />
							</button>

							{#each Array(totalPages) as _, i}
								<button
									class="pagination-num"
									class:active={currentPage === i + 1}
									on:click={() => {
										goToPage(i + 1)
									}}
									aria-label="{t.presse.page} {i + 1}"
									aria-current={currentPage === i + 1 ? 'page' : undefined}
								>
									{i + 1}
								</button>
							{/each}

							<button
								class="pagination-btn"
								disabled={currentPage === totalPages}
								on:click={() => {
									goToPage(currentPage + 1)
								}}
								aria-label={t.presse.next_page}
							>
								<ChevronRight size="1.25rem" />
							</button>
						</nav>
					{/if}
				</div>
			</div>
		{/if}

		<!-- ===== LOCAL (DEPARTMENTAL) TAB ===== -->
		{#if activeTab === 'local'}
			<!-- Department search combobox -->
			<div class="department-filter">
				<label for="dept-search" class="dept-label">{t.presse.dept_label}</label>
				<div
					class="dept-combobox"
					role="combobox"
					aria-expanded={deptDropdownOpen}
					aria-haspopup="listbox"
					aria-controls="dept-listbox"
				>
					<div class="dept-input-wrapper">
						<span class="dept-search-icon"><Search size="1rem" /></span>
						<input
							id="dept-search"
							type="text"
							class="dept-input"
							placeholder={t.presse.dept_placeholder}
							bind:value={deptSearchQuery}
							bind:this={deptInputEl}
							on:focus={onDeptInputFocus}
							on:blur={onDeptInputBlur}
							on:keydown={onDeptKeydown}
							autocomplete="off"
							aria-controls="dept-listbox"
							aria-autocomplete="list"
						/>
						{#if selectedDepartment || deptSearchQuery}
							<button
								class="dept-clear-btn"
								on:mousedown|preventDefault={clearDepartment}
								aria-label={t.presse.clear_selection}
							>
								<X size="1rem" />
							</button>
						{/if}
					</div>
					{#if deptDropdownOpen && filteredDepartments.length > 0}
						<ul id="dept-listbox" class="dept-dropdown" role="listbox">
							{#each filteredDepartments as code, i (code)}
								<li
									role="option"
									class="dept-option"
									class:highlighted={i === highlightedIndex}
									aria-selected={code === selectedDepartment}
									on:mousedown|preventDefault={() => {
										selectDepartment(code)
									}}
								>
									<span class="dept-option-code">{code}</span>
									<span class="dept-option-name">{DEPT_NAMES[code] || code}</span>
								</li>
							{/each}
						</ul>
					{/if}
					{#if deptDropdownOpen && filteredDepartments.length === 0 && deptSearchQuery}
						<div class="dept-dropdown dept-no-result">{t.presse.no_dept_found}</div>
					{/if}
				</div>
			</div>

			{#if filteredLocalReleases.length === 0}
				<div class="empty-state">
					<p>
						{#if selectedDepartment}
							{t.presse.no_dept_release} {getDeptLabel(selectedDepartment)}.
						{:else}
							{t.presse.no_local_release}
						{/if}
					</p>
				</div>
			{:else}
				<!-- Mobile: dropdown navigation -->
				<div class="mobile-nav">
					<label class="mobile-nav-label" for="mobile-select-local">{t.presse.quick_access}</label>
					<select id="mobile-select-local" class="mobile-select" on:change={onMobileSelect}>
						<option value="" disabled selected>{t.presse.mobile_choose}</option>
						{#each paginatedLocalReleases as pr (pr.id)}
							<option value={pr.id}>
								[{pr.department}] {pr.title} ({formatDateShort(pr.date)})
							</option>
						{/each}
					</select>
				</div>

				<div class="press-layout">
					<!-- Desktop: sidebar navigation -->
					<nav class="press-sidebar">
						<h3 class="sidebar-title">{t.presse.quick_access}</h3>
						<ul class="sidebar-list">
							{#each paginatedLocalReleases as pr (pr.id)}
								<li>
									<button
										class="sidebar-item"
										on:click={() => {
											scrollToCard(pr.id)
										}}
									>
										<span class="sidebar-item-dept">{getDeptLabel(pr.department)}</span>
										<span class="sidebar-item-title">{pr.title}</span>
										{#if pr.date}
											<time class="sidebar-item-date" datetime={pr.date}
												>{formatDateShort(pr.date)}</time
											>
										{/if}
									</button>
								</li>
							{/each}
						</ul>
						{#if localTotalPages > 1}
							<div class="sidebar-page-info">
								{t.presse.page}
								{localCurrentPage} / {localTotalPages}
							</div>
						{/if}
					</nav>

					<!-- Local press releases list -->
					<div class="press-releases-list">
						{#each paginatedLocalReleases as pr (pr.id)}
							<a
								id="pr-{pr.id}"
								class="press-release-card"
								href={pr.slug ? `${prefix}/presse/local/${pr.slug}` : pr.url}
								target={pr.slug ? undefined : '_blank'}
								rel={pr.slug ? undefined : 'noopener noreferrer'}
							>
								<div class="pr-content">
									<div class="pr-dept-badge">{getDeptLabel(pr.department)}</div>
									<h3>{pr.title}</h3>
									{#if pr.description}
										<p class="pr-description">{pr.description}</p>
									{/if}
								</div>
								<div class="pr-footer">
									{#if pr.date}
										<time datetime={pr.date}>{formatDate(pr.date)}</time>
									{/if}
									<span class="read-link">
										{t.presse.read_release}
										<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
									</span>
								</div>
							</a>
						{/each}

						{#if localTotalPages > 1}
							<nav class="pagination" aria-label={t.presse.pagination_local}>
								<button
									class="pagination-btn"
									disabled={localCurrentPage === 1}
									on:click={() => {
										goToLocalPage(localCurrentPage - 1)
									}}
									aria-label={t.presse.prev_page}
								>
									<ChevronLeft size="1.25rem" />
								</button>

								{#each Array(localTotalPages) as _, i}
									<button
										class="pagination-num"
										class:active={localCurrentPage === i + 1}
										on:click={() => {
											goToLocalPage(i + 1)
										}}
										aria-label="{t.presse.page} {i + 1}"
										aria-current={localCurrentPage === i + 1 ? 'page' : undefined}
									>
										{i + 1}
									</button>
								{/each}

								<button
									class="pagination-btn"
									disabled={localCurrentPage === localTotalPages}
									on:click={() => {
										goToLocalPage(localCurrentPage + 1)
									}}
									aria-label={t.presse.next_page}
								>
									<ChevronRight size="1.25rem" />
								</button>
							</nav>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</section>

	{#if pressCoverage.length > 0}
		<section class="coverage-section">
			<div class="coverage-header">
				<h2>
					<Newspaper size="1.1rem" style="display:inline;vertical-align:-0.1em" />
					{t.presse.coverage_title}
					<span class="coverage-count">{pressCoverage.length}</span>
				</h2>
				<button class="toggle-all-btn" on:click={toggleAll}>
					{allOpen
						? lang === 'en'
							? 'Collapse all'
							: 'Tout replier'
						: lang === 'en'
							? 'Expand all'
							: 'Tout déplier'}
				</button>
			</div>
			{#each coverageYears as year}
				<details
					class="coverage-year-group"
					open={openYears.has(year)}
					on:toggle={(e) => {
						toggleYear(year, e)
					}}
				>
					<summary class="coverage-year">
						<span class="coverage-year-chevron">▶</span>
						{year}
						<span class="coverage-year-count">{coverageByYear[year].length}</span>
					</summary>
					<ul class="coverage-list">
						{#each coverageByYear[year] as item (item.id)}
							<li>
								<a class="coverage-item" href={item.url} target="_blank" rel="noopener noreferrer">
									<div class="coverage-item-meta">
										<span class="coverage-source">{item.source}</span>
										{#if item.date}
											<time class="coverage-date" datetime={item.date}>{formatDate(item.date)}</time
											>
										{/if}
										<MoveUpRight size="0.75rem" class="coverage-external-icon" />
									</div>
									<span class="coverage-title">{item.title}</span>
								</a>
							</li>
						{/each}
					</ul>
				</details>
			{/each}
		</section>
	{/if}

	<section class="about-section">
		<div class="about-card">
			<h2>{t.presse.about_title}</h2>
			<p>{t.presse.about_p1}</p>
			<p>{t.presse.about_p2}</p>
		</div>
	</section>
</Page>

<style>
	/* Contact section */
	.contact-section {
		margin-bottom: 3rem;
	}

	.contact-card {
		background-color: var(--bg-subtle);
		border: 2px solid var(--brand);
		border-radius: var(--radius-sm);
		padding: 1.25rem 1.5rem;
	}

	.contact-card h2 {
		margin-top: 0;
		margin-bottom: 0.125rem;
		font-size: 1.3rem;
	}

	.contact-note {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
		font-style: italic;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.contact-email-main {
		font-size: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(var(--ink-rgb), 0.06);
	}

	.contact-email-main a {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	.contact-persons {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.contact-person {
		flex: 1;
		min-width: 12rem;
	}

	.contact-person p {
		margin: 0.15rem 0;
	}

	.contact-name {
		font-weight: 700;
		font-size: 1rem;
		margin-bottom: 0;
	}

	.contact-role {
		color: var(--text-secondary);
		font-size: 0.85rem;
		margin-bottom: 0.25rem;
	}

	.contact-info a {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	.redirect {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: 0;
		padding-top: 1rem;
		border-top: 1px solid rgba(var(--ink-rgb), 0.08);
	}

	.redirect a {
		color: var(--brand-subtle);
	}

	/* Press releases section */
	.press-releases-section h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.4rem;
	}

	/* Tabs */
	.tabs {
		display: inline-flex;
		gap: 0.25rem;
		margin-bottom: 1.5rem;
		background-color: var(--bg-secondary);
		border-radius: var(--radius-btn);
		padding: 0.25rem;
	}

	.tab {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.25rem;
		border: none;
		background: transparent;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-secondary);
		cursor: pointer;
		position: relative;
		transition:
			color 0.2s ease,
			background-color 0.2s ease,
			box-shadow 0.2s ease;
		border-radius: var(--radius-sm);
	}

	.tab:hover {
		color: var(--text);
	}

	.tab.active {
		color: var(--brand-subtle);
		background-color: var(--bg-card);
		box-shadow: var(--shadow-card);
	}

	.tab-label {
		white-space: nowrap;
	}

	.tab-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.375rem;
		height: 1.375rem;
		padding: 0 0.375rem;
		font-size: 0.75rem;
		font-weight: 700;
		border-radius: var(--radius-pill);
		background-color: rgba(var(--ink-rgb), 0.08);
		color: var(--text-secondary);
		line-height: 1;
	}

	.tab.active .tab-count {
		background-color: rgba(var(--brand-rgb), 0.15);
		color: var(--brand-subtle);
	}

	/* Department filter combobox */
	.department-filter {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.dept-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text);
		white-space: nowrap;
	}

	.dept-combobox {
		position: relative;
		flex: 1;
		min-width: 16rem;
		max-width: 24rem;
	}

	.dept-input-wrapper {
		display: flex;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background-color: var(--bg-card);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.dept-input-wrapper:focus-within {
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(var(--brand-rgb), 0.1);
	}

	.dept-search-icon {
		display: flex;
		align-items: center;
		padding-left: 0.75rem;
		color: var(--text-secondary);
		flex-shrink: 0;
	}

	.dept-input {
		flex: 1;
		padding: 0.5rem 0.5rem;
		font-size: 0.9rem;
		font-family: var(--font-body);
		border: none;
		background: transparent;
		color: var(--text);
		outline: none;
		min-width: 0;
	}

	.dept-input::placeholder {
		color: var(--text-secondary);
		opacity: 0.7;
	}

	.dept-clear-btn {
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

	.dept-clear-btn:hover {
		color: var(--text);
		background-color: rgba(var(--ink-rgb), 0.06);
	}

	.dept-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		max-height: 15rem;
		overflow-y: auto;
		background-color: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		box-shadow: 0 8px 24px rgba(var(--ink-rgb), 0.12);
		z-index: 50;
		list-style: none;
		padding: 0.25rem;
		margin: 0;
	}

	.dept-option {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: background-color 0.1s ease;
	}

	.dept-option:hover,
	.dept-option.highlighted {
		background-color: rgba(var(--brand-rgb), 0.06);
	}

	.dept-option-code {
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--brand-subtle);
		min-width: 2rem;
	}

	.dept-option-name {
		font-size: 0.875rem;
		color: var(--text);
	}

	.dept-no-result {
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		color: var(--text-secondary);
		text-align: center;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	/* Department badge on cards */
	.pr-dept-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--brand-subtle);
		background-color: rgba(var(--brand-rgb), 0.08);
		border: 1px solid var(--brand);
		border-radius: 0.25rem;
	}

	/* Sidebar department label */
	.sidebar-item-dept {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--brand-subtle);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* Mobile dropdown nav - hidden on desktop */
	.mobile-nav {
		display: none;
		margin-bottom: 1.5rem;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 0.75rem 1rem;
	}

	.mobile-nav-label {
		display: block;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-subtle);
		margin-bottom: 0.5rem;
	}

	.mobile-select {
		width: 100%;
		padding: 0.625rem 2.5rem 0.625rem 0.75rem;
		font-size: 0.875rem;
		font-family: var(--font-body);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background-color: var(--bg-card);
		color: var(--text);
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23676e7a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.625rem center;
		cursor: pointer;
		line-height: 1.4;
	}

	.mobile-select:focus {
		outline: 2px solid var(--brand);
		outline-offset: 2px;
	}

	/* Layout with sidebar */
	.press-layout {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	/* Sidebar - hidden on mobile */
	.press-sidebar {
		position: sticky;
		top: 1rem;
		flex-shrink: 0;
		width: 16rem;
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 1.25rem;
	}

	.sidebar-title {
		margin: 0 0 0.75rem;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-subtle);
	}

	.sidebar-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sidebar-list li {
		padding: 0;
		margin: 0;
	}

	.sidebar-item {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		width: 100%;
		padding: 0.5rem 0.625rem;
		border: none;
		background: transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-align: left;
		transition: background-color 0.15s ease;
	}

	.sidebar-item:hover {
		background-color: rgba(var(--ink-rgb), 0.05);
	}

	.sidebar-item-title {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.sidebar-item-date {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.sidebar-page-info {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-align: center;
	}

	/* Press releases list */
	.press-releases-list {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex-grow: 1;
		min-width: 0;
	}

	.press-release-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		background-color: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--text);
		box-shadow: 0 1px 3px rgba(var(--ink-rgb), 0.06);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.press-release-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px -6px rgba(var(--ink-rgb), 0.12);
		border-color: var(--brand);
		color: var(--text);
	}

	.pr-content {
		flex-grow: 1;
	}

	.pr-content h3 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
	}

	.pr-description {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.pr-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.press-release-card time {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.read-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--brand-subtle);
		transition: color 0.2s ease;
	}

	.press-release-card:hover .read-link {
		color: var(--brand-subtle);
	}

	.link-icon {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.press-release-card:hover .link-icon {
		transform: translate(2px, -2px);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.375rem;
		margin-top: 1rem;
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
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.pagination-btn:hover:not(:disabled) {
		background-color: var(--bg-subtle);
		border-color: var(--brand);
	}

	.pagination-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.pagination-num {
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
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.pagination-num:hover {
		background-color: var(--bg-subtle);
		border-color: var(--brand);
	}

	.pagination-num.active {
		background-color: var(--brand);
		border-color: var(--brand);
		color: var(--on-brand);
	}

	/* ── Press coverage section ──────────────────────────────────── */
	.coverage-section {
		margin-top: 3rem;
	}

	.coverage-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		gap: 1rem;
	}

	.coverage-header h2 {
		margin: 0;
		font-size: 1.4rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.coverage-count {
		font-size: 0.78rem;
		font-weight: 600;
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 0.1rem 0.5rem;
		border-radius: var(--radius-pill);
	}

	.toggle-all-btn {
		font-size: 0.78rem;
		font-weight: 500;
		color: var(--text-secondary);
		background: none;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.25rem 0.625rem;
		cursor: pointer;
		white-space: nowrap;
		transition:
			border-color 0.15s,
			color 0.15s;
	}

	.toggle-all-btn:hover {
		border-color: var(--brand);
		color: var(--text);
	}

	.coverage-year-group {
		border-bottom: 1px solid var(--border);
	}

	.coverage-year-group:last-child {
		border-bottom: none;
	}

	.coverage-year {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		list-style: none;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
		padding: 0.6rem 0.25rem;
		cursor: pointer;
		user-select: none;
	}

	.coverage-year::-webkit-details-marker {
		display: none;
	}

	.coverage-year-chevron {
		font-size: 0.5rem;
		opacity: 0.45;
		transition: transform 0.15s ease;
		display: inline-block;
	}

	details[open] > .coverage-year .coverage-year-chevron {
		transform: rotate(90deg);
	}

	.coverage-year-count {
		font-size: 0.68rem;
		font-weight: 600;
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 0.05rem 0.4rem;
		border-radius: var(--radius-pill);
	}

	.coverage-list {
		list-style: none;
		margin: 0 0 0.5rem;
		padding: 0;
	}

	.coverage-item {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-sm);
		border-left: 2px solid transparent;
		text-decoration: none;
		color: var(--text);
		transition:
			background-color 0.15s,
			border-color 0.15s;
	}

	.coverage-item:hover {
		background-color: var(--bg-subtle);
		border-left-color: var(--brand-subtle);
		color: var(--text);
	}

	.coverage-item-meta {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.coverage-source {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--brand-subtle);
		background: color-mix(in srgb, var(--brand) 10%, transparent);
		padding: 0.1rem 0.4rem;
		border-radius: 0.25rem;
	}

	.coverage-date {
		font-size: 0.72rem;
		color: var(--text-secondary);
	}

	:global(.coverage-external-icon) {
		flex-shrink: 0;
		opacity: 0.2;
		transition: opacity 0.15s;
		color: var(--text-secondary);
		margin-left: auto;
	}

	.coverage-item:hover :global(.coverage-external-icon) {
		opacity: 0.7;
	}

	.coverage-title {
		font-size: 0.88rem;
		font-weight: 500;
		line-height: 1.45;
		color: var(--text);
	}

	/* About section */
	.about-section {
		margin-top: 3rem;
	}

	.about-card {
		background-color: var(--bg-secondary);
		border: 1px solid var(--border);
		border-left: 4px solid var(--brand);
		border-radius: var(--radius-md);
		padding: 2rem 2.5rem;
	}

	.about-card h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.3rem;
		color: var(--brand-subtle);
	}

	.about-card p {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
	}

	.about-card p:last-child {
		margin-bottom: 0;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.mobile-nav {
			display: block;
		}

		.press-layout {
			flex-direction: column;
		}

		.press-sidebar {
			display: none;
		}

		.tabs {
			display: flex;
			width: 100%;
		}

		.tab {
			flex: 1;
			justify-content: center;
			padding: 0.625rem 0.5rem;
			font-size: 0.85rem;
		}

		.department-filter {
			flex-direction: column;
			align-items: stretch;
		}

		.dept-combobox {
			min-width: 0;
			max-width: none;
		}

		.contact-persons {
			flex-direction: column;
			gap: 0.75rem;
		}
	}

	@media (min-width: 640px) {
		.contact-card {
			padding: 1.5rem 2rem;
		}
	}
</style>
