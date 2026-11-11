<script lang="ts">
	/**
	 * Une citation attribuée : portrait, nom, fonction, propos et source.
	 *
	 * Composant plutôt que bloc répété : la carte sert à deux endroits de la
	 * page, dans deux sections différentes. (Sur la branche d'origine c'était
	 * un snippet Svelte 5 ; le site est en Svelte 4.)
	 */
	import { portraitComplet } from '$lib/data/comprendre-le-risque'
	import type { Citation } from '$lib/data/comprendre-le-risque'

	export let c: Citation
</script>

<figure class="citation">
	<div class="qui">
		{#if portraitComplet(c.portrait)}
			<img class="pastille" src={c.portrait?.fichier} alt="" loading="lazy" />
		{:else}
			<span class="pastille" aria-hidden="true">{c.initiales}</span>
		{/if}
		<span>
			<span class="nom">{c.nom}</span>
			<span class="fonction">{c.titre}</span>
		</span>
	</div>
	<blockquote>{c.propos}</blockquote>
	<figcaption>
		{c.source}
		{#if c.url}
			<a href={c.url} target="_blank" rel="noopener noreferrer">{c.lienTexte ?? 'Source'}</a>
		{/if}
	</figcaption>
</figure>

<style>
	.citation {
		display: flex;
		flex-direction: column;
		margin: 1.25rem 0 0;
		padding: 1.5rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		box-shadow: 0 1px 2px rgba(var(--ink-rgb), 0.04);
	}

	.qui {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		margin-bottom: 0.9rem;
	}

	.pastille {
		display: grid;
		place-items: center;
		inline-size: 3rem;
		block-size: 3rem;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--bg-subtle);
		border: 2px solid var(--brand);
		color: var(--brand-subtle);
		font-size: 0.95rem;
		font-weight: 700;
		object-fit: cover;
	}

	.nom {
		display: block;
		font-weight: 700;
		line-height: 1.25;
	}

	.fonction {
		display: block;
		margin-top: 0.1rem;
		font-size: 0.82rem;
		line-height: 1.3;
		color: var(--text-2);
	}

	/* app.css pose un fond crème et une barre orange sur blockquote : la carte
	   porte déjà son cadre, la citation n'a pas besoin d'un second encadré. */
	blockquote {
		margin: 0 0 1rem;
		padding: 0;
		background: none;
		border: 0;
		border-radius: 0;
		font-size: 1rem;
		line-height: 1.55;
		letter-spacing: 0;
		font-weight: 400;
		font-style: italic;
		color: var(--text-2);
	}

	figcaption {
		margin-top: auto;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--text-2);
	}

	figcaption a {
		text-decoration: underline;
	}

	/* À l'impression, les portraits partent : ils coûtent de l'encre et
	   n'apportent rien sur papier. */
	@media print {
		.pastille {
			display: none;
		}

		/* Une citation ne doit pas être coupée entre deux feuilles. */
		.citation {
			break-inside: avoid;
			page-break-inside: avoid;
			box-shadow: none;
			border: 1px solid var(--filet-impression, rgb(153, 153, 153));
		}

		/* On ne clique pas une feuille imprimée : l'adresse de la source doit
		   y figurer. */
		figcaption a::after {
			content: ' (' attr(href) ')';
			font-size: 0.78em;
			font-weight: 400;
			word-break: break-all;
		}
	}
</style>
