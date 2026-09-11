<script lang="ts">
	import type { CampaignStat } from './types'

	/** Chiffres clés de la campagne (signatures, mails envoyés, élus rencontrés…). */
	export let stats: CampaignStat[] = []
</script>

<ul class="stats">
	{#each stats as stat}
		<li class="stat">
			<span class="value">{stat.value}</span>
			<span class="label">{stat.label}</span>
		</li>
	{/each}
</ul>

<style>
	.stats {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 1rem;
	}

	.stat {
		margin: 0;
		padding: 1.5rem 1.25rem;
		text-align: center;
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 12px;
	}

	.value {
		display: block;
		font-weight: 700;
		font-size: clamp(1.75rem, 4vw, 2.25rem);
		line-height: 1.1;
		color: var(--brand-subtle);
	}

	.label {
		display: block;
		margin-top: 0.4rem;
		font-size: 0.9rem;
		line-height: 1.35;
		color: var(--text-2);
	}
</style>
