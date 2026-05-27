<script lang="ts">
	import PieChart from './PieChart.svelte'
	import { surveyData } from '$lib/data/survey-stats'

	export let t: any
	export let lang: string = 'fr'

	// Use real data from the survey-stats.ts file
	// We map them to ensure labels are concise if needed,
	// but here we'll use the labels directly from Notion data.
	$: impactData = surveyData.impact
	$: rapportData = surveyData.rapport
	$: satisfactionData = surveyData.satisfaction
	$: frequenceUtilisationData = surveyData.frequence_utilisation
	$: frequenceInfoData = surveyData.frequence_info
	$: secteurData = surveyData.secteur
</script>

<section class="survey-stats">
	<h2>{t.emploi_ia.stats_section_title}</h2>
	<div class="charts-grid">
		<PieChart title={t.emploi_ia.stats_impact_title} data={impactData} />
		<PieChart title={t.emploi_ia.stats_rapport_title} data={rapportData} />
		<PieChart title={t.emploi_ia.stats_satisfaction_title} data={satisfactionData} />
		<PieChart title="Fréquence d'utilisation" data={frequenceUtilisationData} />
	</div>

	<div class="study-link-container">
		<a href="/{lang}/emploi-ia/statistiques" class="study-link">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-bar-chart-big"
				><path d="M3 3v18h18" /><rect width="4" height="7" x="7" y="10" rx="1" /><rect
					width="4"
					height="12"
					x="15"
					y="5"
					rx="1"
				/></svg
			>
			{t.emploi_ia.stats_study_link}
		</a>
	</div>
</section>

<style>
	.survey-stats {
		margin-top: 4rem;
		margin-bottom: 4rem;
	}

	h2 {
		text-align: center;
		margin-bottom: 3rem;
	}

	.charts-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
		margin-bottom: 3rem;
	}

	.study-link-container {
		display: flex;
		justify-content: center;
	}

	.study-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--brand);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		text-decoration: none;
		font-weight: 600;
		transition:
			background 0.2s ease,
			transform 0.2s ease;
		box-shadow: 0 4px 12px rgba(255, 148, 22, 0.2);
	}

	.study-link:hover {
		background: var(--btn-hover-bg);
		transform: translateY(-2px);
		color: white;
	}

	.study-link svg {
		flex-shrink: 0;
	}
</style>
