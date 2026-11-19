<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Page } from '$components/ui'
	import { base } from '$app/paths'
</script>

<PostMeta
	title="Sensibiliser votre entourage"
	description="Comment parler de Pause IA aux gens que vous connaissez déjà : un guide à lire en ligne, et une version courte à imprimer."
/>

<Page title="Sensibiliser votre entourage" eyebrow="Agir" width="content" as="article">
	<svelte:fragment slot="lede">
		Comment parler des risques de l’IA autour de vous : à qui, à quel moment, et surtout de quelle
		manière.
	</svelte:fragment>

	<p class="intro">
		Personne ne change d’avis en lisant un tract. On y vient en discutant avec quelqu’un en qui on a
		confiance, et on l’écoute d’autant mieux qu’il ne cherche pas à avoir raison. C’est là que vous
		êtes irremplaçable. Ce guide vous apprend surtout cela : poser des questions, écouter les
		réponses, et laisser la personne faire le chemin elle-même.
	</p>

	<!-- Demandes d'Antonin (19/11/2026) : plus de cartes ni de titre « Deux
	     guides… ». Le bouton principal mène au guide complet (tenu dans Notion) ;
	     le PDF est celui de la version courte, d'où son libellé et un bouton
	     d'une autre couleur, pour ne pas le confondre avec le guide complet. Il
	     s'ouvre dans un nouvel onglet. -->
	<p class="actions">
		<Button href="{base}/fr/guide-sensibilisation">Lire le guide complet</Button>
		<Button alt href="/pdfs/guide_recrutement_express.pdf" target="_blank"
			>Version courte à imprimer</Button
		>
	</p>
</Page>

<style>
	/* Page refaite sur la charte : tout passe par les tokens d'app.css, ce qui
	   fait aussi fonctionner le mode sombre. */

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
		align-items: center;
		margin-block: 2rem 0;
	}
</style>
