<script lang="ts">
	import Button from '$lib/components/Button.svelte'
</script>

<svelte:head>
	<title>Merci pour votre participation | Pause IA</title>
</svelte:head>

<article class="thank-you-page">
	<div class="content">
		<h1>Merci pour votre participation !</h1>

		<div class="message">
			<p>
				Votre témoignage a bien été enregistré et nous vous en remercions sincèrement. Vos réponses
				nous aideront à mieux comprendre l'impact de l'IA sur le monde du travail.
			</p>

			<p>Si vous n'y êtes pas déjà, vous pouvez rejoindre notre communauté pour :</p>

			<ul>
				<li>Échanger avec d'autres personnes concernées par l'IA et l'emploi</li>
				<li>Vous informer sur les dernières actualités et recherches</li>
				<li>Participer à des actions concrètes</li>
				<li>Accéder à des ressources et du soutien</li>
			</ul>
		</div>

		<div class="cta-buttons">
			<Button href="https://pauseia.fr" target="_blank">Visiter Pause IA.fr</Button>
			<Button href="https://discord.com/invite/YkKvW9APP9" target="_blank" alt>
				Rejoindre le Discord
			</Button>
		</div>

		<div class="back-link">
			<a href="/emploi-ia">← Retour à la page du groupe de travail emploi IA</a>
		</div>
	</div>
</article>

<style>
	.thank-you-page {
		max-width: 700px;
		margin: 4rem auto;
		padding: 0 1rem;
	}

	.content {
		background-color: var(--bg);
		padding: 3rem;
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	h1 {
		color: var(--brand);
		margin-top: 0;
		margin-bottom: 2rem;
	}

	.message {
		text-align: left;
		margin-bottom: 2rem;
	}

	.message p {
		margin-bottom: 1.5rem;
	}

	.message ul {
		margin: 1rem 0;
		padding-left: 2rem;
	}

	.message li {
		margin: 0.75rem 0;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin: 2rem 0;
	}

	.back-link {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.back-link a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
	}

	.back-link a:hover {
		color: var(--brand);
	}

	@media (max-width: 640px) {
		.content {
			padding: 2rem 1.5rem;
		}

		.cta-buttons {
			flex-direction: column;
		}

		.cta-buttons :global(button),
		.cta-buttons :global(a) {
			width: 100%;
		}
	}
</style>
