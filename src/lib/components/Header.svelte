<script lang="ts">
	import NavDropdown from '$components/NavDropdown.svelte'
	import Logo from '$components/Logo.svelte'
	import { page } from '$app/stores'
	import Banner from '$components/Banner.svelte'
	import { bannerStore } from '$lib/stores/banner'

	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	$: onHomepage = $page.url.pathname == '/'
	$: onEmploiePage = /^\/emploi-ia(?:\/|$)/.test($page.url.pathname)

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

	const navGroups = [
		{
			id: 'comprendre',
			label: 'Comprendre',
			items: [
				{ href: '/dangers', label: "Les dangers de l'IA" },
				{ href: '/emploi-ia', label: 'Emploi et IA' },
				{ href: '/newsletters', label: 'Newsletter' },
				{ href: '/propositions', label: 'Nos propositions' },
				{ href: 'https://pauseia.substack.com/', label: 'Blog', external: true }
			]
		},
		{
			id: 'agir',
			label: 'Agir',
			items: [
				{ href: '/agir', label: 'Comment agir ?' },
				{ href: '/groupes-locaux', label: 'Groupes locaux' }
			]
		},
		{
			id: 'campagnes',
			label: 'Campagnes',
			items: [{ href: '/municipales-2026', label: 'Municipales 2026' }]
		},
		{
			id: 'evenements',
			label: 'Événements',
			items: [
				{ href: '/senat2025', label: 'Colloque Sénat 2025' },
				{
					href: 'https://controleia.org/solutions/',
					label: 'Forum solutions 2025',
					external: true
				}
			]
		},
		{
			id: 'apropos',
			label: 'À propos',
			items: [
				{ href: '/qui-sommes-nous', label: 'Qui sommes-nous ?' },
				{ href: '/propositions', label: 'Nos propositions' },
				{ href: '/presse', label: 'Espace presse' }
			]
		}
	]
</script>

<!--
  Wrapping Banner + nav in a single <header> solves two issues:
  1. The layout grid sees ONE element (auto row), so main gets the 1fr row correctly.
  2. The Banner lives in the same sticky context as the nav — no z-index collision.
  Banner slides away via max-height CSS transition once the user scrolls.
-->
<header class="site-header" class:scrolled>
	<!-- Banner: hidden via CSS when scrolled, without touching its internal dismiss state -->
	<div class="banner-wrapper" class:scrolled>
		<Banner visible={$bannerStore.visible}>
			{$bannerStore.message}
			{#if $bannerStore.linkUrl}
				<a href={$bannerStore.linkUrl}>{$bannerStore.linkText}</a>
			{/if}
		</Banner>
	</div>

	{#if mounted || !onHomepage}
		<nav in:fade={{ duration: 400, delay: 100 }} class:scrolled class:homepage={onHomepage}>
			<a href={onEmploiePage ? '/emploi-ia' : '/'} class="logo">
				<div class="big-logo">
					<Logo
						animate
						fill_pause={onHomepage && !scrolled ? 'white' : 'black'}
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
						<NavDropdown label={group.label} items={group.items} white={onHomepage && !scrolled} />
					{/each}
					<!-- Séparateur vertical -->
					<div
						class="nav-separator"
						class:on-hero={onHomepage && !scrolled}
						aria-hidden="true"
					></div>
					<!-- CTAs -->
					<div class="nav-ctas">
						<a href="/dons" class="btn-donate" class:on-hero={onHomepage && !scrolled}>Donner</a>
						<a href="/rejoindre" class="btn-join" class:on-hero={onHomepage && !scrolled}
							>Rejoindre</a
						>
					</div>
				</div>
				<button aria-label="Open mobile menu" class="hamburger" on:click={() => (open = !open)}>
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							y="0"
							height="2.5"
							width="24"
							fill={onHomepage && !scrolled ? 'white' : 'black'}
						/>
						<rect
							y="10.75"
							height="2.5"
							width="24"
							fill={onHomepage && !scrolled ? 'white' : 'black'}
						/>
						<rect
							y="21.5"
							height="2.5"
							width="24"
							fill={onHomepage && !scrolled ? 'white' : 'black'}
						/>
					</svg>
				</button>
			</div>

			<!-- Mobile/tablet sidebar — use:portal pour l'appender à document.body
			     et l'extraire du containing block créé par position:sticky -->
			<div class="sidebar" class:open use:portal>
				<div class="sidebar-head">
					<a href="/" class="sidebar-logo" on:click={closeMenu}>
						<Logo height={36} fill_pause="black" fill_circle="#FF9416" fill_ai="black" />
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
								stroke="black"
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
						<a href="/dons" class="sidebar-cta" on:click={closeMenu}>Faire un don</a>
						<a href="/rejoindre" class="sidebar-join" on:click={closeMenu}>Nous rejoindre</a>
					</div>
				</div>
			</div>

			{#if open}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="sidebar-backdrop"
					on:click={closeMenu}
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
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
		transition:
			background-color 0.25s ease,
			box-shadow 0.25s ease,
			border-color 0.25s ease;
	}

	.site-header.scrolled {
		background: white;
		border-bottom-color: rgba(0, 0, 0, 0.1);
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
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

	/* ─── Nav ────────────────────────────────────────────────────── */
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.65rem 1rem;
		transition: padding 0.25s ease;
	}

	/* Compact nav when scrolled */
	nav.scrolled {
		padding-top: 0.35rem;
		padding-bottom: 0.35rem;
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
		background: rgba(0, 0, 0, 0.18);
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
		background: black;
		color: white;
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

	.hamburger {
		display: flex;
		align-items: center;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
	}

	.logo {
		line-height: 0;
	}

	.small-logo {
		display: block;
	}

	.small-logo :global(svg) {
		width: 3rem;
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
		background: #fff;
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
		background: rgba(0, 0, 0, 0.06);
		border: none;
		border-radius: 0.45rem;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.15s;
		flex-shrink: 0;
	}

	.close-btn:hover {
		background: rgba(0, 0, 0, 0.1);
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
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
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
		color: rgba(0, 0, 0, 0.38);
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
		color: rgba(0, 0, 0, 0.78);
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
		background: black;
		color: white;
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
	@media (min-width: 480px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}
	}

	@media (min-width: 640px) {
		nav {
			padding: 0.75rem 2rem;
		}

		nav.scrolled {
			padding-top: 0.5rem;
			padding-bottom: 0.5rem;
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
</style>
