<script lang="ts">
	import { page } from '$app/stores'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import PieChart from '$lib/components/PieChart.svelte'
	import { surveyData } from '$lib/data/survey-stats'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import A from '$components/custom/a.svelte'

	$: lang = ($page.params.lang as Lang) || 'fr'
	$: t = getT(lang)

	// Translate labels if needed (for simplicity, I'll keep the ones from surveyData or map them)
	// In a real app, I'd use the keys from t.emploi_questionnaire.options
</script>

<svelte:head>
	<title>{t.emploi_ia.stats_section_title} | Pause IA</title>
</svelte:head>

<div class="stats-page">
	<div class="container">
		<a href="/{lang}/emploi-ia" class="back-link">
			← {t.nav.emploi_ia}
		</a>

		<UnderlinedTitle>
			<h1>{t.emploi_ia.stats_section_title}</h1>
		</UnderlinedTitle>

		<div class="intro">
			<p>
				Cette micro-étude a été réalisée à partir des résultats d’un questionnaire lancé en juillet
				2025 par l’association Pause IA <a href="https://pauseia.fr/fr/emploi-ia/questionnaire"
					>que vous pouvez trouver ici</a
				>
			</p>
			<p>
				Ce questionnaire a pour objectif de recueillir l’avis de différentes personnes sur
				l’intelligence artificielle et son impact sur leur vie quotidienne et professionnelle, afin
				de pouvoir eventuellement mieux les accompagner et mieux comprendre comment nous pourrions
				les aider, aussi bien personnellement que professionnellement.
			</p>
		</div>

		<section class="stats-section">
			<h2>Limite de cette micro-étude et biais statistiques</h2>
			<p>
				Avant de commencer cette micro-étude, il est important de souligner plusieurs biais
				statistiques importants.
			</p>
			<p>
				Pour commencer, le nombre de personnes ayant répondu à ce questionnaire au moment de la
				rédaction de cette micro-étude ({new Date(surveyData.update_date).toLocaleDateString(lang)})
				est de {surveyData.nombre_reponses}. Ce nombre reste relativement faible et ne permet donc
				pas de généraliser les résultats à l’ensemble de la population française.
			</p>
			<p>
				Un autre biais statistique particulièrement visible concerne le niveau d’études des
				répondants. En effet, la majorité des participants possèdent un niveau d’études largement
				supérieur à la moyenne nationale. Par exemple, {(surveyData.etudes.find(
					(item) => item.label === 'Bac +5'
				)?.value || 0) + (surveyData.etudes.find((item) => item.label === '> Bac +5')?.value || 0)} %
				des répondants déclarent avoir un niveau d’études supérieur ou égal à Bac +5, alors que dans
				la population française générale,
				<a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/2011101?geo=FRANCE-1#titre-tableau-FOR_T3"
					>la proportion de personnes ayant un diplôme de niveau Bac +5 ou plus est d’environ 12 %,
					selon l’INSEE en 2023</a
				>
			</p>
			<PieChart title="Niveau d'études des répondants" data={surveyData.etudes} withMargin={true} />
			<p>
				Les diplômés du supérieur long sont donc environ {(
					((surveyData.etudes.find((item) => item.label === 'Bac +5')?.value || 0) +
						(surveyData.etudes.find((item) => item.label === '> Bac +5')?.value || 0)) /
					12
				).toFixed(1)}
				fois plus représentés dans ce questionnaire que dans la population générale. À l’inverse, les
				personnes ayant un niveau d’études inférieur ou égal au Bac général sont très peu représentées
				dans les résultats de cette étude.
			</p>
			<p>
				En plus de ce biais lié au niveau d’études, plusieurs autres déséquilibres apparaissent dans
				l’échantillon.
			</p>
			<p>
				Les indépendants sont davantage représentés que dans la population générale. Ils
				représentent {surveyData.statut?.find((item) => item.label === 'Actif indépendant')
					?.value || 0} % des répondants,
				<a target="_blank" href="https://www.insee.fr/fr/statistiques/8376828?sommaire=8376908"
					>alors qu’ils représentent environ 13.3 % des travailleurs en France selon l’INSEE.</a
				>
			</p>
			<PieChart
				title="Statut professionnel des répondants"
				data={surveyData.statut}
				withMargin={true}
			/>
			<p>
				Les travailleurs indépendants sont donc environ {(
					(surveyData.statut?.find((item) => item.label === 'Actif indépendant')?.value || 0) / 13.3
				).toFixed(1)}
				fois plus représentés dans cette étude que dans la population active française.
			</p>
			<p>
				Les personnes travaillant dans les secteurs de l’informatique et des télécommunications sont
				également fortement surreprésentées. Ce secteur représente {surveyData.secteur?.find(
					(item) => item.label === 'Informatique et télécommunication'
				)?.value || 0} % des répondants,
				<a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/7456871?sommaire=7456956#titre-tableau-figure3"
					>alors qu’il représente environ 3,4 % des emplois en France selon l’INSEE.</a
				>
			</p>
			<PieChart
				title="Répartition des répondants par secteur d'activité"
				data={surveyData.secteur}
				withMargin={true}
			/>
			<p>
				Les métiers du numérique sont donc environ {(
					(surveyData.secteur?.find((item) => item.label === 'Informatique et télécommunication')
						?.value || 0) / 3.4
				).toFixed(1)}
				fois plus représentés dans le questionnaire que dans la population générale.
			</p>
			<p>L’échantillon présente également un léger déséquilibre de genre :</p>
			<ul>
				<li>54,29 % des répondants sont des hommes</li>
				<li>43,81 % sont des femmes</li>
				<li>1,90 % déclarent un autre genre</li>
			</ul>
			<p>
				À titre de comparaison, <a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/2381474"
					>la population française est composée d’environ 51,5 % de femmes selon l’INSEE.
				</a>
			</p>
			<PieChart
				title="Répartition par genre des répondants"
				data={surveyData.genre}
				withMargin={true}
			/>
			<p>
				Enfin, les personnes âgées de 30 à 50 ans sont particulièrement représentées dans les
				réponses :
			</p>
			<ul>
				<li>29,52 % des répondants ont entre 30 et 40 ans</li>
				<li>26,67 % ont entre 40 et 50 ans</li>
			</ul>
			<p>À l’inverse :</p>
			<ul>
				<li>seulement 2,86 % ont entre 10 et 20 ans</li>
				<li>seulement 7,62 % ont plus de 60 ans</li>
			</ul>
			<p>
				Les personnes âgées de 30 à 50 ans représentent donc plus de 56 % de l’échantillon total.
				<a
					target="_blank"
					href="https://www.insee.fr/fr/statistiques/8612506?sommaire=8612596#titre-graphique-figure2"
					>Ce qui ne correspnd pas à la pyramide des âges en France.</a
				>
			</p>
			<PieChart
				title="Répartition par âge des répondants"
				data={surveyData.age}
				withMargin={true}
			/>
			<p>
				Ces différents biais peuvent influencer fortement les résultats de l’étude. Nous le verrons
				plus loin, mais ces biais peuvent s'expliquer par le fait faite que c'est ce profil de la
				population qui semble le plus touché par les transformations liées à l'IA.
			</p>
		</section>

		<section class="stats-section">
			<h2>L'impact de l'IA sur le travail</h2>
			<p>
				Globalement, la majorité des répondants considèrent que l’IA représente déjà une
				transformation importante de leur environnement professionnel. Les réponses les plus
				fréquentes correspondent à un « Impact moyen : transformations auxquelles je m'adapte sans
				grandes difficultés » ({surveyData.impact?.find(
					(item) =>
						item.label ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)?.value || 0}%) ou un « Fort impact : menace de perte d'emploi transformations difficiles »
				({surveyData.impact?.find(
					(item) =>
						item.label === "Fort impact : menace de perte d'emploi transformations difficiles"
				)?.value || 0}%), car ces personnes travaillent déjà avec l'IA. tandis que les réponses
				indiquant « peu d’impact » ({surveyData.impact?.find(
					(item) => item.label === "Peu d'impact / Pas tout de suite"
				)?.value || 0}%) restent minoritaires. Les personnes indiquant un « Très fort impact :
				emploi perdu métier disparu compétences inutiles... » sont aussi minoritaires, avec {surveyData.impact?.find(
					(item) =>
						item.label === 'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)?.value || 0}% des reponses.
			</p>
			<PieChart
				title="Impact jugé de l'IA sur le travail par les répondants"
				data={surveyData.impact}
				withMargin={true}
			/>
		</section>

		<div class="cta-box">
			<h3>Vous souhaitez contribuer ?</h3>
			<p>
				Votre témoignage est précieux pour nous aider à mieux comprendre les transformations en
				cours.
			</p>
			<a href="/{lang}/emploi-ia/questionnaire" class="btn"> Participer à l'enquête </a>
		</div>
	</div>
</div>

<style>
	.stats-page {
		padding: 4rem 0;
		background: var(--bg);
		min-height: 100vh;
	}

	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 2rem;
		color: var(--brand-subtle);
		text-decoration: none;
		font-weight: 500;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.intro {
		font-size: 1.2rem;
		color: var(--text-2);
		margin-bottom: 4rem;
		line-height: 1.6;
	}

	.stats-section {
		margin-bottom: 6rem;
	}

	h2 {
		font-size: 1.8rem;
		margin-bottom: 3rem;
		border-left: 4px solid var(--brand);
		padding-left: 1rem;
	}

	.charts-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
	}

	.cta-box {
		background: var(--brand-light);
		padding: 3rem;
		border-radius: 16px;
		text-align: center;
		margin-top: 4rem;
	}

	.cta-box h3 {
		margin-top: 0;
		font-size: 1.5rem;
		color: var(--brand-subtle);
	}

	.btn {
		display: inline-block;
		background: var(--brand);
		color: white;
		padding: 1rem 2rem;
		border-radius: 9999px;
		text-decoration: none;
		font-weight: 600;
		margin-top: 1.5rem;
		transition: transform 0.2s ease;
	}

	.btn:hover {
		transform: scale(1.05);
		color: white;
	}
</style>
