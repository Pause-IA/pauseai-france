<script lang="ts">
	// Idées reçues sur l'IA : une carte par objection, filtrable par catégorie,
	// avec une recherche. Données : table Notion « Idées reçues » (+page.server.ts).
	import PostMeta from '$components/PostMeta.svelte'
	import { Card, FilterChips, PageHero } from '$components/ui'
	import { ArrowRight, Search } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const title = 'Idées reçues sur l’IA'
	const description =
		'« Il suffirait de la débrancher », « ce n’est que du code »… Nos réponses aux objections les plus courantes, en bref puis en détail.'

	$: idees = data.idees
	// Une pastille par catégorie présente, dans l'ordre prévu (puis les autres).
	$: ordre = [
		...data.categories,
		...new Set(idees.map((i) => i.categorie).filter((c) => !data.categories.includes(c)))
	]
	let categorie = 'toutes'
	$: options = [
		{ value: 'toutes', label: 'Toutes', count: idees.length },
		...ordre
			.filter((c) => idees.some((i) => i.categorie === c))
			.map((c) => ({
				value: c,
				label: c,
				count: idees.filter((i) => i.categorie === c).length
			}))
	]

	// Recherche dans l'objection et la réponse courte, sans tenir compte des accents.
	let recherche = ''
	const simple = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
	$: affichees = idees.filter(
		(i) =>
			(categorie === 'toutes' || i.categorie === categorie) &&
			simple(`${i.objection} ${i.reponseCourte}`).includes(simple(recherche.trim()))
	)
</script>

<PostMeta {title} {description} />

<article>
	<PageHero>
		{title}
		<svelte:fragment slot="lede">{description}</svelte:fragment>
	</PageHero>

	{#if idees.length}
		<FilterChips {options} bind:selected={categorie} />
		<label class="recherche">
			<Search size={16} aria-hidden="true" />
			<span class="sr-only">Rechercher une idée reçue</span>
			<input type="search" bind:value={recherche} placeholder="Rechercher une idée reçue" />
		</label>

		<div class="liste">
			{#each affichees as i (i.slug)}
				<Card href="/{data.lang}/idees-recues/{i.slug}" padding="compact">
					<p class="categorie">{i.categorie}</p>
					<h2>«&nbsp;{i.objection}…&nbsp;»</h2>
					<p class="courte">{i.reponseCourte}</p>
					<span class="suite">Lire l’argumentaire <ArrowRight size={14} aria-hidden="true" /></span>
				</Card>
			{:else}
				<p class="vide">Aucune idée reçue ne correspond à cette recherche.</p>
			{/each}
		</div>
	{:else}
		<p class="vide">Les premières réponses arrivent très bientôt.</p>
	{/if}
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.recherche {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		max-inline-size: 20rem;
		margin-bottom: 1.5rem;
		padding: 0.5rem 0.85rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--bg-card);
		color: var(--text-2);
	}

	.recherche:focus-within {
		border-color: var(--brand);
	}

	.recherche input {
		flex: 1;
		min-inline-size: 0;
		border: none;
		outline: none;
		background: none;
		color: var(--text);
		font-family: inherit;
		font-size: 0.95rem;
	}

	.sr-only {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	.liste {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 1.25rem;
		align-items: start;
	}

	.categorie {
		margin: 0;
		color: var(--brand-subtle);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	h2 {
		margin: 0.4rem 0 0.6rem;
		font-size: 1.12rem;
		line-height: 1.35;
	}

	.courte {
		display: -webkit-box;
		margin: 0 0 0.75rem;
		overflow: hidden;
		color: var(--text-2);
		font-size: 0.92rem;
		line-height: 1.55;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		line-clamp: 5;
	}

	.suite {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		color: var(--brand-subtle);
		font-size: 0.88rem;
		font-weight: 700;
	}

	.vide {
		color: var(--text-2);
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
