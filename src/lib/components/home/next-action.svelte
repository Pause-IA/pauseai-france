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

	// Prochaine action à venir (la plus proche). Rien si aucun événement :
	// l'encart ne s'affiche alors pas, pour ne pas alourdir la page d'accueil.
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
			/* agenda indisponible : on n'affiche rien */
		}
	})

	function fmtDate(d: string): string {
		const dt = new Date(d)
		if (Number.isNaN(dt.getTime())) return d
		return dt.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long'
		})
	}

	$: meta = next ? [next.city, fmtDate(next.date)].filter(Boolean).join(', ') : ''
</script>

{#if next}
	<section class="next-action" aria-label={isEn ? 'Next local action' : 'Prochaine action locale'}>
		<div class="na-inner">
			<p class="na-text">
				<span class="na-emoji" aria-hidden="true">📣</span>
				<strong>{isEn ? 'Next action' : 'Prochaine action'} :</strong>
				{next.title}{#if meta}<span class="na-meta"> · {meta}</span>{/if}
			</p>
			<div class="na-links">
				{#if next.url}
					<a class="na-cta" href={next.url} target="_blank" rel="noopener noreferrer">
						{isEn ? 'Take part' : 'Participer'}
					</a>
				{/if}
				<a class="na-link" href="{prefix}/groupes-locaux">
					{isEn ? 'All groups' : 'Voir tous les groupes'}
				</a>
			</div>
		</div>
	</section>
{/if}

<style>
	.next-action {
		max-inline-size: 62rem;
		margin: 1.5rem auto 0;
		padding: 0 1.25rem;
	}

	.na-inner {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1.25rem;
		padding: 0.85rem 1.25rem;
		border: 1px solid var(--brand);
		border-radius: 12px;
		background: var(--brand-light);
	}

	.na-text {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.4;
		min-inline-size: 0;
	}

	.na-emoji {
		margin-right: 0.35rem;
	}

	.na-meta {
		color: var(--text-2);
	}

	.na-links {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		flex-shrink: 0;
	}

	.na-cta {
		padding: 0.45rem 1.05rem;
		border-radius: 8px;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.9rem;
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}

	.na-cta:hover {
		filter: brightness(0.96);
	}

	.na-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand-subtle);
		white-space: nowrap;
	}
</style>
