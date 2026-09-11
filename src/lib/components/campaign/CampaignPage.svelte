<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'

	/** Titre SEO (balise <title> + OG). */
	export let title: string
	/** Meta description. */
	export let description: string
	/** Largeur de la colonne de contenu. */
	export let width: 'narrow' | 'wide' = 'narrow'
</script>

<PostMeta {title} {description} />

<article class="campaign" class:wide={width === 'wide'}>
	<slot />
</article>

<style>
	/* Conteneur commun à toutes les pages campagne : une seule largeur,
	   une seule gouttière, quel que soit le contenu. */
	.campaign {
		--campaign-gap: 3.5rem;
		max-inline-size: 54rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.campaign.wide {
		max-inline-size: 66rem;
	}

	/* Les sections de campagne gèrent leur propre rythme vertical :
	   on neutralise l'espacement global très large de app.css. */
	.campaign :global(section:not(:last-child)) {
		margin-bottom: var(--campaign-gap);
	}

	@media (max-width: 600px) {
		.campaign {
			--campaign-gap: 2.5rem;
			padding: 0 1.1rem;
		}
	}
</style>
