<script lang="ts">
	/** Titre principal (h1). */
	export let title: string
	/** Chapô : une ou deux phrases qui résument l'enjeu et l'action demandée. */
	export let lede = ''
	/** Étiquette courte au-dessus du titre (ex. « Campagne en cours »). */
	export let eyebrow = ''
	/** Période ou échéance affichée à côté de l'étiquette. */
	export let date = ''
	/** Statut de la campagne : colore l'étiquette. */
	export let status: 'active' | 'ended' = 'active'
</script>

<section class="hero">
	{#if eyebrow || date}
		<div class="hero-meta">
			{#if eyebrow}
				<span class="badge" class:ended={status === 'ended'}>{eyebrow}</span>
			{/if}
			{#if date}<span class="date">{date}</span>{/if}
		</div>
	{/if}

	<h1>{title}</h1>

	{#if lede}
		<p class="lede">{lede}</p>
	{/if}

	{#if $$slots.default}
		<div class="hero-actions">
			<slot />
		</div>
	{/if}
</section>

<style>
	.hero {
		padding: 0.5rem 0 2.25rem;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid var(--border);
	}

	/* Filet orange de marque, repris de la page « Une IA s'est échappée ». */
	.hero::before {
		content: '';
		display: block;
		width: 3rem;
		height: 4px;
		border-radius: 2px;
		background: var(--brand);
		margin-bottom: 1.5rem;
	}

	.hero-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.badge {
		background: var(--brand);
		color: var(--black);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 0.25rem 0.7rem;
		border-radius: 999px;
	}

	.badge.ended {
		background: var(--bg-subtle);
		color: var(--text-2);
		border: 1px solid var(--border);
	}

	.date {
		font-size: 0.9rem;
		color: var(--text-2);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5.5vw, 3rem);
		line-height: 1.1;
		letter-spacing: -0.02em;
	}

	.lede {
		margin: 1.25rem 0 0;
		font-size: clamp(1.05rem, 2vw, 1.25rem);
		line-height: 1.6;
		text-align: left;
		max-inline-size: 44rem;
		color: var(--text-2);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 1.75rem;
	}

	@media (max-width: 600px) {
		.hero-actions {
			flex-direction: column;
			align-items: stretch;
		}

		.hero-actions :global(a),
		.hero-actions :global(button) {
			max-width: none;
			width: 100%;
		}
	}
</style>
