<script lang="ts">
	import { slide, fade } from 'svelte/transition'
	import { page } from '$app/stores'
	import { faqBulkAction } from '$lib/stores/faq'
	import Fly from './Fly.svelte'

	export let open = false
	export let id: string
	export let noHash = false

	const details_id = `${id}-details`
	const title_id = `${id}-title`

	const handleClick = () => {
		open = !open
		// Update URL hash for deep-linking
		if (!noHash && typeof window !== 'undefined') {
			if (open) {
				history.replaceState(null, '', `#${id}`)
			} else {
				history.replaceState(null, '', window.location.pathname)
			}
		}
	}

	$: if (!noHash && $page.url.hash === `#${id}`) {
		open = true
	}

	// React to expand/collapse all signals
	let lastProcessedTs = 0
	$: {
		if ($faqBulkAction.ts > lastProcessedTs) {
			lastProcessedTs = $faqBulkAction.ts
			open = $faqBulkAction.action === 'expand'
		}
	}
</script>

<Fly>
	<div class="accordion" {id}>
		<button on:click={handleClick} class="header" aria-expanded={open} aria-controls={details_id}>
			<h3 class="title" id={title_id}>
				<slot name="head" />
			</h3>

			<span class="chevron" class:chevron-open={open}>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M5 7.5L10 12.5L15 7.5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</button>
		{#if open}
			<div class="details" transition:slide id={details_id} aria-labelledby={title_id}>
				<div transition:fade={{ duration: 500 }}>
					<slot name="details" />
				</div>
			</div>
		{/if}
	</div>
</Fly>

<style>
	/* Style repris de la note aux décideurs, où l'accordéon était volontairement
	   plat : des filets fins, pas de carte.

	   L'ancien panneau était un encadré complet — fond, bordure, rayon et deux
	   ombres portées — posé sous un titre déjà séparé par un trait gris de 2 px.
	   Ouvert, il donnait une boîte qui saute à l'œil ; fermée, une liste de
	   traits gris. On garde le filet, en orange de marque et en 1 px, et la
	   réponse coule sous la question au lieu d'être emboîtée. */
	:global(div.inView:not(:last-child)) > .accordion {
		border-bottom: 1px solid rgba(var(--brand-rgb), 0.4);
	}

	.header {
		cursor: pointer;
		display: flex;
		width: 100%;
		border: none;
		background-color: transparent;
		text-align: left;
		align-items: baseline;
		gap: 1rem;
		padding: 1.15rem 0;
		color: inherit;
	}

	.header .title {
		flex: 1;
		font-weight: 600;
		line-height: 1.35;
	}

	.header:hover .title,
	.header:focus-visible .title {
		color: var(--accent);
	}

	.details {
		padding: 0 0 1.35rem;
		color: var(--text-2);
	}

	.details :global(p:last-child) {
		margin-bottom: 0;
	}

	.chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--accent);
		transition: transform 0.3s ease;
		flex-shrink: 0;
	}

	.chevron-open {
		transform: rotate(180deg);
	}

	h3 {
		margin: 0;
	}
</style>
