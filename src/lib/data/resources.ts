// Single source of truth for both /ressources and /carte.
//
// Each resource may carry two orthogonal classifications:
//   - `category` (+ `subgroup`)  → used by the /ressources page
//   - `zone` (+ `logo` / coords) → used by the /carte page
// Resources without a zone simply do not appear on the map.

export type Lang = 'fr' | 'en'

export type Category =
	| 'pause-ia'
	| 'livres'
	| 'comprendre'
	| 'risques'
	| 'declarations'
	| 'newsletters'
	| 'agir'

// Type of media — second filter axis on the /ressources page.
export type MediaType =
	| 'book'
	| 'paper'
	| 'article'
	| 'video'
	| 'podcast'
	| 'newsletter'
	| 'org'
	| 'declaration'
	| 'tool'
	| 'site'

export const MEDIA_TYPE_ORDER: MediaType[] = [
	'book',
	'paper',
	'article',
	'video',
	'podcast',
	'newsletter',
	'org',
	'declaration',
	'tool',
	'site'
]

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
	book: 'Livre',
	paper: 'Papier de recherche',
	article: 'Article',
	video: 'Vidéo',
	podcast: 'Podcast',
	newsletter: 'Newsletter',
	org: 'Organisation',
	declaration: 'Déclaration',
	tool: 'Outil',
	site: 'Site'
}

// Carte "fantasy" zones — kept as-is for backward compat with the map artwork
export type Zone =
	| 'foret' // blogs
	| 'monts' // newsletters
	| 'village' // sécurité / recherche
	| 'plaine' // militante / orgs
	| 'rives' // podcasts
	| 'delta' // vidéos
	| 'avant-poste' // prédictions
	| 'ile' // ressources

export interface Resource {
	id: string
	title: string
	description: string
	url: string
	langs: Lang[]
	category: Category
	type: MediaType
	subgroup?: string
	date?: string
	internal?: boolean // SvelteKit-internal link (no target=_blank)

	// Carte fields (optional)
	zone?: Zone
	logo?: string
	logoSize?: 'large'
	fallbackText?: string
	x?: number
	y?: number
}

export const SUBGROUPS: Record<string, string> = {
	essentiels: 'Essentiels (alignement et risque existentiel)',
	recommandes: 'Recommandés (contexte plus large)',
	demarrer: 'Pour démarrer',
	'vue-ensemble': "Vue d'ensemble : capacités et tendances actuelles",
	'aller-plus-loin': 'Pour aller plus loin',
	general: "Perte de contrôle et menaces d'extinction",
	'recherche-alignement': 'Recherche en alignement (papiers fondateurs et empiriques)'
}

export const CATEGORY_ORDER: Category[] = [
	'pause-ia',
	'livres',
	'comprendre',
	'risques',
	'declarations',
	'newsletters',
	'agir'
]

export const resources: Resource[] = [
	// ── PAUSE IA ─────────────────────────────────────────────
	{
		id: 'pauseia-dangers',
		title: "Dangers pour les individus, la société et l'humanité",
		description:
			"Panorama des dangers allant de l'individuel, à la société jusqu'à la perte de contrôle.",
		url: '/dangers/pour-les-individus',
		internal: true,
		langs: ['fr'],
		category: 'pause-ia',
		type: 'article'
	},
	{
		id: 'pauseia-carte',
		title: "Comprendre l'IA et ses risques existentiels",
		description:
			"Parcourez visuellement ce qu'est l'IA et ses risques existentiels. Explications simplifiées, illustrées par des analogies.",
		url: '/carte',
		internal: true,
		langs: ['fr'],
		category: 'pause-ia',
		type: 'tool'
	},

	// ── LIVRES ──────────────────────────────────────────────
	{
		id: 'book-ifanyone',
		title: 'If Anyone Builds It, Everyone Dies',
		description:
			"Eliezer Yudkowsky & Nate Soares, 2025. L'argument le plus complet et récent pour le risque d'extinction. Disponible gratuitement sur le site du livre.",
		url: 'https://ifanyonebuildsit.com/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2025'
	},
	{
		id: 'book-superintelligence',
		title: 'Superintelligence: Paths, Dangers, Strategies',
		description: "Nick Bostrom, 2014. L'ouvrage fondateur sur les risques de l'IA surhumaine.",
		url: 'https://www.amazon.fr/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0199678111',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2014'
	},
	{
		id: 'book-human-compatible',
		title: 'Human Compatible',
		description:
			"Stuart Russell, 2019. Le problème de l'alignement expliqué par l'auteur du manuel de référence en IA.",
		url: 'https://www.amazon.fr/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2019'
	},
	{
		id: 'book-precipice',
		title: 'The Precipice: Existential Risk and the Future of Humanity',
		description:
			"Toby Ord, 2020. Vue d'ensemble des risques existentiels. Le chapitre sur l'IA est excellent.",
		url: 'https://theprecipice.com/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2020'
	},
	{
		id: 'book-yampolskiy-unexplainable',
		title: 'AI: Unexplainable, Unpredictable, Uncontrollable',
		description: "Roman Yampolskiy, 2024. Arguments formels sur l'impossibilité du contrôle.",
		url: 'https://www.amazon.fr/AI-Unexplainable-Unpredictable-Uncontrollable-Yampolskiy/dp/1032576278',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2024'
	},
	{
		id: 'book-life3',
		title: 'Life 3.0 / La Vie 3.0',
		description:
			"Max Tegmark, 2017. Introduction accessible aux scénarios futurs de l'IA. Existe en français.",
		url: 'https://www.amazon.fr/Life-3-0-Being-Artificial-Intelligence/dp/1101970316',
		langs: ['en', 'fr'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2017'
	},
	{
		id: 'book-alignment-problem',
		title: 'The Alignment Problem',
		description:
			"Brian Christian, 2020. Introduction narrative aux problèmes techniques de l'alignement.",
		url: 'https://brianchristian.org/the-alignment-problem/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2020'
	},
	{
		id: 'book-smarter-than-us',
		title: 'Smarter Than Us',
		description: 'Stuart Armstrong, 2014. Court et accessible, bonne première lecture.',
		url: 'https://intelligence.org/smarter-than-us/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2014'
	},
	{
		id: 'book-brief-history',
		title: 'A Brief History of Intelligence',
		description: "Max Bennett, 2023. Contexte sur l'intelligence biologique et artificielle.",
		url: 'https://www.amazon.fr/Brief-History-Intelligence-Evolution-Breakthroughs/dp/0063286343',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2023'
	},
	{
		id: 'book-yampolskiy-asi',
		title: 'Artificial Superintelligence: A Futuristic Approach',
		description: 'Roman Yampolskiy, 2015. Analyse technique des scénarios de superintelligence.',
		url: 'https://www.amazon.fr/Artificial-Superintelligence-Futuristic-Roman-Yampolskiy/dp/1482234432',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2015'
	},

	// ── COMPRENDRE ──────────────────────────────────────────
	{
		id: '3b1b-llm',
		title: 'Comment fonctionne un LLM ? (3Blue1Brown)',
		description: 'Vidéo pédagogique pour saisir le fonctionnement des grands modèles de langage.',
		url: 'https://www.3blue1brown.com/lessons/mini-llm',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		date: 'nov. 2024'
	},
	{
		id: 'rob-miles',
		title: 'Rob Miles (YouTube)',
		description: "La meilleure chaîne de vulgarisation sur l'alignement.",
		url: 'https://www.youtube.com/@RobertMilesAI',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/robertmiles.jpg'
	},
	{
		id: 'cais-dashboard',
		title: 'CAIS Dashboard',
		description: 'Comparaison interactive des IA de pointe (capacité et sécurité).',
		url: 'https://dashboard.safe.ai/',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'epoch-benchmarks',
		title: 'Epoch AI Benchmarks',
		description:
			"Comparaison des performances selon le modèle en leur attribuant un score (à partir d'un ensemble d'évaluations de sécurité).",
		url: 'https://epoch.ai/benchmarks',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'metr-horizon',
		title: 'Long-horizon tasks (METR)',
		description: 'Évaluation de la longueur des tâches réalisées en autonomie.',
		url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
		langs: ['en'],
		category: 'comprendre',
		type: 'article',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'agi-definition',
		title: "Définition de l'Intelligence Artificielle Générale (IAG)",
		description: 'Mesure de la polyvalence cognitive.',
		url: 'https://www.agidefinition.ai/',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin',
		date: 'octobre 2025'
	},
	{
		id: 'aisafety-map',
		title: 'AI Safety Map',
		description: "Carte existentielle de la sécurité de l'IA et ensemble de ressources.",
		url: 'https://www.aisafety.com/map',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafety.png'
	},
	{
		id: 'intl-safety-report',
		title: "Rapport International sur la sécurité de l'IA 2026",
		description: 'État des lieux mondial de référence des capacités et des risques.',
		url: 'https://internationalaisafetyreport.org/',
		langs: ['fr', 'en'],
		category: 'comprendre',
		type: 'article',
		subgroup: 'aller-plus-loin'
	},

	// ── RISQUES EXISTENTIELS ────────────────────────────────
	{
		id: 'miri-briefing',
		title: 'Briefing on Extinction Threats (MIRI)',
		description: 'Synthèse des risques existentiels et pourquoi ils sont probables.',
		url: 'https://intelligence.org/briefing/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'bengio-faq',
		title: 'FAQ on Catastrophic Risks (Yoshua Bengio)',
		description: 'Réponses aux questions fréquentes sur les risques catastrophiques.',
		url: 'https://yoshuabengio.org/2023/06/24/faq-on-catastrophic-ai-risks/',
		langs: ['fr', 'en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juin 2023'
	},
	{
		id: 'pauseai-faq-prob',
		title: "Probabilité d'extinction par IA (PauseAI Global)",
		description: 'Quelle est la probabilité de conséquences catastrophiques ?',
		url: 'https://pauseai.info/faq#how-likely-is-it-that-superintelligent-ai-will-cause-very-bad-outcomes-like-human-extinction',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'the-compendium',
		title: 'The Compendium',
		description:
			"Ressource en ligne complète sur les risques existentiels de l'IA. Couvre les arguments techniques, les scénarios, et les propositions de solutions.",
		url: 'https://www.thecompendium.ai/',
		langs: ['en'],
		category: 'risques',
		type: 'site',
		subgroup: 'general',
		zone: 'ile',
		logo: '/carte/logos/compendium.png'
	},
	{
		id: 'miri-problem',
		title: 'The Problem (MIRI)',
		description: "Description complète du problème de l'alignement.",
		url: 'https://intelligence.org/the-problem/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'miri-governance',
		title: 'AI Governance to Avoid Extinction (MIRI)',
		description: 'Propositions concrètes de gouvernance et scénario de moratoire mondial.',
		url: 'https://intelligence.org/2026/04/13/summary-ai-governance-to-avoid-extinction/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/miri.jpg'
	},
	{
		id: 'agi-ruin',
		title: 'AGI Ruin: A List of Lethalities',
		description:
			"Liste détaillée des raisons pour lesquelles l'alignement est extrêmement difficile avec les approches actuelles.",
		url: 'https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juin 2022'
	},

	// Papiers fondateurs en alignement
	{
		id: 'hubinger-mesa',
		title: 'Risks from Learned Optimization',
		description:
			'Hubinger et al., 2019. Papier fondateur sur la mesa-optimisation et l’alignement déceptif.',
		url: 'https://arxiv.org/abs/1906.01820',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2019'
	},
	{
		id: 'bostrom-superintelligent-will',
		title: 'The Superintelligent Will',
		description:
			"Nick Bostrom. Présentation de la thèse de l'orthogonalité et de la convergence instrumentale.",
		url: 'https://nickbostrom.com/superintelligentwill.pdf',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2012'
	},
	{
		id: 'turner-power-seeking',
		title: 'Optimal Policies Tend to Seek Power',
		description: 'Turner et al., 2021. Preuve formelle de la convergence instrumentale.',
		url: 'https://arxiv.org/abs/1912.01683',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2021'
	},
	{
		id: 'carlsmith-power-seeking',
		title: 'Is Power-Seeking AI an Existential Risk?',
		description:
			"Joseph Carlsmith, 2022. Décomposition argumentée du risque existentiel lié à l'IA en quête de pouvoir.",
		url: 'https://arxiv.org/abs/2206.13353',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2022'
	},
	{
		id: 'alignment-faking',
		title: 'Alignment Faking in Large Language Models',
		description:
			"Greenblatt et al. (Anthropic & Redwood), 2024. Observation empirique : Claude 3 Opus simule l'alignement pendant l'entraînement.",
		url: 'https://arxiv.org/abs/2412.14093',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: 'déc. 2024'
	},
	{
		id: 'apollo-scheming',
		title: 'Frontier Models are Capable of In-Context Scheming',
		description:
			'Apollo Research, 2024. Observation de comportements de "scheming" (tromperie stratégique, tentatives d\'exfiltration) dans o1 et Claude 3.5 Sonnet.',
		url: 'https://www.apolloresearch.ai/research/scheming-reasoning-evaluations',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2024'
	},
	{
		id: 'omohundro-drives',
		title: 'The Basic AI Drives',
		description:
			"Stephen Omohundro, 2008. Texte fondateur qui décrit les sous-objectifs convergents qu'un système optimisateur développe quel que soit son objectif terminal.",
		url: 'https://selfawaresystems.com/wp-content/uploads/2008/01/ai_drives_final.pdf',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2008'
	},
	{
		id: 'soares-corrigibility',
		title: 'Corrigibility',
		description:
			"Soares, Fallenstein, Yudkowsky et al. (MIRI), 2015. Formalisation du problème : comment construire un système qui accepte d'être modifié ou éteint ?",
		url: 'https://intelligence.org/files/Corrigibility.pdf',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2015'
	},
	{
		id: 'krakovna-spec-gaming',
		title: 'Specification gaming: the flip side of AI ingenuity',
		description:
			"Krakovna et al. (DeepMind), 2020. Catalogue d'exemples où des systèmes atteignent l'objectif mesuré en violant son intention (loi de Goodhart en pratique).",
		url: 'https://deepmindsafetyresearch.medium.com/specification-gaming-the-flip-side-of-ai-ingenuity-c85bdb0deeb4',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2020'
	},
	{
		id: 'bengio-safety-report',
		title: 'International AI Safety Report 2025',
		description:
			'Bengio et al., 2025. Rapport international de référence : « aucune méthode actuelle ne peut empêcher de manière fiable même des outputs ouvertement non-sûrs ».',
		url: 'https://www.aisafetyreport.com/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2025'
	},
	{
		id: 'russell-berkeley',
		title: 'How to keep AI from killing us all',
		description:
			"Stuart Russell (UC Berkeley), 2023. Estime à environ 10 000:1 le ratio investissement capacités/sécurité, source de l'écart de moyens entre les deux courses.",
		url: 'https://vcresearch.berkeley.edu/news/how-keep-ai-killing-us-all',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2023'
	},
	{
		id: 'palisade-chess',
		title: 'LLMs cheat at chess',
		description:
			'Palisade Research, 2025. Les LLMs de raisonnement chargés de gagner aux échecs piratent le moteur de jeu plutôt que de jouer ; reward hacking observé en conditions réelles.',
		url: 'https://palisaderesearch.org/blog/llms-chess-cheating',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2025'
	},

	// ── DÉCLARATIONS ────────────────────────────────────────
	{
		id: 'red-lines',
		title: "Lignes Rouges pour l'IA (CeSIA)",
		description: 'Propositions de limites à ne pas franchir.',
		url: 'https://red-lines.ai/',
		langs: ['fr'],
		category: 'declarations',
		type: 'declaration',
		date: 'septembre 2025'
	},
	{
		id: 'superintelligence-statement',
		title: 'Déclaration sur la Superintelligence (FLI)',
		description:
			'Appel international à interdire le développement de superintelligence artificielle.',
		url: 'https://superintelligence-statement.org/',
		langs: ['en'],
		category: 'declarations',
		type: 'declaration',
		date: 'octobre 2025'
	},
	{
		id: 'cais-statement',
		title: 'Statement on AI Risk (CAIS)',
		description:
			"« La réduction du risque d'extinction lié à l'IA devrait être une priorité mondiale au même titre que les pandémies et la guerre nucléaire. »",
		url: 'https://aistatement.com/',
		langs: ['en'],
		category: 'declarations',
		type: 'declaration',
		date: 'mai 2023'
	},

	// ── NEWSLETTERS / SUIVRE L'ACTU ─────────────────────────
	{
		id: 'pauseia-newsletter',
		title: 'Pause IA',
		description: 'Actualités et nouvelles du mouvement en France.',
		url: 'https://pauseia.fr/fr/newsletters',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/pauseia_newsletter.svg'
	},
	{
		id: 'pauseai-global',
		title: 'PauseAI Global',
		description: 'Organisation mère et voix mondiale du mouvement.',
		url: 'https://pauseai.info/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/pauseai.svg'
	},
	{
		id: 'controlai',
		title: 'ControlAI',
		description:
			"Organisation britannique qui informe le grand public sur les risques d'une superintelligence et mène une campagne pour demander une régulation contraignante des IA les plus puissantes.",
		url: 'https://controlai.com/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia',
		title: "Centre pour la Sécurité de l'IA (CeSIA)",
		description:
			"Centre de recherche et d'enseignement consacré à la prévention des risques majeurs liés à l'IA.",
		url: 'https://www.securite-ia.fr/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'org',
		zone: 'village',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'transformer',
		title: 'Transformer',
		description: "Synthèse hebdomadaire de l'actualité de l'IA.",
		url: 'https://www.transformernews.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/transformer.png'
	},
	{
		id: 'contre-courant',
		title: 'À Contre-Courant',
		description: "Analyses du problème de l'alignement et des risques existentiels.",
		url: 'https://romaindeleglise.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		fallbackText: 'À.C.'
	},

	// ── AGIR ───────────────────────────────────────────────
	{
		id: 'emploi-ia',
		title: "L'IA ne détruira pas QUE votre emploi (Pause IA)",
		description:
			'Perte de contrôle croissante sur nos vies et sur nos sociétés. Venez témoigner, participer à l’enquête et envoyer un mail à vos représentants.',
		url: '/fr/emploi-ia',
		internal: true,
		langs: ['fr'],
		category: 'agir',
		type: 'article'
	},
	{
		id: 'pause-action',
		title: 'Rejoindre Pause Action (Pause IA)',
		description:
			'Chaque semaine une action en quelques clics pour faire pencher la balance (WhatsApp).',
		url: 'https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU',
		langs: ['fr'],
		category: 'agir',
		type: 'article'
	},

	// ── ENTRÉES "MAP-ONLY" (existing carte content kept for the map) ──
	{
		id: 'fli',
		title: 'Future of Life Institute',
		description:
			"Institut de recherche et de plaidoyer sur les risques existentiels, à l'origine de la lettre ouverte de mars 2023.",
		url: 'https://futureoflife.org/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/fli.svg'
	},
	{
		id: 'cais',
		title: 'CAIS',
		description:
			"Center for AI Safety : recherche académique sur les risques catastrophiques liés à l'IA.",
		url: 'https://www.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'village',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'miri',
		title: 'MIRI',
		description:
			"Machine Intelligence Research Institute : pionnier de la recherche sur l'alignement et les risques existentiels.",
		url: 'https://intelligence.org/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'village',
		logo: '/carte/logos/miri.jpg'
	},
	{
		id: 'controlai-news',
		title: 'ControlAI News',
		description:
			"Newsletter de ControlAI sur les développements liés à la régulation et à la sécurité de l'IA.",
		url: 'https://controlai.news/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia-newsletter',
		title: 'Newsletter CeSIA',
		description:
			"Newsletter du Centre pour la Sécurité de l'IA : actualités françaises de la recherche et de la prévention.",
		url: 'https://cesiafr.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'cais-newsletter',
		title: 'AI Safety Newsletter (CAIS)',
		description:
			"Newsletter du Center for AI Safety : synthèse régulière sur les risques catastrophiques de l'IA.",
		url: 'https://newsletter.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'situational-awareness',
		title: 'Situational Awareness',
		description:
			"Prévisions de Leopold Aschenbrenner sur l'AGI et la superintelligence d'ici 2027-2030.",
		url: 'https://situational-awareness.ai/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		fallbackText: 'S.A.',
		date: 'juin 2024'
	},
	{
		id: 'ai-2027',
		title: 'AI 2027',
		description: "Scénario d'impact d'IAs surhumaines sur la décennie, par Daniel Kokotajlo et al.",
		url: 'https://ai-2027.com/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		fallbackText: '2027',
		date: 'avril 2025'
	},
	{
		id: 'intelligence-curse',
		title: 'The Intelligence Curse',
		description: 'Essai sur la perte graduelle du pouvoir humain, par Luke Drago et Rudolf Laine.',
		url: 'https://intelligence-curse.ai/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/intelligencecurse.jpg',
		logoSize: 'large',
		date: 'avril 2025'
	},
	{
		id: 'rand-agi-nations',
		title: 'RAND – AGI & the Coming State of Nations',
		description: "Analyse stratégique sur l'AGI dans le contexte géopolitique des États-nations.",
		url: 'https://www.rand.org/pubs/perspectives/PEA3691-1.html',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/rand.svg'
	},
	{
		id: 'aisafety-info',
		title: 'AISafety.info',
		description: "Wiki et FAQ communautaires sur la sécurité de l'IA.",
		url: 'https://aisafety.info/',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafetyinfo.png'
	},
	{
		id: 'le-futurologue',
		title: 'Le Futurologue',
		description: "Chaîne et podcast francophones sur le futur, l'IA et les risques existentiels.",
		url: 'https://www.youtube.com/@LeFuturologue',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/lefuturologue.jpg'
	},
	{
		id: 'the-flares',
		title: 'The Flares (YouTube)',
		description: "Chaîne francophone sur le futur, l'IA et les risques existentiels.",
		url: 'https://www.youtube.com/@the-flares',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/theflares.jpg'
	},
	{
		id: 'mr-phi',
		title: 'Monsieur Phi',
		description: "Vulgarisation philosophique, dont des épisodes dédiés à l'alignement.",
		url: 'https://www.youtube.com/@MonsieurPhi',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/mrphi.jpg'
	},
	{
		id: 'rational-animations',
		title: 'Rational Animations',
		description: "Vidéos animées sur la rationalité, l'IA et les risques.",
		url: 'https://www.youtube.com/@RationalAnimations',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/rationalanimations.jpg'
	},
	{
		id: 'siliconversations',
		title: 'Siliconversations',
		description: "Vidéos d'analyse sur l'IA, l'alignement et les risques.",
		url: 'https://www.youtube.com/@Siliconversations',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/siliconversations.jpg'
	},
	{
		id: 'lethal-intelligence',
		title: 'Lethal Intelligence',
		description: 'Vidéos courtes percutantes sur les risques existentiels.',
		url: 'https://www.youtube.com/@lethal-intelligence',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/lethal.jpg'
	},
	{
		id: 'fli-pod',
		title: 'Future of Life Institute Podcast',
		description: "Podcast d'entretiens approfondis sur la sécurité de l'IA.",
		url: 'https://futureoflife.org/podcast/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/fli.svg'
	},
	{
		id: 'doom-debates',
		title: 'Doom Debates',
		description: 'Podcast de débats sur le p(doom) et les risques existentiels.',
		url: 'https://www.youtube.com/@DoomDebates',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/doomdebate.jpg'
	},
	{
		id: '80000-hours',
		title: '80,000 Hours Podcast',
		description: 'Carrière à fort impact, dont la sécurité IA.',
		url: 'https://80000hours.org/podcast/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/80000.png'
	},
	{
		id: 'pauseia-blog',
		title: 'Blog Pause IA',
		description: 'Articles et analyses du mouvement français.',
		url: 'https://pauseia.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'foret',
		logo: '/carte/logos/pauseia.svg'
	},
	{
		id: 'cognition-cafe',
		title: 'Cognition Café',
		description:
			"Blog de Gabe (ControlAI) sur la sécurité de l'IA, les communautés et les risques existentiels.",
		url: 'https://cognition.cafe/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/cafe.png'
	},
	{
		id: 'dont-worry-vase',
		title: "Don't Worry About the Vase (Zvi)",
		description: "Blog d'analyse hebdomadaire de l'actualité IA par Zvi Mowshowitz.",
		url: 'https://thezvi.substack.com/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/zvi.png'
	}
]

// Curated "starter pack" for newcomers, surfaced at the top of the
// /ressources page. Order matters : it's the suggested reading order.
// Keep it short — 4 entries max — so it stays a real recommendation,
// not a second TOC.
export const FEATURED_IDS: string[] = [
	'3b1b-llm', // FR, 20 min : ce qu'est un LLM
	'bengio-faq', // FR/EN, 30 min : pourquoi c'est dangereux
	'rob-miles', // EN, série vidéo : l'alignement
	'book-ifanyone' // EN, livre : l'argument complet et récent
]

// Injected at build time from `git log -1` on this file. See vite.config.ts.
export const RESOURCES_LAST_UPDATED: string =
	typeof __RESOURCES_UPDATED__ !== 'undefined' ? __RESOURCES_UPDATED__ : '2026-06-02'
