<script lang="ts">
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'
	import { temoignagesEmploi, type TemoignageEmploi } from '$lib/data/temoignages-emploi'

	export let lang: Lang = 'fr'

	$: t = getT(lang)

	// Diaporama des témoignages illustrés (préparés pour les réseaux sociaux).
	// Pour ajouter un témoignage : déposez le fichier image dans
	// src/assets/emploi-ia/temoignages/ (repris automatiquement, trié par nom),
	// et ajoutez ses métadonnées dans src/lib/data/temoignages-emploi.ts pour
	// que la citation soit accessible (lecteurs d'écran) et indexable (SEO).
	const modules = import.meta.glob<string>(
		'../../assets/emploi-ia/temoignages/*.{svg,png,jpg,jpeg,webp,avif}',
		{ eager: true, import: 'default' }
	)

	interface Slide {
		url: string
		meta?: TemoignageEmploi
	}

	const metaByFile = new Map(temoignagesEmploi.map((item) => [item.file, item]))

	const slides: Slide[] = Object.keys(modules)
		.sort()
		.map((path) => ({
			url: modules[path],
			meta: metaByFile.get(path.split('/').pop() ?? '')
		}))

	let current = 0
	let zoomed = false

	$: currentSlide = slides[current]
	$: currentAlt = currentSlide.meta
		? `${currentSlide.meta.name}, ${currentSlide.meta.role} : « ${currentSlide.meta.quote} »`
		: `${t.emploi_ia.slideshow_alt} ${current + 1}`

	const goTo = (index: number) => {
		if (!slides.length) return
		const total = slides.length
		current = ((index % total) + total) % total
	}

	const previous = () => {
		goTo(current - 1)
	}
	const next = () => {
		goTo(current + 1)
	}

	const openZoom = () => (zoomed = true)
	const closeZoom = () => (zoomed = false)

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') closeZoom()
		else if (event.key === 'ArrowLeft') previous()
		else if (event.key === 'ArrowRight') next()
	}

	// Balayage tactile (mobile) dans la vue plein écran.
	let touchStartX: number | null = null
	const onTouchStart = (event: TouchEvent) => {
		touchStartX = event.changedTouches[0].clientX
	}
	const onTouchEnd = (event: TouchEvent) => {
		if (touchStartX === null) return
		const dx = event.changedTouches[0].clientX - touchStartX
		if (Math.abs(dx) > 40) {
			if (dx < 0) next()
			else previous()
		}
		touchStartX = null
	}
</script>

<svelte:window on:keydown={zoomed ? handleKeydown : undefined} />

<section class="slideshow" aria-roledescription="carousel">
	{#if slides.length}
		<figure class="slide" aria-live="polite">
			<div class="slide-frame" on:touchstart={onTouchStart} on:touchend={onTouchEnd}>
				<button
					type="button"
					class="zoom-trigger"
					on:click={openZoom}
					title={t.emploi_ia.slideshow_zoom}
				>
					<img src={currentSlide.url} alt={currentAlt} decoding="async" />
					<span class="zoom-hint" aria-hidden="true">⤢ {t.emploi_ia.slideshow_zoom}</span>
				</button>

				{#if slides.length > 1}
					<button
						type="button"
						class="nav-arrow nav-prev"
						on:click={previous}
						aria-label={t.emploi_ia.slideshow_prev}
					>
						‹
					</button>
					<button
						type="button"
						class="nav-arrow nav-next"
						on:click={next}
						aria-label={t.emploi_ia.slideshow_next}
					>
						›
					</button>
				{/if}
			</div>

			<figcaption class="slide-caption">
				{#if currentSlide.meta}
					<span class="attribution">
						{currentSlide.meta.name}, {currentSlide.meta.age} ans · {currentSlide.meta.role}
					</span>
				{/if}
				<span class="counter">{current + 1} / {slides.length}</span>
			</figcaption>
		</figure>
	{:else}
		<p class="empty">{t.emploi_ia.slideshow_empty}</p>
	{/if}
</section>

{#if zoomed}
	<!-- Vue plein écran pour lire les cartes chargées en texte.
	     Navigation : flèches ‹ ›, clavier ← →, balayage tactile.
	     Fermeture : clic sur le fond, bouton ×, ou touche Échap. -->
	<!-- Le clavier est géré au niveau de la fenêtre (Échap ferme, ← → naviguent)
	     et par les boutons ci-dessous ; ce fond ne fait que doubler ces chemins
	     à la souris et au doigt. -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={t.emploi_ia.slideshow_alt}
		on:click={closeZoom}
		on:touchstart={onTouchStart}
		on:touchend={onTouchEnd}
	>
		<button
			type="button"
			class="lightbox-close"
			on:click={closeZoom}
			aria-label={t.emploi_ia.slideshow_close}
		>
			×
		</button>

		{#if slides.length > 1}
			<button
				type="button"
				class="lightbox-arrow lightbox-prev"
				on:click|stopPropagation={previous}
				aria-label={t.emploi_ia.slideshow_prev}
			>
				‹
			</button>
		{/if}

		<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
		<img class="lightbox-img" src={currentSlide.url} alt={currentAlt} on:click|stopPropagation />

		{#if slides.length > 1}
			<button
				type="button"
				class="lightbox-arrow lightbox-next"
				on:click|stopPropagation={next}
				aria-label={t.emploi_ia.slideshow_next}
			>
				›
			</button>
		{/if}

		<span class="lightbox-counter">{current + 1} / {slides.length}</span>
	</div>
{/if}

<style>
	.slideshow {
		margin: 2rem 0 1rem;
	}

	.slide {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}

	.slide-frame {
		position: relative;
		width: 100%;
		max-width: 500px;
	}

	.zoom-trigger {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
		position: relative;
		border-radius: var(--radius-lg);
	}

	/* Flèches de navigation, sur les bords de la carte + balayage tactile. */
	.nav-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 2.75rem;
		height: 2.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.9rem;
		line-height: 1;
		padding-bottom: 0.2rem;
		color: var(--accent);
		background: rgba(var(--on-dark-rgb), 0.92);
		border: 1px solid var(--border);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 8px rgba(var(--ink-rgb), 0.12);
		transition:
			background 0.15s,
			color 0.15s,
			transform 0.15s;
	}

	.nav-arrow:hover {
		background: var(--brand);
		color: var(--on-brand);
		transform: translateY(-50%) scale(1.05);
	}

	.nav-prev {
		left: -0.6rem;
	}

	.nav-next {
		right: -0.6rem;
	}

	@media (max-width: 700px) {
		.nav-prev {
			left: 0.4rem;
		}
		.nav-next {
			right: 0.4rem;
		}
	}

	.zoom-trigger img {
		width: 100%;
		/* Les 19 visuels sont carrés (1080×1080). On réserve la place pour
		   éviter que la mise en page ne saute pendant le chargement d'une image. */
		aspect-ratio: 1 / 1;
		height: auto;
		object-fit: cover;
		border-radius: var(--radius-lg);
		border: 1px solid var(--border);
		display: block;
		background: var(--bg);
	}

	.zoom-hint {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--on-dark);
		background: rgba(var(--ink-rgb), 0.6);
		padding: 0.3rem 0.55rem;
		border-radius: var(--radius-sm);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.zoom-trigger:hover .zoom-hint,
	.zoom-trigger:focus-visible .zoom-hint {
		opacity: 1;
	}

	.slide-caption {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		text-align: center;
	}

	.attribution {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--accent);
	}

	.counter {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.empty {
		margin: 0;
		text-align: center;
		font-size: 1rem;
		color: var(--text-secondary);
		padding: 2rem 1rem;
	}

	/* ── Lightbox plein écran ── */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(var(--ink-rgb), 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		overflow: auto;
		cursor: zoom-out;
	}

	.lightbox-img {
		width: min(90vh, 100%);
		aspect-ratio: 1 / 1;
		height: auto;
		max-height: 95vh;
		object-fit: contain;
		border-radius: var(--radius-sm);
		background: var(--bg-card);
		cursor: default;
	}

	.lightbox-close {
		position: fixed;
		top: 1rem;
		right: 1.25rem;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.8rem;
		line-height: 1;
		color: var(--on-dark);
		background: rgba(var(--on-dark-rgb), 0.15);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-close:hover {
		background: rgba(var(--on-dark-rgb), 0.3);
	}

	.lightbox-arrow {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		width: 3rem;
		height: 3rem;
		font-size: 2rem;
		line-height: 1;
		color: var(--on-dark);
		background: rgba(var(--on-dark-rgb), 0.15);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 0.2rem;
	}

	.lightbox-arrow:hover {
		background: rgba(var(--on-dark-rgb), 0.3);
	}

	.lightbox-prev {
		left: 0.75rem;
	}

	.lightbox-next {
		right: 0.75rem;
	}

	.lightbox-counter {
		position: fixed;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		color: var(--on-dark);
		font-size: 0.9rem;
		font-weight: 600;
		background: rgba(var(--ink-rgb), 0.5);
		padding: 0.35rem 0.8rem;
		border-radius: var(--radius-pill);
	}
</style>
