<script lang="ts">
	// Chercheur·ses qui ont quitté un laboratoire d'IA en alertant sur les risques.
	// Les données sont dans src/lib/data/demissions.json. Seules les entrées
	// relues et validées (« statut » : "valide") s'affichent en production ;
	// en développement, les entrées « à vérifier » apparaissent aussi, signalées.
	import PostMeta from '$components/PostMeta.svelte'
	import RetourFaits from '$components/RetourFaits.svelte'
	import { Card, FilterChips, PageHero } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData

	$: isEn = data.lang === 'en'
	$: title = isEn ? 'They left the AI labs' : 'Ils ont quitté les labos d’IA'
	$: description = isEn
		? 'Researchers who left the major AI labs while publicly warning about the risks, in their own words.'
		: 'Des chercheuses et chercheurs ont quitté les grands laboratoires d’IA en alertant publiquement sur les risques. Leurs raisons, dans leurs propres mots.'

	// Déjà filtrées (Notion « Visible », ou JSON) et triées par +page.server.ts.
	$: toutes = data.demissions
	$: aVerifier = toutes.filter((d) => d.statut !== 'valide').length

	let labo = 'tous'
	$: options = [
		{ value: 'tous', label: isEn ? 'All' : 'Tous', count: toutes.length },
		...[...new Set(toutes.map((d) => d.labo))].sort().map((l) => ({
			value: l,
			label: l,
			count: toutes.filter((d) => d.labo === l).length
		}))
	]
	$: affichees = labo === 'tous' ? toutes : toutes.filter((d) => d.labo === labo)

	$: fmtDate = (aaaamm: string) =>
		new Date(`${aaaamm}-01`).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			month: 'long',
			year: 'numeric'
		})
	const initiales = (nom: string) =>
		nom
			.split(/\s+/)
			.map((mot) => mot[0])
			.join('')
			.slice(0, 2)
</script>

<PostMeta {title} {description} />

<article>
	<RetourFaits lang={data.lang} />
	<PageHero>
		{title}
		<svelte:fragment slot="lede">{description}</svelte:fragment>
	</PageHero>

	{#if aVerifier}
		<p class="brouillon">
			Mode développement : {aVerifier} entrée(s) « à vérifier » affichée(s) ici, mais pas en production.
		</p>
	{/if}

	<FilterChips {options} bind:selected={labo} />

	<div class="liste">
		{#each affichees as d (d.id)}
			<Card padding="compact">
				<div class="entete">
					{#if d.photo}
						<img src={d.photo.url} alt={d.nom} width="64" height="64" loading="lazy" />
					{:else}
						<div class="sans-photo" aria-hidden="true">{initiales(d.nom)}</div>
					{/if}
					<div>
						<h2>{d.nom}</h2>
						<p class="meta">
							{d.poste}, {d.labo} · {isEn ? 'left in' : 'départ en'}
							{fmtDate(d.date)}
						</p>
					</div>
					{#if d.statut !== 'valide'}<span class="a-verifier">À vérifier</span>{/if}
				</div>

				<blockquote>
					<p>«&nbsp;{d.citation}&nbsp;»</p>
					{#if d.citation_originale}
						<p class="originale" lang="en">“{d.citation_originale}”</p>
					{/if}
				</blockquote>

				{#if d.contexte}<p class="contexte">{d.contexte}</p>{/if}

				<p class="source">
					{isEn ? 'Source:' : 'Source :'}
					<a href={d.source.url} target="_blank" rel="noopener">{d.source.titre}</a>
					{#if d.photo}· {isEn ? 'Photo:' : 'Photo :'} {d.photo.auteur}, {d.photo.licence}{/if}
				</p>
			</Card>
		{/each}
	</div>

	<p class="note">
		{isEn
			? 'Quotes translated by Pause IA; the original wording is shown below each translation.'
			: 'Citations traduites par Pause IA ; la formulation d’origine figure sous chaque traduction.'}
	</p>
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.liste {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 1.25rem;
	}

	.entete {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.entete img,
	.sans-photo {
		flex: none;
		inline-size: 4rem;
		block-size: 4rem;
		border-radius: 50%;
		border: 3px solid var(--brand);
		object-fit: cover;
	}

	.sans-photo {
		display: grid;
		place-items: center;
		background: var(--bg-subtle);
		color: var(--text-2);
		font-weight: 700;
	}

	h2 {
		margin: 0;
		font-size: 1.15rem;
	}

	.meta,
	.contexte,
	.source,
	.note,
	.brouillon {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.meta {
		margin: 0.2rem 0 0;
	}

	.a-verifier {
		margin-inline-start: auto;
		padding: 0.15rem 0.6rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-pill);
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	blockquote {
		margin: 0 0 1rem;
		padding-inline-start: 1rem;
		border-inline-start: 3px solid var(--brand);
	}

	blockquote p {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.5;
	}

	blockquote .originale {
		margin-top: 0.4rem;
		color: var(--text-2);
		font-size: 0.85rem;
		font-style: italic;
	}

	.source a {
		color: inherit;
	}

	.brouillon {
		padding: 0.75rem 1rem;
		border: 1px dashed var(--brand);
		border-radius: var(--radius-lg);
	}

	.note {
		margin-top: 2rem;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
