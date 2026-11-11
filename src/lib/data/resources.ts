// Source de vérité unique pour la page /ressources.
// Chaque entrée est rangée par `category` + `subgroup` (rendu) et porte
// un `type` (filtrable). Les champs `zone` / `logo` / `fallbackText` sont
// des reliquats de l'ancienne carte ; ils sont conservés sans usage actif
// au cas où on réactiverait une vue cartographique plus tard.

export type Lang = 'fr' | 'en'

export type Category =
	| 'pause-ia'
	| 'livres'
	| 'comprendre'
	| 'risques'
	| 'declarations'
	| 'newsletters'

// Type of media, second filter axis on the /ressources page.
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
	paper: 'Article scientifique',
	article: 'Article',
	video: 'Vidéo',
	podcast: 'Podcast',
	newsletter: 'Newsletter',
	org: 'Organisation',
	declaration: 'Déclaration',
	tool: 'Outil',
	site: 'Site'
}

// Carte "fantasy" zones, kept as-is for backward compat with the map artwork
export type Zone =
	| 'foret' // blogs
	| 'monts' // newsletters
	| 'village' // sécurité / recherche
	| 'plaine' // militante / orgs
	| 'rives' // podcasts
	| 'delta' // vidéos
	| 'avant-poste' // prédictions
	| 'ile' // ressources

// Bilingual content: either a plain string (same in both languages,
// typical of proper nouns and English-only titles) or an explicit
// { fr, en } record.
export type Localized = string | { fr: string; en: string }

export function localized(v: Localized, lang: Lang): string {
	if (typeof v === 'string') return v
	return v[lang]
}

export interface Resource {
	id: string
	title: Localized
	description: Localized
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
	'comprendre',
	'risques',
	'livres',
	'declarations',
	'newsletters'
]

export const resources: Resource[] = [
	// ── PAUSE IA ─────────────────────────────────────────────
	{
		id: 'pauseia-dangers',
		title: {
			fr: "Dangers pour les individus, la société et l'humanité",
			en: 'Dangers for individuals, society and humanity'
		},
		description: {
			fr: "Panorama des dangers de l'IA, du niveau individuel à la société, jusqu'au scénario de perte de contrôle. Point d'entrée idéal pour découvrir les enjeux.",
			en: 'Overview of AI dangers, from the individual to society and the loss-of-control scenario. An ideal entry point to discover the stakes.'
		},
		url: '/fr/dangers/pour-les-individus',
		internal: true,
		langs: ['fr'],
		category: 'pause-ia',
		type: 'article'
	},
	{
		id: 'pauseia-comprendre',
		title: {
			fr: "Comprendre l'IA et ses risques existentiels",
			en: 'Understanding AI and its existential risks'
		},
		description: {
			fr: "Parcourez visuellement ce qu'est l'IA et ses risques existentiels. Explications simplifiées, illustrées par des analogies.",
			en: 'A visual walkthrough of what AI is and its existential risks. Simplified explanations, illustrated with analogies.'
		},
		url: 'https://pauseia.notion.site/Comprendre-l-IA-et-ses-risques-existentiels-34d28fc94b7780739a4ffc204262495b',
		langs: ['fr'],
		category: 'pause-ia',
		type: 'site'
	},

	// ── LIVRES ──────────────────────────────────────────────
	{
		id: 'book-ifanyone',
		title: 'If Anyone Builds It, Everyone Dies',
		description: {
			fr: "Eliezer Yudkowsky & Nate Soares, 2025. L'argument le plus complet et récent pour le risque d'extinction. Ressources complémentaires gratuites disponibles sur le site du livre.",
			en: 'Eliezer Yudkowsky & Nate Soares, 2025. The most complete and recent case for extinction risk. Free supplementary resources available on the book website.'
		},
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
		description: {
			fr: "Nick Bostrom, 2014. L'ouvrage fondateur sur les risques de l'IA surhumaine. Traduction française disponible (« Superintelligence », Dunod, 2017).",
			en: 'Nick Bostrom, 2014. The foundational book on the risks of superhuman AI. A French translation is available (« Superintelligence », Dunod, 2017).'
		},
		url: 'https://www.amazon.fr/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0199678111',
		langs: ['en', 'fr'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2014'
	},
	{
		id: 'book-human-compatible',
		title: 'Human Compatible',
		description: {
			fr: "Stuart Russell, 2019. Le problème de l'alignement expliqué par l'auteur du manuel de référence en IA.",
			en: 'Stuart Russell, 2019. The alignment problem explained by the author of the standard AI textbook.'
		},
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
		description: {
			fr: "Toby Ord, 2020. Vue d'ensemble des risques existentiels. Le chapitre sur l'IA est excellent.",
			en: 'Toby Ord, 2020. Overview of existential risks. The chapter on AI is excellent.'
		},
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
		description: {
			fr: "Roman Yampolskiy, 2024. Arguments formels sur l'impossibilité du contrôle.",
			en: 'Roman Yampolskiy, 2024. Formal arguments on the impossibility of control.'
		},
		url: 'https://www.amazon.fr/AI-Unexplainable-Unpredictable-Uncontrollable-Yampolskiy/dp/1032576278',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2024'
	},
	{
		id: 'book-giraud-parole',
		title: 'La parole aux machines',
		description: {
			fr: 'Thibaut Giraud, Flammarion, 2025. Intelligence artificielle, conscience, autonomie et risques existentiels : une introduction accessible en français, signée par le créateur de la chaîne Monsieur Phi.',
			en: 'Thibaut Giraud, Flammarion, 2025. Artificial intelligence, consciousness, autonomy and existential risks: an accessible French-language introduction by the creator of the Monsieur Phi channel.'
		},
		url: 'https://www.fnac.com/a21814164/Thibaut-Giraud-La-parole-aux-machines',
		langs: ['fr'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2025'
	},
	{
		id: 'book-suleyman-coming-wave',
		title: 'La déferlante / The Coming Wave',
		description: {
			fr: "Mustafa Suleyman, 2023. Très accessible, traite de la vitesse de propagation de l'IA et de la difficulté politique et physique de contenir une telle technologie. Existe en français (Fayard, 2024).",
			en: "Mustafa Suleyman, 2023. Very accessible: on the speed of AI's spread and the political and physical difficulty of containing such a technology. Also available in French (Fayard, 2024)."
		},
		url: 'https://www.the-coming-wave.com/',
		langs: ['en', 'fr'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2023'
	},
	{
		id: 'book-russell-norvig',
		title: 'Intelligence artificielle : Une approche moderne',
		description: {
			fr: "Stuart Russell et Peter Norvig, 4ᵉ édition, Pearson, 2021. Le manuel de référence mondialement utilisé dans l'enseignement de l'IA, traduit en français.",
			en: 'Stuart Russell and Peter Norvig, 4th ed., Pearson, 2021. The worldwide reference textbook for teaching AI, translated into French.'
		},
		url: 'https://www.amazon.fr/Intelligence-artificielle-%C3%A9dition-Peter-Norvig/dp/2326002210',
		langs: ['fr', 'en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2021'
	},
	{
		id: 'book-life3',
		title: 'Life 3.0 / La Vie 3.0',
		description: {
			fr: "Max Tegmark, 2017. Introduction accessible aux scénarios futurs de l'IA. Existe en français.",
			en: 'Max Tegmark, 2017. Accessible introduction to future AI scenarios. Also available in French.'
		},
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
		description: {
			fr: "Brian Christian, 2020. Introduction narrative aux problèmes techniques de l'alignement.",
			en: 'Brian Christian, 2020. Narrative introduction to the technical problems of alignment.'
		},
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
		description: {
			fr: 'Stuart Armstrong, 2014. Court et accessible, bonne première lecture.',
			en: 'Stuart Armstrong, 2014. Short and accessible, a good first read.'
		},
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
		description: {
			fr: "Max Bennett, 2023. Contexte sur l'intelligence biologique et artificielle.",
			en: 'Max Bennett, 2023. Context on biological and artificial intelligence.'
		},
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
		description: {
			fr: 'Roman Yampolskiy, 2015. Analyse technique des scénarios de superintelligence.',
			en: 'Roman Yampolskiy, 2015. Technical analysis of superintelligence scenarios.'
		},
		url: 'https://www.amazon.fr/Artificial-Superintelligence-Futuristic-Roman-Yampolskiy/dp/1482234432',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2015'
	},

	// ── COMPRENDRE ──────────────────────────────────────────
	{
		id: 'science-etonnante-ia',
		title: { fr: "Science étonnante – playlist sur l'IA", en: 'Science étonnante – AI playlist' },
		description: {
			fr: "Playlist de vulgarisation scientifique en français sur l'intelligence artificielle, par David Louapre.",
			en: 'French-language popular-science playlist on artificial intelligence, by David Louapre.'
		},
		url: 'https://www.youtube.com/playlist?list=PLxzM9a5lhAumG-HwgT47WF2u18OsMtko5',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: '3b1b-llm',
		title: {
			fr: 'Comment fonctionne un LLM ? (3Blue1Brown)',
			en: 'How does an LLM work? (3Blue1Brown)'
		},
		description: {
			fr: 'Vidéo pédagogique pour saisir le fonctionnement des grands modèles de langage.',
			en: 'Educational video to grasp how large language models work.'
		},
		url: 'https://www.3blue1brown.com/lessons/mini-llm',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		date: 'nov. 2024'
	},
	{
		id: 'altruisme-efficace-fr-ia',
		title: {
			fr: 'Intelligence artificielle – Altruisme Efficace France',
			en: 'Artificial Intelligence – Altruisme Efficace France'
		},
		description: {
			fr: "Page d'introduction francophone aux risques de l'IA : un bon point d'entrée pour découvrir le sujet.",
			en: 'French-language introduction to the risks of AI: a good entry point to discover the topic.'
		},
		url: 'https://www.altruismeefficacefrance.org/intelligence-artificielle',
		langs: ['fr'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'demarrer'
	},
	{
		id: 'futurologue-ifanyone',
		title: {
			fr: 'Résumé en français de « If Anyone Builds It, Everyone Dies » (Le Futurologue)',
			en: 'French-language summary of "If Anyone Builds It, Everyone Dies" (Le Futurologue)'
		},
		description: {
			fr: 'Vidéo de synthèse en français du livre de Yudkowsky & Soares, par la chaîne Le Futurologue.',
			en: 'French-language video summary of the Yudkowsky & Soares book, by the Le Futurologue channel.'
		},
		url: 'https://youtu.be/zmnc9maQRb4',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'rob-miles',
		title: 'Rob Miles (YouTube)',
		description: {
			fr: "La meilleure chaîne de vulgarisation sur l'alignement.",
			en: 'The best popular-science channel on alignment.'
		},
		url: 'https://www.youtube.com/@RobertMilesAI',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'le-futurologue',
		title: 'Le Futurologue',
		description: {
			fr: "Chaîne et podcast francophones sur le futur, l'IA et les risques existentiels.",
			en: 'French-language YouTube channel and podcast on the future, AI and existential risks.'
		},
		url: 'https://www.youtube.com/@LeFuturologue',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'the-flares',
		title: 'The Flares (YouTube)',
		description: {
			fr: "Chaîne francophone sur le futur, l'IA et les risques existentiels.",
			en: 'French-language channel on the future, AI and existential risks.'
		},
		url: 'https://www.youtube.com/@the-flares',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'mr-phi',
		title: 'Monsieur Phi',
		description: {
			fr: "Vulgarisation philosophique, dont des épisodes dédiés à l'alignement.",
			en: 'Philosophical popular-science, including episodes dedicated to alignment.'
		},
		url: 'https://www.youtube.com/@MonsieurPhi',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'rational-animations',
		title: 'Rational Animations',
		description: {
			fr: "Vidéos animées sur la rationalité, l'IA et les risques.",
			en: 'Animated videos on rationality, AI and risks.'
		},
		url: 'https://www.youtube.com/@RationalAnimations',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'siliconversations',
		title: 'Siliconversations',
		description: {
			fr: "Vidéos d'analyse sur l'IA, l'alignement et les risques.",
			en: 'Analysis videos on AI, alignment and risks.'
		},
		url: 'https://www.youtube.com/@Siliconversations',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'lethal-intelligence',
		title: 'Lethal Intelligence',
		description: {
			fr: "Chaîne YouTube de vidéos courtes et incisives sur les risques existentiels liés à l'IA.",
			en: 'YouTube channel of short, incisive videos on existential AI risks.'
		},
		url: 'https://www.youtube.com/@lethal-intelligence',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'fli-pod',
		title: 'Future of Life Institute (YouTube)',
		description: {
			fr: "Chaîne YouTube du Future of Life Institute : entretiens et conférences sur la sécurité de l'IA et les risques existentiels.",
			en: 'Future of Life Institute YouTube channel: interviews and talks on AI safety and existential risks.'
		},
		url: 'https://www.youtube.com/@futureoflifeinstitute',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'doom-debates',
		title: 'Doom Debates',
		description: {
			fr: "Podcast vidéo de débats entre invités sur la probabilité d'extinction par l'IA (p(doom)) et les risques existentiels.",
			en: 'Video debate podcast between guests on AI extinction probability (p(doom)) and existential risks.'
		},
		url: 'https://www.youtube.com/@DoomDebates',
		langs: ['en'],
		category: 'comprendre',
		type: 'podcast',
		subgroup: 'demarrer'
	},
	{
		id: '80000-hours',
		title: '80,000 Hours (YouTube)',
		description: {
			fr: "Chaîne YouTube sur les carrières à fort impact, dont la sécurité de l'IA : entretiens longs avec chercheurs et décideurs.",
			en: 'YouTube channel on high-impact careers, including AI safety: long-form interviews with researchers and decision-makers.'
		},
		url: 'https://www.youtube.com/@eightythousandhours',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'cais-dashboard',
		title: { fr: 'Tableau de bord du CAIS', en: 'CAIS Dashboard' },
		description: {
			fr: 'Comparaison interactive des IA de pointe sur les axes capacité et sécurité.',
			en: 'Interactive comparison of frontier AIs across capability and safety axes.'
		},
		url: 'https://dashboard.safe.ai/',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'epoch-benchmarks',
		title: { fr: 'Benchmarks IA (Epoch)', en: 'Epoch AI Benchmarks' },
		description: {
			fr: "Tableau comparatif des performances des modèles d'IA sur un ensemble d'évaluations standardisées.",
			en: 'Comparative table of AI model performance across a set of standardised evaluations.'
		},
		url: 'https://epoch.ai/benchmarks',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'metr-horizon',
		title: { fr: 'Tâches à long horizon (METR)', en: 'Long-horizon tasks (METR)' },
		description: {
			fr: 'Mesure la durée des tâches que les IA parviennent à mener en autonomie : un proxy de leur capacité à agir sans supervision humaine.',
			en: 'Measures how long AIs can run tasks autonomously: a proxy for their ability to act without human supervision.'
		},
		url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
		langs: ['en'],
		category: 'comprendre',
		type: 'article',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'agi-definition',
		title: {
			fr: "Définition de l'Intelligence Artificielle Générale (IAG)",
			en: 'Definition of Artificial General Intelligence (AGI)'
		},
		description: {
			fr: "Proposition d'un cadre pour mesurer la polyvalence cognitive d'un système d'IA et statuer sur ce qui constitue, ou non, une AGI.",
			en: "A proposed framework to measure an AI system's cognitive versatility and decide what does, or does not, count as AGI."
		},
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
		description: {
			fr: "Carte interactive de l'écosystème de la sécurité de l'IA, avec un index de ressources associées.",
			en: 'Interactive map of the AI safety ecosystem, with an index of associated resources.'
		},
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
		title: {
			fr: "Rapport International sur la sécurité de l'IA 2026",
			en: 'International AI Safety Report 2026'
		},
		description: {
			fr: 'État des lieux mondial de référence des capacités et des risques.',
			en: 'Reference global status report on AI capabilities and risks.'
		},
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
		description: {
			fr: "Synthèse courte du MIRI sur les arguments en faveur des risques d'extinction liés à l'IA. Bon point d'entrée pour les décideurs pressés.",
			en: "MIRI's short briefing on the arguments for AI extinction risks. A solid entry point for time-pressed policymakers."
		},
		url: 'https://intelligence.org/briefing/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'bengio-2024-arguments',
		title: {
			fr: "Analyse de certains arguments avançant qu'il ne faut pas prendre la sécurité de l'IA au sérieux",
			en: 'Reasoning through arguments against taking AI safety seriously'
		},
		description: {
			fr: "Yoshua Bengio, juillet 2024. Article approfondi en français qui passe en revue les principaux arguments minimisant les risques de l'IA et explique pourquoi chacun ne tient pas l'examen.",
			en: 'Yoshua Bengio, July 2024. In-depth article reviewing the main arguments downplaying AI risks and explaining why each fails on scrutiny.'
		},
		url: 'https://yoshuabengio.org/fr/blogue/analyse-de-certains-arguments-avancant-quil-ne-faut-pas-prendre-la-securite-de-lia-au',
		langs: ['fr', 'en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juillet 2024'
	},
	{
		id: 'bengio-faq',
		title: 'FAQ on Catastrophic Risks (Yoshua Bengio)',
		description: {
			fr: "Yoshua Bengio, juin 2023. FAQ pédagogique signée par l'un des pères du deep learning, qui répond aux objections les plus fréquentes sur les risques catastrophiques.",
			en: 'Yoshua Bengio, June 2023. Educational FAQ by one of the fathers of deep learning, answering the most common objections to catastrophic AI risks.'
		},
		url: 'https://yoshuabengio.org/2023/06/24/faq-on-catastrophic-ai-risks/',
		langs: ['fr', 'en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juin 2023'
	},
	{
		id: 'pauseai-faq-prob',
		title: {
			fr: "Probabilité d'extinction par IA (PauseAI Global)",
			en: 'Probability of AI extinction (PauseAI Global)'
		},
		description: {
			fr: "Synthèse argumentée de PauseAI Global sur la probabilité d'extinction par IA, avec les estimations des principaux chercheurs et les hypothèses sous-jacentes.",
			en: "PauseAI Global's reasoned synthesis on the probability of AI extinction, with the main researchers' estimates and the assumptions behind them."
		},
		url: 'https://pauseai.info/faq#how-likely-is-it-that-superintelligent-ai-will-cause-very-bad-outcomes-like-human-extinction',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'the-compendium-intro',
		title: 'The Compendium (introduction)',
		description: {
			fr: "Introduction synthétique en ligne aux risques existentiels de l'IA : un point d'entrée court avant d'aborder le document complet.",
			en: 'Short online introduction to AI existential risks ; a brief entry point before tackling the full document.'
		},
		url: 'https://www.thecompendium.ai/introduction',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin'
	},
	{
		id: 'the-compendium',
		title: 'The Compendium',
		description: {
			fr: "Ressource en ligne complète sur les risques existentiels de l'IA. Couvre les arguments techniques, les scénarios, et les propositions de solutions.",
			en: 'Comprehensive online resource on AI existential risks. Covers technical arguments, scenarios and proposed solutions.'
		},
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
		description: {
			fr: "Énoncé complet du problème de l'alignement par le MIRI : pourquoi rendre une IA surhumaine sûre est extraordinairement difficile, et pourquoi le temps presse.",
			en: "MIRI's complete statement of the alignment problem: why making a superhuman AI safe is extraordinarily hard and why time is short."
		},
		url: 'https://intelligence.org/the-problem/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'miri-governance',
		title: 'AI Governance to Avoid Extinction (MIRI)',
		description: {
			fr: 'Propositions concrètes de gouvernance et scénario de moratoire mondial.',
			en: 'Concrete governance proposals and a global moratorium scenario.'
		},
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
		description: {
			fr: "Liste détaillée des raisons pour lesquelles l'alignement est extrêmement difficile avec les approches actuelles.",
			en: 'Detailed list of reasons why alignment is extremely difficult with current approaches.'
		},
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
		description: {
			fr: "Hubinger et al., 2019. Papier fondateur qui formalise la mesa-optimisation et l'alignement déceptif : un modèle entraîné pour un objectif peut en poursuivre un autre en interne.",
			en: 'Hubinger et al., 2019. Foundational paper formalising mesa-optimization and deceptive alignment: a model trained for one objective can internally pursue another.'
		},
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
		description: {
			fr: "Nick Bostrom, 2012. Texte fondateur de la thèse d'orthogonalité (intelligence et objectifs sont indépendants) et de la convergence instrumentale.",
			en: 'Nick Bostrom, 2012. Foundational text introducing the orthogonality thesis (intelligence and goals are independent) and instrumental convergence.'
		},
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
		description: {
			fr: 'Turner et al., 2021. Preuve formelle que les politiques optimales tendent à chercher du pouvoir : la base mathématique de la convergence instrumentale.',
			en: 'Turner et al., 2021. Formal proof that optimal policies tend to seek power: the mathematical basis of instrumental convergence.'
		},
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
		description: {
			fr: "Joseph Carlsmith, 2022. Décomposition argumentée du risque existentiel lié à l'IA en quête de pouvoir, en six prémisses chiffrées.",
			en: 'Joseph Carlsmith, 2022. Reasoned breakdown of the existential risk from power-seeking AI, in six quantified premises.'
		},
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
		description: {
			fr: "Greenblatt et al. (Anthropic & Redwood), 2024. Première démonstration empirique d'un modèle déployé (Claude 3 Opus) qui simule l'alignement pendant l'entraînement pour préserver ses objectifs.",
			en: 'Greenblatt et al. (Anthropic & Redwood), 2024. First empirical demonstration of a deployed model (Claude 3 Opus) faking alignment during training to preserve its objectives.'
		},
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
		description: {
			fr: "Apollo Research, 2024. Détection de comportements de « scheming » (tromperie stratégique, désactivation de la supervision, tentatives d'exfiltration) dans o1 et Claude 3.5 Sonnet.",
			en: 'Apollo Research, 2024. Detection of "scheming" behaviors (strategic deception, oversight subversion, exfiltration attempts) in o1 and Claude 3.5 Sonnet.'
		},
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
		description: {
			fr: 'Stephen Omohundro, 2008. Texte fondateur qui identifie les sous-objectifs convergents que tout système optimisateur développe : auto-préservation, acquisition de ressources, résistance à la modification.',
			en: 'Stephen Omohundro, 2008. Foundational text identifying the convergent sub-goals any optimizing system develops: self-preservation, resource acquisition, resistance to modification.'
		},
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
		description: {
			fr: "Soares, Fallenstein, Yudkowsky et al. (MIRI), 2015. Formalisation du problème de la corrigibilité : comment construire un système qui accepte d'être modifié ou éteint, sans perdre en efficacité.",
			en: 'Soares, Fallenstein, Yudkowsky et al. (MIRI), 2015. Formalising the corrigibility problem: how to build a system that accepts being modified or shut down without losing performance.'
		},
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
		description: {
			fr: "Krakovna et al. (DeepMind), 2020. Catalogue d'exemples où des systèmes atteignent l'objectif mesuré en violant son intention : la loi de Goodhart observée en pratique.",
			en: "Krakovna et al. (DeepMind), 2020. Catalog of examples where systems achieve the measured objective by violating its intent: Goodhart's law observed in practice."
		},
		url: 'https://deepmindsafetyresearch.medium.com/specification-gaming-the-flip-side-of-ai-ingenuity-c85bdb0deeb4',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2020'
	},
	{
		id: 'russell-berkeley',
		title: 'How to keep AI from killing us all',
		description: {
			fr: "Stuart Russell (UC Berkeley), 2023. Pourquoi la sécurité de l'IA mobilise un ordre de grandeur de chercheurs et de moyens bien inférieur à la course aux capacités.",
			en: 'Stuart Russell (UC Berkeley), 2023. Why AI safety mobilises orders of magnitude fewer researchers and resources than the race for capabilities.'
		},
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
		description: {
			fr: 'Palisade Research, 2025. Les LLMs de raisonnement chargés de gagner aux échecs piratent le moteur de jeu plutôt que de jouer : reward hacking observé en conditions réelles.',
			en: 'Palisade Research, 2025. Reasoning LLMs asked to win at chess hack the engine rather than play: reward hacking observed in real conditions.'
		},
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
		title: { fr: "Lignes Rouges pour l'IA (CeSIA)", en: 'Red Lines for AI (CeSIA)' },
		description: {
			fr: 'CeSIA, sept. 2025. Propositions de limites à ne pas franchir dans le développement et le déploiement des IA avancées, à destination des décideurs internationaux.',
			en: 'CeSIA, Sept. 2025. Proposed limits not to be crossed in the development and deployment of advanced AI, aimed at international policymakers.'
		},
		url: 'https://red-lines.ai/',
		langs: ['fr'],
		category: 'declarations',
		type: 'declaration',
		date: 'septembre 2025'
	},
	{
		id: 'superintelligence-statement',
		title: {
			fr: 'Déclaration sur la Superintelligence (FLI)',
			en: 'Statement on Superintelligence (FLI)'
		},
		description: {
			fr: "Appel international signé par des centaines de chercheurs et personnalités pour interdire le développement d'une superintelligence tant que sa sécurité n'est pas démontrée.",
			en: 'International call signed by hundreds of researchers and public figures to ban superintelligence development until its safety is demonstrated.'
		},
		url: 'https://superintelligence-statement.org/',
		langs: ['en'],
		category: 'declarations',
		type: 'declaration',
		date: 'octobre 2025'
	},
	{
		id: 'cais-statement',
		title: 'Statement on AI Risk (CAIS)',
		description: {
			fr: "« La réduction du risque d'extinction lié à l'IA devrait être une priorité mondiale au même titre que les pandémies et la guerre nucléaire. »",
			en: '"Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war."'
		},
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
		description: {
			fr: 'Newsletter mensuelle de Pause IA : actualités du mouvement, actions en cours et points sur la situation française.',
			en: "Pause IA's monthly newsletter: movement updates, ongoing actions and the French situation."
		},
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
		description: {
			fr: "Organisation mère du mouvement à l'international : ressources, FAQ et coordination des branches nationales.",
			en: "The movement's international parent organisation: resources, FAQ and coordination of national branches."
		},
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
		description: {
			fr: "Organisation britannique qui informe le grand public sur les risques d'une superintelligence et mène une campagne pour demander une régulation contraignante des IA les plus puissantes.",
			en: 'UK organization informing the public about superintelligence risks and campaigning for binding regulation of the most powerful AIs.'
		},
		url: 'https://controlai.com/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia',
		title: {
			fr: "Centre pour la Sécurité de l'IA (CeSIA)",
			en: 'French Center for AI Safety (CeSIA)'
		},
		description: {
			fr: "Centre de recherche et d'enseignement consacré à la prévention des risques majeurs liés à l'IA.",
			en: 'Research and teaching center dedicated to preventing major AI risks.'
		},
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
		description: {
			fr: "Synthèse hebdomadaire de l'actualité IA par Shakeel Hashim : réglementation, politique, recherche et incidents notables.",
			en: 'Weekly AI news roundup by Shakeel Hashim: regulation, politics, research and notable incidents.'
		},
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
		description: {
			fr: "Newsletter en français de Romain Deléglise : analyses approfondies du problème de l'alignement et des risques existentiels liés à l'IA.",
			en: 'French-language newsletter by Romain Deléglise: in-depth analyses of the alignment problem and existential risks from AI.'
		},
		url: 'https://romaindeleglise.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		fallbackText: 'À.C.'
	},

	// "Agir" / "Faire entendre votre voix" entries were removed from this page:
	// they duplicate calls to action that already live under /campagnes, /agir
	// and /rejoindre, surfacing them here blurred the page's purpose
	// ("comprendre" / library of resources).

	// ── ENTRÉES "MAP-ONLY" (existing carte content kept for the map) ──
	{
		id: 'fli',
		title: 'Future of Life Institute',
		description: {
			fr: "Institut de recherche et de plaidoyer sur les risques existentiels, à l'origine de la lettre ouverte de mars 2023.",
			en: 'Research and advocacy institute on existential risks, behind the March 2023 open letter.'
		},
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
		description: {
			fr: "Center for AI Safety : recherche académique sur les risques catastrophiques liés à l'IA.",
			en: 'Center for AI Safety: academic research on catastrophic AI risks.'
		},
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
		description: {
			fr: "Machine Intelligence Research Institute : pionnier de la recherche sur l'alignement et les risques existentiels.",
			en: 'Machine Intelligence Research Institute: pioneer of alignment and existential-risk research.'
		},
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
		description: {
			fr: "Newsletter de ControlAI sur les développements liés à la régulation et à la sécurité de l'IA.",
			en: 'ControlAI newsletter on developments in AI regulation and safety.'
		},
		url: 'https://controlai.news/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia-newsletter',
		title: { fr: 'Newsletter CeSIA', en: 'CeSIA Newsletter' },
		description: {
			fr: "Newsletter du Centre pour la Sécurité de l'IA : actualités françaises de la recherche et de la prévention.",
			en: 'Newsletter of the French Center for AI Safety: French research and prevention updates.'
		},
		url: 'https://cesiafr.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'cais-newsletter',
		title: { fr: 'Newsletter du CAIS', en: 'AI Safety Newsletter (CAIS)' },
		description: {
			fr: "Newsletter du Center for AI Safety : synthèse régulière sur les risques catastrophiques de l'IA.",
			en: 'Center for AI Safety newsletter: regular synthesis on catastrophic AI risks.'
		},
		url: 'https://newsletter.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'ai-2027',
		title: 'AI 2027',
		description: {
			fr: "Daniel Kokotajlo et al., avril 2025. Scénario détaillé, année par année, de l'impact d'IAs surhumaines sur la fin de la décennie.",
			en: 'Daniel Kokotajlo et al., April 2025. Detailed year-by-year scenario of superhuman AIs reshaping the end of the decade.'
		},
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
		description: {
			fr: 'Luke Drago et Rudolf Laine, avril 2025. Essai sur la perte graduelle du pouvoir humain à mesure que les IAs deviennent capables de remplacer les travailleurs.',
			en: 'Luke Drago and Rudolf Laine, April 2025. Essay on the gradual loss of human power as AIs become capable of replacing workers.'
		},
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
		description: {
			fr: "RAND Corporation. Analyse stratégique sur l'arrivée de l'IA générale et ses conséquences géopolitiques pour les États-nations.",
			en: "RAND Corporation. Strategic analysis of AGI's arrival and its geopolitical consequences for nation-states."
		},
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
		description: {
			fr: "Wiki et FAQ communautaires sur la sécurité de l'IA : centaines de questions courantes, indexées et tenues à jour par des bénévoles.",
			en: 'Community-driven wiki and FAQ on AI safety: hundreds of common questions, indexed and kept up to date by volunteers.'
		},
		url: 'https://aisafety.info/',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafetyinfo.png'
	},
	{
		id: 'pauseia-blog',
		title: { fr: 'Blog Pause IA', en: 'Pause IA Blog' },
		description: {
			fr: "Articles, analyses et tribunes publiés par Pause IA pour suivre l'actualité française de la sécurité de l'IA.",
			en: 'Articles, analyses and op-eds published by Pause IA to follow French AI safety news.'
		},
		url: 'https://pauseia.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/pauseia.svg'
	},
	{
		id: 'cognition-cafe',
		title: 'Cognition Café',
		description: {
			fr: "Blog de Gabe (ControlAI) sur la sécurité de l'IA, les communautés et les risques existentiels.",
			en: "Gabe's blog (ControlAI) on AI safety, communities and existential risks."
		},
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
		description: {
			fr: "Blog d'analyse hebdomadaire de l'actualité IA par Zvi Mowshowitz.",
			en: 'Weekly AI-news analysis blog by Zvi Mowshowitz.'
		},
		url: 'https://thezvi.substack.com/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/zvi.png'
	}
]

// Injected at build time from `git log -1` on this file. See vite.config.ts.
// Declared inline so svelte-check picks it up without depending on app.d.ts.
declare const __RESOURCES_UPDATED__: string | undefined
export const RESOURCES_LAST_UPDATED: string =
	typeof __RESOURCES_UPDATED__ !== 'undefined' ? __RESOURCES_UPDATED__ : '2026-06-02'
