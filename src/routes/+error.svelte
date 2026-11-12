<script lang="ts">
	import { page } from '$app/stores'
	import Button from '$components/Button.svelte'

	const errorMessages: Record<
		number,
		{ title: string; description: string; showPostsLink: boolean }
	> = {
		404: {
			title: 'Page introuvable',
			description: "La page que vous cherchez n'existe pas ou a été déplacée.",
			showPostsLink: true
		},
		403: {
			title: 'Accès refusé',
			description: "Vous n'avez pas l'autorisation d'accéder à cette page.",
			showPostsLink: false
		},
		500: {
			title: 'Erreur serveur',
			description:
				"Une erreur inattendue s'est produite. Veuillez réessayer dans quelques instants.",
			showPostsLink: false
		}
	}

	$: status = $page.status
	$: info = errorMessages[status] ?? {
		title: 'Une erreur est survenue',
		description: $page.error?.message ?? "Quelque chose s'est mal passé.",
		showPostsLink: false
	}
</script>

<svelte:head>
	<title>{status} · {info.title} | Pause IA</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="error-page">
	<div class="error-code">{status}</div>
	<h1>{info.title}</h1>
	<p class="description">{info.description}</p>
	<div class="actions">
		<Button href="/">Retour à l’accueil</Button>
		{#if info.showPostsLink}
			<Button href="/fr/posts" alt>Voir les articles</Button>
		{/if}
	</div>
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 4rem 2rem;
		min-height: 40vh;
		gap: 1rem;
	}

	.error-code {
		font-size: 6rem;
		font-weight: 700;
		line-height: 1;
		color: var(--accent);
		font-family: var(--font-heading);
	}

	h1 {
		font-size: 2rem;
		margin: 0;
		color: var(--text);
	}

	.description {
		color: var(--text-secondary);
		font-size: 1.1rem;
		max-width: 32rem;
		margin: 0;
	}

	.actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 1rem;
	}

	@media (min-width: 640px) {
		.error-code {
			font-size: 8rem;
		}
	}
</style>
