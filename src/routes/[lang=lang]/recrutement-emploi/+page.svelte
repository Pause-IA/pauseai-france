<script lang="ts">
	/**
	 * Page « Offres d'emploi » hors période de recrutement.
	 *
	 * L'offre de responsable communication (CDD 12 mois, clôturée le
	 * 6 septembre) a été retirée. La ROUTE est conservée : le pied de page y
	 * renvoie, `/directeur-france` y est redirigé en 301 depuis static/_redirects,
	 * et l'adresse a pu être partagée. Une 404 à la place aurait cassé tout cela.
	 *
	 * La page est en `noindex` et retirée du sitemap (src/lib/routes.ts) : sans
	 * offre, elle n'a rien à faire dans les résultats de recherche, et une page
	 * « aucun poste ouvert » bien référencée dessert l'association.
	 *
	 * Quand un poste rouvre : remplacer ce contenu par l'offre, retirer le
	 * `noindex` ci-dessous et la ligne correspondante de EXCLUDED dans
	 * src/lib/routes.ts.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import { PageHero } from '$components/ui'
	import Button from '$components/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'
</script>

<PostMeta
	title={isEn ? 'Job offers | Pause AI' : 'Offres d’emploi | Pause IA'}
	description={isEn
		? 'Pause AI has no open position at the moment. Future offers will be published on this page.'
		: 'Pause IA n’a pas de poste ouvert en ce moment. Les prochaines offres seront publiées sur cette page.'}
/>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<article>
	<PageHero eyebrow={isEn ? 'Working with us' : 'Travailler avec nous'}>
		{isEn ? 'No open position at the moment' : 'Aucun poste ouvert en ce moment'}
		<svelte:fragment slot="lede">
			{isEn
				? 'Pause AI is not hiring right now. When a position opens, it will be published here.'
				: 'Pause IA ne recrute pas pour l’instant. Dès qu’un poste s’ouvre, il est publié sur cette page.'}
		</svelte:fragment>
	</PageHero>

	<section class="suite">
		<p>
			{#if isEn}
				Almost everything Pause AI does is done by volunteers. You do not need to wait for a job
				advert to take part: the teams take on newcomers all year round, whatever time you can give.
			{:else}
				L’essentiel de ce que fait Pause IA repose sur des bénévoles. Vous n’avez pas besoin
				d’attendre une offre d’emploi pour y prendre part : les équipes accueillent de nouvelles
				personnes toute l’année, quel que soit le temps que vous pouvez donner.
			{/if}
		</p>

		<div class="actions">
			<Button href="{prefix}/rejoindre">
				{isEn ? 'Join Pause AI' : 'Rejoindre Pause IA'}
			</Button>
			<Button href="{prefix}/qui-sommes-nous#nos-equipes" alt>
				{isEn ? 'See the teams' : 'Voir les équipes'}
			</Button>
		</div>

		<p class="note">
			{#if isEn}
				Prefer to be told when we next hire? Our newsletter carries it, along with the rest of the
				association’s news.
			{:else}
				Vous préférez être prévenu de notre prochain recrutement ? Notre newsletter l’annonce, avec
				le reste de l’actualité de l’association.
			{/if}
			<a href="{prefix}/newsletters">{isEn ? 'See the newsletter' : 'Voir la newsletter'}</a>.
		</p>
	</section>
</article>

<style>
	article {
		min-inline-size: 0;
		inline-size: 100%;
		max-inline-size: var(--width-content);
		margin-inline: auto;
		padding-block-end: 5rem;
	}

	.suite {
		max-inline-size: var(--width-text);
	}

	.suite p {
		font-size: 1.05rem;
		line-height: 1.65;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-block: 2rem;
	}

	.note {
		font-size: 0.95rem;
		color: var(--text-2);
	}
</style>
