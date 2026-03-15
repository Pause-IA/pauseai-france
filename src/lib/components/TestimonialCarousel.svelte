<script lang="ts">
	import CarouselNavigation from '$components/CarouselNavigation.svelte'
	import { formatFrenchDate, formatDate } from '$lib/utils'
	import type { Testimonial } from '$lib/types'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let testimonials: Testimonial[] = []
	export let lang: Lang = 'fr'

	$: t = getT(lang)

	let current = 0

	const goTo = (index: number) => {
		if (!testimonials.length) {
			return
		}

		const total = testimonials.length
		current = ((index % total) + total) % total
	}

	const previous = () => {
		goTo(current - 1)
	}

	const next = () => {
		goTo(current + 1)
	}

	let currentTestimonial: Testimonial | null = null
	let formattedDate = ''

	$: navItems = testimonials.map(() => ({
		label: t.emploi_ia.carousel_other
	}))

	const handleSelect = (event: CustomEvent<{ index: number }>) => {
		goTo(event.detail.index)
	}

	$: {
		if (testimonials.length) {
			const inBounds = current >= 0 && current < testimonials.length
			const item = inBounds ? testimonials[current] : null
			currentTestimonial = item
			formattedDate = item?.date ? formatDate(item.date, lang) : ''
		} else {
			currentTestimonial = null
			formattedDate = ''
		}
	}
</script>

<section class="carousel" aria-roledescription="carousel">
	{#if currentTestimonial}
		{#key current}
			<article class="slide" aria-live="polite">
				<div class="scrollable">
					<header class="heading">
						<h3>
							{#if currentTestimonial.name}
								{currentTestimonial.name},
							{/if}
							{#if Number(currentTestimonial.age) && currentTestimonial.name}
								{currentTestimonial.age} {t.emploi_ia.carousel_age},
							{/if}
							{#if currentTestimonial.job}
								{currentTestimonial.job}
							{/if}
						</h3>
						<p class="date">{formattedDate}</p>
					</header>
					<p class="testimony">{currentTestimonial.testimony}</p>
				</div>
			</article>
		{/key}
	{:else}
		<p class="empty">{t.emploi_ia.carousel_empty}</p>
	{/if}

	<CarouselNavigation
		items={navItems}
		{current}
		ariaLabel={t.emploi_ia.carousel_nav_aria}
		previousLabel={t.emploi_ia.carousel_prev}
		nextLabel={t.emploi_ia.carousel_next}
		showArrows={testimonials.length > 1}
		showDots={testimonials.length > 1}
		on:previous={previous}
		on:next={next}
		on:select={handleSelect}
	/>
</section>

<style>
	:global(body) {
		--carousel-background: var(--bg-subtle);
		--carousel-border: #d9c7b0;
		--carousel-text: var(--text);
		--carousel-accent: #ff9416;
	}

	:global([data-theme='dark']) {
		--carousel-border: var(--border);
	}

	.slide {
		background: var(--bg);
		border-radius: 18px;
		border: 1px solid var(--carousel-border, #d9c7b0);
		padding: 2rem 2.4rem;
		min-height: 220px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 300px;
	}

	.scrollable {
		overflow-y: auto; /* show scrollbar only when needed */
		overflow-x: hidden; /* prevent horizontal scroll */
		/* optional: limit height so vertical scrolling happens only when content is taller */
		/* max-height: 220px; */
	}

	.heading {
		margin-bottom: 1.2rem;
	}

	h3 {
		font-size: 1.35rem;
		font-weight: 500;
		margin: 0;
		color: var(--carousel-text);
	}

	.date {
		margin: 0.35rem 0 0;
		font-size: 0.92rem;
		color: var(--text-secondary);
	}

	.testimony {
		margin: 0;
		line-height: 1.55;
		font-size: 1rem;
	}

	.empty {
		margin: 0;
		text-align: center;
		font-size: 1rem;
	}

	@media (max-width: 600px) {
		.carousel {
			padding: 2rem 1rem 1.75rem;
		}

		.slide {
			padding: 1.5rem 1.4rem;
			height: 500px;
		}

		h3 {
			font-size: 1.2rem;
		}
	}

	section {
		margin: 2rem 0 1rem;
	}

	section:not(:last-child) {
		margin: 2rem 0 5rem;
	}
</style>
