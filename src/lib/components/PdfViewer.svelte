<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import ExternalLink from '$lib/components/custom/a.svelte'

	export let pdfPath: string
	export let title: string

	let consent = false
</script>

<div class="pdf-viewer">
	<object data={pdfPath} type="application/pdf" width="100%" height="100%" aria-label={title}>
		{#if !consent}
			<div class="consent-widget">
				<div class="consent-text">
					Pour afficher le PDF directement sur cette page, nous utilisons le visualiseur Google
					Docs. En l'activant, vous acceptez que vos données soient traitées conformément à la <ExternalLink
						href="https://policies.google.com/privacy?hl=fr"
						target="_blank">politique de confidentialité de Google</ExternalLink
					>. Alternativement, vous pouvez télécharger le PDF pour le lire localement.
				</div>
				<div class="actions">
					<Button href={pdfPath} target="_blank" alt>Non merci, télécharger le PDF</Button>
					<Button on:click={() => (consent = true)}>Accepter et afficher</Button>
				</div>
			</div>
		{:else}
			<iframe
				src="https://drive.google.com/viewerng/viewer?url=https://pauseia.fr/{pdfPath}&embedded=true"
				width="100%"
				height="100%"
				frameborder="0"
				{title}
			></iframe>
		{/if}
	</object>
</div>

<style>
	.pdf-viewer {
		width: 100%;
		height: 500px;
		border: 1px solid var(--border);
		border-radius: 4px;
	}

	@media (min-width: 768px) {
		.pdf-viewer {
			height: 800px;
		}
	}

	.consent-widget {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.consent-text {
		margin: 1.5rem 0;
	}

	.actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.actions {
			flex-direction: row;
		}
	}

	.consent-widget :global(.alt) {
		border: 1px solid var(--black);
	}
</style>
