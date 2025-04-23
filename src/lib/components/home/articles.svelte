<script lang="ts">
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Fly from '$components/Fly.svelte'
	import ArticlesContent from '$posts/articles.md'

	const label_id = 'articles-title'
</script>

<section class="articles" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>Nos articles mis en avant</UnderlinedTitle>
	</Fly>
	<div class="articles-grid">
		<ArticlesContent />
	</div>
	<div class="button-container">
		<Button href="https://pauseia.substack.com/">Voir tous nos articles</Button>
	</div>
</section>

<style>
	section {
		/* Appliquer une largeur constante au conteneur principal */
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}

	.articles-grid :global(ul) {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.7rem;
		box-sizing: border-box;
	}

	/* Ajouter des coins arrondis aux cartes d'articles */
	.articles-grid :global(ul li) {
		border-radius: 1.3rem; /* Ajuster selon la préférence */
		overflow: hidden; /* Important pour que le border-radius fonctionne */
	}

	/* Cibler spécifiquement les cartes pour s'assurer que le style est appliqué */
	.articles-grid :global(ul li a.article-link) {
		border-radius: 1.3rem;
		overflow: hidden;
	}

	/* Cibler spécifiquement le titre pour l'aligner */
	:global(.articles h2) {
		margin-left: 0;
		padding-left: 0;
	}

	/* S'assurer que le premier élément de la grille est aligné */
	.articles-grid :global(ul li:first-child) {
		margin-left: 0;
		padding-left: 0;
	}

	@media (max-width: 1024px) {
		.articles-grid :global(ul) {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.articles-grid :global(ul) {
			grid-template-columns: 1fr;
		}
	}

	.button-container {
		display: flex;
		justify-content: left;
		margin-top: 2rem;
	}
</style>
