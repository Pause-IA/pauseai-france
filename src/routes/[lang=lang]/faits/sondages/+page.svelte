<script lang="ts">
	// Sondages d'experts sur les risques de l'IA. Données : src/lib/data/sondages.json
	// (bientôt la table Notion des bénévoles). Seuls les sondages « valide » s'affichent
	// en production ; en développement, ceux « à vérifier » apparaissent aussi.
	import PostMeta from '$components/PostMeta.svelte'
	import RetourFaits from '$components/RetourFaits.svelte'
	import { Card, PageHero } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData

	$: isEn = data.lang === 'en'
	$: title = isEn ? 'Expert surveys' : 'Sondages d’experts'
	$: description = isEn
		? 'When AI researchers are asked about the risks of the technology they build, a significant share consider a catastrophe plausible.'
		: 'Interrogés sur les risques de la technologie qu’ils développent, une part importante des chercheurs en IA jugent une catastrophe plausible.'

	// Déjà filtrées (Notion « Visible », ou JSON) et triées par +page.server.ts.
	$: tous = data.sondages
	$: aVerifier = tous.filter((s) => s.statut !== 'valide').length

	$: fmtDate = (aaaamm: string) =>
		new Date(`${aaaamm}-01`).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			month: 'long',
			year: 'numeric'
		})
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
			Mode développement : {aVerifier} sondage(s) « à vérifier » affiché(s) ici, mais pas en production.
		</p>
	{/if}

	<div class="liste">
		{#each tous as s (s.id)}
			<Card padding="compact">
				<p class="organisme">
					{s.organisme} · {fmtDate(s.date)}
					{#if s.statut !== 'valide'}<span class="a-verifier">À vérifier</span>{/if}
				</p>
				<h2>{s.titre}</h2>
				<p class="chiffre">{s.chiffre}</p>
				<p class="resultat">{s.resultat}</p>
				{#if s.precision}<p class="precision">{s.precision}</p>{/if}
				<p class="repondants">{s.repondants}</p>
				<p class="source">
					<a href={s.source.url} target="_blank" rel="noopener">{s.source.titre}</a>
				</p>
			</Card>
		{:else}
			<p class="vide">{isEn ? 'Surveys coming soon.' : 'Les sondages arrivent bientôt.'}</p>
		{/each}
	</div>
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

	.organisme {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		color: var(--brand-subtle);
		font-size: 0.85rem;
		font-weight: 700;
	}

	h2 {
		margin: 0.35rem 0 0.75rem;
		font-size: 1.15rem;
		line-height: 1.3;
	}

	.chiffre {
		margin: 0;
		color: var(--brand);
		font-size: 2.6rem;
		font-weight: 800;
		line-height: 1;
	}

	.resultat {
		margin: 0.5rem 0 0.75rem;
		font-weight: 600;
		line-height: 1.45;
	}

	.precision,
	.repondants,
	.source,
	.brouillon,
	.vide {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.precision,
	.repondants {
		margin: 0 0 0.6rem;
	}

	.source {
		margin: 0;
	}

	.source a {
		color: inherit;
	}

	.a-verifier {
		padding: 0.1rem 0.55rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-pill);
		color: var(--text);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.brouillon {
		padding: 0.75rem 1rem;
		border: 1px dashed var(--brand);
		border-radius: var(--radius-lg);
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
