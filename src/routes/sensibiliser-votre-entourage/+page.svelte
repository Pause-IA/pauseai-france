<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Page } from '$components/ui'
	import { base } from '$app/paths'
</script>

<PostMeta
	title="Sensibiliser votre entourage"
	description="Comment parler de Pause IA aux gens que vous connaissez déjà : un guide court, à lire en ligne ou à imprimer."
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

	<!-- Un seul guide mis en avant, demande d'Antonin (19/11/2026) : la carte
	     « Guide complet » et le titre « Deux guides… » sont retirés. Le guide
	     complet reste en ligne (/fr/guide-sensibilisation) et le guide court y
	     renvoie. -->
	<p class="action"><Button href="{base}/fr/guide-court">Lire le guide</Button></p>
	<p class="pdf"><a href="/pdfs/guide_recrutement_express.pdf">Version PDF, à imprimer</a></p>
</Page>

<style>
	/* Page refaite sur la charte : tout passe par les tokens d'app.css, ce qui
	   fait aussi fonctionner le mode sombre. */

	.action {
		margin-block: 2rem 0.75rem;
	}

	.pdf {
		margin: 0;
		font-size: 0.9rem;
	}
</style>
