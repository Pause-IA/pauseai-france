<script lang="ts">
	/** En-tête de page : filet de marque, titre, chapô. */
	export let eyebrow: string | undefined = undefined
	/** Filet orange au-dessus du titre. Il ne sert que QUAND IL N'Y A PAS de
	    surtitre : l'étiquette orange est elle-même la marque de couleur, et
	    deux repères orange empilés n'en font plus aucun. */
	export let rule = true
	/** Chapô en texte simple (sinon, slot « lede » pour du contenu riche). */
	export let lede: string | undefined = undefined
</script>

<header class="ui-page-hero">
	{#if rule && !eyebrow}<span class="rule" aria-hidden="true"></span>{/if}
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

	/* ÉTIQUETTE, et non ligne de texte colorée.

	   C'est le repère le plus reconnaissable du modèle : un aplat d'orange
	   plein, posé juste au-dessus du titre. En texte coloré il fallait
	   l'assombrir pour qu'il soit lisible, ce qui le rendait marron ; en
	   aplat, l'orange reste l'orange de la marque et c'est l'encre posée
	   dessus (--on-brand) qui porte le contraste. */
	.eyebrow {
		display: inline-block;
		margin: 0 0 0.9rem;
		padding: 0.3rem 0.7rem;
		border-radius: 3px;
		background: var(--brand);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--on-brand);
	}

	/* Le plancher était à 2 rem : sur un téléphone de 360 px, le titre de page
	   tombait à 32 px, à peine plus gros que l'intertitre qui le suit (24 px).
	   Le haut de page ne se lisait plus comme une ouverture. 2,6 rem rétablit
	   l'écart, et la composante en vw prend le relais dès la tablette.
	   `overflow-wrap` parce qu'à cette taille un mot long comme
	   « intelligence » dépasse la colonne d'un petit écran. */
	h1 {
		margin: 0;
		font-size: clamp(2.6rem, 5.5vw, 3.2rem);
		line-height: 1.05;
		letter-spacing: -0.025em;
		overflow-wrap: break-word;
		color: var(--text);
	}

	@media (max-width: 40rem) {
		.eyebrow {
			padding: 0.25rem 0.55rem;
			font-size: 0.75rem;
			letter-spacing: 0.04em;
		}
	}

	/* À l'impression, l'étiquette orange coûte de l'encre et ne dit rien de
	   plus que son texte. */
	@media print {
		.eyebrow {
			padding: 0;
			background: none;
			color: var(--encre-impression, rgb(0, 0, 0));
		}
	}

	.lede {
		margin: 1.1rem 0 0;
		max-inline-size: var(--width-text);
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-2);
	}
</style>
