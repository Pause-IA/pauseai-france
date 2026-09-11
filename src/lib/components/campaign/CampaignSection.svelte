<script lang="ts">
	/** Titre de section (h2). Omis si vide. */
	export let title = ''
	/** Texte d'introduction sous le titre. */
	export let intro = ''
	/** Ancre pour les liens internes (#agir, #evenements…). */
	export let id: string | undefined = undefined
	/**
	 * plain  : texte courant
	 * card   : encadré gris clair (embeds, formulaires, outils)
	 * accent : encadré orange de marque (appel à l'action)
	 */
	export let variant: 'plain' | 'card' | 'accent' = 'plain'
</script>

<section {id} class="section {variant}" aria-labelledby={title && id ? `${id}-title` : undefined}>
	{#if title}
		<h2 id={id ? `${id}-title` : undefined}>{title}</h2>
	{/if}
	{#if intro}
		<p class="intro">{intro}</p>
	{/if}
	<slot />
</section>

<style>
	.section {
		scroll-margin-top: 5rem;
	}

	.section h2 {
		font-size: clamp(1.4rem, 3vw, 1.75rem);
		line-height: 1.2;
		margin: 0 0 1rem;
	}

	.intro {
		margin: 0 0 1.5rem;
		color: var(--text-2);
		text-align: left;
		font-size: 1.05rem;
		line-height: 1.65;
		max-inline-size: 44rem;
	}

	.section :global(p) {
		text-align: left;
		line-height: 1.75;
	}

	.card,
	.accent {
		border-radius: 16px;
		padding: 2rem;
		border: 1px solid var(--border);
	}

	.card {
		background: var(--bg-card);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}

	.accent {
		background: var(--bg-subtle);
		border-color: var(--brand);
	}

	@media (max-width: 600px) {
		.card,
		.accent {
			padding: 1.25rem;
		}
	}
</style>
