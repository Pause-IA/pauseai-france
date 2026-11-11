<script lang="ts">
	/**
	 * Gabarit commun des pages (hors accueil et pages de campagne) : même
	 * largeur, mêmes marges, même en-tête (PageHero) partout.
	 *
	 * - width « text »    : article, texte long (colonne de lecture)
	 * - width « content » : hub, outil, page éditoriale
	 * - width « wide »    : compilation (grilles, listes filtrables)
	 *
	 * Le surtitre (eyebrow) rappelle la rubrique du menu (Comprendre, Agir,
	 * Campagnes, Actualités, À propos) : c'est lui qui rattache la page à sa
	 * rubrique. Modèles détaillés : docs/modeles-de-page.md.
	 */
	import PageHero from './PageHero.svelte'

	export let title: string
	export let eyebrow: string | undefined = undefined
	export let lede: string | undefined = undefined
	export let width: 'text' | 'content' | 'wide' = 'content'
	/** Balise racine : « article » pour un texte, « div » sinon. */
	export let as: 'div' | 'article' = 'div'
</script>

<svelte:element this={as} class="ui-page ui-page--{width}">
	<!-- Deux branches : un slot transmis existe toujours pour PageHero, même
	     vide ; on ne transmet donc le chapô riche que s'il est fourni. -->
	{#if $$slots.lede}
		<PageHero {eyebrow}>
			{title}
			<svelte:fragment slot="lede"><slot name="lede" /></svelte:fragment>
			<slot name="actions" slot="actions" />
		</PageHero>
	{:else}
		<PageHero {eyebrow} {lede}>
			{title}
			<slot name="actions" slot="actions" />
		</PageHero>
	{/if}
	<slot />
</svelte:element>

<style>
	.ui-page {
		inline-size: 100%;
		margin: 3rem auto 2rem;
	}

	.ui-page--text {
		max-inline-size: var(--width-text);
	}

	.ui-page--content {
		max-inline-size: var(--width-content);
	}

	.ui-page--wide {
		max-inline-size: var(--width-wide);
	}
</style>
