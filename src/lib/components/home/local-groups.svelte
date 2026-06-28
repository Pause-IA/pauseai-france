<script lang="ts">
	import { onMount } from 'svelte'
	import { MapPin, Megaphone } from 'lucide-svelte'
	import France from '$components/icons/france.svelte'
	import { localGroups } from '$lib/data/local-groups'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'
	$: isEn = lang === 'en'
	$: prefix = lang === 'fr' ? '/fr' : '/en'

	// Pastilles de villes (preuve sociale) : quelques groupes actifs + « +N ».
	const activeCities = localGroups.filter((g) => !g.forming).map((g) => g.name)
	const MAX_PILLS = 5
	const pillCities = activeCities.slice(0, MAX_PILLS)
	const extraCities = activeCities.length - pillCities.length

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
	<div class="lg-top">
		<!-- Carte de France (silhouette réelle, recoloriée à la couleur de marque) -->
		<France class="france-map" />

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
			{#if pillCities.length}
				<a
					class="cities"
					href="{prefix}/groupes-locaux"
					aria-label={isEn ? 'See local groups' : 'Voir les groupes locaux'}
				>
					{#each pillCities as city}
						<span class="city-pill">{city}</span>
					{/each}
					{#if extraCities > 0}
						<span class="city-pill more">+{extraCities}</span>
					{/if}
				</a>
			{/if}
		</div>
		<a class="btn" href="{prefix}/groupes-locaux">
			{isEn ? 'See local groups' : 'Voir les groupes locaux'}
		</a>
	</div>

	{#if next}
		<div class="lg-next">
			<p class="next-text">
				<Megaphone size="1em" />
				<span>
					<strong>{isEn ? 'Next action' : 'Prochaine action'} :</strong>
					{next.title}{#if meta}<span class="next-meta"> · {meta}</span>{/if}
				</span>
			</p>
			{#if next.url}
				<a class="btn primary" href={next.url} target="_blank" rel="noopener noreferrer">
					{isEn ? 'Take part' : 'Participer'}
				</a>
			{/if}
		</div>
	{/if}
</section>

<style>
	.local-groups {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 2rem 1.75rem;
		background: color-mix(in srgb, var(--brand) 12%, var(--bg));
		border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent);
		border-radius: 1.25rem;
		margin: 0 0 2rem;
	}

	.lg-top {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	/* Carte de France (visible partout : compacte sur mobile) */
	.local-groups :global(.france-map) {
		inline-size: 3rem;
		block-size: auto;
		flex-shrink: 0;
		color: var(--brand);
	}

	/* Pastilles de villes */
	.cities {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.85rem;
		text-decoration: none;
	}

	.city-pill {
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		background: var(--bg);
		border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-2);
		transition: border-color 0.15s;
	}

	.cities:hover .city-pill {
		border-color: var(--brand);
	}

	.city-pill.more {
		background: color-mix(in srgb, var(--brand) 16%, transparent);
		color: var(--brand-subtle, var(--brand));
		border-color: transparent;
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

	/* Bandeau « prochaine action » : texte à gauche, bouton aligné à droite */
	.lg-next {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem 1.25rem;
		padding: 0.9rem 1.1rem;
		border-radius: 0.85rem;
		background: var(--bg);
		border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
	}

	.next-text {
		display: flex;
		align-items: baseline;
		gap: 0.45rem;
		margin: 0;
		font-size: 0.95rem;
		color: var(--text);
		min-width: 0;
	}

	.next-text :global(svg) {
		color: var(--brand);
		flex-shrink: 0;
		transform: translateY(2px);
	}

	.next-meta {
		color: var(--text-2);
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
		text-align: center;
		flex-shrink: 0;
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

	@media (min-width: 720px) {
		.lg-top {
			flex-direction: row;
			align-items: center;
			gap: 1.75rem;
		}

		.local-groups :global(.france-map) {
			inline-size: 4.25rem;
		}

		.text {
			flex: 1;
		}
	}
</style>
