<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import plan from '$lib/data/plan-du-site.json'

	/* Page INTERNE : hors menu, hors pied de page, hors sitemap, et noindex.
	   Elle existe pour travailler la structure du site en équipe, repérer les
	   pages qu'aucun menu n'atteint, vérifier qu'une rubrique est cohérente.

	   Le diagramme est dessiné en CSS, sans bibliothèque : une page de travail
	   doit s'ouvrir instantanément, fonctionner hors ligne, suivre le thème
	   sombre et s'imprimer. Mermaid aurait ajouté ~1 Mo pour le même résultat.

	   Les données viennent de src/lib/data/plan-du-site.json, régénéré à chaque
	   déploiement par scripts/plan-du-site.mjs, même source que le document
	   docs/plan-du-site.md, donc les deux ne peuvent pas diverger. */
	export let data: { lang?: string }

	$: prefix = `/${data.lang ?? 'fr'}`
</script>

<PostMeta title="Plan du site · interne" description="Arborescence réelle du site." />

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="page">
	<header class="hero">
		<p class="eyebrow">Document de travail interne</p>
		<h1>Plan du site</h1>
		<span class="filet" aria-hidden="true"></span>
		<p class="lede">
			L’arborescence réelle, régénérée à chaque déploiement depuis les routes, le menu et le pied de
			page. Cette page n’est ni dans le menu, ni dans le sitemap, ni indexée.
		</p>
		<p class="meta">
			{plan.total.pages} pages · {plan.total.dynamiques} gabarits dynamiques · {plan.total.articles}
			articles · {plan.orphelines.length} hors menu · généré le {plan.genere}
		</p>
	</header>

	<section class="bloc">
		<h2>Depuis le menu principal</h2>
		<div class="arbre">
			{#each plan.groupes as groupe}
				<div class="rubrique">
					<div class="tete">{groupe.label}</div>
					<ul>
						{#each groupe.items as item}
							<li>
								{#if item.externe}
									<a
										class="noeud externe"
										href={item.href}
										target="_blank"
										rel="noopener noreferrer"
									>
										<span class="titre">{item.label}</span>
										<span class="chemin">site externe ↗</span>
									</a>
								{:else}
									<a class="noeud" href="{prefix}{item.href}">
										<span class="titre">{item.label}</span>
										<span class="chemin">{item.href}</span>
									</a>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>

	<section class="bloc">
		<h2>Pages hors menu</h2>
		<p class="intro">
			En ligne, mais qu’aucun menu ni pied de page n’atteint. Certaines sont normales (pages
			d’atterrissage de campagne, confirmations, remerciements) ; les autres méritent une entrée ou
			un retrait.
		</p>
		<ul class="orphelines">
			{#each plan.orphelines as page}
				<!-- `page.url` et non `prefix + chemin` : /recrutement et /guide-recrutement
				     sont des pages françaises sans préfixe de langue, et /fr/… y renvoie 404. -->
				<li>
					<a class="noeud orpheline" href={page.url}><span class="chemin">{page.chemin}</span></a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="bloc">
		<h2>Pied de page</h2>
		<div class="arbre">
			{#each plan.colonnes as colonne}
				<div class="rubrique">
					<div class="tete sobre">{colonne.label}</div>
					<ul>
						{#each colonne.liens as lien}
							<li>
								<span class="noeud plat">
									<span class="titre">{lien.label}</span>
									<span class="chemin">{lien.externe ? 'site externe ↗' : lien.href}</span>
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	.page {
		inline-size: 100%;
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	.hero {
		margin-block: 2.5rem 3.5rem;
	}

	.eyebrow {
		margin: 0 0 0.4rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5.5vw, 3rem);
		line-height: 1.1;
		color: var(--text);
	}

	.filet {
		display: block;
		inline-size: 3rem;
		block-size: 4px;
		margin-block: 1.25rem 0;
		border-radius: var(--radius-pill);
		background: var(--brand);
	}

	.lede {
		margin: 1.25rem 0 0;
		max-inline-size: var(--width-text);
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.meta {
		margin: 0.9rem 0 0;
		font-size: 0.9rem;
		color: var(--text-2);
	}

	.bloc {
		margin-block-end: 3.5rem;
	}

	h2 {
		margin: 0 0 1rem;
		font-size: clamp(1.4rem, 3vw, 1.75rem);
	}

	.intro {
		margin: 0 0 1.5rem;
		max-inline-size: var(--width-text);
		color: var(--text-2);
		line-height: 1.7;
	}

	.arbre {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
		gap: 1.5rem;
		align-items: start;
	}

	.tete {
		padding: 0.6rem 0.9rem;
		font-weight: 700;
		color: var(--on-brand);
		background: var(--brand);
		border-radius: var(--radius-sm);
	}

	/* Le pied de page est une structure secondaire : même forme, moins de poids. */
	.tete.sobre {
		color: var(--text);
		background: var(--bg-subtle);
		border: 1px solid var(--brand);
	}

	.rubrique ul {
		list-style: none;
		margin: 0;
		padding: 0 0 0 1.1rem;
		/* Le trait vertical et les coudes dessinent l'arborescence : c'est lui
		   qui fait lire la page comme un diagramme plutôt qu'une liste. */
		border-inline-start: 2px solid var(--border);
		margin-inline-start: 0.9rem;
	}

	.rubrique li {
		position: relative;
		margin-block-start: 0.5rem;
	}

	.rubrique li::before {
		content: '';
		position: absolute;
		inset-inline-start: -1.1rem;
		inset-block-start: 1.1rem;
		inline-size: 1.1rem;
		block-size: 2px;
		background: var(--border);
	}

	.noeud {
		display: block;
		padding: 0.5rem 0.75rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: var(--text);
	}

	a.noeud:hover,
	a.noeud:focus-visible {
		border-color: var(--brand);
	}

	.noeud.externe {
		border-style: dashed;
	}

	.titre {
		display: block;
		font-size: 0.95rem;
		line-height: 1.3;
	}

	.chemin {
		display: block;
		margin-block-start: 0.15rem;
		font-size: 0.78rem;
		color: var(--text-2);
		word-break: break-word;
	}

	.orphelines {
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
	}

	.noeud.orpheline {
		background: var(--bg-subtle);
		border-color: var(--brand);
	}

	.noeud.orpheline .chemin {
		color: var(--text);
		font-size: 0.85rem;
	}

	@media (max-width: 600px) {
		.page {
			padding-inline: 1.1rem;
		}
	}
</style>
