/**
 * Ressources pour les décideurs publics : les travaux que nous citons, classés
 * par usage.
 *
 * Page hors menu et hors sitemap : on y arrive par le lien que nous partageons
 * à la suite d'un rendez-vous. Le contenu vit ici pour que la page reste un
 * gabarit, et pour qu'une mise à jour des sources ne demande pas de toucher à
 * la mise en forme.
 */

/** Date de dernière vérification des liens, affichée en page. */
export const miseAJour = '2026-11-09'

export interface Reference {
	titre: string
	meta: string
	url: string
	/** Ressource en français. La quasi-totalité des sources de fond sont
	    anglophones : la page le dit une fois, et signale les exceptions
	    plutôt que de répéter « en anglais » sur douze entrées sur treize. */
	francais?: boolean
}

export interface GroupeDeReferences {
	id: string
	titre: string
	references: Reference[]
}

export const references: GroupeDeReferences[] = [
	{
		id: 'declarations',
		titre: 'Déclarations et textes officiels',
		references: [
			{
				titre: 'Statement on AI Risk',
				meta: 'Center for AI Safety, 2023. La déclaration et la liste de ses signataires.',
				url: 'https://www.safe.ai/work/statement-on-ai-risk'
			},
			{
				titre: 'Déclaration de Bletchley',
				meta: 'Sommet sur la sécurité de l’IA, novembre 2023. Signée par une trentaine de pays, dont la France.',
				url: 'https://www.gov.uk/government/publications/ai-safety-summit-2023-the-bletchley-declaration'
			},
			{
				titre: 'Rapport international sur la sécurité de l’IA 2025',
				meta: 'Sous la présidence de Yoshua Bengio. L’état des lieux validé par une trentaine de pays.',
				url: 'https://www.gov.uk/government/publications/international-ai-safety-report-2025'
			},
			{
				titre: 'Rapport international sur la sécurité de l’IA 2026',
				meta: 'L’édition suivante, et la seule disponible en français.',
				url: 'https://internationalaisafetyreport.org/sites/default/files/2026-02/rapport-international-sur-la-securite-de-l-ia-2026.pdf',
				francais: true
			},
			{
				titre: 'Déclaration sur la superintelligence',
				meta: 'Future of Life Institute, octobre 2025. Appel à interdire le développement de la superintelligence tant que sa sûreté n’est pas établie.',
				url: 'https://superintelligence-statement.org/'
			},
			{
				titre: 'A Call for Control of Frontier AI Models',
				meta: 'Appel porté par la Finlande et la Norvège, septembre 2026. La France en est signataire.',
				url: 'https://www.presidentti.fi/en/a-call-for-control-of-frontier-ai-models/'
			},
			{
				titre: 'Intervention de Jean-Noël Barrot au Conseil de sécurité des Nations unies',
				meta: 'Le ministre de l’Europe et des Affaires étrangères sur l’IA et la sécurité internationale. La position française, par la France.',
				url: 'https://onu.diplomatie.gouv.fr/fr/intervention-de-jean-noel-barrot-ministre-de-leurope-et-des-affaires-etrangeres-au-conseil-de',
				francais: true
			}
		]
	},
	{
		id: 'mesures',
		titre: 'Ce que mesurent les chercheurs',
		references: [
			{
				titre: 'Thousands of AI Authors on the Future of AI',
				meta: 'AI Impacts, enquête auprès de 2 778 chercheurs. La source des probabilités citées.',
				url: 'https://arxiv.org/abs/2401.02843'
			},
			{
				titre: 'Advanced AI according to 1 580 researchers',
				meta: 'AI Impacts, vague de décembre 2024. C’est l’enquête d’où vient la probabilité médiane de 10 % citée plus haut.',
				url: 'https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf'
			},
			{
				titre: 'Managing extreme AI risks amid rapid progress',
				meta: 'Bengio, Hinton, Russell et al., revue Science, 2024. Le consensus scientifique sur les risques extrêmes.',
				url: 'https://arxiv.org/abs/2310.17688'
			}
		]
	},
	{
		id: 'comportements',
		titre: 'Des comportements déjà observés',
		references: [
			{
				titre: 'Scheming reasoning evaluations',
				meta: 'Apollo Research, 2024. Des modèles qui trompent délibérément leurs évaluateurs en test.',
				url: 'https://apolloresearch.ai/research/scheming-reasoning-evaluations'
			},
			{
				titre: 'Agentic Misalignment',
				meta: 'Anthropic, 2025. Des systèmes qui recourent au chantage en situation de test pour éviter d’être remplacés.',
				url: 'https://www.anthropic.com/research/agentic-misalignment'
			}
		]
	},
	{
		id: 'parlements',
		titre: 'Ce que proposent déjà des parlements',
		references: [
			{
				titre: 'Artificial Superintelligence Security Bill',
				meta: 'Proposition de loi britannique, septembre 2026, soutenue par plus de 70 parlementaires de plusieurs partis.',
				url: 'https://images.controlai.com/ControlAI_UK_ASI_Bill_Ten_Minute_Rule.pdf'
			},
			{
				titre: 'Ban Artificial Superintelligence Act',
				meta: 'Texte déposé par le sénateur Bernie Sanders et le représentant Greg Casar, septembre 2026.',
				url: 'https://www.sanders.senate.gov/wp-content/uploads/Ban-Artificial-Superintelligence-Act.pdf'
			}
		]
	},
	{
		id: 'institutions',
		titre: 'Quelles institutions pour garder le contrôle',
		references: [
			{
				titre: 'The Direct Institutional Plan',
				meta: 'ControlAI. Un plan institutionnel pour empêcher le risque d’extinction.',
				url: 'https://controlai.org/dip'
			},
			{
				titre: 'Trois priorités du CeSIA dans le rapport parlementaire sur l’alignement',
				meta: 'Centre pour la sécurité de l’IA, août 2026. Des recommandations reprises par le Sénat français.',
				url: 'https://cesia.org/fr/publications/cesias-three-priorities-make-it-into-the-french-senates-ai-alignment-report/',
				francais: true
			}
		]
	},
	{
		id: 'scenarios',
		titre: 'Scénarios et vulgarisation',
		references: [
			{
				titre: 'AI 2027',
				meta: 'Scénario détaillé, par d’anciens chercheurs des laboratoires, d’un emballement possible des capacités.',
				url: 'https://ai-2027.com'
			},
			{
				titre: 'Pause Giant AI Experiments',
				meta: 'Lettre ouverte du Future of Life Institute, 2023, signée par plus de 30 000 personnes.',
				url: 'https://futureoflife.org/open-letter/pause-giant-ai-experiments/'
			},
			{
				titre: 'Ingénieur en IA : « Ça y est, la perte de contrôle a commencé »',
				meta: 'Entretien avec Maxime Fournes, président et cofondateur de Pause IA, dans Le Futurologue, septembre 2026. Une heure pour entrer dans le sujet, en français.',
				url: 'https://www.youtube.com/watch?v=WhQViEjkg7s',
				francais: true
			},
			{
				titre: 'If Anyone Builds It, Everyone Dies',
				meta: 'E. Yudkowsky et N. Soares, 2025. L’argument de la perte de contrôle, en langage accessible.',
				url: 'https://ifanyonebuildsit.com'
			}
		]
	},
	{
		id: 'agir',
		titre: 'Agir avec nous',
		references: [
			{
				titre: 'Pause IA',
				meta: 'L’antenne française de PauseAI : nos positions, nos ressources et nos actions.',
				url: 'https://pauseia.fr',
				francais: true
			},
			{
				titre: 'PauseAI',
				meta: 'Le mouvement international dont Pause IA est la branche française.',
				url: 'https://pauseai.info'
			}
		]
	}
]
