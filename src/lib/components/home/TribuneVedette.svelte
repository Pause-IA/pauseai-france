<script lang="ts">
	/**
	 * Le fait marquant mis en vedette : la tribune du Monde.
	 *
	 * Posée sur la surface sombre de la marque, qui sert ici à ce pour quoi
	 * elle est faite — marquer un arrêt dans le fil de la page.
	 *
	 * Le nombre de signataires est compté dans les données, et non écrit en
	 * dur : la liste publiée fait foi, et elle peut encore s'allonger.
	 */
	import { Bandeau } from '$components/ui'
	import { signataires } from '$lib/data/tribunes/le-monde-octobre-2026'

	export let lang: 'fr' | 'en' = 'fr'
	$: prefix = `/${lang}`
	$: isEn = lang === 'en'

	const LIEN_LE_MONDE =
		'https://www.lemonde.fr/idees/article/2026/10/18/une-large-partie-de-la-communaute-scientifique-considere-que-les-risques-lies-a-l-ia-sont-significatifs_6797088_3232.html'
</script>

<Bandeau>
	<p class="source">{isEn ? 'Le Monde · 18 October 2026' : 'Le Monde · 18 octobre 2026'}</p>
	<p class="phrase">
		{isEn
			? '“A large part of the scientific community considers the risks linked to AI to be significant.”'
			: '« Une large partie de la communauté scientifique considère que les risques liés à l’IA sont significatifs. »'}
	</p>
	<p class="contexte">
		{isEn
			? `An op-ed signed by ${signataires.length} researchers and public figures, published in Le Monde.`
			: `Une tribune signée par ${signataires.length} chercheurs et personnalités, publiée dans Le Monde.`}
	</p>
	<p class="liens">
		<a href={LIEN_LE_MONDE} target="_blank" rel="noopener noreferrer">
			{isEn ? 'Read the op-ed' : 'Lire la tribune'}
		</a>
		<a href="{prefix}/tribunes/le-monde-octobre-2026">
			{isEn ? 'See the signatories' : 'Voir les signataires'}
		</a>
	</p>
</Bandeau>

<style>
	.source {
		margin: 0 0 0.75rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--brand);
	}

	.phrase {
		margin: 0 0 0.9rem;
		max-inline-size: 36rem;
		font-family: var(--font-heading);
		font-size: clamp(1.3rem, 3vw, 1.75rem);
		font-weight: 700;
		line-height: 1.25;
		letter-spacing: -0.015em;
	}

	.contexte {
		margin: 0 0 1.25rem;
		font-size: 0.98rem;
		line-height: 1.55;
	}

	.liens {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin: 0;
		font-weight: 600;
	}

	.liens a::after {
		content: ' →';
	}
</style>
