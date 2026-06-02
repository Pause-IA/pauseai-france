<script lang="ts">
	import { slide, fade } from 'svelte/transition'
	import { page } from '$app/stores'
	import { faqBulkAction } from '$lib/stores/faq'
	import { onMount } from 'svelte'
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
			if ($faqBulkAction.action === 'expand') open = true
			else if ($faqBulkAction.action === 'collapse') open = false
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
	:global(div.inView:not(:last-child)) > .accordion {
		border-bottom: solid 2px var(--border);
	}

	.header {
		cursor: pointer;
		display: flex;
		width: 100%;
		border: none;
		background-color: transparent;
		text-align: left;
		align-items: center;
		padding: 1.5rem 0;
	}

	.header .title {
		flex: 1;
	}

	.details {
		padding: 1rem 1.5rem 1.5rem 1.5rem;
		margin: 0.25rem 0.5rem 1rem 0.5rem;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.08),
			0 4px 12px rgba(0, 0, 0, 0.06);
		text-align: justify;
	}

	.chevron {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 1rem;
		color: var(--text-secondary);
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
