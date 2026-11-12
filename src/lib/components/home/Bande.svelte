<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	/**
	 * Bande thématique de la page d'accueil : « Agir » puis « S'informer ».
	 *
	 * La page empilait neuf blocs de poids égal, sans hiérarchie. Le but est de
	 * créer deux territoires, et c'est LE CHANGEMENT DE FOND qui le fait.
	 *
	 * Le titre reprend exactement la forme du titre de la F.A.Q.
	 * (UnderlinedTitle) : ce sont les trois repères de même niveau de la page,
	 * ils doivent se ressembler. Les blocs internes sont passés en h3, donc la
	 * hiérarchie visuelle et la hiérarchie du document disent la même chose.
	 */
	export let titre: string
	/** Filet de séparation au-dessus de la bande. La première de la page n'en
	    a pas besoin : le héros la sépare déjà de ce qui précède. */
	export let filet = true

	const id = `bande-${Math.random().toString(36).slice(2, 8)}`
</script>

<section class="bande" class:filet aria-labelledby={id}>
	<UnderlinedTitle {id}>{titre}</UnderlinedTitle>
	<slot />
</section>

<style>
	/* La bande garde la LARGEUR NORMALE d'une section et peint son fond d'un
	   bord à l'autre avec un pseudo-élément. Faite en `inline-size: 100vw`, ses
	   enfants calculaient leur propre pleine largeur par rapport à elle et non à
	   la colonne : leur texte se retrouvait coupé hors écran. */
	.bande {
		position: relative;
		padding-block: 3rem;
	}

	/* Le crème a été sorti de la charte : la séparation entre les deux
	   territoires de la page se fait par un filet, comme les sections du
	   modèle, et non par un aplat teinté. Il court d'un bord à l'autre, pour
	   qu'on le lise comme une coupure de page et pas comme un trait de
	   paragraphe. */
	.bande.filet::before {
		content: '';
		position: absolute;
		z-index: 0;
		inset-block-start: 0;
		inset-inline-start: calc(50% - 50vw);
		inline-size: 100vw;
		block-size: 1px;
		background: rgba(var(--brand-rgb), 0.4);
	}

	.bande > :global(*) {
		position: relative;
		z-index: 1;
	}

	/* app.css donne 5 rem (10 rem en large) à toute `section`, y compris à la
	   bande et à chacun de ses enfants : un trou entre les deux bandes, et des
	   blocs trop espacés pour se lire comme un groupe. La bande gère son rythme. */
	.bande:not(:last-child) {
		margin-block-end: 0;
	}

	.bande :global(section:not(:last-child)) {
		margin-block-end: 2.5rem;
	}

	@media (max-width: 600px) {
		.bande {
			padding-block: 2rem;
		}
	}
</style>
