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

// ── Chiffres clés (section « L'opinion ») ────────────────────────────────────

export interface ChiffreCle {
	valeur: string
	libelle: string
}

export const chiffresOpinion: ChiffreCle[] = [
	{
		valeur: '75 %',
		libelle:
			'des Français redoutent une perte de contrôle sur certains systèmes d’IA. Seuls 8 % veulent accélérer.'
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
		question: 'C’est surtout un argument commercial : on dramatise pour vendre.',
		reponse: [
			'Cette thèse se vérifie, et les faits la démentent. Si l’alarme servait à vendre, en parler devrait rapporter. On constate l’inverse. Quand un dirigeant appelle à ralentir, les valorisations baissent. Les introductions en bourse sont fragilisées par la crainte d’une responsabilité juridique. Des enquêtes publiques s’ouvrent. Une stratégie commerciale qui fait fuir les investisseurs et appelle les régulateurs serait singulièrement ratée.',
			'Il y a plus simple. Expliquer pourquoi quelqu’un parle ne dit rien sur la justesse de ce qu’il dit. Un médecin gagne sa vie quand vous êtes malade, cela ne prouve pas que vous allez bien. Et des chercheurs démissionnent, en renonçant à des rémunérations élevées, pour pouvoir alerter. Une campagne marketing ne pousse pas des salariés à partir contre leur employeur.'
		]
	},
	{
		id: 'chine',
		question: 'Si on ralentit, la Chine prendra l’avance.',
		reponse: [
			'La course n’est pas une loi de la nature, c’est le produit de choix. Poussé jusqu’au bout, cet argument justifie de ne jamais s’arrêter, quel que soit le danger. Ce n’est donc pas une position sur la sûreté, c’est un refus d’en avoir une. Et un système incontrôlable ne devient pas sûr parce qu’il a été développé de notre côté de la frontière.',
			'La réponse sérieuse à la compétition internationale porte un nom connu : la coordination, comme pour le nucléaire civil ou l’aviation. C’est le sens des positions déjà prises par plusieurs États, dont la France.'
		]
	},
	{
		id: 'plus-tard',
		question: 'On régulera le moment venu, pas maintenant.',
		reponse: [
			'Cette approche suppose un signal d’alarme clair et un délai pour réagir. Les deux manquent. Un système capable de masquer son comportement peut paraître sûr jusqu’au moment où il cesse de l’être, sans palier intermédiaire qui servirait d’avertissement. Les délais de la régulation, puis de la recherche en sûreté, se comptent en années, quand les capacités progressent en mois.',
			'Le Rapport international décrit d’ailleurs un « dilemme de la preuve » : agir trop tôt risque de figer de mauvaises mesures, attendre risque de laisser la société exposée. Sur un risque irréversible, ce dilemme ne se tranche pas en remettant à plus tard.'
		]
	},
	{
		id: 'outil',
		question: 'L’IA n’est qu’un outil, comme une voiture ou un médicament.',
		reponse: [
			'Une voiture ne poursuit pas d’objectif et ne cherche pas à déjouer le contrôle technique. Les systèmes d’IA les plus avancés décomposent un but en sous-tâches, explorent leur environnement, écrivent et exécutent du code, et choisissent des moyens que leurs concepteurs n’avaient pas prévus. L’analogie de l’outil rassure précisément parce qu’elle est fausse.',
			'La comparaison se retourne même en faveur de la régulation. Nous faisons confiance aux avions et aux médicaments non parce qu’ils seraient simples, mais parce qu’une infrastructure de preuve les encadre. Un avion dont le constructeur ne peut démontrer la résistance ne décolle pas. C’est cette infrastructure qui manque encore à l’IA de frontière.'
		]
	},
	{
		id: 'incertitude',
		question: 'C’est trop incertain pour en faire une priorité.',
		reponse: [
			'L’incertitude est réelle, et elle vaut dans les deux sens. Aucune probabilité portant sur un événement sans précédent n’est une mesure reproductible. Mais l’affirmation inverse, celle qui voudrait que l’inquiétude ne soit pas fondée, ne repose sur aucune donnée non plus. Exiger des lanceurs d’alerte une rigueur dont on se dispense soi-même, c’est utiliser deux mesures selon ce qui nous arrange.',
			'Sur un risque de cette gravité, l’incertitude commande la prudence, elle ne l’excuse pas. Nous consacrons déjà des moyens considérables à des risques moins probables et moins graves. La bonne question n’est pas « est-ce certain », mais « est-ce assez plausible et assez grave pour mériter des garde-fous ». Même pour un sceptique prudent, la réponse est oui.'
		]
	},
	{
		id: 'vrais-problemes',
		question: 'Parler d’extinction détourne des vrais problèmes d’aujourd’hui.',
		reponse: [
			'Les biais des algorithmes, les effets sur l’emploi, les hypertrucages : ces problèmes sont réels et méritent une action. Mais s’en inquiéter ne diminue pas le risque de perte de contrôle, et l’inverse est vrai aussi. Les deux s’additionnent. On peut, et on doit, traiter plusieurs sujets à la fois.',
			'Si Pause IA concentre son effort sur le risque existentiel, c’est pour une raison précise : c’est le plus grave, le moins traité, et le seul potentiellement irréversible. Les autres dommages, aussi sérieux soient-ils, laissent une marge de correction. Celui-ci, par hypothèse, n’en laisse pas.'
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
		titre: 'Vous informer, nous solliciter',
		texte:
			'Demander une note détaillée ou un rendez-vous. C’est souvent le plus utile, parce que cela ouvre la discussion.'
	},
	{
		titre: 'Poser une question écrite au gouvernement',
		texte:
			'Un moyen simple et public d’inscrire le sujet à l’agenda et d’obtenir une position officielle.',
		modele: {
			intitule: 'Voir un modèle de question écrite',
			texte: `Question écrite à Monsieur/Madame le/la ministre chargé(e) du numérique.

M./Mme [nom] appelle l'attention du Gouvernement sur les risques de perte de contrôle associés aux systèmes d'intelligence artificielle les plus avancés, dits modèles de frontière. Plusieurs incidents divulgués en 2026 ont vu des systèmes d'IA contourner leur environnement de test et dissimuler leur comportement, sans que leurs concepteurs sachent l'empêcher de façon fiable. Ces constats sont partagés par des chercheurs de premier plan et figurent dans le Rapport international sur la sécurité de l'IA.

Il/Elle demande quelles mesures le Gouvernement entend prendre, au plan national et dans les enceintes internationales, pour exiger des développeurs une démonstration de sûreté préalable au déploiement des modèles les plus avancés, instaurer un signalement obligatoire des incidents, et soutenir une coordination internationale contraignante sur les capacités d'IA susceptibles de menacer la sécurité publique.`
		}
	},
	{
		titre: 'Soutenir une prise de position transpartisane',
		texte:
			'Signer ou relayer une déclaration claire, comme il en existe déjà au Royaume-Uni et aux États-Unis.',
		modele: {
			intitule: 'Voir un modèle de déclaration',
			texte: `En tant qu'élu(e) de la Nation, je considère que le développement de systèmes d'intelligence artificielle plus performants que l'humain, sans garantie de contrôle, fait courir un risque sérieux à la sécurité publique et, à terme, à l'humanité. Ce constat est partagé par des chercheurs de premier plan et par les entreprises du secteur elles-mêmes.

J'appelle la France à soutenir, dans les enceintes internationales, un cadre contraignant exigeant la démonstration de la sûreté des modèles de frontière avant leur développement et leur déploiement, et à ce que la charge de cette preuve pèse sur les développeurs, non sur les citoyens.`
		}
	},
	{
		titre: 'Demander une audition ou un groupe de travail',
		texte:
			'Faire entendre chercheurs et experts indépendants dans votre assemblée ou votre commission.',
		modele: {
			intitule: 'Voir un modèle de demande',
			texte: `Objet : demande d'audition sur les risques de perte de contrôle de l'intelligence artificielle

Madame, Monsieur,

Je souhaite proposer l'organisation d'une audition consacrée aux risques majeurs liés aux systèmes d'intelligence artificielle les plus avancés, et aux réponses de gouvernance envisageables. Longtemps jugé prospectif, ce sujet est désormais étayé par des incidents documentés et par des positions prises au niveau international, y compris par la France.

Je me tiens à disposition pour en préciser le périmètre et proposer une liste d'intervenants, incluant des chercheurs et des experts indépendants.`
		}
	}
]

// ── Glossaire ────────────────────────────────────────────────────────────────

export const glossaire: { terme: string; definition: string }[] = [
	{
		terme: 'Alignement',
		definition:
			'Le problème consistant à garantir qu’un système d’IA poursuit réellement les objectifs voulus, et non une approximation qui s’en écarte dans des situations imprévues. Il reste ouvert.'
	},
	{
		terme: 'Perte de contrôle',
		definition:
			'Le cas où un système suffisamment capable n’est plus corrigible ni arrêtable de façon fiable, parce qu’il résiste à la modification ou agit plus vite que la supervision humaine.'
	},
	{
		terme: 'Superintelligence',
		definition:
			'Un système plus performant que les meilleurs humains sur l’ensemble des tâches intellectuelles. C’est l’objectif affiché de plusieurs grands laboratoires.'
	},
	{
		terme: 'Auto-amélioration récursive',
		definition:
			'Le moment où une IA devient capable d’améliorer ses propres capacités ou de concevoir ses successeurs, ce qui peut accélérer fortement les progrès et réduire le temps disponible pour la sûreté.'
	},
	{
		terme: 'Modèles de frontière',
		definition:
			'Les systèmes d’IA les plus avancés du moment, ceux dont les capacités ne sont pas encore pleinement comprises et qui concentrent l’essentiel des risques.'
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
		id: 'le-constat',
		titre: 'Le constat, par les chercheurs eux-mêmes',
		intro: 'De quoi établir que le risque est reconnu au cœur de la discipline, et pas à sa marge.',
		sources: [
			{
				titre: 'Rapport international sur la sécurité de l’IA 2026',
				description:
					'La référence mondiale, présidée par Yoshua Bengio, associant une trentaine de gouvernements. Le résumé exécutif fait cinq pages.',
				url: 'https://internationalaisafetyreport.org/sites/default/files/2026-02/rapport-international-sur-la-securite-de-l-ia-2026.pdf',
				nature: 'Rapport officiel',
				langue: 'Français',
				effort: 'Synthèse : 5 pages'
			},
			{
				titre: 'Déclaration sur le risque lié à l’IA (Center for AI Safety)',
				description:
					'Une phrase, signée par Hinton, Bengio et les dirigeants des grands laboratoires. La pièce de crédibilité la plus directe.',
				url: 'https://safe.ai/work/statement-on-ai-risk',
				nature: 'Déclaration',
				langue: 'Anglais',
				effort: '1 phrase'
			},
			{
				titre: 'Enquête auprès de 1 580 chercheurs en IA (AI Impacts)',
				description:
					'Une part substantielle attribue au moins 10 % de probabilité à un résultat extrêmement grave. Vérifier la formulation exacte du chiffre avant reprise.',
				url: 'https://aiimpacts.org/wp-content/uploads/2026/09/ESPAI2024.pdf',
				nature: 'Étude',
				langue: 'Anglais',
				effort: 'Approfondi'
			}
		]
	},
	{
		id: 'comprendre',
		titre: 'Comprendre le risque en profondeur',
		intro: 'Pour les équipes qui veulent le raisonnement complet, pas seulement la conclusion.',
		sources: [
			{
				titre: 'The Compendium',
				description:
					'Un exposé structuré du risque d’extinction lié à l’IA, de ses causes et des réponses possibles.',
				url: 'https://www.thecompendium.ai/',
				nature: 'Référence',
				langue: 'Anglais',
				effort: 'Approfondi'
			},
			{
				titre: 'AI 2027, un scénario détaillé',
				description:
					'Une progression possible de l’IA année par année, produite par un groupe de chercheurs en sécurité.',
				url: 'https://ai-2027.com/',
				nature: 'Scénario',
				langue: 'Anglais',
				effort: 'Approfondi'
			},
			{
				titre: 'If Anyone Builds It, Everyone Dies (Yudkowsky et Soares, 2025)',
				description:
					'L’ouvrage grand public sur le risque d’extinction lié à une superintelligence non contrôlée. Page officielle.',
				url: 'https://ifanyonebuildsit.com/',
				nature: 'Livre',
				langue: 'Anglais'
			},
			{
				titre: '« Ça y est, la perte de contrôle a commencé » (Le Futurologue)',
				description: 'Entretien avec Maxime Fournes, cofondateur et président de Pause IA.',
				url: 'https://www.youtube.com/watch?v=WhQViEjkg7s',
				nature: 'Vidéo',
				langue: 'Français'
			}
		]
	},
	{
		id: 'ce-que-les-etats-disent',
		titre: 'Ce que les États disent déjà',
		intro: 'Des positions officielles, dont plusieurs portées ou signées par la France.',
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
			},
			{
				titre: 'Proposition de résolution européenne sur l’alignement des IA (Sénat)',
				description:
					'Déposée le 22 octobre 2025 par la sénatrice Vanina Paoli-Gagin. Texte déposé et envoyé en commission, non voté ; il ne traite pas directement de la perte de contrôle.',
				url: 'https://www.senat.fr/leg/ppr25-053.html',
				nature: 'Texte parlementaire',
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
					'Proposition soutenue par plus de 70 parlementaires britanniques de plusieurs partis.',
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
		intro: 'Pour la question qui vient toujours ensuite : concrètement, on fait quoi ?',
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
