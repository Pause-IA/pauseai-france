import type { PressCoverage } from '$lib/notion'

/**
 * Revue de presse de SECOURS (fichier statique du dépôt).
 *
 * Depuis le branchement de la base Notion « Revue de presse »
 * (NOTION_PRESS_COVERAGE_DATABASE_ID), la page presse utilise Notion en
 * priorité et ne retombe sur cette liste QUE si la base Notion est vide ou non
 * configurée. Pour ajouter un article au quotidien, passer par Notion (voir
 * docs/espace-presse.md), pas par ce fichier.
 */
export const staticPressCoverage: PressCoverage[] = [
	// ── G7 2026 / Emploi & IA (juin 2026) ───────────────────────────────────
	{
		id: 'static-channelnews-g7-2026-06-17',
		title: 'Pause IA salue la prise de conscience par le G7 des risques posés par l’IA',
		source: 'Channel News',
		date: '2026-06-17',
		url: 'https://www.channelnews.fr/pause-ia-salue-la-prise-de-conscience-par-le-g7-des-risques-poses-par-lia-157380',
		order: 0,
		visible: true
	},
	{
		id: 'static-nouvelobs-g7-2026-06-15',
		title: 'Le G7 ne doit pas accélérer mais sécuriser l’IA',
		source: 'Le Nouvel Obs',
		date: '2026-06-15',
		url: 'https://www.nouvelobs.com/economie/20260615.OBS115808/le-g7-ne-doit-pas-accelerer-mais-securiser-l-ia.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-lemonde-cadres-ia-2026-06-05',
		title: 'De la réticence au refus, ces cadres qui vivent mal l’injonction d’utiliser l’IA',
		source: 'Le Monde',
		date: '2026-06-05',
		url: 'https://www.lemonde.fr/emploi/article/2026/06/05/de-la-reticence-au-refus-ces-cadres-qui-vivent-mal-l-injonction-d-utiliser-l-ia_6697853_1698637.html',
		order: 0,
		visible: true
	},

	// ── Campagne Emploi & IA / manifestation 1er mai 2026 ───────────────────
	{
		id: 'static-radio-france-ici-matin-2026-05-01',
		title: 'Pause IA à la matinale ICI Paris Île-de-France (1er mai)',
		source: 'ICI Paris Île-de-France',
		date: '2026-05-01',
		url: 'https://www.dailymotion.com/video/xa7pbcq?start=4708',
		order: 0,
		visible: true
	},
	{
		id: 'static-nouvelobs-2026-05-01',
		title:
			"IA et travail : une poignée d'hommes de la Silicon Valley doit-elle être en mesure de remodeler tout notre contrat social ?",
		source: 'Le Nouvel Obs',
		date: '2026-05-01',
		url: 'https://www.nouvelobs.com/economie/20260501.OBS114604/ia-et-travail-une-poignee-d-hommes-de-la-silicon-valley-doit-elle-etre-en-mesure-de-remodeler-tout-notre-contrat-social.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-mesinfos-paris-2026-05-01',
		title: "Manifestation de Pause IA devant l'Assemblée le 1er mai",
		source: 'MesInfos',
		date: '2026-05-01',
		url: 'https://mesinfos.fr/75000-paris/manifestation-de-pause-ia-devant-l-assemblee-le-1er-mai-245348.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-esteval-2026-05-01',
		title: "1er mai – Pause IA alerte sur les enjeux sociaux et démocratiques de la course à l'IA",
		source: "L'Est en Val",
		date: '2026-05-01',
		url: 'https://www.esteval.fr/article.46137.expertises-1er-mai-pause-ia-alerte-sur-les-enjeux-sociaux-et-democratiques-de-la-course-a-l-ia',
		order: 0,
		visible: true
	},
	{
		id: 'static-vie-economique-dordogne-2026-05',
		title: "De l'impact social de l'IA",
		source: 'La Vie Économique',
		date: '2026-05-01',
		url: 'https://www.vie-economique.com/actualites/de-limpact-social-de-lia/',
		order: 0,
		visible: true
	},
	{
		id: 'static-dordogne-libre-2026-05',
		title:
			"« La question de la sécurité n'est pas posée » — le collectif Pause IA demande un moratoire sur le développement de l'intelligence artificielle",
		source: 'Dordogne Libre',
		date: '2026-05-01',
		url: 'https://www.dordognelibre.fr/dordogne/la-question-de-la-securite-n-est-pas-posee-le-collectif-pause-ia-demande-un-moratoire-sur-le-developpement-de-l-intelligence-artificielle-28895566.php',
		order: 0,
		visible: true
	},

	// ── Campagne élections municipales 2026 ─────────────────────────────────
	{
		id: 'static-next-municipales-2026-03-17',
		title: "Quand l'IA s'invite dans les municipales",
		source: 'Next',
		date: '2026-03-17',
		url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/',
		order: 0,
		visible: true
	},
	{
		id: 'static-france-culture-2026-03-13',
		title: 'Journal de 18h du vendredi 13 mars 2026 (15:30 – 17:22)',
		source: 'France Culture',
		date: '2026-03-13',
		url: 'https://www.radiofrance.fr/franceculture/podcasts/journal-de-18h/journal-de-18h-emission-du-vendredi-13-mars-2026-9405796',
		order: 0,
		visible: true
	},
	{
		id: 'static-presseagence-avignon-2026-03-13',
		title: 'Avignon : Clémence Peyrot : « Les candidats aux municipales doivent se positionner »',
		source: 'Presse Agence',
		date: '2026-03-13',
		url: 'https://presseagence.fr/avignon-clemence-peyrot-les-candidats-aux-municipales-doivent-se-positionner/',
		order: 0,
		visible: true
	},
	{
		id: 'static-odsradio-annecy-2026-03-12',
		title: "Annecy : une association interpelle les candidats sur l'intelligence artificielle",
		source: 'ODS Radio',
		date: '2026-03-12',
		url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle',
		order: 0,
		visible: true
	},
	{
		id: 'static-contexte-municipales-2026-03-11',
		title: "Pause IA s'incruste dans les municipales",
		source: 'Contexte',
		date: '2026-03-11',
		url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807',
		order: 0,
		visible: true
	},
	{
		id: 'static-lopinion-municipales-2026-03-10',
		title: "Risques IA : l'association interpelle les candidats aux municipales de Toulouse",
		source: "L'Opinion",
		date: '2026-03-10',
		url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse',
		order: 0,
		visible: true
	},
	{
		id: 'static-presseagence-nice-fournes-2026-03-10',
		title:
			'Nice : Maxime Fournes : « Les candidats aux municipales doivent se positionner clairement »',
		source: 'Presse Agence',
		date: '2026-03-10',
		url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/',
		order: 0,
		visible: true
	},
	{
		id: 'static-placegrenet-2026-03-08',
		title:
			"Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'intelligence artificielle",
		source: "Place Gre'net",
		date: '2026-03-08',
		url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506',
		order: 0,
		visible: true
	},
	{
		id: 'static-dauphinelibere-2026-03-06',
		title:
			"Isère / Grenoble : l'association Pause IA appelle les candidats à s'engager sur sa charte",
		source: 'Le Dauphiné Libéré',
		date: '2026-03-06',
		url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte',
		order: 0,
		visible: true
	},
	{
		id: 'static-presseagence-nice-governatori-2026-02-06',
		title: "Nice : Jean-Marc Governatori s'engage sur la charte de Pause IA pour les municipales",
		source: 'Presse Agence',
		date: '2026-02-06',
		url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/',
		order: 0,
		visible: true
	},

	// ── Tribune & articles nationaux ────────────────────────────────────────
	{
		id: 'static-nouvelobs-2026-02-16',
		title:
			"Sommet de l'IA : face aux risques, remettre la sécurité en haut de l'agenda international",
		source: 'Le Nouvel Obs',
		date: '2026-02-16',
		url: 'https://www.nouvelobs.com/opinions/20260216.OBS112421/sommet-de-l-ia-face-aux-risques-remettre-la-securite-en-haut-de-l-agenda-international.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-bfmtv-2025-02-23',
		title:
			"Exigeons une pause IA : quand des citoyens et des ingénieurs veulent encadrer l'intelligence artificielle",
		source: 'BFM TV',
		date: '2025-02-23',
		url: 'https://www.bfmtv.com/tech/intelligence-artificielle/exigeons-une-pause-ia-quand-des-citoyens-et-des-ingenieurs-veulent-encadrer-l-ia_AN-202502230038.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-latribune-2025-02',
		title:
			"À Paris et dans le monde, les inquiets de l'intelligence artificielle appellent à une pause",
		source: 'La Tribune',
		date: '2024-05-14',
		url: 'https://www.latribune.fr/technos-medias/informatique/a-paris-et-dans-le-monde-les-inquiets-de-l-intelligence-artificielle-appellent-a-une-pause-997475.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-lemonde-2024-09-11',
		title:
			"À l'approche du sommet de Paris, les militants inquiets quant à la sécurité de l'IA cherchent à se faire entendre",
		source: 'Le Monde',
		date: '2024-09-11',
		url: 'https://www.lemonde.fr/economie/article/2024/09/11/a-l-approche-du-sommet-de-paris-les-militants-inquiets-quant-a-la-securite-de-l-ia-cherchent-a-se-faire-entendre_6312979_3234.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-contexte-commission-2024',
		title: "Pause IA remet en cause la crédibilité du rapport de la Commission de l'IA",
		source: 'Contexte',
		date: '2024-05-01', // approx.
		url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-remet-en-cause-la-credibilite-du-rapport-de-la-commission-de-lia_201323',
		order: 0,
		visible: true
	},
	{
		id: 'static-ladn-2024',
		title:
			'Pas de futur sans IA sûre : des technophiles alertent sur les dérapages des IA génératives',
		source: "L'ADN",
		date: '2024-05-15',
		url: 'https://www.ladn.eu/tech-a-suivre/pas-de-futur-sans-ia-sure-des-technophiles-alertent-sur-les-derapages-des-ia-generatives/',
		order: 0,
		visible: true
	},
	{
		id: 'static-nextink-launch-2024-09-12',
		title: "Des militants de la sécurité de l'intelligence artificielle lancent Pause IA en France",
		source: 'Next.ink',
		date: '2024-09-12',
		url: 'https://next.ink/149818/des-militants-de-la-securite-de-lintelligence-artificielle-lancent-pause-ia-en-france/',
		order: 0,
		visible: true
	}
]
