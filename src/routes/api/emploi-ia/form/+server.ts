import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { Client } from '@notionhq/client'
import type { CreatePageParameters } from '@notionhq/client'

const notion = new Client({
	auth: process.env.NOTION_TOKEN as string
})

export const POST: RequestHandler = async ({ request }) => {
	try {
		let data = await request.json()

		if (
			!data.email ||
			!data.sexe ||
			!data.age ||
			!data.statutProfessionnel ||
			!data.secteurActivite ||
			!data.veutPlusQuestions
		) {
			return json({ error: 'Champs requis manquants' }, { status: 400 })
		}

		// Validate email format (simple check for @ symbol)
		if (typeof data.email !== 'string' || !data.email.includes('@')) {
			return json({ error: "Format d'email invalide" }, { status: 400 })
		}

		// Validate age range
		const age = Number(data.age)
		if (isNaN(age) || age < 1 || age > 120) {
			return json({ error: "L'âge doit être entre 1 et 120" }, { status: 400 })
		}

		if (Array.isArray(data.objectifsCellule)) {
			data.objectifsCellule = data.objectifsCellule
				.map((obj: string) => (obj === 'Autre' ? data.autreObjectif : obj))
				.join('\n\n')
		}

		if (Array.isArray(data.typeTaches)) {
			data.typeTaches = data.typeTaches
				.map((tache: string) => (tache === 'Autre' ? data.autreTache : tache))
				.join('\n\n')
		}

		if (Array.isArray(data.raisonsUtilisation)) {
			data.raisonsUtilisation = data.raisonsUtilisation
				.map((raison: string) => (raison === 'Autre' ? data.autreRaison : raison))
				.join('\n\n')
		}

		const properties: CreatePageParameters['properties'] = {
			Prenom: {
				title: [
					{
						text: { content: data.prenom.length > 200 ? data.prenom.slice(0, 200) : data.prenom }
					}
				]
			},
			Sexe: {
				select: { name: data.sexe }
			},
			Age: {
				rich_text: [{ text: { content: String(data.age) } }]
			},
			Statut_professionnel: {
				rich_text: [
					{
						text: {
							content:
								data.statutProfessionnel === 'Autre'
									? data.autreStatutProfessionnel
									: data.statutProfessionnel
						}
					}
				]
			},
			Secteur_activité: {
				rich_text: [
					{
						text: {
							content:
								data.secteurActivite === 'Autres' ? data.autreSecteurActivite : data.secteurActivite
						}
					}
				]
			},
			Profession: {
				rich_text: [{ text: { content: data.profession || '' } }]
			},
			Fréquence_info_IA: {
				rich_text: [{ text: { content: data.frequenceInformation || '' } }]
			},
			Rapport_à_IA: {
				rich_text: [
					{
						text: {
							content:
								data.rapportIA === 'Un autre rapport' ? data.autreRapport : data.rapportIA || ''
						}
					}
				]
			},
			Raison_cellule: {
				rich_text: [{ text: { content: data.objectifsCellule || '' } }]
			},
			Témoignage: {
				rich_text: [{ text: { content: data.temoignage || '' } }]
			},
			Email: {
				email: data.email
			},
			Tâche_IA: {
				rich_text: [{ text: { content: data.typeTaches || '' } }]
			},
			Raisons_utilisation: {
				rich_text: [{ text: { content: data.raisonsUtilisation || '' } }]
			},
			Date: {
				date: { start: new Date().toISOString() }
			},
			Consentement: {
				checkbox: data.consentementPartage
			},
			Afficher: {
				checkbox: false
			}
		}

		if (data.niveauEtudes && data.niveauEtudes.trim()) {
			properties.Niveau_études = {
				select: { name: data.niveauEtudes }
			}
		}

		if (data.impactIA && data.impactIA.trim()) {
			properties.Impact_perçu = {
				select: { name: data.impactIA }
			}
		}

		if (data.interesseCellule && data.interesseCellule.trim()) {
			properties.Intéressé_cellule = {
				select: { name: data.interesseCellule }
			}
		}

		if (data.utilisationIA && data.utilisationIA.trim()) {
			properties.Fréquence_utilisation = {
				select: { name: data.utilisationIA }
			}
		}

		if (data.satisfactionUtilisation && data.satisfactionUtilisation.trim()) {
			properties.Satisfaction = {
				select: { name: data.satisfactionUtilisation }
			}
		}

		const page = await notion.pages.create({
			parent: { data_source_id: process.env.TESTIMONIALS_ID as string },
			properties
		})

		return json({ success: true })
	} catch (err) {
		console.error('Error creating Notion entry:', {
			error: err instanceof Error ? err.message : String(err),
			timestamp: new Date().toISOString()
		})
		return json({ error: 'Erreur serveur' }, { status: 500 })
	}
}
