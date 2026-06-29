<script lang="ts">
	import Button from '$components/Button.svelte'
	import Mark from '$components/Mark.svelte'
	import Logo from '$components/Logo.svelte'
	import LeftCorner from '$components/hero/LeftCorner.svelte'
	import RightCorner from '$components/hero/RightCorner.svelte'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import { theme } from '$lib/stores/theme'
	import { onMount, tick } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	const label_id = 'hero-title'

	export let lang: Lang = 'fr'
	$: t = getT(lang)
	$: prefix = lang === 'fr' ? '/fr' : '/en'

	// 4 rows of photos, each row scrolls in its own direction
	const row1 = [
		'/hero/tshirt-pauseai.webp',
		'/hero/senat-intro.webp',
		'/hero/pauseia-01.webp',
		'/hero/manif-12.webp',
		'/hero/manif-13.webp',
		'/hero/manif-01.webp',
		'/hero/projection-gateau.webp',
		'/hero/conf-full-room.webp',
		'/hero/manif-08.webp',
		'/hero/pauseia-08.webp',
		'/hero/fost-summit.webp',
		'/hero/event-14.webp',
		'/hero/senat-speaker2.webp',
		'/hero/event-02.webp',
		'/hero/manif-03.webp',
		'/hero/apidays-talk.webp',
		'/hero/pauseia-15.webp',
		'/hero/panneau-pauseai.webp',
		'/hero/senat-audience1.webp',
		'/hero/pauseia-09.webp'
	]
	const row2 = [
		'/hero/manif-14.webp',
		'/hero/manif-15.webp',
		'/hero/megaphone.webp',
		'/hero/senat-panel.webp',
		'/hero/manif-07.webp',
		'/hero/event-04.webp',
		'/hero/conf-audience.webp',
		'/hero/stop-course.webp',
		'/hero/event-17.webp',
		'/hero/pauseia-10.webp',
		'/hero/projection-ambiance.webp',
		'/hero/manif-02.webp',
		'/hero/event-05.webp',
		'/hero/senat-talk.webp',
		'/hero/fost-talk.webp',
		'/hero/sans-ia-sure.webp',
		'/hero/conf-presenter.webp',
		'/hero/event-06.webp',
		'/hero/manif-05.webp',
		'/hero/manif-16.webp'
	]
	const row3 = [
		'/hero/senat-orateur.webp',
		'/hero/pauseia-03.webp',
		'/hero/manif-04.webp',
		'/hero/manif-20.webp',
		'/hero/projection-discussion.webp',
		'/hero/conference-salle.webp',
		'/hero/manif-09.webp',
		'/hero/fost-speaker.webp',
		'/hero/event-08.webp',
		'/hero/panneau-rue.webp',
		'/hero/senat-salle.webp',
		'/hero/pauseia-17.webp',
		'/hero/conf-panel.webp',
		'/hero/manif-11.webp',
		'/hero/event-09.webp',
		'/hero/apidays-slide.webp',
		'/hero/senat-discussion.webp',
		'/hero/manif-17.webp',
		'/hero/manif-18.webp'
	]
	const row4 = [
		'/hero/manif-06.webp',
		'/hero/pauseia-04.webp',
		'/hero/event-22.webp',
		'/hero/senat-groupe.webp',
		'/hero/discussion.webp',
		'/hero/pauseia-14.webp',
		'/hero/conf-reprise.webp',
		'/hero/event-23.webp',
		'/hero/manif-10.webp',
		'/hero/pauseia-05.webp',
		'/hero/event-24.webp',
		'/hero/projection-conference.webp',
		'/hero/conference-speaker.webp',
		'/hero/event-25.webp',
		'/hero/senat-audience2.webp',
		'/hero/event-26.webp',
		'/hero/apidays-expo.webp',
		'/hero/conf-speaker-new.webp',
		'/hero/senat-speaker1.webp',
		'/hero/manif-19.webp',
		'/hero/manif-21.webp'
	]

	let mounted = false
	let heroTopOffset = 80 // fallback in px
	let heroBgEl: HTMLElement | null = null
	let contentBoxEl: HTMLElement | null = null
	let frostColTop = 'calc(50% - 17rem)' // CSS fallback before measurement

	function measureFrostCol() {
		if (!heroBgEl || !contentBoxEl) return
		const bgRect = heroBgEl.getBoundingClientRect()
		const boxRect = contentBoxEl.getBoundingClientRect()
		const topOffset = Math.max(0, boxRect.top - bgRect.top)
		// Start the column above the content-box for visual breathing room
		frostColTop = `${Math.max(0, topOffset - 52)}px`
	}

	onMount(() => {
		let roHeader: ResizeObserver | undefined
		let roContent: ResizeObserver | undefined

		// Wait for pending DOM updates (Header nav rendering) before measuring
		tick().then(async () => {
			const header = document.querySelector('.site-header')
			const main = document.querySelector('main')

			const measure = () => {
				if (header) {
					const headerH = header.getBoundingClientRect().height
					const mainPT = main ? parseFloat(getComputedStyle(main).paddingTop) : 0
					heroTopOffset = headerH + mainPT
				}
			}

			measure()
			mounted = true

			// Keep heroTopOffset in sync whenever the header resizes (e.g. scrolled
			// state collapses padding after SvelteKit navigation restores scroll=0)
			roHeader = new ResizeObserver(measure)
			if (header) roHeader.observe(header)

			// After hero renders (next tick), measure content-box position for the
			// frost column so it starts exactly at the top of the text block.
			await tick()
			measureFrostCol()
			roContent = new ResizeObserver(measureFrostCol)
			if (contentBoxEl) roContent.observe(contentBoxEl)
		})

		return () => {
			roHeader?.disconnect()
			roContent?.disconnect()
		}
	})
</script>

{#if mounted}
	<section
		class="hero"
		style="--hero-top-offset: -{heroTopOffset}px; --frost-col-top: {frostColTop}"
		aria-labelledby={label_id}
	>
		<div class="hero-bg" bind:this={heroBgEl} aria-hidden="true">
			<div class="marquee-container">
				<div class="marquee-row row-left">
					<div class="marquee-track">
						{#each [...row1, ...row1] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
				<div class="marquee-row row-right">
					<div class="marquee-track">
						{#each [...row2, ...row2] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
				<div class="marquee-row row-left row-slow">
					<div class="marquee-track">
						{#each [...row3, ...row3] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
				<div class="marquee-row row-right row-slow">
					<div class="marquee-track">
						{#each [...row4, ...row4] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
			</div>
			<div class="mosaic-overlay"></div>
		</div>
		<div class="frost-col" aria-hidden="true"></div>
		<div class="content" in:fade={{ duration: 500, delay: 200 }}>
			<div class="content-box" bind:this={contentBoxEl}>
				<div class="hero-logo">
					<Logo
						height={48}
						fill_pause={$theme === 'dark' ? 'white' : 'black'}
						fill_circle="#FF9416"
						fill_ai={$theme === 'dark' ? 'white' : '#FF9416'}
					/>
				</div>
				<h1 id={label_id}>
					{t.home.hero_title}
					<br /><Mark>{t.home.hero_highlight}</Mark>
				</h1>
				<div class="description">
					{#if lang === 'en'}
						<p>
							Every month, new AI systems cross thresholds we thought were far away. Experts warn:
							without guardrails, this race poses a catastrophic risk in the near term.
						</p>
						<p>The window is closing fast, let's act now.</p>
					{:else}
						<p>
							Chaque mois, de nouveaux systèmes franchissent des seuils que l'on pensait lointains.
							Les experts alertent&nbsp;: sans garde-fous, cette course fait peser un risque
							catastrophique à court terme.
						</p>
						<p>La fenêtre se referme, agissons maintenant.</p>
					{/if}
					<div class="buttons">
						<div in:fly={{ y: 20, duration: 300, delay: 700 }}>
							<Button href="{prefix}/rejoindre">{t.home.hero_cta}</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="corners">
			<LeftCorner />
			<RightCorner />
		</div>
	</section>
{/if}

<style>
	.hero {
		display: flex;
		height: 100svh; /* definite height → abs-pos children can use bottom:0 / height:% */
		min-height: 100svh; /* still grows if content is taller */
		margin-top: var(--hero-top-offset, -5rem);
		padding-top: calc(-1 * var(--hero-top-offset, -5rem));
		align-items: center;
		z-index: 0;
		position: relative;
	}

	.hero-bg {
		position: absolute;
		overflow: hidden;
		top: 0;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		z-index: -1;
		background: #fffaf5;
	}

	:global([data-theme='dark']) .hero-bg {
		background: #1a1a1a;
	}

	/* Marquee scrolling rows */
	.marquee-container {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		padding: 0;
	}

	.marquee-row {
		overflow: hidden;
		flex: 1;
		min-height: 0;
	}

	.marquee-track {
		display: flex;
		gap: 5px;
		height: 100%;
		width: max-content;
	}

	.marquee-track img {
		height: 100%;
		aspect-ratio: 4/3;
		object-fit: cover;
		display: block;
		border-radius: 6px;
		flex-shrink: 0;
		/* No filter — natural colors, overlay handles readability */
	}

	/* Scroll left — slow, contemplative */
	.row-left .marquee-track {
		animation: scroll-left 235s linear infinite;
	}

	/* Scroll right */
	.row-right .marquee-track {
		animation: scroll-right 235s linear infinite;
	}

	.row-slow .marquee-track {
		animation-duration: 300s;
	}

	@keyframes scroll-left {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@keyframes scroll-right {
		0% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(0);
		}
	}

	/* Respect user preference */
	@media (prefers-reduced-motion: reduce) {
		.row-left .marquee-track,
		.row-right .marquee-track {
			animation: none;
		}
	}

	/* Overlay: subtle gradient, readability handled by content-box backdrop */
	.mosaic-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
				to right,
				rgba(255, 250, 245, 0.6) 0%,
				rgba(255, 250, 245, 0.35) 20%,
				rgba(255, 250, 245, 0.1) 40%,
				transparent 55%
			),
			linear-gradient(
				to top,
				rgba(255, 250, 245, 0.4) 0%,
				transparent 6%,
				transparent 94%,
				rgba(255, 250, 245, 0.4) 100%
			);
		pointer-events: none;
	}

	/* Text content */
	.content {
		color: var(--text);
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 100%;
		margin-bottom: 2.5rem;
	}

	.content-box {
		max-width: 28rem;
		background: rgba(255, 250, 245, 0.82);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-radius: 16px;
		padding: 1rem 1.5rem;
	}

	.content h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.6rem;
	}

	.description {
		width: 0;
		min-width: 100%;
	}

	.description p {
		line-height: 1.5;
		margin-top: 0;
		margin-bottom: 0.6rem;
	}

	.frost-col {
		display: none; /* only visible on desktop via the 1024px media query */
	}

	.corners {
		width: 100vw;
		bottom: -1px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-bottom: 4px solid var(--brand, #ff9416);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
	}

	.buttons {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
		margin-top: 1rem;
	}

	/* ─── Mobile (< 640px) ────────────────────────────────────── */
	@media (max-width: 639px) {
		/* Pull the hero slightly into main's horizontal padding so the
		   text column is wider and easier to read on narrow phones. */
		.hero {
			padding-bottom: 2rem;
			margin-left: -0.5rem;
			margin-right: -0.5rem;
		}

		/* Sub-pixel gap insurance — extend the bg 1px above the hero box
		   so no sliver of white is visible between header and photos. */
		.hero-bg {
			top: -1px;
		}

		/* Extend the photo grid 5px beyond .hero-bg bounds on top/bottom
		   so the image border-radius is clipped by overflow:hidden and
		   no background colour peeks through at the edges. */
		.marquee-container {
			gap: 4px;
			inset: -5px 0;
		}

		.marquee-track img {
			border-radius: 4px;
		}

		/* Compact content so it fits in 100svh on small phones
		   (≥ 568px).  Target total ≈ 390px including margins. */
		.content h1 {
			font-size: 1.4rem;
			margin-bottom: 0.75rem;
		}

		.description p {
			margin-bottom: 0.5rem;
			line-height: 1.5;
		}

		.content-box {
			min-width: 17rem;
		}

		.content {
			margin-bottom: 0;
			/* The hero has asymmetric padding (large top for header
			   compensation, small bottom). This shifts the flex-centred
			   content visually downward. Nudge it back up so it sits
			   closer to the true screen centre. */
			position: relative;
			top: -3rem;
		}

		.buttons {
			margin-top: 1rem;
		}

		/* Overlay on mobile — readability handled by content-box backdrop */
		.mosaic-overlay {
			background: linear-gradient(
					to right,
					rgba(255, 250, 245, 0.5) 0%,
					rgba(255, 250, 245, 0.2) 40%,
					transparent 65%
				),
				linear-gradient(
					to top,
					rgba(255, 250, 245, 0.5) 0%,
					transparent 8%,
					transparent 92%,
					rgba(255, 250, 245, 0.5) 100%
				);
		}

		.content-box {
			padding: 0.75rem 1rem;
		}
	}

	@media (min-width: 480px) {
		.buttons {
			flex-direction: row;
		}
	}

	@media (min-width: 640px) {
		.content {
			margin-bottom: 2.5rem;
		}

		.content h1 {
			margin-bottom: 1.25rem;
			font-size: 1.9rem;
		}
	}

	@media (min-width: 768px) {
		.content h1 {
			font-size: 2.1rem;
		}
		.marquee-container {
			gap: 6px;
		}
		.marquee-track {
			gap: 6px;
		}
		.marquee-track img {
			border-radius: 8px;
		}
	}

	@media (min-width: 1024px) {
		.content h1 {
			font-size: 2.2rem;
		}

		.description p {
			font-size: 1.18rem;
		}

		/* Frosted glass column: sits directly in .hero (no overflow:hidden parent)
		   so bottom:0 reliably reaches the hero's bottom edge.
		   JS measures the exact content-box top → --frost-col-top.
		   z-index keeps it above hero-bg (-1) but below .content (auto/later in DOM). */
		.frost-col {
			display: block;
			position: absolute;
			top: var(--frost-col-top, calc(50% - 14rem));
			bottom: 0;
			/* left:0 = hero's left edge, which is already at main's padding-left (6rem
			   from viewport). Adding 6rem here would double the offset. */
			left: 0;
			width: calc(27rem + 3rem); /* content-box max-width + 2 × 1.5rem padding */
			background: rgba(255, 250, 245, 0.82);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			border-radius: 16px 16px 0 0;
			pointer-events: none;
			/* z-index:-1 puts frost-col at paint step 2 (negative stacking contexts),
			   while .content (in-flow flex item) is painted at step 3 → text on top. */
			z-index: -1;
		}

		/* Content-box: the visual background is now the column behind it.
		   Keep padding for text spacing, strip own backdrop/bg. */
		.content-box {
			background: none;
			backdrop-filter: none;
			-webkit-backdrop-filter: none;
			border-radius: 0;
			padding: 1rem 1.5rem;
			max-width: 27rem; /* fill the column */
		}

		/* Lighter gradient: frosted column ensures readability on the left */
		.mosaic-overlay {
			background: linear-gradient(
					to right,
					rgba(255, 250, 245, 0.5) 0%,
					rgba(255, 250, 245, 0.2) 22%,
					transparent 46%
				),
				linear-gradient(
					to top,
					rgba(255, 250, 245, 0.4) 0%,
					transparent 6%,
					transparent 94%,
					rgba(255, 250, 245, 0.4) 100%
				);
		}
	}

	@media (min-width: 1280px) {
		.content h1 {
			font-size: 2.6rem;
		}
	}

	/* ─── Logo dans le hero ──────────────────────────────────── */
	.hero-logo {
		margin-bottom: 1.5rem;
	}

	/* ─── Dark mode ──────────────────────────────────────────── */
	:global([data-theme='dark']) .mosaic-overlay {
		background: linear-gradient(
				to right,
				rgba(26, 26, 26, 0.97) 0%,
				rgba(26, 26, 26, 0.92) 12%,
				rgba(26, 26, 26, 0.55) 25%,
				rgba(26, 26, 26, 0.1) 38%,
				transparent 48%
			),
			linear-gradient(
				to top,
				rgba(26, 26, 26, 0.4) 0%,
				transparent 6%,
				transparent 94%,
				rgba(26, 26, 26, 0.4) 100%
			);
	}

	@media (max-width: 639px) {
		:global([data-theme='dark']) .mosaic-overlay {
			background: linear-gradient(
					to right,
					rgba(26, 26, 26, 0.98) 0%,
					rgba(26, 26, 26, 0.93) 15%,
					rgba(26, 26, 26, 0.65) 35%,
					rgba(26, 26, 26, 0.15) 55%,
					transparent 65%
				),
				linear-gradient(
					to top,
					rgba(26, 26, 26, 0.5) 0%,
					transparent 8%,
					transparent 92%,
					rgba(26, 26, 26, 0.5) 100%
				);
		}
	}

	/* Dark mode: content box (mobile/tablet) needs a dark background.
	   Light text (--text = #f0f0f0) on the default cream rgba(255,250,245,0.82)
	   is almost invisible. At ≥1024px the frost-col provides the backdrop instead. */
	@media (max-width: 1023px) {
		:global([data-theme='dark']) .content-box {
			background: rgba(30, 30, 30, 0.9);
		}
	}

	@media (min-width: 1024px) {
		:global([data-theme='dark']) .frost-col {
			background: rgba(30, 30, 30, 0.9);
		}
	}
</style>
