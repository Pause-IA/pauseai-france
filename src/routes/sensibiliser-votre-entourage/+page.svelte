<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Callout from '$components/Callout.svelte'
	import Button from '$components/Button.svelte'
	import { Card, PageHero, SectionTitle } from '$components/ui'
	import { base } from '$app/paths'
</script>

<PostMeta
	title="Sensibiliser votre entourage"
	description="Comment parler de Pause IA aux gens que vous connaissez déjà : un guide court à lire sur cette page, et un guide complet pour aller plus loin."
/>

<article class="recruitment-landing">
	<!-- Hero Section -->
	<PageHero eyebrow="Agir">
		Sensibiliser votre entourage
		<svelte:fragment slot="lede">
			Les gens écoutent plus volontiers quelqu’un qu’ils connaissent qu’une affiche ou une
			publication. En parler à vos proches, vos collègues, vos amis est donc l’une des choses les
			plus utiles que vous puissiez faire. Voici comment s’y prendre sans braquer personne.
		</svelte:fragment>
	</PageHero>

	<p class="intro">
		La plupart des gens ne changent pas d’avis en lisant un tract. Ils en parlent d’abord avec
		quelqu’un en qui ils ont confiance. C’est pour cela qu’une conversation avec vous vaut mieux que
		n’importe quelle affiche : vous êtes cette personne-là pour votre entourage.
	</p>

	<section class="ressources" aria-labelledby="ressources-titre">
		<SectionTitle id="ressources-titre">Deux guides, selon le temps que vous avez</SectionTitle>

		<div class="grille">
			<Card class="ressource principale">
				<h3>Guide court</h3>
				<p class="duree">5 à 10 minutes</p>
				<p>
					L’essentiel : pourquoi votre voix compte, les quatre principes, et la marche à suivre en
					trois temps.
				</p>
				<p class="action"><Button href="{base}/fr/guide-court">Lire le guide court</Button></p>
				<p class="pdf">
					<a href="/pdfs/guide_recrutement_express.pdf">Version PDF, à imprimer</a>
				</p>
			</Card>

			<Card class="ressource">
				<h3>Guide complet</h3>
				<p class="duree">30 minutes et plus</p>
				<p>Les situations concrètes, les objections fréquentes et comment y répondre.</p>
				<p class="action">
					<Button alt href="{base}/fr/guide-sensibilisation">Lire le guide complet</Button>
				</p>
			</Card>
		</div>
	</section>
</article>

<style>
	/* Page refaite sur la charte : plus aucune couleur, aucun rayon ni aucune
	   ombre en dur, tout passe par les tokens d'app.css, ce qui fait aussi
	   fonctionner le mode sombre. Les briques partagées (PageHero, Card,
	   SectionTitle, Button) remplacent les cartes et boutons maison. */
	.recruitment-landing {
		/* <main> est un conteneur flex : sans ces deux déclarations, l'article
		   refuse de descendre sous la largeur intrinsèque de son contenu et la
		   page défile horizontalement sur mobile. Même piège que CampaignPage. */
		min-inline-size: 0;
		inline-size: 100%;
		max-inline-size: var(--width-content);
		margin-inline: auto;
		padding: 2.5rem 1.5rem 5rem;
	}

	section {
		margin-block-end: 3.5rem;
	}

	/* --- Cartes de ressources --------------------------------------------- */
	/* Quatre ressources : deux par deux. En `auto-fit`, elles tombaient en 3 + 1,
	   et la dernière restait seule sur sa ligne. */
	.grille {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
		align-items: start;
	}

	@media (max-width: 640px) {
		.grille {
			grid-template-columns: 1fr;
		}
	}

	.grille :global(.ressource) {
		display: flex;
		flex-direction: column;
	}

	/* Le guide express est l'entrée recommandée : bordure de marque, pas d'aplat
	   (le texte sur un aplat orange descend à 2,2:1 s'il est blanc). */
	.grille :global(.principale) {
		border-color: var(--brand);
	}

	.grille :global(.ressource h3) {
		margin: 0 0 0.25rem;
		font-size: 1.15rem;
		color: var(--text);
	}

	.grille :global(.ressource p) {
		margin: 0;
		color: var(--text-2);
		line-height: 1.6;
	}

	.grille :global(.pdf) {
		margin: 0.75rem 0 0;
		font-size: 0.9rem;
	}

	.grille :global(.duree) {
		margin-block-end: 0.75rem !important;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text) !important;
	}

	/* Les boutons tombent sur la même ligne quelle que soit la longueur du texte. */
	.grille :global(.action) {
		margin-block-start: auto !important;
		padding-block-start: 1.25rem;
	}

	/* --- Corps du guide ---------------------------------------------------- */

	/* --- Conclusion -------------------------------------------------------- */

	@media (max-width: 600px) {
		.recruitment-landing {
			padding: 2rem 1.1rem 3.5rem;
		}

		section {
			margin-block-end: 2.5rem;
		}
	}
</style>
