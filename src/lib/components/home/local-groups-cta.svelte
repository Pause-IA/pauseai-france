<script lang="ts">
	import { onMount } from 'svelte'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'
	$: isEn = lang === 'en'
	$: prefix = lang === 'fr' ? '/fr' : '/en'

	interface LocalEvent {
		id: string
		title: string
		date: string
		city: string
		type: string
		url: string
		description: string
		image?: string
	}

	// Prochaine action à venir (la plus proche). Optionnelle : la mini-section
	// « groupes locaux » s'affiche toujours, et n'ajoute la ligne événement que
	// s'il y a effectivement une action programmée.
	let next: LocalEvent | null = null
	onMount(async () => {
		try {
			const res = await fetch('/api/events')
			if (!res.ok) return
			const events: LocalEvent[] = await res.json()
			const today = new Date()
			today.setHours(0, 0, 0, 0)
			next =
				events
					.filter((e) => new Date(e.date) >= today)
					.sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] ?? null
		} catch {
			/* agenda indisponible : on garde la mini-section sans événement */
		}
	})

	function fmtDate(d: string): string {
		const dt = new Date(d)
		if (Number.isNaN(dt.getTime())) return d
		return dt.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' })
	}

	$: meta = next ? [next.city, fmtDate(next.date)].filter(Boolean).join(', ') : ''
</script>

<section class="lg" aria-label={isEn ? 'Local groups' : 'Groupes locaux'}>
	<div class="lg-card">
		<p class="lg-main">
			<span class="lg-icon" aria-hidden="true">📍</span>
			<span>
				<strong>{isEn ? 'Local groups' : 'Groupes locaux'}</strong> ·
				{isEn
					? 'Pause AI takes action near you: demonstrations, leafleting, outreach.'
					: 'Pause IA agit près de chez vous : manifestations, tractages, sensibilisation.'}
				<a class="lg-link" href="{prefix}/groupes-locaux">
					{isEn ? 'See local groups ↗' : 'Voir les groupes locaux ↗'}
				</a>
			</span>
		</p>

		{#if next}
			<p class="lg-next">
				<span class="lg-icon" aria-hidden="true">📣</span>
				<span class="lg-next-text">
					<strong>{isEn ? 'Next action' : 'Prochaine action'} :</strong>
					{next.title}{#if meta}<span class="lg-meta"> · {meta}</span>{/if}
				</span>
				{#if next.url}
					<a class="lg-cta" href={next.url} target="_blank" rel="noopener noreferrer">
						{isEn ? 'Take part' : 'Participer'}
					</a>
				{/if}
			</p>
		{/if}
	</div>
</section>

<style>
	.lg {
		max-inline-size: 62rem;
		margin: 1.5rem auto 0;
		padding: 0 1.25rem;
	}

	.lg-card {
		border: 1px solid var(--brand);
		border-radius: 12px;
		background: var(--brand-light);
		padding: 1rem 1.25rem;
	}

	.lg-main {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.5;
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
	}

	.lg-icon {
		flex-shrink: 0;
	}

	.lg-link {
		color: var(--brand-subtle);
		font-weight: 600;
		white-space: nowrap;
	}

	.lg-next {
		margin: 0.85rem 0 0;
		padding-top: 0.85rem;
		border-top: 1px solid var(--brand);
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 0.85rem;
		font-size: 0.95rem;
	}

	.lg-next-text {
		flex: 1;
		min-inline-size: 0;
	}

	.lg-meta {
		color: var(--text-2);
	}

	.lg-cta {
		padding: 0.4rem 1rem;
		border-radius: 8px;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.88rem;
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.lg-cta:hover {
		filter: brightness(0.96);
	}
</style>
