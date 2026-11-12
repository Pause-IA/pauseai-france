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
	     vide ; on ne transmet donc le chapô riche que s’il est fourni. -->
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

	/* Colonne de lecture pour le texte suivi, même sur une page large.
	   La charte plafonne le chapô à 44 rem mais rien ne le faisait pour les
	   paragraphes du corps : sur les pages « content » et « wide », la ligne
	   montait à 110 ou 130 signes, loin des 45 à 66 visés.

	   Ne sont visés que les paragraphes posés directement dans la page ou
	   dans une de ses sections : ceux des cartes et des grilles gardent la
	   largeur de leur conteneur, qui est déjà étroit. */
	.ui-page > :global(p),
	.ui-page > :global(section) > :global(p) {
		max-inline-size: var(--width-text);
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

	/* La citation devient L'APLAT BLEU du modèle.

	   Le bleu sombre de la marque n'était posé nulle part sur le site : il
	   existait comme jeton et comme brique (Bandeau), sans un seul emploi. Or
	   le modèle s'en sert à un endroit précis et répétable — le passage qu'on
	   veut faire ressortir du fil du texte, qui est presque toujours une
	   citation. Le lier au <blockquote> le met en place partout d'un coup,
	   sans retoucher chaque page.

	   Il déborde légèrement de la colonne de lecture : c'est ce débordement
	   qui fait l'arrêt, plus encore que la couleur. */
	.ui-page--note :global(blockquote) {
		position: relative;
		margin-inline: calc(-1 * clamp(0rem, 4vw, 3rem));
		margin-block: clamp(2rem, 5vw, 3rem);
		padding: clamp(1.75rem, 4vw, 2.5rem);
		border: 0;
		border-radius: 2px;
		background: var(--surface-sombre, rgb(14, 36, 51));
		color: var(--on-dark);
		font-style: normal;
	}

	/* Petit filet orange en tête : il rattache l'aplat à la marque au lieu de
	   le laisser flotter comme un bloc sombre quelconque. */
	.ui-page--note :global(blockquote)::before {
		content: '';
		position: absolute;
		inset-block-start: clamp(1.75rem, 4vw, 2.5rem);
		inset-inline-start: clamp(1.75rem, 4vw, 2.5rem);
		inline-size: 2.5rem;
		block-size: 3px;
		border-radius: var(--radius-pill);
		background: var(--brand);
	}

	.ui-page--note :global(blockquote > :first-child) {
		margin-block-start: 1.6rem;
	}

	.ui-page--note :global(blockquote > :last-child) {
		margin-block-end: 0;
	}

	.ui-page--note :global(blockquote p) {
		color: var(--on-dark);
	}

	/* --accent est un bleu : illisible sur le bleu. Sur l'aplat, c'est
	   l'orange de marque qui porte les liens (7,2:1). */
	.ui-page--note :global(blockquote a) {
		color: var(--brand);
	}

	/* À l'impression, un aplat sombre vide la cartouche pour rien. */
	@media print {
		.ui-page--note :global(blockquote) {
			margin-inline: 0;
			padding-inline-start: 1rem;
			border-inline-start: 3px solid var(--filet-impression, rgb(153, 153, 153));
			background: none;
			color: var(--encre-impression, rgb(0, 0, 0));
		}

		.ui-page--note :global(blockquote)::before {
			display: none;
		}

		.ui-page--note :global(blockquote p) {
			color: var(--encre-impression, rgb(0, 0, 0));
		}
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

	/* À l'impression, l'étiquette orange coûte de l'encre et ne dit rien de
	   plus que son texte. */
	@media print {
		.ui-page--note {
			--filet-note: var(--filet-impression, rgb(153, 153, 153));
			max-inline-size: none;
			font-size: 11pt;
		}
	}
</style>
