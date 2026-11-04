<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$lib/components/Button.svelte'
	import { getT } from '$lib/i18n'
	import { getSortedCampaigns } from '$lib/campaigns'
	import type { Campaign } from '$lib/campaigns'
	import { fade } from 'svelte/transition'
	import { Badge, Card, Page } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData

	$: t = getT(data.lang)
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'
	$: sortedCampaigns = getSortedCampaigns()
	$: activeCount = sortedCampaigns.filter((c) => c.status === 'active').length

	const MONTHS_FR = [
		'jan.',
		'fév.',
		'mars',
		'avr.',
		'mai',
		'juin',
		'juil.',
		'août',
		'sept.',
		'oct.',
		'nov.',
		'déc.'
	]
	const MONTHS_EN = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	function formatDate(yyyymm: string): string {
		const [year, month] = yyyymm.split('-')
		const m = parseInt(month, 10) - 1
		const months = isEn ? MONTHS_EN : MONTHS_FR
		return `${months[m]} ${year}`
	}

	let selectedCampaign: Campaign | null = null

	function openSummary(campaign: Campaign) {
		if (campaign.status === 'ended' && campaign.summary) {
			selectedCampaign = campaign
		}
	}

	function closeSummary() {
		selectedCampaign = null
	}

	// Seul un clic sur le fond ferme la modale : un clic dans la boîte remonte
	// jusqu'ici, on le distingue par sa cible.
	function closeOnBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) closeSummary()
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeSummary()
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<PostMeta title={t.campagnes.meta_title} description={t.campagnes.meta_desc} />

<Page width="wide" eyebrow={t.nav.campagnes} title={t.campagnes.title} lede={t.campagnes.subtitle}>
	<section class="hero">
		<p class="active-count">
			<Badge variant="success">
				{activeCount}
				{activeCount === 1 ? t.campagnes.active_count_singular : t.campagnes.active_count_plural}
			</Badge>
		</p>
	</section>

	<section class="campaigns-list">
		{#each sortedCampaigns as campaign}
			{@const content = isEn ? campaign.en : campaign.fr}
			{@const href = campaign.url ?? `${prefix}/${campaign.slug}`}
			{@const hasSummary = campaign.status === 'ended' && campaign.summary}
			<Card
				interactive={Boolean(hasSummary)}
				class="campaign-card {campaign.status === 'ended' ? 'ended' : ''} {hasSummary
					? 'clickable'
					: ''}"
				role={hasSummary ? 'button' : undefined}
				tabindex={hasSummary ? 0 : undefined}
				on:click={() => {
					if (hasSummary) openSummary(campaign)
				}}
				on:keydown={(e) => {
					if (e.key === 'Enter' && hasSummary) openSummary(campaign)
				}}
			>
				<div class="card-top">
					<Badge size="sm" variant={campaign.status === 'ended' ? 'neutral' : 'success'}>
						{campaign.status === 'active' ? t.campagnes.badge_active : t.campagnes.badge_ended}
					</Badge>
					<span class="card-date">
						{#if campaign.endDate}
							{formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
						{:else}
							{t.campagnes.since} {formatDate(campaign.startDate)}
						{/if}
					</span>
				</div>
				<h2>{content.title}</h2>
				<p>{content.description}</p>
				{#if campaign.status === 'active'}
					<Button {href}>{content.cta}</Button>
				{:else if hasSummary}
					<span class="see-results">{isEn ? 'View results' : 'Voir le bilan'} →</span>
				{/if}
			</Card>
		{/each}
	</section>
</Page>

{#if selectedCampaign?.summary}
	{@const summary = isEn ? selectedCampaign.summary.en : selectedCampaign.summary.fr}
	{@const content = isEn ? selectedCampaign.en : selectedCampaign.fr}
	<div
		class="modal-overlay"
		role="presentation"
		on:click={closeOnBackdrop}
		transition:fade={{ duration: 150 }}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-label={isEn ? 'Campaign results' : 'Bilan de la campagne'}
		>
			<button class="modal-close" on:click={closeSummary} aria-label={isEn ? 'Close' : 'Fermer'}
				>&times;</button
			>

			<div class="modal-header">
				<Badge size="sm" variant="neutral">{t.campagnes.badge_ended}</Badge>
				<h2>{content.title}</h2>
				{#if selectedCampaign.startDate}
					<p class="modal-dates">
						{formatDate(
							selectedCampaign.startDate
						)}{#if selectedCampaign.endDate && selectedCampaign.endDate !== selectedCampaign.startDate}
							– {formatDate(selectedCampaign.endDate)}{/if}
					</p>
				{/if}
			</div>

			<!-- Les bilans longs sont écrits en paragraphes séparés par une ligne
			     vide : un seul bloc de texte devenait illisible. -->
			{#each summary.text.split('\n\n') as paragraph}
				<p class="modal-text">{paragraph}</p>
			{/each}

			{#if summary.results.length > 0}
				<div class="results-grid">
					{#each summary.results as result}
						<div class="result-card">
							<span class="result-value">{result.value}</span>
							<span class="result-label">{result.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if summary.articles?.length}
				<div class="articles-section">
					<h3 class="articles-title">
						{summary.articlesTitle ?? (isEn ? 'Press coverage' : 'Couverture presse')}
					</h3>
					<ul class="articles-list">
						{#each summary.articles as article}
							<li>
								<!-- Un article du site reste dans l'onglet courant ; seule une
								     source externe s'ouvre à côté. -->
								<a
									href={article.url}
									target={article.url.startsWith('http') ? '_blank' : undefined}
									rel="noopener noreferrer"
									class="article-link"
								>
									<span class="article-source">{article.source}</span>
									<span class="article-title">{article.title}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			{#if summary.link}
				<a
					href={summary.link.url}
					target={summary.link.url.startsWith('http') ? '_blank' : undefined}
					rel="noopener noreferrer"
					class="modal-link-btn"
				>
					{summary.link.label}{summary.link.url.startsWith('http') ? ' ↗' : ' →'}
				</a>
			{/if}
		</div>
	</div>
{/if}

<style>
	.hero {
		margin: -1rem 0 2rem;
	}

	.campaigns-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 5rem;
	}

	/* Le fond, la bordure et l'ombre viennent du composant Card. */
	.campaigns-list :global(.campaign-card) {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.campaigns-list :global(.campaign-card.ended) {
		opacity: 0.75;
		cursor: default;
	}

	.campaigns-list :global(.campaign-card.ended:hover) {
		transform: none;
		box-shadow: var(--shadow-card);
		border-color: var(--border);
	}

	.campaigns-list :global(.campaign-card.clickable) {
		cursor: pointer;
	}

	.active-count {
		margin-top: 0.5rem;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.card-date {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.card-top :global(.ui-badge) {
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.campaigns-list :global(.campaign-card p) {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text-muted);
		margin-bottom: 1.5rem;
	}

	.see-results {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand-subtle);
		margin-top: auto;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(var(--ink-rgb), 0.5);
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		backdrop-filter: blur(3px);
	}

	.modal {
		background: var(--bg);
		border-radius: 1rem;
		padding: 2.5rem;
		max-width: 36rem;
		width: 100%;
		max-height: 90dvh;
		overflow-y: auto;
		position: relative;
		box-shadow: 0 16px 48px rgba(var(--ink-rgb), 0.2);
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 1.75rem;
		line-height: 1;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
		transition: background 0.15s;
	}

	.modal-close:hover {
		background: var(--bg-subtle);
	}

	.modal-header {
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		font-size: 1.5rem;
		margin-top: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.modal-dates {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.modal-text {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		color: var(--text);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	/* Un troisième chiffre seul sur sa ligne : il occupe toute la largeur
	   plutôt que de laisser un trou à côté. */
	.result-card:nth-child(3):last-child {
		grid-column: 1 / -1;
	}

	.result-card {
		background: var(--bg-subtle);
		border-radius: var(--radius-md);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.result-value {
		font-weight: 700;
		font-size: 1rem;
		color: var(--text);
	}

	.result-label {
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.articles-section {
		margin-top: 1.5rem;
	}

	.articles-title {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--text-secondary);
		margin: 0 0 0.75rem;
	}

	.articles-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.article-link {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.45rem 0.6rem;
		border-radius: var(--radius-sm);
		text-decoration: none;
		transition: background 0.15s;
	}

	.article-link:hover {
		background: var(--bg-subtle);
	}

	.article-source {
		flex-shrink: 0;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--brand-subtle);
		background: color-mix(in srgb, var(--brand) 10%, var(--bg));
		padding: 0.1rem 0.45rem;
		border-radius: var(--radius-pill);
	}

	.article-title {
		font-size: 0.9rem;
		color: var(--text);
		line-height: 1.4;
	}

	.modal-link-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 1.5rem;
		padding: 0.55rem 1.1rem;
		border-radius: var(--radius-pill);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		background: color-mix(in srgb, var(--brand) 12%, var(--bg));
		color: var(--brand-subtle);
		border: 1.5px solid color-mix(in srgb, var(--brand) 35%, transparent);
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.modal-link-btn:hover {
		background: color-mix(in srgb, var(--brand) 20%, var(--bg));
		border-color: color-mix(in srgb, var(--brand) 55%, transparent);
	}

	@media (max-width: 600px) {
		h2 {
			font-size: 1.4rem;
		}

		.campaigns-list :global(.campaign-card) {
			padding: 1.5rem;
		}

		.modal-overlay {
			align-items: flex-end;
			padding: 0;
		}

		.modal {
			width: 100%;
			max-width: 100%;
			max-height: 88dvh;
			border-radius: 1.25rem 1.25rem 0 0;
			padding: 1.25rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
		}

		.modal::before {
			content: '';
			display: block;
			width: 2.5rem;
			height: 0.25rem;
			background: var(--border);
			border-radius: var(--radius-pill);
			margin: 0 auto 1.25rem;
		}

		.modal-close {
			top: 0.75rem;
			right: 0.75rem;
		}

		.results-grid {
			grid-template-columns: 1fr 1fr;
		}

		.modal-link-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
