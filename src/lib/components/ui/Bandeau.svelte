<script lang="ts">
	/**
	 * Encadré sur la surface sombre de la marque.
	 *
	 * La couleur secondaire (--surface-sombre, le complément perceptuel de
	 * notre orange) n'existait que dans le style d'une seule page. C'est une
	 * brique : un bloc qui doit trancher avec le fil du texte — une mise en
	 * garde, une citation forte, un appel à l'action — s'y pose.
	 *
	 * Le texte posé dessus prend --on-dark, et les liens l'orange de marque :
	 * --brand-subtle, qui sert aux liens sur fond clair, ne donne que 2,98:1
	 * sur ce bleu, sous le seuil. --brand y donne 7,2:1.
	 */

	/** Déborde de la colonne de lecture, pour faire respirer la page. */
	export let large = false
	/** Petit filet orange en tête de bloc, comme sur la note aux décideurs :
	    il rattache l'aplat à la marque au lieu de le laisser flotter. */
	export let filet = true
</script>

<aside class="ui-bandeau" class:large>
	{#if filet}<span class="filet-marque" aria-hidden="true"></span>{/if}
	<slot />
</aside>

<style>
	.ui-bandeau {
		margin-block: 2.5rem;
		padding: clamp(1.5rem, 4vw, 2.25rem);
		border-radius: 2px;
		background: var(--surface-sombre, rgb(14, 36, 51));
		color: var(--on-dark);
		font-size: clamp(1.0625rem, 0.97rem + 0.42vw, 1.1875rem);
		line-height: 1.62;
	}

	.ui-bandeau :global(p) {
		color: var(--on-dark);
	}

	.filet-marque {
		display: block;
		inline-size: 3rem;
		block-size: 4px;
		border-radius: var(--radius-pill);
		background: var(--brand);
		margin-bottom: 1.25rem;
	}

	.large {
		margin-inline: clamp(-1.5rem, -3vw, -3rem);
	}

	.ui-bandeau :global(a) {
		color: var(--brand);
	}

	.ui-bandeau :global(h2),
	.ui-bandeau :global(h3),
	.ui-bandeau :global(strong) {
		color: var(--on-dark);
	}

	.ui-bandeau :global(p:last-child) {
		margin-bottom: 0;
	}

	/* Accordéon posé sur le bleu : filets et chevron s'y adaptent. */
	.ui-bandeau :global(div.inView:not(:last-child) > .accordion) {
		border-bottom-color: rgba(var(--on-dark-rgb), 0.22);
	}

	.ui-bandeau :global(.accordion .chevron) {
		color: var(--brand);
	}

	.ui-bandeau :global(.accordion .details) {
		color: rgba(var(--on-dark-rgb), 0.82);
	}

	.ui-bandeau :global(.accordion .header:hover .title) {
		color: var(--brand);
	}

	/* app.css pose un fond crème et une barre orange sur blockquote : sur le
	   bleu, cela donnait du blanc sur du crème. */
	.ui-bandeau :global(blockquote) {
		margin: 0;
		padding: 0;
		background: none;
		border: 0;
		color: var(--on-dark);
	}

	/* À l'impression, l'aplat sombre coûte une page entière d'encre. */
	@media print {
		.ui-bandeau {
			margin-inline: 0;
			padding: 1.2rem 0 0;
			background: none;
			color: var(--encre-impression, rgb(0, 0, 0));
			border-top: 2px solid var(--encre-impression, rgb(0, 0, 0));
		}

		.ui-bandeau :global(a) {
			color: var(--encre-impression, rgb(0, 0, 0));
		}
	}
</style>
