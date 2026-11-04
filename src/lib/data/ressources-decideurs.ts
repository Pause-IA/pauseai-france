/**
 * Ressources destinées aux décideur·euses (élus, cabinets, administrations).
 *
 * Page hors menu et hors sitemap : on y arrive par le lien qu'on partage lors
 * d'un rendez-vous de plaidoyer. Les références sont volontairement citées au
 * format bibliographique, pour qu'elles puissent être reprises telles quelles
 * dans une note ou un rapport.
 *
 * Date de dernière vérification des liens, affichée en haut de page.
 */
export const miseAJour = '2026-11-04'

export interface RessourceDecideur {
	/** Ce que la ressource apporte, en une phrase. */
	apport: string
	/** Référence bibliographique complète. */
	reference: string
	url: string
	/** Langue du document, signalée quand ce n'est pas le français. */
	langue?: 'en'
}

export interface SectionDecideurs {
	id: string
	titre: string
	titreEn: string
	intro?: string
	introEn?: string
	ressources: RessourceDecideur[]
}

export const sections: SectionDecideurs[] = [
	{
		id: 'etat-du-risque',
		titre: 'Où en est le risque',
		titreEn: 'Where the risk stands',
		intro:
			'Les sources sur lesquelles nous nous appuyons pour affirmer que le risque est reconnu par les chercheurs eux-mêmes, et non par une poignée de militants.',
		introEn:
			'The sources behind our claim that the risk is acknowledged by researchers themselves, not by a handful of campaigners.',
		ressources: [
			{
				apport:
					'Plus de la moitié des chercheurs en IA interrogés estimaient, en décembre 2024, que le risque d’extinction ou de perte de contrôle sévère était d’au moins 10 %.',
				reference:
					'AI Impacts. (2026). Advanced AI according to 1,580 researchers: uncertain, unsafe, and sooner than we thought.',
				url: 'https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf',
				langue: 'en'
			},
			{
				apport:
					'Le rapport international de référence sur la sécurité de l’IA, en version française. Le résumé exécutif fait cinq pages.',
				reference:
					'Bengio, Y., Clare, S., Prunkl, C., Andriushchenko, M., Bucknall, B., & Murray, M. (et al.). (2026, février). Rapport international sur la sécurité de l’IA 2026.',
				url: 'https://internationalaisafetyreport.org/sites/default/files/2026-02/rapport-international-sur-la-securite-de-l-ia-2026.pdf'
			},
			{
				apport:
					'Un scénario détaillé de progression de l’IA, produit par un groupe de chercheurs en sécurité de l’IA.',
				reference: 'AI Futures Project. (s. d.). AI 2027.',
				url: 'https://ai-2027.com/',
				langue: 'en'
			},
			{
				apport:
					'L’ouvrage de référence sur le risque d’extinction lié au développement non contrôlé d’une superintelligence.',
				reference:
					'Yudkowsky, E., & Soares, N. (2025). If anyone builds it, everyone dies. Jonathan Cape.',
				url: 'https://www.hedweb.com/private/if-anyone-builds-it-everyone-dies.pdf',
				langue: 'en'
			},
			{
				apport:
					'Entretien avec Maxime Fournes, cofondateur et président de Pause IA, sur l’état de la perte de contrôle.',
				reference:
					'Le Futurologue. (2026, 8 septembre). Ingénieur en IA : « Ça y est, la perte de contrôle a commencé… » [Vidéo]. YouTube.',
				url: 'https://www.youtube.com/watch?v=WhQViEjkg7s'
			}
		]
	},
	{
		id: 'prises-de-position',
		titre: 'Ce que les États disent déjà',
		titreEn: 'What states are already saying',
		intro:
			'Des positions officielles, dont certaines portées par la France : le sujet est installé dans le débat diplomatique.',
		introEn:
			'Official positions, some of them carried by France: the subject is already part of the diplomatic conversation.',
		ressources: [
			{
				apport:
					'Déclaration pour le contrôle des modèles d’IA de frontière, à l’initiative de la Finlande et de la Norvège, signée par la France le 23 septembre 2026.',
				reference: '(2026, 21 septembre). A Call for Control of Frontier AI Models. Presidentti.',
				url: 'https://www.presidentti.fi/en/a-call-for-control-of-frontier-ai-models/',
				langue: 'en'
			},
			{
				apport:
					'Intervention de la France au Conseil de sécurité des Nations unies sur l’intelligence artificielle.',
				reference:
					'Intervention de Jean-Noël Barrot, ministre de l’Europe et des Affaires étrangères, au Conseil de sécurité des Nations unies. (s. d.). La France à l’ONU.',
				url: 'https://onu.diplomatie.gouv.fr/fr/intervention-de-jean-noel-barrot-ministre-de-leurope-et-des-affaires-etrangeres-au-conseil-de'
			}
		]
	},
	{
		id: 'propositions-de-loi',
		titre: 'Des textes législatifs existent ailleurs',
		titreEn: 'Legislation already exists elsewhere',
		intro:
			'Deux propositions de loi récentes, utiles comme précédents : un moratoire sur la superintelligence n’est pas une idée sans traduction juridique.',
		introEn:
			'Two recent bills, useful as precedents: a moratorium on superintelligence is not an idea without legal form.',
		ressources: [
			{
				apport:
					'Proposition de loi sur la sécurité en matière de superintelligence artificielle, soutenue par plus de 70 parlementaires britanniques de plusieurs partis.',
				reference:
					'Sobel, A. (2026, 8 septembre). Artificial Superintelligence Security Bill. House of Commons.',
				url: 'https://images.controlai.com/ControlAI_UK_ASI_Bill_Ten_Minute_Rule.pdf',
				langue: 'en'
			},
			{
				apport:
					'Projet de loi visant à interdire la superintelligence artificielle, déposé par le sénateur Bernie Sanders et le député Greg Casar.',
				reference:
					'Sanders, B., & Casar, G. (2026, 23 septembre). Ban Artificial Superintelligence Act. United States Senate.',
				url: 'https://www.sanders.senate.gov/wp-content/uploads/Ban-Artificial-Superintelligence-Act.pdf',
				langue: 'en'
			}
		]
	},
	{
		id: 'que-faire',
		titre: 'Les solutions proposées',
		titreEn: 'The proposed solutions',
		intro:
			'Des plans institutionnels construits, pour répondre à la question qui vient toujours ensuite : concrètement, on fait quoi ?',
		introEn:
			'Worked-out institutional plans, answering the question that always comes next: what do we actually do?',
		ressources: [
			{
				apport: 'Un plan institutionnel direct pour écarter le risque d’extinction lié à l’IA.',
				reference:
					'ControlAI. (s. d.). The Direct Institutional Plan to prevent AI Extinction Risk.',
				url: 'https://controlai.org/dip',
				langue: 'en'
			},
			{
				apport:
					'Un scénario de recommandations pour parvenir à l’alignement de l’IA, incluant l’arrêt du développement de la superintelligence jusqu’en 2040.',
				reference: 'AI Futures Project. (s. d.). AI 2040.',
				url: 'https://ai-2040.com/',
				langue: 'en'
			},
			{
				apport:
					'Trois priorités du CeSIA reprises dans le rapport parlementaire français sur l’alignement de l’IA.',
				reference:
					'CeSIA. (2026, 14 août). Trois priorités du CeSIA retenues dans le rapport parlementaire sur l’alignement de l’IA.',
				url: 'https://cesia.org/fr/publications/cesias-three-priorities-make-it-into-the-french-senates-ai-alignment-report/'
			}
		]
	}
]
