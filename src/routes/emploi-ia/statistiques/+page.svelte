<script lang="ts">
	import { page } from '$app/stores'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import PieChart from '$lib/components/PieChart.svelte'
	import { surveyData } from '$lib/data/survey-stats'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	$: lang = ($page.params.lang as Lang) || 'fr'
	$: t = getT(lang)
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

		<p class="intro">
			Cette micro-étude a été réalisée à partir des résultats d’un questionnaire lancé en juillet
			2025 par l’association Pause IA <a href="https://pauseia.fr/fr/emploi-ia/questionnaire"
				>que vous pouvez trouver ici</a
			>. Ce questionnaire a pour objectif de recueillir l’avis de différentes personnes sur
			l’intelligence artificielle et son impact sur leur vie quotidienne et professionnelle, afin de
			pouvoir eventuellement mieux les accompagner et mieux comprendre comment nous pourrions les
			aider, aussi bien personnellement que professionnellement.
		</p>

		<section class="stats-section">
			<h2>Impact et Rapport à l'IA</h2>
			<div class="charts-grid">
				<PieChart title={t.emploi_ia.stats_impact_title} data={surveyData.impact} />
				<PieChart title={t.emploi_ia.stats_rapport_title} data={surveyData.rapport} />
				<PieChart title={t.emploi_ia.stats_satisfaction_title} data={surveyData.satisfaction} />
				<PieChart title="Fréquence d'utilisation" data={surveyData.frequence_utilisation} />
				<PieChart title="Fréquence d'information" data={surveyData.frequence_info} />
			</div>
		</section>

		<section class="stats-section">
			<h2>Profil des participants</h2>
			<div class="charts-grid">
				<PieChart title="Répartition par âge" data={surveyData.age} />
				<PieChart title="Niveau d'études" data={surveyData.etudes} />
				<PieChart title="Secteur d'activité" data={surveyData.secteur} />
			</div>
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
