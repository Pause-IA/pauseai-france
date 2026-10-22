<script lang="ts">
	// Déclarations sur les risques de l'IA, en deux onglets :
	//  - « Textes collectifs » : déclarations signées par de nombreuses personnes ;
	//  - « Voix individuelles » : citations, avec filtres par catégorie et recherche.
	// Données : src/lib/data/declarations.json (bientôt la table Notion des bénévoles).
	// Seules les entrées « valide » s'affichent en production ; en développement,
	// celles « à vérifier » apparaissent aussi.
	import PostMeta from '$components/PostMeta.svelte'
	import RetourFaits from '$components/RetourFaits.svelte'
	import { Card, FilterChips, PageHero } from '$components/ui'
	import { ArrowUpRight, Search } from 'lucide-svelte'
	import type { CategorieDeclaration as Categorie, Declaration } from '$lib/server/faits'
	import type { PageData } from './$types'

	export let data: PageData

	$: isEn = data.lang === 'en'
	$: title = isEn ? 'Statements' : 'Déclarations'
	$: description = isEn
		? 'Scientists, AI lab leaders and public figures on the risks of losing control of AI, in their own words.'
		: 'Scientifiques, dirigeants des laboratoires d’IA, personnalités : ce qu’ils disent des risques de perte de contrôle de l’IA, dans leurs propres mots.'

	$: libelles = {
		scientifiques: isEn ? 'Scientists' : 'Scientifiques',
		labos: isEn ? 'AI lab leaders' : 'Dirigeants de labos',
		personnalites: isEn ? 'Public figures' : 'Personnalités',
		lanceurs_alerte: isEn ? 'Whistleblowers' : 'Lanceurs d’alerte'
	} as Record<Categorie, string>

	// Déjà filtrées (Notion « Visible », ou JSON) et triées par +page.server.ts.
	$: toutes = data.declarations
	$: aVerifier = toutes.filter((d) => d.statut !== 'valide').length
	$: collectifs = toutes.filter((d) => d.type === 'collectif')
	$: voix = toutes.filter((d) => d.type === 'individuel')

	let onglet: 'collectifs' | 'voix' = 'voix'
	$: onglets = [
		{
			id: 'collectifs',
			label: isEn ? 'Joint statements' : 'Textes collectifs',
			n: collectifs.length
		},
		{ id: 'voix', label: isEn ? 'Individual voices' : 'Voix individuelles', n: voix.length }
	] as const

	// Voix individuelles : une pastille par catégorie présente (pas de filtre vide).
	let categorie = 'toutes'
	$: options = [
		{ value: 'toutes', label: isEn ? 'All' : 'Toutes', count: voix.length },
		...(Object.keys(libelles) as Categorie[])
			.filter((k) => voix.some((d) => d.categorie === k))
			.map((k) => ({
				value: k,
				label: libelles[k],
				count: voix.filter((d) => d.categorie === k).length
			}))
	]

	// Recherche par nom, sans tenir compte des accents ni des majuscules.
	let recherche = ''
	const simple = (texte: string) => texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
	$: voixAffichees = voix.filter(
		(d) =>
			(categorie === 'toutes' || d.categorie === categorie) &&
			simple(d.auteur).includes(simple(recherche.trim()))
	)

	// Chaque carte montre la version originale ; un bouton bascule vers la traduction.
	let traduites = new Set<string>()
	function basculer(id: string) {
		if (traduites.has(id)) traduites.delete(id)
		else traduites.add(id)
		traduites = traduites
	}
	const texte = (d: Declaration, traduite: boolean) =>
		d.citation_originale && !traduite ? d.citation_originale : d.citation

	$: fmtDate = (date: string) =>
		date.length === 4
			? date
			: new Date(`${date}-01`).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
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
			Mode développement : {aVerifier} déclaration(s) « à vérifier » affichée(s) ici, mais pas en production.
		</p>
	{/if}

	<div class="onglets" role="tablist">
		{#each onglets as o (o.id)}
			<button
				type="button"
				role="tab"
				aria-selected={onglet === o.id}
				class:actif={onglet === o.id}
				on:click={() => (onglet = o.id)}
			>
				{o.label} <span class="n">{o.n}</span>
			</button>
		{/each}
	</div>

	{#if onglet === 'voix'}
		<FilterChips {options} bind:selected={categorie} />
		<label class="recherche">
			<Search size={16} aria-hidden="true" />
			<span class="sr-only">{isEn ? 'Search a name' : 'Rechercher un nom'}</span>
			<input
				type="search"
				bind:value={recherche}
				placeholder={isEn ? 'Search a name' : 'Rechercher un nom'}
			/>
		</label>
	{/if}

	<div class="liste">
		{#each onglet === 'voix' ? voixAffichees : collectifs as d (d.id)}
			{@const traduite = traduites.has(d.id)}
			<Card padding="compact" class="carte">
				{#if d.type === 'collectif'}<h2>{d.auteur}</h2>{/if}
				<blockquote lang={d.citation_originale && !traduite ? 'en' : 'fr'}>
					<p>«&nbsp;{texte(d, traduite)}&nbsp;»</p>
				</blockquote>

				{#if d.type === 'individuel'}
					<div class="auteur">
						<span class="avatar" aria-hidden="true">{initiales(d.auteur)}</span>
						<div>
							<p class="nom">
								{d.auteur}
								{#if d.statut !== 'valide'}<span class="a-verifier">À vérifier</span>{/if}
							</p>
							<p class="fonction">{d.fonction} · {fmtDate(d.date)}</p>
						</div>
					</div>
				{:else}
					<p class="fonction">
						{d.fonction} · {fmtDate(d.date)}
						{#if d.statut !== 'valide'}<span class="a-verifier">À vérifier</span>{/if}
					</p>
				{/if}

				{#if d.contexte}<p class="contexte">{d.contexte}</p>{/if}

				<div class="actions">
					{#if d.citation_originale}
						<button
							type="button"
							class="lien"
							on:click={() => {
								basculer(d.id)
							}}
						>
							{traduite
								? isEn
									? 'Show original'
									: 'Afficher la version originale'
								: isEn
									? 'Show translation'
									: 'Afficher la traduction'}
						</button>
					{/if}
					<a
						class="source"
						href={d.source.url}
						target="_blank"
						rel="noopener"
						title={d.source.titre}
					>
						Source <ArrowUpRight size={14} aria-hidden="true" />
					</a>
				</div>
			</Card>
		{:else}
			<p class="vide">{isEn ? 'No match.' : 'Aucun résultat.'}</p>
		{/each}
	</div>

	<p class="note">
		{isEn
			? 'Quotes are shown in their original language; translations by Pause IA.'
			: 'Les citations sont affichées dans leur langue d’origine ; traductions de Pause IA.'}
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

	.onglets {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--border);
	}

	.onglets button {
		margin-bottom: -1px;
		padding: 0.6rem 0.1rem;
		border: none;
		border-bottom: 2px solid transparent;
		background: none;
		color: var(--text-2);
		font-family: inherit;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
	}

	.onglets button:hover {
		color: var(--text);
	}

	.onglets button.actif {
		border-bottom-color: var(--brand);
		color: var(--text);
	}

	.n {
		font-size: 0.75rem;
		opacity: 0.7;
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
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 1.25rem;
		align-items: start;
	}

	h2 {
		margin: 0 0 0.75rem;
		font-size: 1.1rem;
		line-height: 1.3;
	}

	blockquote {
		margin: 0 0 1rem;
		padding-inline-start: 1rem;
		border-inline-start: 3px solid var(--brand);
	}

	blockquote p {
		margin: 0;
		font-size: 1.02rem;
		font-style: italic;
		line-height: 1.55;
	}

	.auteur {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		inline-size: 2.5rem;
		block-size: 2.5rem;
		border-radius: 50%;
		background: var(--bg-subtle);
		color: var(--text-2);
		font-size: 0.85rem;
		font-weight: 700;
	}

	.nom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		margin: 0;
		font-weight: 700;
	}

	.fonction,
	.contexte,
	.note,
	.brouillon,
	.vide {
		color: var(--text-2);
		font-size: 0.88rem;
		line-height: 1.5;
	}

	.fonction {
		margin: 0.1rem 0 0;
	}

	.contexte {
		margin: 0 0 0.75rem;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		margin-top: 0.75rem;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.lien {
		padding: 0;
		border: none;
		background: none;
		color: var(--brand-subtle);
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		cursor: pointer;
	}

	.lien:hover,
	.source:hover {
		text-decoration: underline;
	}

	.source {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		margin-inline-start: auto;
		color: var(--text-2);
		text-decoration: none;
	}

	.a-verifier {
		padding: 0.1rem 0.55rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-pill);
		font-size: 0.75rem;
		font-weight: 600;
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
