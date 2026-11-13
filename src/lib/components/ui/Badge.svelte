<script lang="ts">
	/**
	 * Pastille de la charte. `brand` par défaut.
	 *
	 * DEUX FORMES, DEUX RÔLES — et il faut s'y tenir, sinon la même étiquette
	 * apparaît ronde ici et carrée là, ce qui s'est produit pour « Campagne
	 * en cours ».
	 *
	 * RECTANGLE (rayon 3 px) : le surtitre d'une PAGE. Il dit où l'on est —
	 * « À propos », « Groupes locaux », « Campagne en cours ». Il n'y en a
	 * qu'un par page, en tête, et c'est PageHero qui le pose.
	 *
	 * OVALE (rayon plein) : une étiquette attachée à un OBJET dans la page —
	 * le statut d'une campagne dans une liste, « Soutien officiel » sur une
	 * carte, un filtre de recherche. Il y en a autant qu'il y a d'objets.
	 *
	 * Autrement dit : rectangle = la page, ovale = une chose dans la page.
	 * Ce composant ne sert qu'au second cas.
	 *
	 * `success` et `error` sont réservés aux RETOURS DE FORMULAIRE — un envoi
	 * réussi, une erreur de saisie. Une campagne « en cours » n'est pas un
	 * succès : c'est un état, et un état se dit avec les couleurs de la
	 * marque (`outline`, filet orange) ou en neutre. Le vert était la seule
	 * tache verte des pages campagne, et il s'y lisait comme une validation.
	 */
	export let variant: 'brand' | 'neutral' | 'outline' | 'success' | 'error' = 'brand'
	export let size: 'sm' | 'md' = 'md'
</script>

<span class="ui-badge {variant} {size}"><slot /></span>

<style>
	.ui-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		border: 1px solid transparent;
		border-radius: var(--radius-pill);
		font-weight: 700;
		line-height: 1;
		white-space: nowrap;
		width: fit-content;
	}

	.md {
		padding: 0.3rem 0.7rem;
		font-size: 0.8rem;
	}

	.sm {
		padding: 0.18rem 0.55rem;
		font-size: 0.72rem;
	}

	.brand {
		background: var(--brand);
		color: var(--on-brand);
	}

	.neutral {
		background: var(--bg-secondary);
		color: var(--text-secondary);
		border-color: var(--border);
	}

	.outline {
		background: transparent;
		color: var(--text);
		border-color: var(--brand);
	}

	.success {
		background: var(--success-bg);
		color: var(--success);
		border-color: var(--success-border);
	}

	.error {
		background: var(--error-bg);
		color: var(--error);
		border-color: var(--error-border);
	}
</style>
