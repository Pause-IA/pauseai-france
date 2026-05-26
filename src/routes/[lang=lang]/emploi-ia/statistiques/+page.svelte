<script lang="ts">
	import { page } from '$app/stores'
	import { getT } from '$lib/i18n'
	import type { Lang } from '$lib/i18n'
	import PieChart from '$lib/components/PieChart.svelte'
	import HorizontalBarChart from '$lib/components/HorizontalBarChart.svelte'
	import { surveyData } from '$lib/data/survey-stats'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	type SectionSelection = {
		dimensionKey?: string
		groupIndex?: number
	}

	type LimitLink = {
		href: string
		label: string
	}

	let selectedStatsBySection: Record<string, SectionSelection> = {}

	const getSurveyData = (key: string) => (surveyData as any)[key] ?? []
	const getAnalysisData = (
		metric: string,
		dimension: string,
		target: string,
		kind: 'pie' | 'bars'
	) => (surveyData as any).analyses?.[metric]?.[dimension]?.[target]?.[kind] ?? []
	const formatStatText = (template: string, values: Record<string, string>) =>
		Object.entries(values).reduce(
			(text, [key, value]) => text.replaceAll(`{${key}}`, value),
			template
		)

	const getDimensionByKey = (key: string | undefined) =>
		key ? profileDimensions.find((d) => d.key === key) : undefined

	const selectStatsGroup = (sectionKey: string, groupIndex: number) => {
		const currentSelection = selectedStatsBySection[sectionKey] ?? {}
		selectedStatsBySection = {
			...selectedStatsBySection,
			[sectionKey]: {
				...currentSelection,
				groupIndex
			}
		}
	}

	const selectStatsDimension = (sectionKey: string, dimensionKey: string) => {
		const currentSelection = selectedStatsBySection[sectionKey] ?? {}
		if (currentSelection.dimensionKey === dimensionKey) {
			const next = { ...selectedStatsBySection }
			delete next[sectionKey]
			selectedStatsBySection = next
		} else {
			selectedStatsBySection = {
				...selectedStatsBySection,
				[sectionKey]: {
					...currentSelection,
					dimensionKey
				}
			}
		}
	}

	const getValue = (items: { label: string; value: number }[] | undefined, label: string) =>
		items?.find((item) => item.label === label)?.value || 0

	const formatPercent = (value: number) =>
		Number.isInteger(value) ? String(value) : value.toFixed(1)

	const getCombinedImpactRows = (dimensionKey: string) => {
		const rows = new Map<string, { label: string; total: number; impactCount: number }>()
		const impactData = (surveyData as any).analyses?.impact?.[dimensionKey] ?? {}

		for (const targetKey of ['tres_fort', 'fort']) {
			for (const item of impactData[targetKey]?.bars ?? []) {
				const current = rows.get(item.label) ?? {
					label: item.label,
					total: item.count ?? 0,
					impactCount: 0
				}

				current.total = item.count ?? current.total
				current.impactCount += Math.round(((item.count ?? 0) * item.value) / 100)
				rows.set(item.label, current)
			}
		}

		const totalImpactCount = [...rows.values()].reduce((sum, row) => sum + row.impactCount, 0)

		return [...rows.values()].map((row) => ({
			...row,
			proportion: row.total > 0 ? (row.impactCount / row.total) * 100 : 0,
			sampleShare: totalImpactCount > 0 ? (row.impactCount / totalImpactCount) * 100 : 0
		}))
	}

	const getCombinedImpactValue = (
		dimensionKey: string,
		label: string,
		field: 'proportion' | 'sampleShare'
	) => {
		const row = getCombinedImpactRows(dimensionKey).find((item) => item.label === label)
		return formatPercent(row?.[field] ?? 0)
	}

	const getPieShare = (dimensionKey: string, targetKey: string, label: string) => {
		const item = (surveyData as any).analyses?.impact?.[dimensionKey]?.[targetKey]?.pie?.find(
			(entry: { label: string; value: number }) => entry.label === label
		)
		return formatPercent(item?.value ?? 0)
	}

	const formatAnalysisParagraphs = (paragraphs: string[] | undefined) =>
		(paragraphs ?? []).map((paragraph) => formatStatText(paragraph, statsTextValues))

	const getSectionAnalysisParagraphs = (sectionKey: string) =>
		formatAnalysisParagraphs((statsAnalysis as any)?.[sectionKey]?.overview)

	const getDimensionAnalysisParagraphs = (sectionKey: string, dimensionKey: string | undefined) =>
		dimensionKey
			? formatAnalysisParagraphs(
					(statsAnalysis as any)?.[sectionKey]?.dimension_analyses?.[dimensionKey]
				)
			: []

	const getLimitLink = (sectionKey: string, dimensionKey: string | undefined): LimitLink | null => {
		if (sectionKey !== 'impact' || !dimensionKey) return null

		const links: Record<string, LimitLink> = {
			etudes: {
				href: '#limites-etudes',
				label: statsPage.analysis_limit_education_link
			},
			age: {
				href: '#limites-age',
				label: statsPage.analysis_limit_age_link
			}
		}

		return links[dimensionKey] ?? null
	}

	$: lang = ($page.params.lang as Lang) || 'fr'
	$: t = getT(lang)
	$: statsDetail = t.emploi_ia.stats_detail
	$: statsPage = t.emploi_ia.stats_page
	$: statsAnalysis = t.emploi_ia.stats_analysis ?? {}
	$: profileDimensions = statsDetail.profile_dimensions
	$: groupedStatsSections = statsDetail.grouped_sections
	$: surveyUpdateDate = new Date(surveyData.update_date).toLocaleDateString(lang)
	$: educationHighShare =
		getValue(surveyData.etudes, 'Bac +5') + getValue(surveyData.etudes, '> Bac +5')
	$: selfEmployedShare = getValue(surveyData.statut, 'Actif indépendant')
	$: digitalShare = getValue(surveyData.secteur, 'Informatique et télécommunication')
	$: age30_39 = getValue(surveyData.age, '30-39 ans')
	$: age40_49 = getValue(surveyData.age, '40-49 ans')
	$: statsTextValues = {
		moyen: String(
			getValue(
				surveyData.impact,
				"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
			)
		),
		fort: String(
			getValue(
				surveyData.impact,
				"Fort impact : menace de perte d'emploi transformations difficiles"
			)
		),
		peu: String(getValue(surveyData.impact, "Peu d'impact / Pas tout de suite")),
		tresFort: String(
			getValue(
				surveyData.impact,
				'Très fort impact : emploi perdu métier disparu compétences inutiles...'
			)
		),
		prudence: String(getValue(surveyData.rapport, "L'observation et la prudence")),
		malaise: String(getValue(surveyData.rapport, "Le malaise voire l'anxiété")),
		excitation: String(
			getValue(surveyData.rapport, "L'excitation à l'idée de l'utiliser davantage")
		),
		confiance: String(getValue(surveyData.rapport, 'La confiance dans ces nouveaux outils')),
		aucunRapport: String(getValue(surveyData.rapport, 'Pas de rapport particulier')),
		age30_50: String((age30_39 + age40_49).toFixed(1)),
		educationBenchmarkShare: '12',
		independentBenchmarkShare: '13.3',
		sectorBenchmarkShare: '3.4',
		femalePopulationBenchmarkShare: '51.5',
		impactFortTresFort: String(
			(
				getValue(
					surveyData.impact,
					"Fort impact : menace de perte d'emploi transformations difficiles"
				) +
				getValue(
					surveyData.impact,
					'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)
			).toFixed(1)
		),
		secteurInfoSampleImpact: getCombinedImpactValue(
			'secteur',
			'Informatique et télécommunication',
			'sampleShare'
		),
		secteurInfoProportionImpact: getCombinedImpactValue(
			'secteur',
			'Informatique et télécommunication',
			'proportion'
		),
		secteurComProportionImpact: getCombinedImpactValue(
			'secteur',
			'Communication et marketing',
			'proportion'
		),
		secteurServicePublicProportionImpact: getCombinedImpactValue(
			'secteur',
			'Service public, défense et sécurité',
			'proportion'
		),
		secteurSanteProportionImpact: getCombinedImpactValue('secteur', 'Santé', 'proportion'),
		secteurInfoFortPieShare: getPieShare('secteur', 'fort', 'Informatique et télécommunication'),
		secteurComFortPieShare: getPieShare('secteur', 'fort', 'Communication et marketing'),
		secteurEnergieFortPieShare: getPieShare('secteur', 'fort', 'Energie'),
		age30_39SampleImpact: getCombinedImpactValue('age', '30-39 ans', 'sampleShare'),
		age40_49SampleImpact: getCombinedImpactValue('age', '40-49 ans', 'sampleShare'),
		age20_29SampleImpact: getCombinedImpactValue('age', '20-29 ans', 'sampleShare'),
		age10_19Count: String(getValue(surveyData.age, '10-19 ans')),
		age20_29ProportionImpact: getCombinedImpactValue('age', '20-29 ans', 'proportion'),
		age30_39ProportionImpact: getCombinedImpactValue('age', '30-39 ans', 'proportion'),
		age40_49ProportionImpact: getCombinedImpactValue('age', '40-49 ans', 'proportion'),
		age60_69ProportionImpact: getCombinedImpactValue('age', '60-69 ans', 'proportion'),
		age10_19ProportionImpact: getCombinedImpactValue('age', '10-19 ans', 'proportion'),
		femmeSampleImpact: getCombinedImpactValue('genre', 'Femme', 'sampleShare'),
		hommeSampleImpact: getCombinedImpactValue('genre', 'Homme', 'sampleShare'),
		femmeProportionImpact: getCombinedImpactValue('genre', 'Femme', 'proportion'),
		hommeProportionImpact: getCombinedImpactValue('genre', 'Homme', 'proportion'),
		genreFemmeTresFortPieShare: getPieShare('genre', 'tres_fort', 'Femme'),
		genreHommeTresFortPieShare: getPieShare('genre', 'tres_fort', 'Homme'),
		salarieSampleImpact: getCombinedImpactValue('statut', 'Actif salarié', 'sampleShare'),
		independantSampleImpact: getCombinedImpactValue('statut', 'Actif indépendant', 'sampleShare'),
		etudiantSampleImpact: getCombinedImpactValue(
			'statut',
			'Élève / étudiant / apprenti',
			'sampleShare'
		),
		independantProportionImpact: getCombinedImpactValue(
			'statut',
			'Actif indépendant',
			'proportion'
		),
		etudiantProportionImpact: getCombinedImpactValue(
			'statut',
			'Élève / étudiant / apprenti',
			'proportion'
		),
		salarieProportionImpact: getCombinedImpactValue('statut', 'Actif salarié', 'proportion'),
		fonctionnaireProportionImpact: getCombinedImpactValue(
			'statut',
			'Actif fonctionnaire',
			'proportion'
		),
		retraiteProportionImpact: getCombinedImpactValue('statut', 'Retraité', 'proportion')
	}
</script>

<svelte:head>
	<title>{t.emploi_ia.stats_section_title} | Pause IA</title>
</svelte:head>

<div class="stats-page">
	<div class="container">
		<a href="/{lang}/emploi-ia" class="back-link">&larr; {t.nav.emploi_ia}</a>

		<UnderlinedTitle>
			<h1>{t.emploi_ia.stats_section_title}</h1>
		</UnderlinedTitle>

		<div class="intro">
			<p>
				{statsPage.intro_p1}
				<a href="https://pauseia.fr/fr/emploi-ia/questionnaire">{statsPage.intro_link}</a>.
			</p>
			<p>{statsPage.intro_p2}</p>
		</div>

		{#each groupedStatsSections as section}
			{@const selection = selectedStatsBySection[section.key] ?? {}}
			{@const selectedGroup = section.groups[selection.groupIndex ?? 0] ?? section.groups[0]}
			{@const selectedDimension = getDimensionByKey(selection.dimensionKey)}
			<section class="stats-section">
				<h2>{section.title}</h2>
				{#each getSectionAnalysisParagraphs(section.key) as paragraph}
					<p>{paragraph}</p>
				{/each}
				<PieChart
					title={section.overviewTitle}
					data={getSurveyData(section.key)}
					withMargin={true}
				/>

				<div
					class="dimension-selector"
					aria-label={formatStatText(statsDetail.templates.section_dimension_aria, {
						section: section.title
					})}
				>
					{#each profileDimensions as dimension}
						<button
							type="button"
							class="dimension-button"
							class:active={selection.dimensionKey === dimension.key}
							on:click={() => selectStatsDimension(section.key, dimension.key)}
						>
							{dimension.plural}
						</button>
					{/each}
				</div>

				<div class="deep-analysis">
					<h3>
						{#if selectedDimension}
							{formatStatText(statsDetail.templates.section_dimension_title, {
								section: section.title,
								dimension: selectedDimension.label
							})}
						{:else}
							{section.title}
						{/if}
					</h3>
					{#if selectedDimension}
						{#each getDimensionAnalysisParagraphs(section.key, selectedDimension.key) as paragraph}
							<p class="dimension-analysis">{paragraph}</p>
						{/each}

						{@const limitLink = getLimitLink(section.key, selectedDimension.key)}
						{#if limitLink}
							<p class="dimension-limit-link">
								<a href={limitLink.href}>{limitLink.label}</a>
							</p>
						{/if}
					{/if}

					{#if selectedDimension}
						<div
							class="group-selector"
							aria-label={formatStatText(statsDetail.templates.group_aria, {
								section: section.title
							})}
						>
							{#each section.groups as group, groupIndex}
								<button
									type="button"
									class="group-button"
									class:active={(selection.groupIndex ?? 0) === groupIndex}
									on:click={() => selectStatsGroup(section.key, groupIndex)}
								>
									{group.title}
								</button>
							{/each}
						</div>

						<div class="charts-grid">
							{#each selectedGroup.targets as target}
								<div class="chart-card">
									<PieChart
										title={formatStatText(statsDetail.templates.pie_title, {
											dimensionPlural: selectedDimension.plural,
											target: target.label
										})}
										data={getAnalysisData(section.key, selectedDimension.key, target.key, 'pie')}
									/>
								</div>
							{/each}
						</div>
						<div class="bar-chart-section">
							{#each selectedGroup.targets as target}
								<HorizontalBarChart
									data={getAnalysisData(section.key, selectedDimension.key, target.key, 'bars')}
									title={formatStatText(statsDetail.templates.bar_title, {
										dimensionPlural: selectedDimension.plural,
										target: target.label
									})}
									withMargin={true}
								/>
							{/each}
						</div>
					{:else}
						<p class="select-prompt">{statsPage.select_prompt}</p>
					{/if}
				</div>
			</section>
		{/each}
	</div>

	<section class="stats-section limit-section">
		<h2 id="limites">{statsPage.limit_title}</h2>
		<p>{statsPage.limit_intro}</p>
		<p>
			{formatStatText(statsPage.limit_response_count, {
				date: surveyUpdateDate,
				count: String(surveyData.nombre_reponses)
			})}
		</p>
		<p>{statsPage.limit_sample_bias}</p>
		<p id="limites-etudes">{statsPage.limit_education_bias}</p>
		<p>
			{formatStatText(statsPage.limit_education_share, {
				percent: String(educationHighShare)
			})}
		</p>
		<a
			target="_blank"
			href="https://www.insee.fr/fr/statistiques/2011101?geo=FRANCE-1#titre-tableau-FOR_T3"
		>
			{formatStatText(statsPage.limit_education_link, {
				educationBenchmarkShare: statsTextValues.educationBenchmarkShare
			})}
		</a>
		<p>
			{formatStatText(statsPage.limit_education_comparison, {
				ratio: (
					(educationHighShare || 0) / Number(statsTextValues.educationBenchmarkShare)
				).toFixed(1)
			})}
		</p>
		<p>{statsPage.limit_education_inverse}</p>
		<p>{statsPage.limit_other_biases}</p>
		<p>
			{formatStatText(statsPage.limit_independent_bias, {
				percent: String(selfEmployedShare),
				independentBenchmarkShare: statsTextValues.independentBenchmarkShare
			})}
		</p>
		<PieChart
			title={statsPage.limit_status_chart_title}
			data={surveyData.statut}
			withMargin={true}
		/>
		<p>
			{formatStatText(statsPage.limit_independent_comparison, {
				ratio: (selfEmployedShare / Number(statsTextValues.independentBenchmarkShare)).toFixed(1)
			})}
		</p>
		<p>
			{formatStatText(statsPage.limit_sector_bias, {
				percent: String(digitalShare),
				sectorBenchmarkShare: statsTextValues.sectorBenchmarkShare
			})}
		</p>
		<PieChart
			title={statsPage.limit_sector_chart_title}
			data={surveyData.secteur}
			withMargin={true}
		/>
		<p>
			{formatStatText(statsPage.limit_sector_comparison, {
				ratio: (digitalShare / Number(statsTextValues.sectorBenchmarkShare)).toFixed(1)
			})}
		</p>
		<p>{statsPage.limit_gender_intro}</p>
		<ul>
			<li>
				{formatStatText(statsPage.limit_gender_male, {
					percent: String(getValue(surveyData.genre, 'Homme'))
				})}
			</li>
			<li>
				{formatStatText(statsPage.limit_gender_female, {
					percent: String(getValue(surveyData.genre, 'Femme'))
				})}
			</li>
			<li>
				{formatStatText(statsPage.limit_gender_other, {
					percent: String(getValue(surveyData.genre, 'Autre'))
				})}
			</li>
		</ul>
		<p>
			<a target="_blank" href="https://www.insee.fr/fr/statistiques/2381474">
				{formatStatText(statsPage.limit_gender_link, {
					femalePopulationBenchmarkShare: statsTextValues.femalePopulationBenchmarkShare
				})}
			</a>
		</p>
		<PieChart
			title={statsPage.limit_gender_chart_title}
			data={surveyData.genre}
			withMargin={true}
		/>
		<p id="limites-age">{statsPage.limit_age_intro}</p>
		<ul>
			<li>{formatStatText(statsPage.limit_age_30_39, { percent: String(age30_39) })}</li>
			<li>{formatStatText(statsPage.limit_age_40_49, { percent: String(age40_49) })}</li>
		</ul>
		<p>{statsPage.limit_age_inverse}</p>
		<ul>
			<li>
				{formatStatText(statsPage.limit_age_10_19, {
					percent: String(getValue(surveyData.age, '10-19 ans'))
				})}
			</li>
			<li>
				{formatStatText(statsPage.limit_age_60_69, {
					percent: String(getValue(surveyData.age, '60-69 ans'))
				})}
			</li>
		</ul>
		<p>
			{formatStatText(statsPage.limit_age_comparison, {
				percent: String((age30_39 + age40_49).toFixed(1))
			})}
		</p>
		<p>
			<a
				target="_blank"
				href="https://www.insee.fr/fr/statistiques/8612506?sommaire=8612596#titre-graphique-figure2"
			>
				{statsPage.limit_age_link}
			</a>
		</p>
		<PieChart title={statsPage.limit_age_chart_title} data={surveyData.age} withMargin={true} />
		<p>{statsPage.limit_conclusion}</p>
	</section>
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

	.limit-section {
		max-width: 1000px;
		margin: 0 auto 6rem;
		padding: 2rem 1.5rem;
		border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.12));
		background: var(--bg-card, #fafafa);
		border-radius: 18px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
	}

	h2 {
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
		border-left: 4px solid var(--brand);
		padding-left: 1rem;
	}

	.dimension-analysis {
		color: var(--text-2);
		line-height: 1.6;
		max-width: 760px;
		margin: 0 0 2rem;
	}

	.dimension-analysis + .dimension-analysis {
		margin-top: -1rem;
	}

	.dimension-limit-link {
		margin: -0.75rem 0 1.5rem;
	}

	.dimension-limit-link a {
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		margin: 2rem 0;
	}

	.chart-card {
		min-width: 0;
	}

	.chart-card:last-child:nth-child(odd) {
		grid-column: 1 / -1;
	}

	.deep-analysis {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.1));
	}

	h3 {
		font-size: 1.5rem;
		margin-top: 3rem;
		margin-bottom: 2rem;
		color: var(--brand);
		font-family: 'IBM Plex Sans', sans-serif;
		font-weight: 700;
		position: relative;
		display: inline-block;
	}

	h3::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		width: 50%;
		height: 4px;
		background: var(--brand-subtle);
		border-radius: 2px;
	}

	.dimension-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin: 2rem 0;
	}

	.group-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin: 1.5rem 0 2rem;
	}

	.dimension-button {
		border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.15));
		background: var(--bg-card, #fafafa);
		color: var(--text);
		padding: 0.65rem 1rem;
		border-radius: 8px;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.group-button {
		border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.15));
		background: var(--bg-card, #fafafa);
		color: var(--text);
		padding: 0.55rem 0.9rem;
		border-radius: 9999px;
		font: inherit;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.group-button:hover,
	.group-button.active {
		background: var(--brand-subtle);
		border-color: var(--brand-subtle);
		color: white;
	}

	.dimension-button:hover,
	.dimension-button.active {
		background: var(--brand);
		border-color: var(--brand);
		color: white;
	}

	.bar-chart-section {
		margin-top: 4rem;
	}

	.select-prompt {
		text-align: center;
		color: var(--text-2);
		font-style: italic;
		padding: 3rem 2rem;
		background: var(--bg-card, rgba(0, 0, 0, 0.02));
		border: 2px dashed var(--border-subtle, rgba(0, 0, 0, 0.15));
		border-radius: 12px;
		margin: 2.5rem auto;
		font-size: 1.1rem;
		max-width: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	ul {
		margin: 0 0 1.5rem 1.5rem;
	}

	li {
		margin: 0.35rem 0;
	}

	a {
		color: var(--brand);
	}

	@media (max-width: 640px) {
		.charts-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
