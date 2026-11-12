/**
 * Retours presse de la campagne « Perte de contrôle » (semaine d’action du
 * 21 au 28 septembre 2026), regroupés par groupe local.
 *
 * Source unique : cette liste alimente aussi la revue de presse de /presse
 * (voir press-coverage-static.ts), où seuls les éléments datés apparaissent.
 */
export interface CampaignPressArticle {
	source: string
	title: string
	url: string
	date?: string // YYYY-MM-DD
	video?: boolean // interview radio/TV mise sur notre chaîne YouTube
}

export interface CampaignPressGroup {
	city: string // nom de ville, identique en français et en anglais
	national?: boolean
	articles: CampaignPressArticle[]
}

export const pressePerteDeControle: CampaignPressGroup[] = [
	{
		city: 'National',
		national: true,
		articles: [
			{
				source: '20 Minutes',
				title:
					'Comment l’IA pourrait vraiment tous nous tuer (et pourquoi il ne suffira pas de débrancher la prise pour l’arrêter)',
				url: 'https://www.20minutes.fr/societe/4244433-20260911-comment-ia-pourrait-vraiment-tous-tuer-pourquoi-suffira-debrancher-prise-arreter',
				date: '2026-09-11'
			}
		]
	},
	{
		city: 'Grenoble',
		articles: [
			{
				source: 'Place Gre’net',
				title:
					'Grenoble : l’association Pause IA alerte les passants sur les risques de perte de contrôle des intelligences artificielles',
				url: 'https://www.placegrenet.fr/2026/09/28/grenoble-lassociation-pause-ia-alerte-les-passants-sur-les-risques-de-perte-de-controle-des-intelligences-artificielles/690227',
				date: '2026-09-28'
			},
			{
				source: 'Grenoble Mag',
				title:
					'À Grenoble, Pause IA appelle à une « pause » face aux risques liés à l’intelligence artificielle',
				url: 'https://www.grenoblemag.com/article/3369/a-grenoble-pause-ia-appelle-a-une-pause-face-aux-risques-lies-a-lintelligence-artificielle',
				date: '2026-09-25'
			},
			{
				source: 'Mesinfos',
				title: 'Course à l’IA : une action de sensibilisation aux risques ce vendredi à Grenoble',
				url: 'https://mesinfos.fr/38000-grenoble/course-a-l-ia-une-action-de-sensibilisation-aux-risques-ce-vendredi-a-grenoble-339629.html',
				date: '2026-09-24'
			},
			{
				source: 'Le Dauphiné libéré',
				title:
					'Isère : à Grenoble, l’association Pause IA se mobilise ce vendredi pour une pause internationale « de toute urgence »',
				url: 'https://www.ledauphine.com/economie/2026/09/21/isere-grenoble-l-association-pause-ia-se-mobilise-ce-vendredi-pour-une-pause-internationale-de-toute-urgence',
				date: '2026-09-21'
			}
		]
	},
	{
		city: 'Lille',
		articles: [
			{
				source: 'France 3 Hauts-de-France',
				title:
					'« Un risque existentiel pour l’humanité » : ils réclament une pause pour les intelligences artificielles et « un moratoire international »',
				url: 'https://france3-regions.franceinfo.fr/hauts-de-france/nord-0/lille/un-risque-existentiel-pour-l-humanite-ils-reclament-une-pause-pour-les-intelligences-artificielles-et-un-moratoire-international-3422831.html',
				date: '2026-09-24'
			},
			{
				source: '20 Minutes',
				title:
					'« On passe pour des complotistes »… Une asso tente d’éveiller les consciences au risque existentiel lié à l’IA',
				url: 'https://www.20minutes.fr/lille/4248453-20260929-passe-complotistes-asso-tente-eveiller-consciences-risque-existentiel-lie-ia',
				date: '2026-09-29'
			},
			{
				source: 'Ici Hauts-de-France',
				title: 'Interview lors de l’action Pause IA à Lille',
				url: 'https://youtu.be/SMCMSBmJGJQ',
				date: '2026-09-24',
				video: true
			}
		]
	},
	{
		city: 'Toulouse',
		articles: [
			{
				source: 'France 3 Occitanie',
				title:
					'« Des modèles d’IA plus compétents que les meilleurs hackers » : pourquoi les dérives d’intelligences artificielles surpuissantes ont de quoi faire peur',
				url: 'https://france3-regions.franceinfo.fr/occitanie/haute-garonne/toulouse/des-modeles-d-ia-plus-competents-que-les-meilleurs-hackers-pourquoi-les-derives-d-intelligences-artificielles-surpuissantes-ont-de-quoi-faire-peur-3421148.html',
				date: '2026-09-27'
			},
			{
				source: 'Nostalgie',
				title: 'Interview lors de l’action Pause IA à Toulouse (1/3)',
				url: 'https://youtu.be/QDZlZn8jQYk',
				date: '2026-09-21',
				video: true
			},
			{
				source: 'Nostalgie',
				title: 'Interview lors de l’action Pause IA à Toulouse (2/3)',
				url: 'https://youtu.be/kGE1k6ncJqs',
				date: '2026-09-21',
				video: true
			},
			{
				source: 'Nostalgie',
				title: 'Interview lors de l’action Pause IA à Toulouse (3/3)',
				url: 'https://youtu.be/UIw6WyQPatc',
				date: '2026-09-21',
				video: true
			}
		]
	},
	{
		city: 'Paris',
		articles: [
			{
				source: 'France 3 Paris Île-de-France',
				title:
					'« Stoppons cette course suicidaire » : mobilisation contre le risque d’une « perte de contrôle » de l’IA à Paris',
				url: 'https://france3-regions.franceinfo.fr/paris-ile-de-france/paris/stoppons-cette-course-suicidaire-mobilisation-contre-le-risque-d-une-perte-de-controle-de-l-ia-a-paris-3421424.html',
				date: '2026-09-23'
			}
		]
	},
	{
		city: 'Clermont-Ferrand',
		articles: [
			{
				source: 'France 3 Auvergne-Rhône-Alpes',
				title:
					'« Pause IA » : quel est ce mouvement citoyen qui veut agir pour garder l’intelligence artificielle sous contrôle ?',
				url: 'https://france3-regions.franceinfo.fr/auvergne-rhone-alpes/puy-de-dome/clermont-ferrand/pause-ia-quel-est-ce-mouvement-citoyen-qui-veut-agir-pour-garder-l-intelligence-artificielle-sous-controle-3420800.html',
				date: '2026-09-22'
			},
			{
				source: 'Ici Auvergne',
				title: 'Interview lors de l’action Pause IA à Clermont-Ferrand',
				url: 'https://youtu.be/4lGnfuXwM1E',
				date: '2026-09-25',
				video: true
			}
		]
	},
	{
		city: 'Bordeaux',
		articles: [
			{
				source: 'Nostalgie',
				title: 'Interview lors de l’action Pause IA à Bordeaux',
				url: 'https://youtu.be/VvW2AqzGVnk',
				date: '2026-09-27',
				video: true
			}
		]
	},
	{
		city: 'Mérignac',
		articles: [
			{
				source: 'Sud Ouest',
				title: 'À Mérignac, une association alerte « sur la course effrénée à l’IA »',
				url: 'https://www.sudouest.fr/gironde/merignac/a-merignac-une-association-alerte-sur-la-course-effrenee-a-l-ia-30737673.php',
				date: '2026-09-25'
			}
		]
	}
]
