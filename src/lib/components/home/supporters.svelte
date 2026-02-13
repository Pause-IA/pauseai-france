<script lang="ts">
	import SupporterCard from '$components/SupporterCard.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { onMount } from 'svelte'
	/* eslint-disable @typescript-eslint/ban-ts-comment */
	//@ts-expect-error some issue with the language server is preventing @sveltejs/enhanced-img ambient types from working
	import ImageJPerret from '$assets/supporters/J_Perret.jpg?enhanced'
	//@ts-expect-error
	import ImageSAmarsy from '$assets/supporters/S_Amarsy.jpg?enhanced'
	//@ts-expect-error
	import ImageCdeLaHiguera from '$assets/supporters/C_de_la_Higuera.jpg?enhanced'
	/* eslint-enable @typescript-eslint/ban-ts-comment */

	const label_id = 'articles-title'

	/* eslint-disable @typescript-eslint/no-unsafe-assignment */
	const supporters = [
		{
			name: 'Jérémy Perret',
			blurb: 'Suboptimal IA Docteur et ingénieur en intelligence artificielle',
			image: ImageJPerret,
			url: 'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-perret-b22a72b9/'
		},
		{
			name: 'Stéphane Amarsy',
			blurb: 'PDG The Next Mind Intelligence artificielle',
			image: ImageSAmarsy,
			url: 'https://www.linkedin.com/in/stephane-amarsy/'
		},
		{
			name: 'Colin de la Higuera',
			blurb:
				'Chaire Unesco en Ressources Educatives Libres et Intelligence Artificielle à Nantes Université',
			image: ImageCdeLaHiguera,
			url: 'https://www.linkedin.com/in/colin-de-la-higuera-3b30aa62/'
		}
	]
	/* eslint-enable @typescript-eslint/no-unsafe-assignment */

	const secondsPerLogo = 5
	$: animationDuration = secondsPerLogo * supporters.length
	let containerRef: HTMLDivElement
	let needsAnimation = false

	onMount(() => {
		const observer = new ResizeObserver(() => {
			const container = containerRef
			const singleSet = container.firstElementChild as HTMLElement
			// ignore margins
			const containerWidth = containerRef.parentElement?.clientWidth ?? 0

			// Compare the width of a single set of items against the container width
			needsAnimation = singleSet.scrollWidth > containerWidth
		})

		observer.observe(containerRef)

		return () => {
			observer.disconnect()
		}
	})
</script>

<!--
<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Nos soutiens</UnderlinedTitle>
	<div
		bind:this={containerRef}
		class="logos"
		class:animate={needsAnimation}
		style="--animation-duration: {animationDuration}s;"
	>
		<div class="logo_items">
			{#each supporters as supporter}
				<SupporterCard
					name={supporter.name}
					blurb={supporter.blurb}
					image={supporter.image}
					url={supporter.url}
				/>
			{/each}
		</div>

		{#if needsAnimation}
			<div class="logo_items">
				{#each supporters as supporter}
					<SupporterCard
						name={supporter.name}
						blurb={supporter.blurb}
						image={supporter.image}
						url={supporter.url}
					/>
				{/each}
			</div>
		{/if}
	</div>
</section>
-->

<style>
	@keyframes slides {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(-100% - 1rem));
		}
	}

	.logos {
		overflow: hidden;
		position: relative;
		display: flex;
		gap: 1rem;
	}

	.logos.animate {
		margin-left: -1rem;
		margin-right: -1rem;
	}

	@media (min-width: 640px) {
		.logos.animate {
			margin-left: -2rem;
			margin-right: -2rem;
		}
	}

	@media (min-width: 768px) {
		.logos.animate {
			margin-left: -4rem;
			margin-right: -4rem;
		}
	}
	@media (min-width: 1024px) {
		.logos.animate {
			margin-left: -6rem;
			margin-right: -6rem;
		}
	}

	.logo_items {
		display: flex;
		gap: 1rem;
	}

	.logos.animate .logo_items {
		animation: slides infinite linear;
		animation-duration: var(--animation-duration, 25s); /* fallback duration */
	}

	.logos:hover .logo_items {
		animation-play-state: paused;
	}
</style>
