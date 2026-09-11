<script lang="ts">
	import Button from '$components/Button.svelte'
	import type { CampaignAction } from './types'

	/** Liste des actions proposées au visiteur (écrire à un élu, signer, partager…). */
	export let actions: CampaignAction[] = []
</script>

<div class="actions">
	{#each actions as action}
		<div class="action" class:featured={action.featured}>
			<h3>{action.title}</h3>
			<p>{action.description}</p>
			<Button
				href={action.href}
				alt={!action.featured}
				target={action.external ? '_blank' : ''}
				rel={action.external ? 'noopener noreferrer' : ''}
			>
				{action.cta}
			</Button>
		</div>
	{/each}
</div>

<style>
	.actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.25rem;
	}

	.action {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
	}

	.action.featured {
		background: var(--bg-subtle);
		border-color: var(--brand);
	}

	.action h3 {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.25;
	}

	.action p {
		margin: 0;
		flex: 1;
		font-size: 1rem;
		line-height: 1.6;
		text-align: left;
		color: var(--text-2);
	}
</style>
