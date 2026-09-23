<script lang="ts">
	// Carte d'un signataire de la déclaration : nom, titre, pays et message.
	// Le message est replié à quelques lignes ; « Lire la suite » n'apparaît que
	// s'il dépasse réellement (mesuré, pas estimé au nombre de caractères).
	import { onMount } from 'svelte'
	import { countryLabel } from '$lib/countries'
	import type { Entry } from '$lib/declaration'

	export let signatory: Entry
	export let lang: 'fr' | 'en'
	/** Masque le pays (quand la liste est déjà filtrée sur ce pays). */
	export let hideCountry = false

	$: isEn = lang === 'en'
	$: meta = [
		signatory.title,
		!hideCountry && signatory.country ? countryLabel(signatory.country, lang) : undefined
	].filter(Boolean)

	let text: HTMLElement | undefined
	let expanded = false
	let overflowing = false

	function measure() {
		if (text && !expanded) overflowing = text.scrollHeight > text.clientHeight + 1
	}

	onMount(() => {
		measure()
		const ro = new ResizeObserver(measure)
		if (text) ro.observe(text)
		return () => {
			ro.disconnect()
		}
	})
</script>

<li class="signatory" class:with-comment={signatory.comment}>
	<p class="name" class:anonymous={signatory.anonymous} class:global={!signatory.local}>
		{signatory.anonymous ? (isEn ? 'Anonymous' : 'Anonyme') : signatory.name}
	</p>
	{#if meta.length}<p class="meta">{meta.join(' · ')}</p>{/if}
	{#if signatory.comment}
		<p class="comment" class:clamped={!expanded} bind:this={text}>{signatory.comment}</p>
		{#if overflowing || expanded}
			<button
				type="button"
				class="more"
				aria-expanded={expanded}
				on:click={() => {
					expanded = !expanded
					if (!expanded) measure()
				}}
			>
				{#if expanded}
					{isEn ? 'Show less' : 'Réduire'}
				{:else}
					{isEn ? 'Read more' : 'Lire la suite'}
				{/if}
			</button>
		{/if}
	{/if}
</li>

<style>
	.signatory {
		break-inside: avoid;
		margin: 0 0 1rem;
		padding: 1rem 1.2rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
	}

	.name {
		margin: 0;
		font-weight: 700;
		line-height: 1.3;
	}

	/* Comme sur pauseai.info : noms saisis librement, mis en capitales initiales. */
	.global {
		text-transform: capitalize;
	}

	.anonymous {
		font-style: italic;
		color: var(--text-2);
	}

	.meta {
		margin: 0.15rem 0 0;
		color: var(--text-2);
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.comment {
		position: relative;
		margin: 0.7rem 0 0;
		padding-left: 0.9rem;
		border-left: 3px solid var(--brand);
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text);
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.clamped {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		overflow: hidden;
	}

	.more {
		margin: 0.4rem 0 0 0.9rem;
		padding: 0;
		background: none;
		border: none;
		font: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: underline;
		cursor: pointer;
	}
</style>
