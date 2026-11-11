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
</script>

<aside class="ui-bandeau" class:large>
	<slot />
</aside>

<style>
	.ui-bandeau {
		margin-block: 2.5rem;
		padding: clamp(1.5rem, 4vw, 2.25rem);
		border-radius: 2px;
		background: var(--surface-sombre, rgb(14, 36, 51));
		color: var(--on-dark);
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
