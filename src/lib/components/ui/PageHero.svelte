<script lang="ts">
	/** En-tête de page : filet de marque, titre, chapô. */
	export let eyebrow: string | undefined = undefined
	/** Masque le filet orange au-dessus du titre. */
	export let rule = true
	/** Chapô en texte simple (sinon, slot « lede » pour du contenu riche). */
	export let lede: string | undefined = undefined
</script>

<header class="ui-page-hero">
	{#if rule}<span class="rule" aria-hidden="true"></span>{/if}
	{#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
	<h1><slot /></h1>
	{#if $$slots.lede}
		<p class="lede"><slot name="lede" /></p>
	{:else if lede}
		<p class="lede">{lede}</p>
	{/if}
	<slot name="actions" />
</header>

<style>
	.ui-page-hero {
		margin-bottom: 2.5rem;
	}

	.rule {
		display: block;
		inline-size: 3rem;
		block-size: 4px;
		border-radius: var(--radius-pill);
		background: var(--brand);
		margin-bottom: 1.1rem;
	}

	.eyebrow {
		margin: 0 0 0.4rem;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--brand-subtle);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5.5vw, 3rem);
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.lede {
		margin: 1rem 0 0;
		max-inline-size: var(--width-text);
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-2);
	}
</style>
