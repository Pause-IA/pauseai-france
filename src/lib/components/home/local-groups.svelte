<script lang="ts">
	import { onMount } from 'svelte'
	import { MapPin, Megaphone } from 'lucide-svelte'
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
	}

	// Prochaine action (la plus proche). La section s'affiche toujours ; la ligne
	// événement n'apparaît que s'il y a une action programmée.
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
			/* agenda indisponible : on garde la section sans événement */
		}
	})

	function fmtDate(d: string): string {
		const dt = new Date(d)
		if (Number.isNaN(dt.getTime())) return d
		return dt.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' })
	}

	$: meta = next ? [next.city, fmtDate(next.date)].filter(Boolean).join(' · ') : ''
</script>

<section class="local-groups">
	<div class="text">
		<p class="title">
			<MapPin size="1.2em" />
			{isEn ? 'Local groups' : 'Groupes locaux'}
		</p>
		<p class="desc">
			{#if isEn}
				Demonstrations, leafleting, outreach: Pause AI takes action near you. Join the movement in
				your city.
			{:else}
				Manifestations, tractages, sensibilisation : Pause IA agit près de chez vous. Rejoignez le
				mouvement dans votre ville.
			{/if}
		</p>
		{#if next}
			<p class="next">
				<Megaphone size="1em" />
				<span>
					<strong>{isEn ? 'Next action' : 'Prochaine action'} :</strong>
					{next.title}{#if meta}<span class="next-meta"> · {meta}</span>{/if}
				</span>
			</p>
		{/if}
	</div>

	<div class="actions">
		{#if next && next.url}
			<a class="btn primary" href={next.url} target="_blank" rel="noopener noreferrer">
				{isEn ? 'Take part' : 'Participer'}
			</a>
		{/if}
		<a class="btn" href="{prefix}/groupes-locaux">
			{isEn ? 'See local groups' : 'Voir les groupes locaux'}
		</a>
	</div>
</section>

<style>
	.local-groups {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem 1.75rem;
		background: color-mix(in srgb, var(--brand) 12%, var(--bg));
		border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent);
		border-radius: 1.25rem;
		margin: 0 0 2rem;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 0;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-family: var(--font-heading);
		font-size: 1.4rem;
		font-weight: 700;
		margin: 0;
		color: var(--text);
	}

	.title :global(svg) {
		color: var(--brand);
	}

	.desc {
		margin: 0;
		font-size: 1rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	.next {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		margin: 0.25rem 0 0;
		font-size: 0.95rem;
		color: var(--text);
	}

	.next :global(svg) {
		color: var(--brand);
		flex-shrink: 0;
		transform: translateY(2px);
	}

	.next-meta {
		color: var(--text-2);
	}

	.actions {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.65rem 1.4rem;
		border-radius: 0.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.95rem;
		text-decoration: none;
		white-space: nowrap;
		border: 1.5px solid color-mix(in srgb, var(--brand) 45%, transparent);
		color: var(--brand-subtle, var(--brand));
		background: var(--bg);
		transition: opacity 0.15s;
	}

	.btn:hover {
		opacity: 0.85;
	}

	.btn.primary {
		background: var(--brand);
		color: white;
		border-color: var(--brand);
	}

	@media (min-width: 640px) {
		.local-groups {
			padding: 2.25rem 2.5rem;
		}

		.title {
			font-size: 1.6rem;
		}
	}

	@media (min-width: 1024px) {
		.local-groups {
			flex-direction: row;
			align-items: center;
			gap: 3rem;
			padding: 2.5rem 3rem;
		}

		.text {
			flex: 1;
		}

		.actions {
			flex: 0 0 auto;
			flex-direction: column;
		}

		.actions .btn {
			text-align: center;
		}
	}
</style>
