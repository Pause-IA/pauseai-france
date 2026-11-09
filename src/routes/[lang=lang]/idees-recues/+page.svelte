<script lang="ts">
	// Idées reçues sur l'IA : une carte par objection, filtrable par catégorie,
	// avec une recherche. Données : table Notion « Idées reçues » (+page.server.ts).
	import PostMeta from '$components/PostMeta.svelte'
	import TexteNotion from '$components/TexteNotion.svelte'
	import { Card, FilterChips, PageHero } from '$components/ui'
	import { ArrowRight, Search } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const title = 'Idées reçues sur l’IA'
	// Texte du haut de page : version de Jeanne (com), 04/11/2026.
	const accroche =
		'« Il suffirait de la débrancher », « Ce n’est que du code »… Beaucoup de nos concitoyens sont encore très mal informés sur les dangers de l’IA et s’arrêtent aux idées reçues.'
	const invitation =
		'Pour vous aider à informer votre entourage et à répondre aux objections infondées, les bénévoles de Pause IA proposent ici des réponses détaillées aux idées reçues. Ce catalogue se construit progressivement.'
	// Pour les moteurs de recherche et les aperçus de lien : plus court.
	const description =
		'« Il suffirait de la débrancher », « Ce n’est que du code »… Les réponses détaillées des bénévoles de Pause IA aux idées reçues sur l’IA.'

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

	// Les thèmes (#alignement…) traversent les catégories. Pas de filtre par
	// thème en haut de page (retour de Jeanne, 04/11/2026 : « simplifions ») ;
	// ils s'affichent en simple texte sur les cartes, pour ne pas ressembler aux
	// boutons des catégories.
	const diese = (t: string) => (t.startsWith('#') ? t : `#${t}`)

	// Recherche dans l'objection et la réponse courte, sans tenir compte des accents.
	let recherche = ''
	// Recherche tolérante : sans accents, sans majuscules, et « n'est » tapé au
	// clavier trouve « n’est » affiché.
	const simple = (t: string) =>
		t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/’/g, "'").toLowerCase()
	// Sur « Toutes », les catégories sont mêlées (demande de Jeanne, 04/11/2026) :
	// la 1re idée de chaque catégorie, puis la 2e de chaque, etc. Un ordre fixe
	// plutôt qu'un tirage au hasard : la page ne bouge pas d'une visite à l'autre,
	// et le rendu serveur et celui du navigateur restent identiques.
	function melangerLesCategories(liste: typeof idees): typeof idees {
		const parCategorie = ordre.map((c) => liste.filter((i) => i.categorie === c))
		const tour = Math.max(0, ...parCategorie.map((l) => l.length))
		return Array.from({ length: tour }, (_, rang) =>
			parCategorie.flatMap((l) => (rang < l.length ? [l[rang]] : []))
		).flat()
	}
	$: triees = categorie === 'toutes' ? melangerLesCategories(idees) : idees
	$: affichees = triees.filter(
		(i) =>
			(categorie === 'toutes' || i.categorie === categorie) &&
			simple(`${i.objection} ${i.reponseCourte}`).includes(simple(recherche.trim()))
	)
</script>

<PostMeta {title} {description} />

<article>
	<PageHero>
		{title}
		<svelte:fragment slot="lede"
			><span class="paragraphe">{accroche}</span><span class="paragraphe">{invitation}</span
			></svelte:fragment
		>
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
					<p class="courte">
						<TexteNotion segments={i.reponseCourteMiseEnForme} liens={false} />
					</p>
					{#if i.themes.length}
						<ul class="themes">
							{#each i.themes as t}<li>{diese(t)}</li>{/each}
						</ul>
					{/if}
					<span class="suite">Voir plus <ArrowRight size={14} aria-hidden="true" /></span>
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

	.paragraphe {
		display: block;
	}

	.paragraphe + .paragraphe {
		margin-top: 0.75rem;
	}

	/* Thèmes : du texte, pas des boutons (les catégories en sont). */
	.themes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.6rem;
		margin: 0 0 0.6rem;
		padding: 0;
		list-style: none;
	}

	.themes li {
		margin: 0; /* annule la marge et le retrait des <li> du site (app.css) */
		padding: 0;
		color: var(--text-2);
		font-size: 0.8rem;
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
