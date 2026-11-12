<script lang="ts">
	import type { CampaignFact } from './types'

	/**
	 * « L'essentiel » d'une campagne : deux à quatre affirmations courtes et
	 * vérifiables, chacune renvoyant vers l'article qui la démontre. C'est le
	 * bloc qui doit convaincre un visiteur pressé ; le développement vient
	 * après, ailleurs sur la page.
	 */
	export let facts: CampaignFact[] = []
	/** Libellé par défaut du lien quand un fait n'en précise pas. */
	export let linkLabel = 'Lire l’analyse'
</script>

<ul class="facts">
	{#each facts as fact}
		<li class="fact">
			<p class="statement">{fact.statement}</p>
			{#if fact.detail}<p class="detail">{fact.detail}</p>{/if}
			{#if fact.href}
				<a
					class="more"
					href={fact.href}
					target={fact.external ? '_blank' : undefined}
					rel={fact.external ? 'noopener noreferrer' : undefined}
				>
					{fact.linkLabel ?? linkLabel}
					<span aria-hidden="true">→</span>
				</a>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.facts {
		display: grid;
		gap: 1rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 720px) {
		.facts {
			grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		}
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.1rem 1.25rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-left: 4px solid var(--brand);
		border-radius: var(--radius-md);
	}

	.statement {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--text);
	}

	.detail {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text-2);
	}

	.more {
		margin-top: auto;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--accent);
		text-decoration: none;
	}

	.more:hover,
	.more:focus-visible {
		text-decoration: underline;
	}
</style>
