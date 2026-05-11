import { Client } from '@notionhq/client'
import { writeFileSync } from 'fs'
import {
	find_pourcentage,
	mean,
	statistics_by_tens,
	find_pourcentage_by_groupe,
	find_pourcentage_by_groupe_age_tens,
	impact_by_age_tens,
	extractValue
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
	const colors = ['#ff9416', '#c96900', '#ffb766', '#8a4700', '#ffd9a3', '#e5e7eb']

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
		genre: getChartData('Sexe')
	}

	const content = `export const surveyData = ${JSON.stringify(data, null, 2)};\n`
	writeFileSync('src/lib/data/survey-stats.ts', content, 'utf-8')
	console.log('✅ Updated src/lib/data/survey-stats.ts with real data')
}

downloadAll().catch((err) => {
	console.error('❌  Error:', err.message ?? err)
	process.exit(1)
})
