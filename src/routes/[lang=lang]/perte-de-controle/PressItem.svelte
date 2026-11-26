<script lang="ts">
	/** Un article de la section « La presse en parle » (marche et semaine d'action). */
	import { MoveUpRight } from 'lucide-svelte'
	import type { CampaignPressArticle } from '$lib/data/presse-perte-de-controle'

	export let item: CampaignPressArticle
	export let isEn = false
	/** Carte encadrée, comme la liste presse de la page Emploi (bloc de la marche). */
	export let carte = false

	const formatDate = (date: string) =>
		new Date(date).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
</script>

<a class="press-item" class:carte href={item.url} target="_blank" rel="noopener noreferrer">
	<span class="press-meta">
		<span class="press-source">{item.source}</span>
		{#if item.video}
			<span class="press-video">{isEn ? 'Video' : 'Vidéo'}</span>
		{/if}
		{#if item.date}
			<time datetime={item.date}>{formatDate(item.date)}</time>
		{/if}
		<MoveUpRight size="0.75rem" aria-hidden="true" />
	</span>
	<span class="press-title">{item.title}</span>
</a>

<style>
	.press-item {
		display: block;
		padding: 0.85rem 1rem;
		border: 2px solid rgb(255 148 22 / 45%); /* --brand, atténué */
		border-radius: var(--radius-sm);
		color: inherit;
		text-decoration: none;
		transition: border-color 0.2s ease;
	}

	.press-item:hover,
	.press-item:focus-visible {
		border-color: var(--brand);
	}

	.press-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.press-source {
		font-weight: 700;
		color: var(--text);
	}

	.press-video {
		padding: 0 0.4rem;
		border: 1px solid var(--border);
		border-radius: 0.25rem;
		font-size: 0.75rem;
	}

	.press-title {
		display: block;
		margin-top: 0.25rem;
		font-weight: 600;
		line-height: 1.4;
	}

	/* Variante carte : reprend la liste presse de la page Emploi. */
	.press-item.carte {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
		padding: 0.85rem 1.1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.press-item.carte:hover {
		border-color: var(--brand);
		box-shadow: 0 2px 8px rgba(var(--brand-rgb), 0.1);
	}
</style>
