<script lang="ts">
	import Button from '$components/Button.svelte'
</script>

<section class="newsletter-cta">
	<div class="content">
		<p class="tagline">Restez informé·e des enjeux de l'IA</p>
		<p class="description">
			Recevez notre décryptage mensuel de l'actualité IA directement dans votre boîte mail.
		</p>
	</div>
	<Button href="#newsletter">S'inscrire à la newsletter</Button>
</section>

<style>
	.newsletter-cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem 1.5rem;
		background: linear-gradient(135deg, #fff8f0 0%, #fff0e0 100%);
		border-radius: 1rem;
		margin: 2rem 0;
		text-align: center;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tagline {
		font-family: var(--font-heading);
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		color: var(--text);
	}

	.description {
		font-size: 1rem;
		margin: 0;
		color: var(--text-2);
		max-width: 500px;
	}

	@media (min-width: 768px) {
		.newsletter-cta {
			flex-direction: row;
			justify-content: space-between;
			text-align: left;
			padding: 2.5rem 3rem;
		}

		.tagline {
			font-size: 1.75rem;
		}
	}
</style>
