<script lang="ts">
	/**
	 * Bande « Vu dans » : les médias qui ont parlé de nous.
	 *
	 * En noms et non en logos : nous n'avons pas les fichiers, et un logo mal
	 * détouré ou étiré fait l’effet inverse de celui recherché. Les noms sont
	 * assez connus pour être reconnus seuls.
	 *
	 * Trois secondes de défilement, posées juste après le hero : c'est la
	 * première chose qui doit répondre à « ces gens sont-ils sérieux ? ».
	 */
	import { vuDans } from '$lib/data/accueil'

	export let lang: 'fr' | 'en' = 'fr'
	$: prefix = `/${lang}`
</script>

<section class="vu-dans" aria-labelledby="vu-dans-titre">
	<p class="intitule" id="vu-dans-titre">{lang === 'en' ? 'As seen in' : 'Vu dans'}</p>
	<ul>
		{#each vuDans as media (media)}
			<li>{media}</li>
		{/each}
	</ul>
	<a class="plus" href="{prefix}/presse">
		{lang === 'en' ? 'Press coverage' : 'La revue de presse'}
	</a>
</section>

<style>
	.vu-dans {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.75rem 1.5rem;
		padding-block: 2rem;
		border-top: 1px solid rgba(var(--brand-rgb), 0.4);
		border-bottom: 1px solid rgba(var(--brand-rgb), 0.4);
	}

	.intitule {
		margin: 0;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--brand-subtle);
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 1.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li {
		margin: 0;
		font-family: var(--font-heading);
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--text);
	}

	.plus {
		margin-inline-start: auto;
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: none;
	}

	.plus::after {
		content: ' →';
	}

	.plus:hover,
	.plus:focus-visible {
		text-decoration: underline;
	}

	@media (max-width: 40rem) {
		.plus {
			margin-inline-start: 0;
		}
	}
</style>
