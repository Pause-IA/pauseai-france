import { Client } from '@notionhq/client'
import { writeFileSync } from 'fs'
import {
	find_pourcentage,
	mean,
	statistics_by_tens,
	find_pourcentage_by_groupe,
	find_pourcentage_by_groupe_age_tens,
	impact_by_age_tens,
	extractValue,
	find_impact_rankings,
	find_impact_rankings_by_age
} from '../src/lib/data/statistics.ts'
import dotenv from 'dotenv'

dotenv.config()

const notion = new Client({
	auth: process.env.NOTION_TOKEN as string
})

/** Wrap a cell value so it is safe inside a CSV file. */
function csvCell(value: string): string {
	return `"${value.replace(/"/g, '""')}"`
}

async function downloadAll() {
	const allResults: any[] = []
	let cursor: string | undefined = undefined

	console.log('⬇️  Fetching testimonials from Notion…')

	// Fetch database schema to get valid options
	// @ts-ignore
	const db = await notion.dataSources.retrieve({
		data_source_id: process.env.TESTIMONIALS_ID as string
	})
	const schema = db.properties

	do {
		// Use dataSources as found in test script
		// @ts-ignore
		const response: any = await notion.dataSources.query({
			data_source_id: process.env.TESTIMONIALS_ID as string,
			...(cursor ? { start_cursor: cursor } : {})
		})

		allResults.push(...response.results)
		console.log(`   fetched ${allResults.length} record(s) so far…`)

		cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined
	} while (cursor)

	if (allResults.length === 0) {
		console.log('⚠️  No testimonials found. Check your TESTIMONIALS_ID.')
		return
	}

	// Header and CSV generation (following user request)
	let headers = [
		'Prenom',
		'Sexe',
		'Age',
		'Statut_professionnel',
		'Niveau_études',
		'Secteur_activité',
		'Profession',
		'Fréquence_info_IA',
		'Impact_perçu',
		'Rapport_à_IA',
		'Intéressé_cellule',
		'Raison_cellule',
		'Témoignage',
		'Email',
		'Fréquence_utilisation',
		'Tâche_IA',
		'Raisons_utilisation',
		'Satisfaction',
		'Date',
		'Consentement',
		'Afficher',
		'Dernière modification par'
	]

	allResults.sort((a, b) => {
		const dateA: string = a.properties?.Date?.date?.start ?? ''
		const dateB: string = b.properties?.Date?.date?.start ?? ''
		return dateB.localeCompare(dateA)
	})

	const headerLine = headers.map(csvCell).join(',')
	const dataLines = allResults.map((item) =>
		headers.map((key) => csvCell(extractValue(item.properties[key]))).join(',')
	)

	const csv = [headerLine, ...dataLines].join('\n')

	writeFileSync('testimony.csv', csv, 'utf-8')
	console.log(`✅  Exported ${allResults.length} testimonial(s) → testimony.csv`)

	// Update the survey-stats.ts file with real data
	generateSurveyStatsFile(allResults, schema)
}

function generateSurveyStatsFile(allResults: any[], schema: any) {
	const colors = ['#ff9416', '#c96900', '#ffb766', '#8a4700', '#ffd9a3']

	// Official options from fr.ts to group personalized "Other" answers
	const officialOptions: Record<string, string[]> = {
		Impact_perçu: [
			'Ne souhaite pas répondre',
			'Jamais',
			"Peu d'impact / Pas tout de suite",
			"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés",
			"Fort impact : menace de perte d'emploi transformations difficiles",
			'Très fort impact : emploi perdu métier disparu compétences inutiles...'
		],
		Rapport_à_IA: [
			'Ne souhaite pas répondre',
			"L'excitation à l'idée de l'utiliser davantage",
			'La confiance dans ces nouveaux outils',
			'Pas de rapport particulier',
			"L'observation et la prudence",
			"Le malaise voire l'anxiété",
			'Un autre rapport'
		],
		Satisfaction: [
			'Oui et non cela dépend des tâches',
			"Oui c'est un outil de travail précieux",
			'Non les résultats obtenus ne sont pas satisfaisants',
			'Oui cela décuple mes capacités',
			'Ne souhaite pas répondre',
			"Non je ne sais pas bien l'utiliser"
		],
		Niveau_études: [
			'Bac +5',
			'Bac +2 ou bac +3',
			'> Bac +5',
			'Bac général',
			'CAP ou bac professionnel',
			'Aucun diplôme / Brevet des collèges',
			'Ne souhaite pas répondre'
		],
		Fréquence_utilisation: [
			'Tous les jours',
			'Toutes mes tâches ou presque',
			'Toutes les semaines',
			'Très ponctuellement',
			'Jamais',
			'Je ne sais pas',
			'Ne souhaite pas répondre'
		],
		Fréquence_info_IA: [
			'Quotidienne ou quasi-quotidienne',
			'Hebdomadaire ou équivalent',
			'Mensuelle et de façon active',
			"Moins d'une fois par mois, ponctuellement",
			'Jamais',
			'Ne souhaite pas répondre'
		],
		Tâche_IA: [
			"Génération d'images, de sons, de vidéos",
			'Analyse / Résumé de document (texte, vidéo...)',
			'Traduction',
			'Correction et rédaction de texte',
			'Automatisation de tâches répétitives',
			'Codage',
			'Gestion de planning / projet',
			'Analyse de données',
			'Gestion relationnelle (chatbot, mail..)',
			'Pilotage/contrôle de dispositifs connectés',
			'Prise de décision / aide à la décision',
			'Autre'
		],
		Raisons_utilisation: [
			'Par pure curiosité',
			'Suite à une formation / demande de ma direction',
			'Suite aux conseils de mes collègues',
			'Suite à la pression concurrentielle',
			'Pour pouvoir réaliser toutes mes tâches',
			'Par manque de compétences',
			'Pour gagner du temps, être plus efficace',
			'Autre'
		],
		Secteur_activité: [
			'Activités juridiques et comptables',
			'Agriculture et élevage',
			'Architecture',
			'Artisanat',
			'Automobile',
			'BTP',
			'Commerce et distribution',
			'Communication et marketing',
			'Culture et patrimoine',
			'Edition',
			'Energie',
			'Finance, banque et assurance',
			'Gestion administrative et RH',
			'Hotellerie-restauration',
			'Immobilier',
			'Industrie alimentaire',
			'Industrie bois / chimie / textile / papier et imprimerie',
			'Informatique et télécommunication',
			'Maintenance, entretien et nettoyage',
			'Recherche',
			'Santé',
			'Service à la personne',
			'Service public, défense et sécurité',
			'Social',
			'Sport, animation et loisirs',
			'Tourisme',
			'Autres'
		],
		Statut_professionnel: [
			'Actif fonctionnaire',
			'Actif salarié',
			'Actif indépendant',
			'Actif bénévole',
			'Actif intérimaire / intermittent',
			'Actif sans emploi / au chômage',
			"Diplômé à la recherche d'un premier emploi",
			'Élève / étudiant / apprenti',
			'Retraité',
			'Autre'
		],
		Sexe: ['Femme', 'Homme', 'Autre']
	}

	const getChartData = (field: string) => {
		// Use hardcoded official options or fallback to schema if available
		let allowedValues = officialOptions[field] || []

		if (allowedValues.length === 0) {
			const fieldSchema = schema[field]
			if (fieldSchema) {
				if (fieldSchema.type === 'select') {
					allowedValues = fieldSchema.select.options.map((o: any) => o.name)
				} else if (fieldSchema.type === 'multi_select') {
					allowedValues = fieldSchema.multi_select.options.map((o: any) => o.name)
				}
			}
		}

		const stats = find_pourcentage(
			allResults.map((item) => extractValue(item.properties?.[field])),
			allowedValues
		)
		return stats.map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		}))
	}

	const withColors = (items: { label: string; value: number; count?: number }[]) =>
		items.map((item, i) => ({ ...item, color: colors[i % colors.length] }))

	const splitValues = (value: string) =>
		value
			.split(/\n| \| /)
			.map((v) => v.trim())
			.filter(Boolean)

	const normalizeComparable = (value: string) =>
		value
			.trim()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()

	const getValues = (item: any, field: string) => {
		const raw = extractValue(item.properties?.[field]).trim()
		if (!raw) return []

		const allowedValues = officialOptions[field] || []
		const allowedMap = new Map(
			allowedValues.map((value) => [normalizeComparable(value), value] as const)
		)

		return splitValues(raw).map((value) => {
			if (allowedValues.length === 0) return value
			return (
				allowedMap.get(normalizeComparable(value)) ??
				(allowedValues.includes('Autres') ? 'Autres' : 'Autre')
			)
		})
	}

	const getAgeGroup = (item: any) => {
		const rawAge = extractValue(item.properties?.Age).trim()
		const match = rawAge.match(/\d+/)
		if (!match) return ''

		const age = parseInt(match[0])
		const min = Math.floor(age / 10) * 10
		return `${min}-${min + 9} ans`
	}

	const getGroupValues = (item: any, groupField: string) => {
		if (groupField === 'Age') {
			const ageGroup = getAgeGroup(item)
			return ageGroup ? [ageGroup] : []
		}

		return getValues(item, groupField)
	}

	const hasTargetValue = (item: any, field: string, targetValue: string) =>
		getValues(item, field).some(
			(value) => normalizeComparable(value) === normalizeComparable(targetValue)
		)

	const getRepartitionForTarget = (field: string, targetValue: string, groupField: string) => {
		const groupValues = allResults
			.filter((item) => hasTargetValue(item, field, targetValue))
			.flatMap((item) => getGroupValues(item, groupField))

		return withColors(
			find_pourcentage(groupValues, groupField === 'Age' ? [] : officialOptions[groupField])
				.slice(0, 8)
				.map((s) => ({
					label: s.value,
					value: parseFloat(s.percentage.replace('%', ''))
				}))
		)
	}

	const getRankingForTarget = (
		field: string,
		targetValue: string,
		groupField: string,
		minCount: number = 3
	) => {
		const grouped: Record<string, any[]> = {}

		for (const item of allResults) {
			for (const group of getGroupValues(item, groupField)) {
				if (!grouped[group]) grouped[group] = []
				grouped[group].push(item)
			}
		}

		const rankings = Object.entries(grouped)
			.map(([group, items]) => {
				const targetCount = items.filter((item) => hasTargetValue(item, field, targetValue)).length
				return {
					label: group,
					value: items.length > 0 ? parseFloat(((targetCount / items.length) * 100).toFixed(2)) : 0,
					count: items.length
				}
			})
			.filter((item) => item.value > 0 && item.count >= minCount)
			.sort((a, b) => b.value - a.value)

		return withColors(rankings)
	}

	const dimensions = [
		{ slug: 'secteur', field: 'Secteur_activité' },
		{ slug: 'etudes', field: 'Niveau_études' },
		{ slug: 'age', field: 'Age' },
		{ slug: 'genre', field: 'Sexe' },
		{ slug: 'statut', field: 'Statut_professionnel' }
	]

	const metrics = [
		{
			slug: 'impact',
			field: 'Impact_perçu',
			targets: [
				{
					slug: 'tres_fort',
					value: 'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				},
				{
					slug: 'fort',
					value: "Fort impact : menace de perte d'emploi transformations difficiles"
				},
				{
					slug: 'moyen',
					value: "Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				},
				{ slug: 'peu', value: "Peu d'impact / Pas tout de suite" },
				{ slug: 'jamais', value: 'Jamais' }
			]
		},
		{
			slug: 'rapport',
			field: 'Rapport_à_IA',
			targets: [
				{ slug: 'malaise', value: "Le malaise voire l'anxiété" },
				{ slug: 'observation_prudence', value: "L'observation et la prudence" },
				{ slug: 'confiance', value: 'La confiance dans ces nouveaux outils' },
				{ slug: 'excitation', value: "L'excitation à l'idée de l'utiliser davantage" }
			]
		},
		{
			slug: 'frequence_utilisation',
			field: 'Fréquence_utilisation',
			targets: [
				{ slug: 'toutes_les_semaines', value: 'Toutes les semaines' },
				{ slug: 'tres_ponctuellement', value: 'Très ponctuellement' },
				{ slug: 'jamais', value: 'Jamais' },
				{ slug: 'tous_les_jours', value: 'Tous les jours' },
				{ slug: 'toutes_mes_taches', value: 'Toutes mes tâches ou presque' }
			]
		},
		{
			slug: 'raisons_utilisation',
			field: 'Raisons_utilisation',
			targets: officialOptions.Raisons_utilisation.map((value) => ({
				slug: value
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '_')
					.replace(/^_|_$/g, ''),
				value
			}))
		},
		{
			slug: 'taches',
			field: 'Tâche_IA',
			targets: officialOptions.Tâche_IA.map((value) => ({
				slug: value
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '_')
					.replace(/^_|_$/g, ''),
				value
			}))
		},
		{
			slug: 'satisfaction',
			field: 'Satisfaction',
			targets: [
				{ slug: 'oui_capacites', value: 'Oui cela décuple mes capacités' },
				{ slug: 'oui_precieux', value: "Oui c'est un outil de travail précieux" },
				{ slug: 'oui_non', value: 'Oui et non cela dépend des tâches' },
				{ slug: 'non_resultats', value: 'Non les résultats obtenus ne sont pas satisfaisants' },
				{ slug: 'non_utilisation', value: "Non je ne sais pas bien l'utiliser" }
			]
		},
		{
			slug: 'frequence_info',
			field: 'Fréquence_info_IA',
			targets: [
				{ slug: 'quotidienne', value: 'Quotidienne ou quasi-quotidienne' },
				{ slug: 'hebdomadaire', value: 'Hebdomadaire ou équivalent' },
				{ slug: 'mensuelle', value: 'Mensuelle et de façon active' },
				{ slug: 'moins_mensuelle', value: "Moins d'une fois par mois, ponctuellement" },
				{ slug: 'jamais', value: 'Jamais' }
			]
		}
	]

	const analyses = Object.fromEntries(
		metrics.map((metric) => [
			metric.slug,
			Object.fromEntries(
				dimensions.map((dimension) => [
					dimension.slug,
					Object.fromEntries(
						metric.targets.map((target) => [
							target.slug,
							{
								pie: getRepartitionForTarget(metric.field, target.value, dimension.field),
								bars: getRankingForTarget(metric.field, target.value, dimension.field)
							}
						])
					)
				])
			)
		])
	)

	// Age distribution needs grouping as in user's statistics_by_tens
	const ages = allResults
		.map((item) => {
			const val = extractValue(item.properties?.Age)
			const match = val.match(/\d+/)
			return match ? parseInt(match[0]) : NaN
		})
		.filter((n) => !isNaN(n))

	const ageStats = statistics_by_tens(ages)
	const ageData = ageStats
		.map((s, i) => ({
			label: `${s.value}-${s.value + 9} ans`,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		}))
		.sort((a, b) => a.label.localeCompare(b.label))

	const data = {
		update_date: new Date(),
		nombre_reponses: allResults.length,
		impact: getChartData('Impact_perçu'),
		rapport: getChartData('Rapport_à_IA'),
		satisfaction: getChartData('Satisfaction'),
		frequence_utilisation: getChartData('Fréquence_utilisation'),
		frequence_info: getChartData('Fréquence_info_IA'),
		raisons_utilisation: getChartData('Raisons_utilisation'),
		taches: getChartData('Tâche_IA'),
		secteur: getChartData('Secteur_activité'),
		age: ageData,
		etudes: getChartData('Niveau_études'),
		statut: getChartData('Statut_professionnel'),
		genre: getChartData('Sexe'),
		analyses,
		impact_par_secteur: find_pourcentage_by_groupe(allResults, 'Secteur_activité', 'Impact_perçu'),
		secteurs_tres_fortement_impactes: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Impact_perçu',
			'Très fort impact : emploi perdu métier disparu compétences inutiles...'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_fortement_impactes: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Impact_perçu',
			"Fort impact : menace de perte d'emploi transformations difficiles"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_moyen_impactes: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Impact_perçu',
			"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_peu_impactes: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Impact_perçu',
			"Peu d'impact / Pas tout de suite"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_pas_impactes: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Impact_perçu',
			'Jamais'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),

		repartition_secteurs_tres_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		repartition_secteurs_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Fort impact : menace de perte d'emploi transformations difficiles"
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		repartition_secteurs_moyen_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		repartition_secteurs_peu_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) === "Peu d'impact / Pas tout de suite"
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),

		repartition_secteurs_jamais_impactes: find_pourcentage(
			allResults
				.filter((item) => extractValue(item.properties?.Impact_perçu) === 'Jamais')
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		studies_tres_fortement_impactes: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Impact_perçu',
			'Très fort impact : emploi perdu métier disparu compétences inutiles...'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		studies_fortement_impactes: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Impact_perçu',
			"Fort impact : menace de perte d'emploi transformations difficiles"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		studies_moyen_impactes: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Impact_perçu',
			"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		studies_peu_impactes: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Impact_perçu',
			"Peu d'impact / Pas tout de suite"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		studies_pas_impactes: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Impact_perçu',
			'Jamais'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		repartition_studies_tres_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		repartition_studies_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Fort impact : menace de perte d'emploi transformations difficiles"
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		repartition_studies_moyen_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),
		repartition_studies_peu_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) === "Peu d'impact / Pas tout de suite"
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),

		repartition_studies_jamais_impactes: find_pourcentage(
			allResults
				.filter((item) => extractValue(item.properties?.Impact_perçu) === 'Jamais')
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		)
			.slice(0, 8)
			.map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			})),

		// Age Impact Analysis
		age_tres_fortement_impactes: find_impact_rankings_by_age(
			allResults,
			'Age',
			'Impact_perçu',
			'Très fort impact : emploi perdu métier disparu compétences inutiles...'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		age_fortement_impactes: find_impact_rankings_by_age(
			allResults,
			'Age',
			'Impact_perçu',
			"Fort impact : menace de perte d'emploi transformations difficiles"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		age_moyen_impactes: find_impact_rankings_by_age(
			allResults,
			'Age',
			'Impact_perçu',
			"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		age_peu_impactes: find_impact_rankings_by_age(
			allResults,
			'Age',
			'Impact_perçu',
			"Peu d'impact / Pas tout de suite"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),

		age_jamais_impactes: find_impact_rankings_by_age(
			allResults,
			'Age',
			'Impact_perçu',
			'Jamais'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),

		// Gender Impact Analysis
		genre_tres_fortement_impactes: find_impact_rankings(
			allResults,
			'Sexe',
			'Impact_perçu',
			'Très fort impact : emploi perdu métier disparu compétences inutiles...'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		genre_fortement_impactes: find_impact_rankings(
			allResults,
			'Sexe',
			'Impact_perçu',
			"Fort impact : menace de perte d'emploi transformations difficiles"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		genre_moyen_impactes: find_impact_rankings(
			allResults,
			'Sexe',
			'Impact_perçu',
			"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		genre_peu_impactes: find_impact_rankings(
			allResults,
			'Sexe',
			'Impact_perçu',
			"Peu d'impact / Pas tout de suite"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),

		genre_jamais_impactes: find_impact_rankings(allResults, 'Sexe', 'Impact_perçu', 'Jamais').map(
			(item, i) => ({ ...item, color: colors[i % colors.length] })
		),

		// Professional Status Impact Analysis
		statut_tres_fortement_impactes: find_impact_rankings(
			allResults,
			'Statut_professionnel',
			'Impact_perçu',
			'Très fort impact : emploi perdu métier disparu compétences inutiles...'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		statut_fortement_impactes: find_impact_rankings(
			allResults,
			'Statut_professionnel',
			'Impact_perçu',
			"Fort impact : menace de perte d'emploi transformations difficiles"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		statut_moyen_impactes: find_impact_rankings(
			allResults,
			'Statut_professionnel',
			'Impact_perçu',
			"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		statut_peu_impactes: find_impact_rankings(
			allResults,
			'Statut_professionnel',
			'Impact_perçu',
			"Peu d'impact / Pas tout de suite"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		statut_jamais_impactes: find_impact_rankings(
			allResults,
			'Statut_professionnel',
			'Impact_perçu',
			'Jamais'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),

		// Repartition (PieCharts) for Age
		repartition_age_tres_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)
				.map((item) => {
					const val = extractValue(item.properties?.Age)
					const match = val.match(/\d+/)
					if (!match) return ''
					const age = parseInt(match[0])
					const min = Math.floor(age / 10) * 10
					return `${min}-${min + 9} ans`
				}),
			[]
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_age_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Fort impact : menace de perte d'emploi transformations difficiles"
				)
				.map((item) => {
					const val = extractValue(item.properties?.Age)
					const match = val.match(/\d+/)
					if (!match) return ''
					const age = parseInt(match[0])
					const min = Math.floor(age / 10) * 10
					return `${min}-${min + 9} ans`
				}),
			[]
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		repartition_age_moyen_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)
				.map((item) => {
					const val = extractValue(item.properties?.Age)
					const match = val.match(/\d+/)
					if (!match) return ''
					const age = parseInt(match[0])
					const min = Math.floor(age / 10) * 10
					return `${min}-${min + 9} ans`
				}),
			[]
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		repartition_age_peu_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) === "Peu d'impact / Pas tout de suite"
				)
				.map((item) => {
					const val = extractValue(item.properties?.Age)
					const match = val.match(/\d+/)
					if (!match) return ''
					const age = parseInt(match[0])
					const min = Math.floor(age / 10) * 10
					return `${min}-${min + 9} ans`
				}),
			[]
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		repartition_age_jamais_impactes: find_pourcentage(
			allResults
				.filter((item) => extractValue(item.properties?.Impact_perçu) === 'Jamais')
				.map((item) => {
					const val = extractValue(item.properties?.Age)
					const match = val.match(/\d+/)
					if (!match) return ''
					const age = parseInt(match[0])
					const min = Math.floor(age / 10) * 10
					return `${min}-${min + 9} ans`
				}),
			[]
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		// Repartition (PieCharts) for Gender
		repartition_genre_tres_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)
				.map((item) => extractValue(item.properties?.Sexe)),
			officialOptions.Sexe
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_genre_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Fort impact : menace de perte d'emploi transformations difficiles"
				)
				.map((item) => extractValue(item.properties?.Sexe)),
			officialOptions.Sexe
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		repartition_genre_moyen_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)
				.map((item) => extractValue(item.properties?.Sexe)),
			officialOptions.Sexe
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		repartition_genre_peu_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) === "Peu d'impact / Pas tout de suite"
				)
				.map((item) => extractValue(item.properties?.Sexe)),
			officialOptions.Sexe
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		repartition_genre_jamais_impact: find_pourcentage(
			allResults
				.filter((item) => extractValue(item.properties?.Impact_perçu) === 'Jamais')
				.map((item) => extractValue(item.properties?.Sexe)),
			officialOptions.Sexe
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),

		// Repartition (PieCharts) for Status
		repartition_statut_tres_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						'Très fort impact : emploi perdu métier disparu compétences inutiles...'
				)
				.map((item) => extractValue(item.properties?.Statut_professionnel)),
			officialOptions.Statut_professionnel
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_statut_fort_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Fort impact : menace de perte d'emploi transformations difficiles"
				)
				.map((item) => extractValue(item.properties?.Statut_professionnel)),
			officialOptions.Statut_professionnel
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_statut_moyen_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) ===
						"Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés"
				)
				.map((item) => extractValue(item.properties?.Statut_professionnel)),
			officialOptions.Statut_professionnel
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_statut_peu_impact: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Impact_perçu) === "Peu d'impact / Pas tout de suite"
				)
				.map((item) => extractValue(item.properties?.Statut_professionnel)),
			officialOptions.Statut_professionnel
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_statut_jamais_impact: find_pourcentage(
			allResults
				.filter((item) => extractValue(item.properties?.Impact_perçu) === 'Jamais')
				.map((item) => extractValue(item.properties?.Statut_professionnel)),
			officialOptions.Statut_professionnel
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		secteurs_malaise_voire_l_anxiété: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Rapport_à_IA',
			"Le malaise voire l'anxiété"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_l_observation_et_la_prudence: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Rapport_à_IA',
			"L'observation et la prudence"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_la_confiance_dans_ces_nouveaux_outils: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Rapport_à_IA',
			'La confiance dans ces nouveaux outils'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		secteurs_l_excitation_à_l_idee_de_l_utiliser_davantage: find_impact_rankings(
			allResults,
			'Secteur_activité',
			'Rapport_à_IA',
			"L'excitation à l'idée de l'utiliser davantage"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		repartition_rapport_secteurs_le_malaise_voire_l_anxiété: find_pourcentage(
			allResults
				.filter(
					(item) => extractValue(item.properties?.Rapport_à_IA) === "Le malaise voire l'anxiété"
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_rapport_secteurs_l_observation_et_la_prudence: find_pourcentage(
			allResults
				.filter(
					(item) => extractValue(item.properties?.Rapport_à_IA) === "L'observation et la prudence"
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_rapport_secteurs_La_confiance_dans_ces_nouveaux_outils: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Rapport_à_IA) === 'La confiance dans ces nouveaux outils'
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_rapport_secteurs_L_excitation_à_l_idee_de_l_utiliser_davantage: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Rapport_à_IA) ===
						"L'excitation à l'idée de l'utiliser davantage"
				)
				.map((item) => extractValue(item.properties?.Secteur_activité)),
			officialOptions.Secteur_activité
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		etudes_malaise_voire_l_anxiété: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Rapport_à_IA',
			"Le malaise voire l'anxiété"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		etudes_l_observation_et_la_prudence: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Rapport_à_IA',
			"L'observation et la prudence"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		etudes_la_confiance_dans_ces_nouveaux_outils: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Rapport_à_IA',
			'La confiance dans ces nouveaux outils'
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		etudes_l_excitation_à_l_idee_de_l_utiliser_davantage: find_impact_rankings(
			allResults,
			'Niveau_études',
			'Rapport_à_IA',
			"L'excitation à l'idée de l'utiliser davantage"
		).map((item, i) => ({ ...item, color: colors[i % colors.length] })),
		repartition_rapport_niveau_etudes_le_malaise_voire_l_anxiété: find_pourcentage(
			allResults
				.filter(
					(item) => extractValue(item.properties?.Rapport_à_IA) === "Le malaise voire l'anxiété"
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_rapport_niveau_etudes_l_observation_et_la_prudence: find_pourcentage(
			allResults
				.filter(
					(item) => extractValue(item.properties?.Rapport_à_IA) === "L'observation et la prudence"
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_rapport_niveau_etudes_La_confiance_dans_ces_nouveaux_outils: find_pourcentage(
			allResults
				.filter(
					(item) =>
						extractValue(item.properties?.Rapport_à_IA) === 'La confiance dans ces nouveaux outils'
				)
				.map((item) => extractValue(item.properties?.Niveau_études)),
			officialOptions.Niveau_études
		).map((s, i) => ({
			label: s.value,
			value: parseFloat(s.percentage.replace('%', '')),
			color: colors[i % colors.length]
		})),
		repartition_rapport_niveau_etudes_L_excitation_à_l_idee_de_l_utiliser_davantage:
			find_pourcentage(
				allResults
					.filter(
						(item) =>
							extractValue(item.properties?.Rapport_à_IA) ===
							"L'excitation à l'idée de l'utiliser davantage"
					)
					.map((item) => extractValue(item.properties?.Niveau_études)),
				officialOptions.Niveau_études
			).map((s, i) => ({
				label: s.value,
				value: parseFloat(s.percentage.replace('%', '')),
				color: colors[i % colors.length]
			}))
	}

	const content = `export const surveyData = ${JSON.stringify(data, null, 2)};\n`
	writeFileSync('src/lib/data/survey-stats.ts', content, 'utf-8')
	console.log('✅ Updated src/lib/data/survey-stats.ts with real data')
}

downloadAll().catch((err) => {
	console.error('❌  Error:', err.message ?? err)
	process.exit(1)
})
