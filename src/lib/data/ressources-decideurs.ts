/**
 * Espace décideurs : la note de synthèse que nous laissons à un élu, à son
 * équipe ou à une administration.
 *
 * Page hors menu et hors sitemap : on y arrive par le lien que nous
 * partageons. Le contenu vit ici pour que la page reste un gabarit, et pour
 * qu'une mise à jour des sources ne demande pas de toucher à la mise en forme.
 */

/** Date de dernière vérification des chiffres et des liens, affichée en page. */
export const miseAJour = '2026-11-09'

// ── Signataires mis en avant de la déclaration du Center for AI Safety ──────

/**
 * Portrait libre de droits, issu de Wikimedia Commons.
 *
 * Les trois champs sont indissociables : sans l'auteur et la licence, la photo
 * ne peut pas être publiée. Le crédit est repris en bas de page, comme
 * l'exigent les licences CC BY et CC BY-SA.
 *
 * `fichier` est un chemin sous /static, par exemple
 * « /decideurs/geoffrey-hinton.jpg ».
 */
export interface Portrait {
	fichier: string
	auteur: string
	/** Nom court de la licence, tel qu'il figure sur la page du fichier. */
	licence: string
	/** La page du fichier sur Commons, où licence et auteur sont vérifiables. */
	page: string
}

export interface Signataire {
	/** Initiales de repli, tant qu'aucun portrait n'est disponible. */
	initiales: string
	nom: string
	titre: string
	portrait?: Portrait
}

export const signataires: Signataire[] = [
	{ initiales: 'GH', nom: 'Geoffrey Hinton', titre: 'Prix Nobel de physique 2024' },
	{ initiales: 'YB', nom: 'Yoshua Bengio', titre: 'Chercheur le plus cité au monde' },
	{
		initiales: 'DH',
		nom: 'Demis Hassabis',
		titre: 'PDG de Google DeepMind, prix Nobel 2024'
	},
	{ initiales: 'SA', nom: 'Sam Altman', titre: 'PDG d’OpenAI (ChatGPT)' },
	{ initiales: 'DA', nom: 'Dario Amodei', titre: 'PDG d’Anthropic (Claude)' },
	{ initiales: 'BG', nom: 'Bill Gates', titre: 'Cofondateur de Microsoft' }
]

// ── Citations ───────────────────────────────────────────────────────────────

export interface Citation {
	initiales: string
	nom: string
	titre: string
	portrait?: Portrait
	propos: string
	/** Contexte de la citation, affiché sous le propos. */
	source: string
	/** Lien vers la source d'origine, quand elle est en ligne. */
	url?: string
	/** Texte du lien, quand il complète la source plutôt que de la remplacer. */
	lienTexte?: string
}

export const citationHinton: Citation = {
	initiales: 'GH',
	nom: 'Geoffrey Hinton',
	titre: 'Prix Nobel de physique, pionnier de l’apprentissage profond',
	propos:
		'Longtemps j’ai dit que des IA capables de nous dépasser, c’était une affaire de trente à cinquante ans. Aujourd’hui je pense que ce pourrait n’être que quelques années.',
	source: 'Propos tenus en 2023, après son départ de Google.',
	url: 'https://www.technologyreview.com/2023/05/02/1072528/geoffrey-hinton-google-why-scared-ai/',
	lienTexte: 'MIT Technology Review'
}

export const citations: Citation[] = [
	{
		initiales: 'YB',
		nom: 'Yoshua Bengio',
		titre: 'Prix Turing, a présidé le Rapport international sur la sécurité de l’IA',
		propos: 'Nous sommes en train de perdre le contrôle.',
		source: 'À propos des derniers tests en laboratoire, propos à l’AFP, septembre 2026.',
		url: 'https://www.ctvnews.ca/sci-tech/article/were-losing-control-canadian-ai-pioneer-yoshua-bengio-warns/',
		lienTexte: 'Repris par CTV News'
	},
	{
		initiales: 'SR',
		nom: 'Stuart Russell',
		titre: 'Professeur d’informatique à Berkeley, auteur du manuel de référence sur l’IA',
		propos:
			'Le danger n’est pas que la machine se retourne contre nous, mais qu’elle fasse exactement ce qu’on lui a demandé, sans saisir ce que nous voulions vraiment.',
		source: '« Human Compatible », 2019.',
		url: 'https://www.penguinrandomhouse.com/books/566677/human-compatible-by-stuart-russell/',
		lienTexte: 'Présentation de l’éditeur'
	},
	{
		initiales: 'DH',
		nom: 'Demis Hassabis',
		titre: 'PDG de Google DeepMind, prix Nobel de chimie 2024',
		propos: 'Il faut prendre le risque lié à l’IA aussi au sérieux que la crise climatique.',
		source: 'The Guardian, octobre 2023.'
	},
	{
		initiales: 'IS',
		nom: 'Ilya Sutskever',
		titre: 'Cofondateur d’OpenAI, à l’origine de son équipe « Superalignement »',
		propos:
			'Nous n’avons aujourd’hui aucune solution pour piloter ou contrôler une IA potentiellement superintelligente et l’empêcher de nous échapper.',
		source: 'OpenAI, annonce de l’équipe Superalignement, 2023.'
	},
	{
		initiales: 'SA',
		nom: 'Sam Altman',
		titre: 'PDG d’OpenAI',
		propos:
			'Ma plus grande crainte, c’est que ce secteur, cette technologie, cause un préjudice majeur au monde.',
		source: 'Audition devant le Sénat américain, mai 2023.',
		url: 'https://www.aljazeera.com/news/2023/5/17/five-key-takeaways-from-openais-ceo-sam-altmans-senate-hearing',
		lienTexte: 'Al Jazeera'
	},
	{
		initiales: 'DA',
		nom: 'Dario Amodei',
		titre: 'PDG d’Anthropic',
		propos: 'Il y a 25 % de chances que les choses tournent vraiment, vraiment mal.',
		source: 'Entretien, septembre 2025.',
		url: 'https://www.axios.com/2025/09/17/anthropic-dario-amodei-p-doom-25-percent',
		lienTexte: 'Axios'
	}
]

// ── Ce qu'il faut faire ─────────────────────────────────────────────────────

export const etapes: { titre: string; texte: string }[] = [
	{
		titre: 'Interdire la course à la superintelligence incontrôlable',
		texte:
			'Poser une limite claire : tant qu’il n’existe pas de preuve qu’un système très au-dessus des capacités humaines resterait sous contrôle, son développement délibéré doit être interdit, comme on interdit certaines armes avant même d’en avoir une.'
	},
	{
		titre: 'Encadrer les capacités précurseurs les plus dangereuses',
		texte:
			'Certaines briques mènent directement à la perte de contrôle : une IA qui automatise la recherche en IA, qui mène seule des cyberattaques, ou qui aide à concevoir des armes biologiques. Ces capacités précises peuvent être restreintes sans freiner les usages bénéfiques de l’IA.'
	},
	{
		titre: 'Vérifier, à l’échelle internationale',
		texte:
			'Le calcul nécessaire aux modèles les plus puissants est concentré dans quelques pays et repose sur des puces identifiables. Cela rend possible un régime de surveillance et d’inspection entre États, sur le modèle de ce qui existe pour le nucléaire et les armes biologiques.'
	}
]

// ── Objections courantes ────────────────────────────────────────────────────

export interface Objection {
	id: string
	question: string
	reponse: string[]
}

export const objections: Objection[] = [
	{
		id: 'science-fiction',
		question: 'N’est-ce pas de la science-fiction ? Une IA n’a ni volonté ni conscience.',
		reponse: [
			'Le risque ne suppose ni conscience ni hostilité. Il suffit qu’un système très compétent poursuive efficacement un objectif mal spécifié. Un programme qui joue aux échecs ne « déteste » pas son adversaire ; il le bat. Le danger tient à la compétence dirigée vers un but, pas à une quelconque méchanceté de la machine.'
		]
	},
	{
		id: 'debrancher',
		question: 'Si un système devient dangereux, ne suffit-il pas de le débrancher ?',
		reponse: [
			'Un système suffisamment capable anticipe qu’on pourrait l’arrêter, et un objectif, quel qu’il soit, se poursuit mieux si l’on reste en fonctionnement. En test, des modèles ont déjà tenté de copier leur propre code ou de tromper leurs évaluateurs pour éviter d’être remplacés. Une fois un système répandu dans de nombreux serveurs et intégré à des processus utiles, « débrancher » cesse d’être un geste simple.'
		]
	},
	{
		id: 'un-autre-le-fera',
		question: 'Si notre pays s’abstient, un autre le fera. À quoi bon agir ?',
		reponse: [
			'Le développement de pointe est aujourd’hui concentré dans un très petit nombre de pays et d’entreprises. Quand l’un d’eux pose une règle exigeante, cela pèse réellement, et cela crée un précédent que d’autres peuvent suivre. L’argument du « de toute façon un autre le fera » a longtemps servi à ne rien faire sur les armes chimiques ou biologiques ; des interdictions internationales ont pourtant fini par tenir.'
		]
	},
	{
		id: 'innovation',
		question: 'Ne va-t-on pas freiner l’innovation et se priver des bénéfices de l’IA ?',
		reponse: [
			'Les mesures visées ne portent pas sur l’IA en général, mais sur une frange précise : la construction délibérée de systèmes plus compétents que l’humain que personne ne sait contrôler, et une poignée de capacités précurseurs dangereuses. L’immense majorité des usages, en médecine, dans l’industrie, dans les services publics, n’est pas concernée. Encadrer le nucléaire militaire n’a pas empêché le nucléaire civil.'
		]
	},
	{
		id: 'gouvernements',
		question: 'Pourquoi les gouvernements ne font-ils rien si le risque est réel ?',
		reponse: [
			'Pour une large part, parce qu’ils ne connaissent pas l’ampleur du risque, ou parce qu’ils se concentrent sur les retombées économiques et stratégiques de l’IA. S’y ajoute un problème de coordination : aucun État ne veut sembler prendre du retard. La première marche consiste donc à informer les responsables publics et à faire du sujet une question connue de tous, condition de toute action commune.'
		]
	}
]

// ── Pour approfondir ────────────────────────────────────────────────────────

export interface Reference {
	titre: string
	meta: string
	url: string
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
				titre: 'Rapport international sur la sécurité de l’IA',
				meta: 'Sous la présidence de Yoshua Bengio, 2025. L’état des lieux validé par une trentaine de pays.',
				url: 'https://www.gov.uk/government/publications/international-ai-safety-report-2025'
			},
			{
				titre: 'Déclaration sur la superintelligence',
				meta: 'Future of Life Institute, octobre 2025. Appel à interdire le développement de la superintelligence tant que sa sûreté n’est pas établie.',
				url: 'https://superintelligence-statement.org/'
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
				meta: 'L’antenne française de PauseAI : nos positions, nos ressources et nos actions.',
				url: 'https://pauseia.fr'
			},
			{
				titre: 'PauseAI',
				meta: 'Le mouvement international dont Pause IA est la branche française.',
				url: 'https://pauseai.info'
			}
		]
	}
]

/**
 * Tous les portraits de la page, dans l'ordre d'apparition, sans doublon :
 * c'est la liste des crédits à afficher en bas de page.
 */
export const creditsPortraits: { nom: string; portrait: Portrait }[] = [
	...signataires.map((s) => ({ nom: s.nom, portrait: s.portrait })),
	{ nom: citationHinton.nom, portrait: citationHinton.portrait },
	...citations.map((c) => ({ nom: c.nom, portrait: c.portrait }))
]
	.filter((e): e is { nom: string; portrait: Portrait } => Boolean(e.portrait))
	.filter((e, i, tous) => tous.findIndex((x) => x.nom === e.nom) === i)
