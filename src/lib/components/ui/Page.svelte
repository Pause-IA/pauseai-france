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
	/**
	 * Modèle de page.
	 *
	 * - « standard » : le gabarit historique.
	 * - « note »     : le modèle mis au point sur la note aux décideurs.
	 *   Colonne de lecture étroite, corps de texte fluide, titres resserrés,
	 *   surtitre en étiquette orange, et un filet orange au-dessus de chaque
	 *   section ou intertitre, qui remplace les grands blancs d'app.css.
	 *   C'est le modèle des textes longs : il se lit, il s'imprime.
	 */
	export let variant: 'standard' | 'note' = 'standard'
	/** Balise racine : « article » pour un texte, « div » sinon. */
	export let as: 'div' | 'article' = 'div'
</script>

<svelte:element this={as} class="ui-page ui-page--{width} ui-page--{variant}">
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
	/* ── Modèle « note » ─────────────────────────────────────────────────
	   Mis au point sur la note aux décideurs, puis généralisé. Les valeurs
	   sont celles qui ont été mesurées sur cette page : la ligne tient entre
	   45 et 66 signes de 390 px à 1280 px, et le rythme vient de filets
	   orange plutôt que des 5 à 10 rem de blanc d'app.css. */
	.ui-page--note {
		max-inline-size: var(--width-text);
		/* app.css fixe le corps à 1,2 rem, soit 19,2 px : sur un téléphone de
		   390 px cela ne laisse qu'une trentaine de signes par ligne. */
		font-size: clamp(1.0625rem, 0.97rem + 0.42vw, 1.1875rem);
		line-height: 1.62;
		/* Orange de marque à 40 % : un filet, pas un trait. Réservé aux
		   séparations horizontales — bordures de cartes et de boutons gardent
		   le gris, sinon l'orange cesse d'attirer l'œil. */
		--filet-note: rgba(var(--brand-rgb), 0.4);
	}

	.ui-page--note :global(h1) {
		font-size: clamp(2.1rem, 6vw, 3.2rem);
		line-height: 1.06;
		letter-spacing: -0.025em;
		font-weight: 700;
	}

	.ui-page--note :global(h2) {
		font-size: clamp(1.5rem, 3.4vw, 2.05rem);
		line-height: 1.12;
		letter-spacing: -0.02em;
		font-weight: 700;
	}

	.ui-page--note :global(p) {
		line-height: 1.62;
	}

	/* Le filet de marque du hero fait doublon avec l'étiquette du surtitre. */
	.ui-page--note :global(.ui-page-hero .rule) {
		display: none;
	}

	.ui-page--note :global(.eyebrow) {
		display: inline-block;
		margin-bottom: 1rem;
		padding: 0.3rem 0.7rem;
		border-radius: 3px;
		background: var(--brand);
		color: var(--on-brand);
	}

	/* Rythme : un filet au-dessus de chaque section. Les pages écrites en
	   Markdown n'ont pas de <section> : c'est l'intertitre qui porte la
	   séparation. */
	.ui-page--note :global(section),
	.ui-page--note :global(.prose h2) {
		border-top: 1px solid var(--filet-note);
		padding-top: clamp(2rem, 4.5vw, 2.5rem);
		margin-top: clamp(2rem, 4.5vw, 3rem);
	}

	.ui-page--note :global(.prose > h2:first-child) {
		margin-top: 0;
	}

	/* app.css espace les sections de 5 rem (10 rem au-delà de 52 rem) : le
	   filet rend ce blanc inutile, et il casserait le rythme. */
	.ui-page--note :global(section:not(:last-child)) {
		margin-bottom: 0;
	}

	.ui-page--note :global(section > :last-child) {
		margin-bottom: 0;
	}

	@media (max-width: 40rem) {
		.ui-page--note :global(.eyebrow) {
			padding: 0.25rem 0.55rem;
			font-size: 0.75rem;
			letter-spacing: 0.04em;
		}
	}

	/* À l'impression, l'étiquette orange coûte de l'encre et ne dit rien de
	   plus que son texte. */
	@media print {
		.ui-page--note {
			--filet-note: var(--filet-impression, rgb(153, 153, 153));
			max-inline-size: none;
			font-size: 11pt;
		}

		.ui-page--note :global(.eyebrow) {
			padding: 0;
			background: none;
			color: var(--encre-impression, rgb(0, 0, 0));
		}
	}
</style>
