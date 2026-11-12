<script lang="ts">
	/**
	 * Ce que nous demandons, en trois points.
	 *
	 * La page d'accueil disait longuement pourquoi s'inquiéter, et nulle part
	 * ce que l'association réclame. Trois points repris du one pager, détaillés
	 * sur /propositions.
	 */
	import { demandes } from '$lib/data/accueil'

	export let lang: 'fr' | 'en' = 'fr'
	$: prefix = `/${lang}`
</script>

<ol class="demandes">
	{#each demandes as d, i (d.titre)}
		<li>
			<span class="rang" aria-hidden="true">{i + 1}</span>
			<div>
				<h3>{d.titre}</h3>
				<p>{d.texte}</p>
			</div>
		</li>
	{/each}
</ol>

<p class="suite">
	<a href="{prefix}/propositions">
		{lang === 'en' ? 'Our proposals in detail' : 'Nos propositions en détail'}
	</a>
</p>

<style>
	.demandes {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.demandes li {
		display: flex;
		gap: 1rem;
		margin: 0;
		padding: 1.1rem 0;
		border-top: 1px solid rgba(var(--brand-rgb), 0.4);
	}

	.demandes li:last-child {
		border-bottom: 1px solid rgba(var(--brand-rgb), 0.4);
	}

	.rang {
		flex-shrink: 0;
		font-family: var(--font-heading);
		font-size: 1.1rem;
		font-weight: 800;
		line-height: 1.4;
		color: var(--brand-subtle);
	}

	h3 {
		margin: 0 0 0.3rem;
		font-size: 1.1rem;
		line-height: 1.3;
	}

	p {
		margin: 0;
		max-inline-size: var(--width-text);
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.suite {
		margin: 1.25rem 0 0;
	}

	.suite a {
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: none;
	}

	.suite a::after {
		content: ' →';
	}

	.suite a:hover,
	.suite a:focus-visible {
		text-decoration: underline;
	}
</style>
