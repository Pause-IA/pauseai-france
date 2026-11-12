<script lang="ts">
	/**
	 * Trois preuves chiffrées, juste après la bande « Vu dans ».
	 *
	 * C'est la couche crédibilité, et elle passe avant l'action : un visiteur
	 * voyait « voici comment agir » avant « ces gens sont sérieux ». Trois
	 * chiffres, pas plus — au-delà, aucun ne reste en mémoire.
	 *
	 * Les valeurs vivent dans src/lib/data/accueil.ts, avec la date de leur
	 * dernière vérification : ce sont des chiffres qui vieillissent.
	 */
	import { preuves } from '$lib/data/accueil'

	export let lang: 'fr' | 'en' = 'fr'
	$: prefix = `/${lang}`
</script>

<ul class="preuves">
	{#each preuves as p (p.chiffre)}
		<li>
			<p class="chiffre">{p.chiffre}</p>
			<p class="libelle">{p.libelle}</p>
			<p class="detail">{p.detail}</p>
			{#if p.href && p.lien}
				<a href="{prefix}{p.href}">{p.lien}</a>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.preuves {
		display: grid;
		gap: 2rem 2.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 48rem) {
		.preuves {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.preuves li {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding-top: 1rem;
		border-top: 2px solid var(--brand);
	}

	.chiffre {
		margin: 0;
		font-family: var(--font-heading);
		font-size: clamp(2.2rem, 5vw, 2.8rem);
		font-weight: 800;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--brand-subtle);
	}

	.libelle {
		margin: 0.35rem 0 0.6rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.detail {
		margin: 0 0 0.9rem;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	a {
		margin-top: auto;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: none;
	}

	a::after {
		content: ' →';
	}

	a:hover,
	a:focus-visible {
		text-decoration: underline;
	}
</style>
