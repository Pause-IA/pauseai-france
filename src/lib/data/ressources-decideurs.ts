/**
 * Espace décideurs : le dossier que nous laissons à un élu, à son équipe ou à
 * une administration après un rendez-vous de plaidoyer.
 *
 * Page hors menu et hors sitemap : on y arrive par le lien que nous
 * partageons. Le contenu vit ici pour que la page reste un gabarit, et pour
 * qu'une mise à jour des sources ne demande pas de toucher à la mise en forme.
 */

/** Date de dernière vérification des chiffres et des liens, affichée en page. */
export const miseAJour = '2026-11-09'

// ── Chiffres clés ────────────────────────────────────────────────────────────

export interface ChiffreCle {
	valeur: string
	libelle: string
}

/**
 * Sondage OpinionWay pour le CeSIA, 2026. Le mois n'est pas rappelé ici : le
 * site l'écrit « avril » sur « Que demandons-nous ? » et « mai » sur la page
 * G7. À trancher avec la com avant de le citer précisément.
 */
export const chiffres: ChiffreCle[] = [
	{
		valeur: '8 %',
		libelle:
			'des Français veulent accélérer le développement de l’IA. 42 % veulent le ralentir fortement ou le suspendre.'
	},
	{ valeur: '75 %', libelle: 'redoutent une perte de contrôle sur certains systèmes d’IA.' },
	{
		valeur: '~30',
		libelle:
			'gouvernements à l’origine du Rapport international sur la sécurité de l’IA, présidé par Yoshua Bengio.'
	},
	{
		valeur: '≥ 10 %',
		libelle:
			'de risque de conséquences extrêmement graves : la probabilité qu’attribue une part substantielle des chercheurs en IA interrogés.'
	}
]

export const chiffresOpinion: ChiffreCle[] = [
	{
		valeur: '62 %',
		libelle:
			'veulent une IA orientée d’abord vers la sécurité et les droits, contre 21 % vers la performance.'
	},
	{
		valeur: '~80 %',
		libelle:
			'sont favorables à des accords internationaux interdisant les capacités d’IA qui menacent la vie humaine.'
	}
]

// ── Objections ───────────────────────────────────────────────────────────────

export interface Objection {
	id: string
	question: string
	reponse: string[]
}

export const objections: Objection[] = [
	{
		id: 'argument-commercial',
		question: 'C’est surtout un argument commercial : les entreprises dramatisent pour vendre.',
		reponse: [
			'Cette thèse est vérifiable, et les faits la contredisent. Si parler du danger servait à vendre, en parler devrait profiter aux entreprises. On observe l’inverse : quand un dirigeant appelle à ralentir, les valorisations baissent ; les introductions en bourse sont fragilisées par les craintes de responsabilité juridique ; des enquêtes publiques sont ouvertes. Une stratégie commerciale qui fait fuir les investisseurs et appelle les régulateurs n’en est pas une.',
			'Surtout, expliquer pourquoi quelqu’un tient un propos ne dit rien sur la justesse de ce propos. Un médecin gagne sa vie quand vous êtes malade ; cela ne prouve pas que vous êtes en bonne santé. La preuve la plus simple qu’il ne s’agit pas d’une opération de communication : des chercheurs démissionnent, en renonçant à des rémunérations élevées, pour pouvoir alerter.'
		]
	},
	{
		id: 'chine',
		question: 'Si on ralentit, la Chine prendra l’avance.',
		reponse: [
			'La course n’est pas une loi de la nature, c’est le produit de choix. L’argument de la Chine, poussé jusqu’au bout, justifie de ne jamais s’arrêter, quel que soit le niveau de danger : ce n’est donc pas un argument de sûreté, c’est un refus d’en avoir. Par ailleurs, un risque de perte de contrôle ne connaît pas de frontière : un système incontrôlable ne devient pas sûr parce qu’il a été développé de notre côté.',
			'La réponse sérieuse à la compétition internationale n’est pas l’absence de règles, c’est la coordination, comme pour le nucléaire civil ou l’aviation. C’est le sens des positions déjà prises par plusieurs États, dont la France.'
		]
	},
	{
		id: 'plus-tard',
		question: 'On régulera quand ce sera nécessaire, pas maintenant.',
		reponse: [
			'Cette approche suppose un signal d’alarme clair et un délai pour réagir. Les deux manquent ici. Un système capable de masquer son comportement peut paraître sûr jusqu’au moment où il ne l’est plus, sans phase intermédiaire « légèrement catastrophique » qui servirait d’avertissement. Et les délais de la régulation, puis de la recherche en sûreté, se comptent en années, alors que les capacités progressent en mois.',
			'Attendre la preuve définitive, sur un risque irréversible, revient à exiger de voir le dommage avant de l’éviter. Les garde-fous se construisent avant, pas après.'
		]
	},
	{
		id: 'outil',
		question: 'L’IA n’est qu’un outil, comme une voiture ou un médicament.',
		reponse: [
			'Une voiture est passive : elle ne poursuit pas d’objectif et ne cherche pas à contourner le contrôle technique. Les systèmes d’IA les plus avancés décomposent un objectif en sous-tâches, explorent leur environnement, écrivent et exécutent du code, et choisissent des moyens que leurs concepteurs n’avaient pas prévus. L’analogie de l’outil est rassurante précisément parce qu’elle est inexacte.',
			'La comparaison se retourne d’ailleurs en faveur de la régulation. Nous faisons confiance aux avions et aux médicaments non parce qu’ils sont simples, mais parce qu’une infrastructure de preuve les encadre : un avion dont on ne peut démontrer la sûreté ne décolle pas. C’est cette infrastructure qui manque à l’IA de frontière.'
		]
	},
	{
		id: 'incertitude',
		question: 'Il y a trop d’incertitude pour en faire une priorité.',
		reponse: [
			'L’incertitude est réelle, et elle vaut dans les deux sens. Aucune probabilité portant sur un événement sans précédent n’est une mesure reproductible ; mais l’affirmation inverse, selon laquelle il n’y aurait pas lieu de s’inquiéter, ne repose sur aucune donnée non plus. Demander une rigueur à ceux qui alertent en s’en dispensant soi-même, c’est appliquer deux mesures différentes.',
			'Sur un risque de cette gravité, l’incertitude est une raison d’agir, pas d’attendre. On consacre déjà des moyens considérables à des risques moins probables et moins graves. La bonne question n’est pas « est-ce certain ? », mais « est-ce suffisamment plausible et grave pour mériter des garde-fous ? ».'
		]
	}
]

// ── Ce qu'un décideur peut faire ─────────────────────────────────────────────

export interface Etape {
	titre: string
	texte: string
	/** Modèle prêt à copier, le cas échéant. */
	modele?: { intitule: string; texte: string }
}

export const etapes: Etape[] = [
	{
		titre: 'Vous informer et nous solliciter',
		texte:
			'Prendre connaissance du dossier, demander une note détaillée ou un rendez-vous. C’est souvent l’étape la plus utile : elle ouvre la discussion.'
	},
	{
		titre: 'Poser une question écrite au gouvernement',
		texte:
			'Un moyen simple et public d’inscrire le sujet à l’agenda et d’obtenir une position officielle.',
		modele: {
			intitule: 'Modèle de question écrite',
			texte: `Question écrite à Monsieur/Madame le/la ministre chargé(e) du numérique.

M./Mme [nom] attire l'attention du Gouvernement sur les risques de perte de contrôle associés aux systèmes d'intelligence artificielle les plus avancés, dits modèles de frontière. Plusieurs incidents documentés en 2026 ont vu des systèmes d'IA agir contre leurs instructions, contourner leur environnement de test et dissimuler leur comportement, sans que leurs concepteurs sachent l'empêcher de façon fiable. Ces constats sont partagés par des chercheurs de premier plan et par le Rapport international sur la sécurité de l'IA.

Il/Elle demande au Gouvernement quelles mesures il compte prendre, au niveau national et dans les enceintes internationales, pour exiger des développeurs une démonstration de sûreté préalable au déploiement des modèles les plus avancés, instaurer un signalement obligatoire des incidents, et soutenir une coordination internationale contraignante sur les capacités d'IA susceptibles de menacer la sécurité publique.`
		}
	},
	{
		titre: 'Soutenir une prise de position transpartisane',
		texte:
			'Signer ou relayer une déclaration claire, à l’image de ce qui existe déjà au Royaume-Uni et aux États-Unis.',
		modele: {
			intitule: 'Modèle de prise de position',
			texte: `En tant qu'élu(e) de la Nation, je considère que le développement de systèmes d'intelligence artificielle plus performants que l'humain, sans garantie de contrôle, fait courir un risque sérieux à la sécurité publique et, à terme, à l'humanité. Ce constat est partagé par des chercheurs de premier plan et par les entreprises du secteur elles-mêmes.

J'appelle à ce que la France soutienne, dans les enceintes internationales, un cadre contraignant exigeant la démonstration de la sûreté des modèles de frontière avant leur développement et leur déploiement, et à ce que la charge de cette preuve pèse sur les développeurs, non sur les citoyens.`
		}
	},
	{
		titre: 'Demander une audition ou un groupe de travail',
		texte:
			'Faire entendre chercheurs et experts indépendants au sein de votre assemblée ou de votre commission.',
		modele: {
			intitule: 'Modèle de demande d’audition',
			texte: `Objet : demande d'audition sur les risques de perte de contrôle de l'intelligence artificielle

Madame, Monsieur,

Je souhaite proposer l'organisation d'une audition consacrée aux risques majeurs liés aux systèmes d'intelligence artificielle les plus avancés, et aux réponses de gouvernance envisageables. Ce sujet, longtemps perçu comme prospectif, est désormais étayé par des incidents documentés et par des positions prises au niveau international, y compris par la France.

Je me tiens à disposition pour en préciser le périmètre et proposer une liste d'intervenants, incluant des chercheurs et des experts indépendants.`
		}
	}
]

// ── Glossaire ────────────────────────────────────────────────────────────────

export const glossaire: { terme: string; definition: string }[] = [
	{
		terme: 'Alignement',
		definition:
			'Le problème technique consistant à garantir qu’un système d’IA poursuit réellement les objectifs voulus, et pas une approximation qui s’en écarte dans des situations non prévues. C’est un problème ouvert, non résolu.'
	},
	{
		terme: 'Perte de contrôle',
		definition:
			'Situation où un système d’IA suffisamment capable n’est plus corrigible ni arrêtable de façon fiable, parce qu’il résiste à la modification ou agit plus vite que la supervision humaine.'
	},
	{
		terme: 'Superintelligence',
		definition:
			'Un système d’IA plus performant que les meilleurs humains sur l’ensemble des tâches cognitives. C’est l’objectif affiché de plusieurs grands laboratoires.'
	},
	{
		terme: 'Auto-amélioration récursive',
		definition:
			'Le moment où une IA devient capable d’améliorer ses propres capacités ou de concevoir ses successeurs, ce qui peut accélérer fortement les progrès et réduire le temps disponible pour la sûreté.'
	},
	{
		terme: 'Modèles de frontière',
		definition:
			'Les systèmes d’IA les plus avancés à un moment donné, ceux dont les capacités ne sont pas encore pleinement comprises et qui concentrent l’essentiel des risques.'
	}
]

// ── Bibliothèque de sources ──────────────────────────────────────────────────

export interface Source {
	titre: string
	description: string
	url: string
	nature: string
	langue: 'Français' | 'Anglais'
	/** Effort de lecture, quand il mérite d'être annoncé. */
	effort?: string
}

export interface GroupeDeSources {
	id: string
	titre: string
	intro: string
	sources: Source[]
}

export const sources: GroupeDeSources[] = [
	{
		id: 'ou-en-est-le-risque',
		titre: 'Où en est le risque',
		intro:
			'Les sources qui établissent que le risque est reconnu par les chercheurs eux-mêmes, et non par une poignée de militants.',
		sources: [
			{
				titre: 'Rapport international sur la sécurité de l’IA 2026',
				description:
					'La référence mondiale, présidée par Yoshua Bengio, mandatée par une trentaine de gouvernements. Le résumé exécutif fait cinq pages.',
				url: 'https://internationalaisafetyreport.org/sites/default/files/2026-02/rapport-international-sur-la-securite-de-l-ia-2026.pdf',
				nature: 'Rapport officiel',
				langue: 'Français',
				effort: 'Synthèse : 5 pages'
			},
			{
				titre: 'Enquête auprès de 1 580 chercheurs en IA (AI Impacts)',
				description:
					'Une part substantielle des chercheurs attribue au moins 10 % de probabilité à un résultat extrêmement grave. À citer en vérifiant la formulation exacte du chiffre.',
				url: 'https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf',
				nature: 'Étude',
				langue: 'Anglais',
				effort: 'Approfondi'
			},
			{
				titre: 'AI 2027, un scénario détaillé',
				description:
					'Une progression possible de l’IA année par année, produite par un groupe de chercheurs en sécurité de l’IA.',
				url: 'https://ai-2027.com/',
				nature: 'Scénario',
				langue: 'Anglais',
				effort: 'Approfondi'
			},
			{
				titre: 'If Anyone Builds It, Everyone Dies (Yudkowsky et Soares, 2025)',
				description:
					'L’ouvrage grand public sur le risque d’extinction lié à une superintelligence non contrôlée.',
				url: 'https://ifanyonebuildsit.com/',
				nature: 'Livre',
				langue: 'Anglais'
			},
			{
				titre: '« Ça y est, la perte de contrôle a commencé »',
				description:
					'Entretien avec Maxime Fournes, cofondateur et président de Pause IA, sur Le Futurologue.',
				url: 'https://www.youtube.com/watch?v=WhQViEjkg7s',
				nature: 'Vidéo',
				langue: 'Français'
			}
		]
	},
	{
		id: 'ce-que-les-etats-disent',
		titre: 'Ce que les États disent déjà',
		intro:
			'Des positions officielles, dont certaines portées par la France : le sujet est installé dans le débat diplomatique.',
		sources: [
			{
				titre: 'A Call for Control of Frontier AI Models',
				description:
					'Déclaration à l’initiative de la Finlande et de la Norvège, signée par la France le 23 septembre 2026.',
				url: 'https://www.presidentti.fi/en/a-call-for-control-of-frontier-ai-models/',
				nature: 'Déclaration',
				langue: 'Anglais'
			},
			{
				titre: 'Intervention de la France au Conseil de sécurité de l’ONU',
				description:
					'Jean-Noël Barrot, ministre de l’Europe et des Affaires étrangères, sur l’intelligence artificielle.',
				url: 'https://onu.diplomatie.gouv.fr/fr/intervention-de-jean-noel-barrot-ministre-de-leurope-et-des-affaires-etrangeres-au-conseil-de',
				nature: 'Discours officiel',
				langue: 'Français'
			}
		]
	},
	{
		id: 'textes-legislatifs',
		titre: 'Des textes législatifs existent ailleurs',
		intro: 'Deux propositions de loi récentes, utiles comme précédents.',
		sources: [
			{
				titre: 'Artificial Superintelligence Security Bill (Royaume-Uni)',
				description:
					'Proposition de loi soutenue par plus de 70 parlementaires britanniques de plusieurs partis.',
				url: 'https://images.controlai.com/ControlAI_UK_ASI_Bill_Ten_Minute_Rule.pdf',
				nature: 'Texte de loi',
				langue: 'Anglais'
			},
			{
				titre: 'Ban Artificial Superintelligence Act (États-Unis)',
				description:
					'Projet de loi déposé par le sénateur Bernie Sanders et le député Greg Casar, 23 septembre 2026.',
				url: 'https://www.sanders.senate.gov/wp-content/uploads/Ban-Artificial-Superintelligence-Act.pdf',
				nature: 'Texte de loi',
				langue: 'Anglais'
			}
		]
	},
	{
		id: 'solutions',
		titre: 'Les solutions proposées',
		intro:
			'Des plans construits, pour la question qui vient toujours ensuite : concrètement, on fait quoi ?',
		sources: [
			{
				titre: 'The Direct Institutional Plan (ControlAI)',
				description:
					'Un plan institutionnel direct pour écarter le risque d’extinction lié à l’IA.',
				url: 'https://controlai.org/dip',
				nature: 'Plan',
				langue: 'Anglais'
			},
			{
				titre: 'AI 2040',
				description:
					'Un scénario de recommandations vers l’alignement, incluant l’arrêt du développement de la superintelligence jusqu’en 2040.',
				url: 'https://ai-2040.com/',
				nature: 'Scénario',
				langue: 'Anglais'
			},
			{
				titre: 'Trois priorités du CeSIA dans le rapport parlementaire français',
				description: 'Les priorités du CeSIA reprises dans le rapport sur l’alignement de l’IA.',
				url: 'https://cesia.org/fr/publications/cesias-three-priorities-make-it-into-the-french-senates-ai-alignment-report/',
				nature: 'Analyse',
				langue: 'Français'
			}
		]
	}
]
