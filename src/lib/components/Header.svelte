<script lang="ts">
	import NavDropdown from '$components/NavDropdown.svelte'
	import Logo from '$components/Logo.svelte'
	import { page } from '$app/stores'
	import Banner from '$components/Banner.svelte'
	import { bannerStore } from '$lib/stores/banner'
	import { theme } from '$lib/stores/theme'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'

	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	export let lang: Lang = 'fr'

	$: t = getT(lang)
	$: prefix = lang === 'fr' ? '/fr' : '/en'
	$: onHomepage =
		$page.url.pathname == '/' ||
		$page.url.pathname == `/${lang}` ||
		$page.url.pathname == `/${lang}/`
	$: onEmploiePage = $page.url.pathname.includes('/emploi-ia')

	// Hero has a light background — header stays dark on homepage
	$: whiteNav = false && onHomepage && !scrolled

	let open = false
	let scrolled = false
	let mounted = false

	// Portal action: move the node to document.body so it escapes the sticky
	// header's containing block. position:fixed inside position:sticky is
	// contained by the sticky ancestor in modern browsers, which breaks the
	// sidebar layout (it renders inside the nav bar instead of full-screen).
	function portal(node: HTMLElement): { destroy: () => void } {
		document.body.appendChild(node)
		return {
			destroy() {
				node.parentNode?.removeChild(node)
			}
		}
	}

	onMount(() => {
		mounted = true
		// Hysteresis: activate at 90px, deactivate only at 5px (near top).
		// The gap (85px) exceeds the total header height change (~53px) so the
		// scroll-anchoring feedback loop can never close.
		// RAF batching ensures multiple scroll events per frame don't cause
		// rapid toggling of the `scrolled` class mid-transition.
		let rafId: ReturnType<typeof requestAnimationFrame> | null = null
		const handleScroll = () => {
			if (rafId !== null) return
			rafId = requestAnimationFrame(() => {
				rafId = null
				if (!scrolled && window.scrollY > 90) {
					scrolled = true
				} else if (scrolled && window.scrollY < 5) {
					scrolled = false
				}
			})
		}
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => {
			window.removeEventListener('scroll', handleScroll)
			if (rafId !== null) cancelAnimationFrame(rafId)
		}
	})

	function closeMenu() {
		open = false
	}

	type NavItem = { href: string; label: string; external?: boolean; muted?: boolean }
	type NavGroup = { id: string; label: string; items: NavItem[] }
	let navGroups: NavGroup[]
	$: navGroups = [
		{
			id: 'comprendre',
			label: t.nav.comprendre,
			items: [
				{ href: `${prefix}/dangers`, label: t.nav.dangers },
				{ href: `${prefix}/emploi-ia`, label: 'Emploi et IA' },
				{ href: `${prefix}/newsletters`, label: t.nav.newsletter },
				{ href: `${prefix}/propositions`, label: t.nav.propositions },
				{ href: 'https://pauseia.substack.com/', label: t.nav.blog, external: true }
			]
		},
		{
			id: 'agir',
			label: t.nav.agir,
			items: [
				{ href: `${prefix}/agir`, label: t.nav.comment_agir },
				{ href: `${prefix}/groupes-locaux`, label: t.nav.groupes_locaux }
			]
		},
		{
			id: 'campagnes',
			label: t.nav.campagnes,
			items: [
				{ href: `${prefix}/campagnes`, label: t.nav.toutes_campagnes },
				{ href: `${prefix}/municipales-2026`, label: t.nav.municipales }
			]
		},
		{
			id: 'evenements',
			label: t.nav.evenements,
			items: [
				{ href: `${prefix}/senat2025`, label: t.nav.senat2025 },
				{
					href: 'https://controleia.org/solutions/',
					label: t.nav.forum2025,
					external: true
				}
			]
		},
		{
			id: 'apropos',
			label: t.nav.apropos,
			items: [
				{ href: `${prefix}/qui-sommes-nous`, label: t.nav.qui_sommes_nous },
				{ href: `${prefix}/propositions`, label: t.nav.propositions },
				{ href: `${prefix}/presse`, label: t.nav.presse }
			]
		}
	]

	// Language switcher: swap /fr/ <-> /en/ in current pathname
	$: otherLang = lang === 'fr' ? 'en' : 'fr'

	// Danger page slugs differ between languages — map them explicitly
	const DANGER_SLUGS: Record<'fr' | 'en', string[]> = {
		fr: ['economiques-et-materiels', 'pour-les-individus', 'pour-la-societe', "pour-l'humanite"],
		en: ['economic-and-material', 'for-individuals', 'for-society', 'for-humanity']
	}

	function getSwitchLangHref(pathname: string, currentLang: string, other: string) {
		const slugsFrom = DANGER_SLUGS[currentLang as 'fr' | 'en']
		const slugsTo = DANGER_SLUGS[other as 'fr' | 'en']
		if (slugsFrom && slugsTo) {
			const dangerMatch = pathname.match(new RegExp(`^/${currentLang}/dangers/(.+)$`))
			if (dangerMatch) {
				const idx = slugsFrom.indexOf(dangerMatch[1])
				if (idx >= 0) return `/${other}/dangers/${slugsTo[idx]}`
			}
		}

		return pathname.replace(`/${currentLang}`, `/${other}`) || `/${other}`
	}

	$: switchLangHref = getSwitchLangHref($page.url.pathname, lang, otherLang)
</script>

<!--
  Wrapping Banner + nav in a single <header> solves two issues:
  1. The layout grid sees ONE element (auto row), so main gets the 1fr row correctly.
  2. The Banner lives in the same sticky context as the nav — no z-index collision.
  Banner slides away via max-height CSS transition once the user scrolls.
-->
<header class="site-header" class:scrolled class:homepage={onHomepage}>
	<!-- Banner behavior:
		 - Homepage: hidden while hero is visible, appears when scrolled past hero
		 - Other pages: visible at top, hidden when scrolled (original behavior)
	-->
	<div class="banner-wrapper" class:scrolled class:homepage={onHomepage}>
		<Banner visible={$bannerStore.visible}>
			{$bannerStore.message}
			{#if $bannerStore.linkUrl}
				<a href={$bannerStore.linkUrl}>{$bannerStore.linkText}</a>
			{/if}
		</Banner>
	</div>

	{#if mounted || !onHomepage}
		<nav in:fade={{ duration: 400, delay: 100 }} class:scrolled class:homepage={onHomepage}>
			<a href={onEmploiePage ? `${prefix}/emploi-ia` : `${prefix}`} class="logo">
				<div class="big-logo">
					<Logo
						animate
						fill_pause={whiteNav ? 'white' : $theme === 'dark' ? 'white' : 'black'}
						emploi_ia={onEmploiePage}
					/>
				</div>
				<div class="small-logo">
					<Logo animate only_circle />
				</div>
			</a>

			<div class="nav-right">
				<div class="nav-links">
					{#each navGroups as group}
						<NavDropdown label={group.label} items={group.items} white={whiteNav} />
					{/each}
					<!-- Séparateur vertical -->
					<div class="nav-separator" class:on-hero={whiteNav} aria-hidden="true"></div>
					<!-- CTAs -->
					<div class="nav-ctas">
						<a
							href={switchLangHref}
							class="lang-toggle"
							class:on-hero={whiteNav}
							aria-label={otherLang === 'fr' ? 'Passer en français' : 'Switch to English'}
							title={otherLang === 'fr' ? 'Français' : 'English'}>{otherLang.toUpperCase()}</a
						>
						<button
							class="theme-toggle"
							class:on-hero={whiteNav}
							on:click={() => theme.toggle()}
							aria-label={$theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
							title={$theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
						>
							{#if $theme === 'dark'}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<circle cx="12" cy="12" r="5" />
									<line x1="12" y1="1" x2="12" y2="3" />
									<line x1="12" y1="21" x2="12" y2="23" />
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
									<line x1="1" y1="12" x2="3" y2="12" />
									<line x1="21" y1="12" x2="23" y2="12" />
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
								</svg>
							{:else}
								<svg
									width="18"
									height="18"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
								</svg>
							{/if}
						</button>
						<a href="/dons" class="btn-donate" class:on-hero={whiteNav}>Donner</a>
						<a href="/rejoindre" class="btn-join" class:on-hero={whiteNav}>Rejoindre</a>
					</div>
				</div>
				<button
					aria-label="Open mobile menu"
					class="hamburger"
					class:open
					on:click={() => (open = !open)}
				>
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							class="bar bar-top"
							y="0"
							height="2.5"
							width="24"
							fill={whiteNav ? 'white' : $theme === 'dark' ? 'white' : 'black'}
						/>
						<rect
							class="bar bar-mid"
							y="10.75"
							height="2.5"
							width="24"
							fill={whiteNav ? 'white' : $theme === 'dark' ? 'white' : 'black'}
						/>
						<rect
							class="bar bar-bot"
							y="21.5"
							height="2.5"
							width="24"
							fill={whiteNav ? 'white' : $theme === 'dark' ? 'white' : 'black'}
						/>
					</svg>
				</button>
			</div>

			<!-- Mobile/tablet sidebar — use:portal pour l'appender à document.body
			     et l'extraire du containing block créé par position:sticky -->
			<div class="sidebar" class:open use:portal>
				<div class="sidebar-head">
					<a href="/" class="sidebar-logo" on:click={closeMenu}>
						<Logo
							height={36}
							fill_pause={$theme === 'dark' ? 'white' : 'black'}
							fill_circle="#FF9416"
							fill_ai={$theme === 'dark' ? 'white' : 'black'}
						/>
					</a>
					<button aria-label="Close mobile menu" class="close-btn" on:click={closeMenu}>
						<svg
							width="16"
							height="16"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M1.5 1.5L14.5 14.5M14.5 1.5L1.5 14.5"
								stroke={$theme === 'dark' ? 'white' : 'black'}
								stroke-width="2.2"
								stroke-linecap="round"
							/>
						</svg>
					</button>
				</div>

				<div class="sidebar-links">
					{#each navGroups as group}
						<div class="sidebar-section">
							<p class="sidebar-section-label">{group.label}</p>
							<div class="sidebar-subsection">
								{#each group.items as item}
									<a
										href={item.href}
										on:click={closeMenu}
										target={item.external ? '_blank' : undefined}
										rel={item.external ? 'noopener noreferrer' : undefined}
										class:active={!item.href.startsWith('http') &&
											($page.url.pathname === item.href ||
												$page.url.pathname.startsWith(item.href + '/'))}
									>
										{item.label}
										{#if item.external}
											<svg
												class="ext-icon"
												width="11"
												height="11"
												viewBox="0 0 11 11"
												fill="none"
												aria-hidden="true"
											>
												<path
													d="M6.5 1h3.5v3.5M10 1L4.5 6.5M3 3H1.5A.5.5 0 001 3.5v6A.5.5 0 001.5 10h6a.5.5 0 00.5-.5V8"
													stroke="currentColor"
													stroke-width="1.5"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										{/if}
									</a>
								{/each}
							</div>
						</div>
					{/each}

					<div class="sidebar-actions">
						<a
							href={switchLangHref}
							class="sidebar-lang-toggle"
							on:click={closeMenu}
							aria-label={otherLang === 'fr' ? 'Passer en français' : 'Switch to English'}
						>
							{otherLang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
						</a>
						<button
							class="sidebar-theme-toggle"
							on:click={() => theme.toggle()}
							aria-label={$theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
						>
							{#if $theme === 'dark'}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<circle cx="12" cy="12" r="5" />
									<line x1="12" y1="1" x2="12" y2="3" />
									<line x1="12" y1="21" x2="12" y2="23" />
									<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
									<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
									<line x1="1" y1="12" x2="3" y2="12" />
									<line x1="21" y1="12" x2="23" y2="12" />
									<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
									<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
								</svg>
								Mode clair
							{:else}
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
								</svg>
								Mode sombre
							{/if}
						</button>
						<a href="/dons" class="sidebar-cta" on:click={closeMenu}>Faire un don</a>
						<a href="/rejoindre" class="sidebar-join" on:click={closeMenu}>Nous rejoindre</a>
					</div>
				</div>
			</div>

			{#if open}
				<div
					class="sidebar-backdrop"
					role="presentation"
					on:click={closeMenu}
					on:keydown={(e) => (e.key === 'Escape' || e.key === 'Enter') && closeMenu()}
					transition:fade={{ duration: 200 }}
					use:portal
				></div>
			{/if}
		</nav>
	{/if}
</header>

<style>
	/* ─── Site header wrapper (sticky) ──────────────────────────── */
	.site-header {
		position: sticky;
		top: 0;
		z-index: 100;
		border-bottom: 1px solid var(--border);
		transition:
			background-color 0.25s ease,
			box-shadow 0.25s ease,
			border-color 0.25s ease,
			opacity 0.3s ease;
	}

	.site-header.scrolled {
		background: var(--bg);
		border-bottom-color: var(--border);
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
	}

	/* On homepage before scroll, header is hidden so hero is full-screen */
	.site-header.homepage:not(.scrolled) {
		opacity: 0;
		pointer-events: none;
		border-bottom-color: transparent;
	}

	/* ─── Banner slide-away on scroll ───────────────────────────── */
	.banner-wrapper {
		overflow: hidden;
		max-height: 8rem; /* generous, Banner is ~2.5rem */
		transition:
			max-height 0.3s ease,
			opacity 0.25s ease;
		opacity: 1;
		/* Prevent the browser's scroll-anchoring from adjusting scrollY when
		   the banner collapses — that would create a feedback loop where the
		   layout shift caused by the collapse brings scrollY back below the
		   threshold, making the banner re-expand, then collapse again, etc. */
		overflow-anchor: none;
	}

	.banner-wrapper.scrolled {
		max-height: 0;
		opacity: 0;
	}

	/* Homepage: inverted — hidden at top, visible when scrolled past hero */
	.banner-wrapper.homepage {
		max-height: 0;
		opacity: 0;
	}

	.banner-wrapper.homepage.scrolled {
		max-height: 8rem;
		opacity: 1;
	}

	/* ─── Nav ────────────────────────────────────────────────────── */
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.85rem 1rem;
		transition: padding 0.25s ease;
	}

	/* Compact nav when scrolled (mobile) */
	nav.scrolled {
		padding-top: 0.55rem;
		padding-bottom: 0.55rem;
	}

	.nav-right {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav-links {
		display: none;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 0.375rem;
	}

	/* Séparateur vertical entre les liens nav et les boutons CTA */
	.nav-separator {
		width: 1px;
		height: 1.5rem;
		background: var(--border);
		margin: 0 0.625rem;
		flex-shrink: 0;
	}

	.nav-separator.on-hero {
		background: rgba(255, 255, 255, 0.4);
	}

	/* CTAs group (Donner + Rejoindre) */
	.nav-ctas {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	/* ─── Nav CTA buttons ────────────────────────────────────────── */
	.btn-donate,
	.btn-join {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.9rem;
		border-radius: 0.4rem;
		padding: 0.45rem 1rem;
		white-space: nowrap;
		transition:
			opacity 0.15s,
			background 0.15s;
	}

	/* "Donner" — brand orange */
	.btn-donate {
		background: var(--brand);
		color: white;
	}

	.btn-donate:hover {
		opacity: 0.85;
	}

	/* "Rejoindre" — black */
	.btn-join {
		background: var(--black);
		color: var(--white);
	}

	.btn-join:hover {
		opacity: 0.8;
	}

	/* On hero (white text context): invert to semi-transparent white */
	.btn-donate.on-hero {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		outline: 1.5px solid rgba(255, 255, 255, 0.5);
		outline-offset: -1.5px;
	}

	.btn-donate.on-hero:hover {
		background: rgba(255, 255, 255, 0.32);
		opacity: 1;
	}

	.btn-join.on-hero {
		background: white;
		color: black;
	}

	.btn-join.on-hero:hover {
		opacity: 0.88;
	}

	/* ─── Theme toggle ───────────────────────────────────────── */
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.4rem;
		border: none;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.theme-toggle:hover {
		background: rgba(0, 0, 0, 0.08);
	}

	.theme-toggle.on-hero {
		color: white;
	}

	.theme-toggle.on-hero:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	/* Dark mode: flip icon colors automatically via CSS currentColor */
	:global([data-theme='dark']) .theme-toggle {
		color: var(--text);
	}

	/* ─── Language toggle ─────────────────────────────────────── */
	.lang-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.4rem;
		background: transparent;
		color: var(--text);
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.75rem;
		text-decoration: none;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.lang-toggle:hover {
		background: rgba(0, 0, 0, 0.08);
	}

	.lang-toggle.on-hero {
		color: white;
	}

	.lang-toggle.on-hero:hover {
		background: rgba(255, 255, 255, 0.15);
	}

	:global([data-theme='dark']) .lang-toggle:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.sidebar-lang-toggle {
		display: block;
		text-align: center;
		text-decoration: none;
		padding: 0.55rem 0.6rem;
		border-radius: 0.45rem;
		background: rgba(0, 0, 0, 0.05);
		color: var(--text-secondary);
		font-size: 0.95rem;
		font-family: var(--font-heading);
		font-weight: 600;
		transition: background 0.1s;
	}

	.sidebar-lang-toggle:hover {
		background: rgba(255, 148, 22, 0.1);
		color: var(--brand);
	}

	:global([data-theme='dark']) .sidebar-lang-toggle {
		background: rgba(255, 255, 255, 0.07);
		color: var(--text);
	}

	:global([data-theme='dark']) .sidebar-lang-toggle:hover {
		background: rgba(255, 148, 22, 0.15);
		color: var(--brand);
	}

	.sidebar-theme-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.55rem 0.6rem;
		border: none;
		border-radius: 0.45rem;
		background: rgba(0, 0, 0, 0.05);
		color: var(--text-secondary);
		font-size: 0.95rem;
		font-family: var(--font-heading);
		font-weight: 600;
		cursor: pointer;
		transition: background 0.1s;
	}

	.sidebar-theme-toggle:hover {
		background: rgba(255, 148, 22, 0.1);
		color: var(--brand);
	}

	:global([data-theme='dark']) .sidebar-theme-toggle {
		background: rgba(255, 255, 255, 0.07);
		color: var(--text);
	}

	:global([data-theme='dark']) .sidebar-theme-toggle:hover {
		background: rgba(255, 148, 22, 0.15);
		color: var(--brand);
	}

	.hamburger {
		display: flex;
		align-items: center;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
	}

	/* ─── Hamburger → croix (morph) ──────────────────────────── */
	.hamburger .bar {
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.25s ease;
	}

	/* barre du haut : descend + tourne 45° */
	.hamburger.open .bar-top {
		transform: translateY(10.75px) rotate(45deg);
	}

	/* barre du milieu : disparaît */
	.hamburger.open .bar-mid {
		opacity: 0;
		transform: scaleX(0);
	}

	/* barre du bas : monte + tourne -45° */
	.hamburger.open .bar-bot {
		transform: translateY(-10.75px) rotate(-45deg);
	}

	.logo {
		line-height: 0;
	}

	.small-logo {
		display: block;
	}

	.small-logo :global(svg) {
		width: auto;
		height: 36px;
	}

	.big-logo {
		display: none;
	}

	.big-logo :global(svg) {
		height: 42px;
		width: auto;
	}

	/* ─── Sidebar ────────────────────────────────────────────────── */
	.sidebar {
		position: fixed;
		/* height: 100% dépend du containing block (peut être le header sticky
		   sur Safari/iOS), ce qui réduit la sidebar à ~60px. On utilise une
		   unité viewport absolue qui n'en dépend pas. */
		height: 100vh;
		height: 100dvh;
		width: min(22rem, 100%);
		background: var(--bg);
		top: 0;
		right: 0;
		transform: translateX(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1000;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.35);
		z-index: 999;
		backdrop-filter: blur(2px);
	}

	.sidebar-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.1rem 1.5rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.07);
		background: white;
		flex-shrink: 0;
		z-index: 10;
	}

	.sidebar-logo {
		line-height: 0;
		display: block;
	}

	.close-btn {
		background: var(--btn-alt-bg);
		border: none;
		border-radius: 0.45rem;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background 0.15s,
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		flex-shrink: 0;
	}

	.close-btn:hover {
		background: var(--btn-alt-hover-bg);
		transform: rotate(90deg);
	}

	/* ─── Sidebar sections ──────────────────────────────────────── */
	.sidebar-links {
		display: flex;
		flex-direction: column;
		padding: 0.75rem 1.5rem 2rem;
		flex: 1;
		overflow-y: auto;
		min-height: 0;
	}

	.sidebar-section {
		padding: 0.875rem 0 0.5rem;
		border-bottom: 1px solid var(--border);
	}

	.sidebar-section:last-of-type {
		border-bottom: none;
	}

	.sidebar-section-label {
		font-family: var(--font-heading);
		font-size: 0.67rem;
		font-weight: 700;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--text-secondary);
		margin: 0 0 0.4rem;
	}

	.sidebar-subsection {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.sidebar-subsection a {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		text-decoration: none;
		font-size: 0.95rem;
		font-family: var(--font-heading);
		font-weight: 600;
		color: var(--text);
		padding: 0.4rem 0.6rem;
		border-radius: 0.45rem;
		transition:
			background 0.1s,
			color 0.1s;
	}

	.sidebar-subsection a:hover,
	.sidebar-subsection a.active {
		background: rgba(255, 148, 22, 0.1);
		color: var(--brand);
	}

	.ext-icon {
		opacity: 0.4;
		flex-shrink: 0;
	}

	/* ─── Sidebar CTAs ──────────────────────────────────────────── */
	.sidebar-actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.sidebar-cta {
		display: block;
		text-decoration: none;
		text-align: center;
		background: var(--brand);
		color: white;
		border-radius: 0.625rem;
		padding: 0.8rem 1.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1rem;
		transition: opacity 0.15s;
	}

	.sidebar-cta:hover {
		opacity: 0.85;
	}

	.sidebar-join {
		display: block;
		text-decoration: none;
		background: var(--black);
		color: var(--white);
		text-align: center;
		padding: 0.8rem 1.5rem;
		border-radius: 0.625rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1rem;
		transition: opacity 0.15s;
	}

	.sidebar-join:hover {
		opacity: 0.85;
	}

	/* ─── Responsive ─────────────────────────────────────────────── */
	@media (min-width: 640px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}

		nav {
			padding: 0.85rem 2rem;
		}

		nav.scrolled {
			padding-top: 0.6rem;
			padding-bottom: 0.6rem;
		}
	}

	@media (min-width: 768px) {
		nav {
			padding: 1.25rem 4rem;
		}

		nav.scrolled {
			padding-top: 0.7rem;
			padding-bottom: 0.7rem;
		}
	}

	@media (min-width: 1024px) {
		.nav-links {
			display: flex;
		}

		.hamburger,
		.sidebar,
		.sidebar-backdrop {
			display: none;
		}

		nav {
			padding: 1.25rem 6rem;
		}

		nav.scrolled {
			padding-top: 0.7rem;
			padding-bottom: 0.7rem;
		}
	}

	@media (min-width: 1280px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}
	}

	/* ─── Dark mode overrides ────────────────────────────────── */
	:global([data-theme='dark']) .site-header.scrolled {
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
	}

	:global([data-theme='dark']) .sidebar-theme-toggle {
		background: rgba(255, 255, 255, 0.07);
		color: var(--text);
	}

	:global([data-theme='dark']) .theme-toggle:hover {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
