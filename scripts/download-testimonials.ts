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
		secteur: getChartData('Secteur_activité'),
		age: ageData,
		etudes: getChartData('Niveau_études'),
		statut: getChartData('Statut_professionnel'),
		genre: getChartData('Sexe'),
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
