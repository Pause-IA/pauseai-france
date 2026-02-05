<script lang="ts">
	import ArticleCard from '$components/ArticleCard.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Report } from '$lib/notion'

	export let reports: Report[] = []

	const label_id = 'inserts-title'

	// Fallback reports if Notion data is not available
	const fallbackReports: Report[] = [
		{
			id: '1',
			title: 'IA : nos craintes pour la France',
			description:
				"Analyse critique du rapport de la Commission IA, soulignant les risques ignorés et les conflits d'intérêts.",
			url: 'https://contre-rapport-ia.fr/',
			image: '',
			order: 1,
			visible: true
		},
		{
			id: '2',
			title: "Reprendre le Contrôle: Forum des solutions pour une IA compatible avec l'humanité",
			description: "Explorer les approches et solutions pour une gestion responsable de l'IA.",
			url: 'https://controleia.org/solutions/',
			image: '',
			order: 2,
			visible: true
		}
	]

	$: displayReports = reports.length > 0 ? reports : fallbackReports
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Rapports et Solutions</UnderlinedTitle>
	<div class="inserts-grid">
		{#each displayReports as report (report.id)}
			<ArticleCard
				title={report.title}
				blurb={report.description}
				url={report.url}
				linkText="Voir le site"
				category="Rapport"
			/>
		{/each}
	</div>
</section>

<style>
	section {
		margin-bottom: 1rem;
	}

	.inserts-grid {
		display: grid;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.inserts-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
