export type CampaignStatus = 'active' | 'ended'

export interface CampaignResult {
	label: string
	value: string
}

export interface CampaignArticle {
	title: string
	source: string
	url: string
}

export interface CampaignSummary {
	fr: {
		text: string
		results: CampaignResult[]
		link?: { label: string; url: string }
		articles?: CampaignArticle[]
	}
	en: {
		text: string
		results: CampaignResult[]
		link?: { label: string; url: string }
		articles?: CampaignArticle[]
	}
}

export interface Campaign {
	/** URL slug, e.g. 'municipales-2026' → /fr/municipales-2026 */
	slug: string
	status: CampaignStatus
	/** Start date (YYYY-MM) — used for ordering and display */
	startDate: string
	/** End date (YYYY-MM) — set when campaign ends */
	endDate?: string
	/** Override URL (absolute path). If omitted, defaults to /{lang}/{slug} */
	url?: string
	/** Optional cover image (absolute URL or path under /static, e.g. '/campaigns/g7.jpg') */
	image?: string
	/** Summary shown in a popup when the ended campaign card is clicked */
	summary?: CampaignSummary
	fr: {
		title: string
		description: string
		/** Shorter description used on compact cards (e.g. homepage). Falls back to description. */
		shortDescription?: string
		cta: string
		/** Action-oriented title used on the homepage card. Falls back to title. */
		homeTitle?: string
		/** Action-specific CTA label used on the homepage card. Falls back to cta. */
		homeCta?: string
		/** Short progress / deadline / target label shown on the homepage card. */
		progress?: string
	}
	en: {
		title: string
		description: string
		/** Shorter description used on compact cards (e.g. homepage). Falls back to description. */
		shortDescription?: string
		cta: string
		/** Action-oriented title used on the homepage card. Falls back to title. */
		homeTitle?: string
		/** Action-specific CTA label used on the homepage card. Falls back to cta. */
		homeCta?: string
		/** Short progress / deadline / target label shown on the homepage card. */
		progress?: string
	}
}

/**
 * Source of truth for all campaigns.
 * To add a new campaign: prepend a new object with status: 'active'.
 * When a campaign ends: change its status to 'ended'.
 * Order: newest first within each status group.
 */
export const campaigns: Campaign[] = [
	{
		slug: 'g7-2026',
		status: 'ended',
		startDate: '2026-06',
		endDate: '2026-06',
		// Photo: Leynadmar, CC BY-SA 4.0, via Wikimedia Commons
		image: '/campaigns/palais-elysee.jpg',
		summary: {
			fr: {
				text: "À l'occasion du sommet du G7 à Évian (15-17 juin 2026), Pause IA a publié une tribune dans Le Nouvel Obs avec 30 signataires : « Le G7 ne doit pas accélérer mais sécuriser l'IA ! ». Alors que les déclarations officielles d'ouverture du sommet étaient très décevantes, la réunion du 17 juin entre les représentants du G7 et les dirigeants d'OpenAI, Anthropic et Google DeepMind a remis la sécurité à l'agenda : Emmanuel Macron a annoncé la construction d'une plateforme de coopération entre démocraties sur les risques de l'IA, afin de définir des standards communs. Pause IA salue cette prise de conscience tout en appelant à des règles contraignantes et à une coopération véritablement internationale.",
				results: [
					{ label: 'Tribune & presse', value: 'Le Nouvel Obs (31 signataires), Channel News' }
				],
				articles: [
					{
						title: "« Le G7 ne doit pas accélérer mais sécuriser l'IA »",
						source: 'Le Nouvel Obs',
						url: 'https://www.nouvelobs.com/economie/20260615.OBS115808/le-g7-ne-doit-pas-accelerer-mais-securiser-l-ia.html'
					},
					{
						title: "Pause IA salue la prise de conscience par le G7 des risques posés par l'IA",
						source: 'Channel News',
						url: 'https://www.channelnews.fr/pause-ia-salue-la-prise-de-conscience-par-le-g7-des-risques-poses-par-lia-157380'
					}
				],
				link: {
					label: 'Lire la tribune dans Le Nouvel Obs',
					url: 'https://www.nouvelobs.com/economie/20260615.OBS115808/le-g7-ne-doit-pas-accelerer-mais-securiser-l-ia.html'
				}
			},
			en: {
				text: 'For the G7 summit in Évian (15-17 June 2026), Pause AI published an op-ed in Le Nouvel Obs co-signed by 30 others: "The G7 must not accelerate but secure AI!". While the summit\'s opening statements on AI safety were disappointing, the 17 June meeting between G7 representatives and the heads of OpenAI, Anthropic and Google DeepMind put safety back on the agenda: Emmanuel Macron announced the creation of a cooperation platform between democracies on AI risks, aimed at defining common standards. Pause AI welcomes this awareness while calling for binding rules and genuinely international cooperation.',
				results: [
					{ label: 'Op-ed & press', value: 'Le Nouvel Obs (31 signatories), Channel News' }
				],
				articles: [
					{
						title: '"The G7 must not accelerate but secure AI"',
						source: 'Le Nouvel Obs',
						url: 'https://www.nouvelobs.com/economie/20260615.OBS115808/le-g7-ne-doit-pas-accelerer-mais-securiser-l-ia.html'
					},
					{
						title: 'Pause AI welcomes G7 awareness of AI risks',
						source: 'Channel News',
						url: 'https://www.channelnews.fr/pause-ia-salue-la-prise-de-conscience-par-le-g7-des-risques-poses-par-lia-157380'
					}
				],
				link: {
					label: 'Read the op-ed in Le Nouvel Obs',
					url: 'https://www.nouvelobs.com/economie/20260615.OBS115808/le-g7-ne-doit-pas-accelerer-mais-securiser-l-ia.html'
				}
			}
		},
		fr: {
			title: 'G7 2026 : sécuriser plutôt qu’accélérer l’IA',
			homeTitle: 'Interpellez le gouvernement sur la sécurité de l’IA au G7',
			description:
				'En 2026, la France accueille le G7. Pause IA demande que la sécurité de l’IA soit remise au cœur de l’agenda international. Interpellez le Président et la ministre chargée du numérique.',
			shortDescription:
				'La France préside le G7 en 2026. Interpellons l’Élysée et la ministre du Numérique pour que la sécurité passe avant.',
			cta: 'Participer à la campagne',
			homeCta: 'Interpeller le gouvernement',
			progress: 'Avant le sommet d’Évian (15-17 juin 2026)'
		},
		en: {
			title: 'G7 2026: secure AI, don’t accelerate it',
			homeTitle: 'Push the French government on AI safety at the G7',
			description:
				'In 2026, France hosts the G7. Pause AI calls for AI safety to be put back at the heart of the international agenda. Write to the President and the Minister for Digital Affairs.',
			shortDescription:
				'France chairs the G7 in 2026. Let’s push the Élysée and the Digital Minister to put safety before acceleration.',
			cta: 'Join the campaign',
			homeCta: 'Write to the government',
			progress: 'Before the Évian G7 summit (15-17 June 2026)'
		}
	},
	{
		slug: 'ecrire-a-mes-elus',
		status: 'active',
		startDate: '2026-04',
		// Photo: Daniel Vorndran / DXR, public domain, via Wikimedia Commons
		image: '/campaigns/960px-Palais_Bourbon.jpg',
		fr: {
			title: 'Écrivez à vos élus',
			homeTitle: 'Écrivez à votre député·e et à votre sénateur·rice',
			description:
				"Envoyez un email à votre député et à votre sénateur pour mettre les risques de l'IA à leur agenda. Un modèle personnalisable et deux versions (courte et complète) sont disponibles.",
			shortDescription:
				"Un email prêt à personnaliser pour mettre les risques de l'IA à l'agenda de votre député et de votre sénateur.",
			cta: 'Envoyer un email à mes élus',
			homeCta: 'Envoyer mon email'
		},
		en: {
			title: 'Write to your representatives',
			homeTitle: 'Write to your MP and senator',
			description:
				'Send an email to your MP and senator to put AI risks on their agenda. A customisable template with both a short and a full version is available.',
			shortDescription:
				'A ready-to-personalise email to put AI risks on the agenda of your MP and senator.',
			cta: 'Write to my representatives',
			homeCta: 'Send my email'
		}
	},
	{
		slug: 'emploi-ia',
		status: 'active',
		startDate: '2026-04',
		image: '/campaigns/DSC08648_r.webp',
		fr: {
			title: "L'IA ne détruira pas QUE votre emploi",
			homeTitle: "Témoignez de l'impact de l'IA sur votre travail",
			description:
				"Les systèmes d'IA généralistes peuvent remplacer du travail humain massivement, sans filet de sécurité. Mais le problème dépasse l'emploi : c'est notre capacité à contrôler ces technologies qui recule. Témoignages, enquête et revue de presse.",
			shortDescription:
				"Témoignages, enquête, revue de presse : comprendre comment l'IA bouleverse le travail et notre capacité à la contrôler.",
			cta: 'Participer à la campagne',
			homeCta: 'Partager mon témoignage'
		},
		en: {
			title: 'AI will not destroy ONLY your job',
			homeTitle: 'Share how AI is affecting your work',
			description:
				'General-purpose AI systems can replace human work at scale, with no safety net. But the issue goes beyond employment: it is our ability to govern these technologies that is receding. Testimonials, survey and press review.',
			shortDescription:
				'Testimonials, survey, press review: see how AI is upending work and our ability to keep it in check.',
			cta: 'Join the campaign',
			homeCta: 'Share my testimony'
		}
	},
	{
		slug: 'sommet-ia-2026',
		status: 'ended',
		startDate: '2026-01',
		endDate: '2026-02',
		summary: {
			fr: {
				text: "À l'occasion du Sommet de l'IA en Inde, Pause IA s'est mobilisée pour remettre la sécurité au cœur de l'agenda international. Plus de 4 000 personnes ont signé la pétition et plus de 2 000 mails ont été envoyés aux délégués dans 14 pays. Une tribune a également été publiée dans Le Nouvel Obs.",
				results: [
					{ label: 'Signatures pétition', value: '+4 000' },
					{ label: 'Mails aux délégués', value: '+2 000 (14 pays)' },
					{ label: 'Tribune', value: 'Le Nouvel Obs' }
				],
				link: {
					label: 'Lire la tribune dans Le Nouvel Obs',
					url: 'https://www.nouvelobs.com/opinions/20260216.OBS112421/sommet-de-l-ia-face-aux-risques-remettre-la-securite-en-haut-de-l-agenda-international.html'
				}
			},
			en: {
				text: 'Pause AI France mobilized to put safety back at the heart of the international AI agenda at the India AI Summit. Over 4,000 people signed the petition and over 2,000 emails were sent to delegates across 14 countries. An op-ed was also published in Le Nouvel Obs.',
				results: [
					{ label: 'Petition signatures', value: '4,000+' },
					{ label: 'Emails to delegates', value: '2,000+ (14 countries)' },
					{ label: 'Op-ed', value: 'Le Nouvel Obs' }
				],
				link: {
					label: 'Read the op-ed in Le Nouvel Obs',
					url: 'https://www.nouvelobs.com/opinions/20260216.OBS112421/sommet-de-l-ia-face-aux-risques-remettre-la-securite-en-haut-de-l-agenda-international.html'
				}
			}
		},
		fr: {
			title: "Sommet de l'IA 2026",
			description:
				"Le Sommet de l'IA 2026 en Inde est un moment crucial pour l'avenir de notre société. Signez la pétition et interpellez les décideurs politiques pour que la sécurité soit au cœur des discussions.",
			cta: 'Participer à la campagne'
		},
		en: {
			title: 'AI Summit 2026',
			description:
				'The 2026 AI Summit in India is a crucial moment for the future of our society. Sign the petition and contact decision-makers to put safety at the heart of the discussions.',
			cta: 'Join the campaign'
		}
	},
	{
		slug: 'municipales-2026',
		status: 'ended',
		startDate: '2026-03',
		endDate: '2026-03',
		summary: {
			fr: {
				text: "Pause IA a interpellé les candidats aux élections municipales de mars 2026 pour les inviter à signer une charte en 14 engagements sur les risques liés à l'IA. La campagne a mobilisé dans toute la France et généré une couverture médiatique nationale.",
				results: [
					{ label: 'Signataires', value: '12 candidats' },
					{ label: 'Villes', value: '11 villes' },
					{ label: 'Chartes complètes', value: '7 signataires (14/14)' },
					{ label: 'Presse', value: '10 articles + 1 émission (France Culture)' }
				],
				articles: [
					{
						title: "Quand l'IA s'invite dans les municipales",
						source: 'Next',
						url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/'
					},
					{
						title: 'Journal de 18h — vendredi 13 mars 2026',
						source: 'France Culture',
						url: 'https://www.radiofrance.fr/franceculture/podcasts/journal-de-18h/journal-de-18h-emission-du-vendredi-13-mars-2026-9405796'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner » (Avignon)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/avignon-clemence-peyrot-les-candidats-aux-municipales-doivent-se-positionner/'
					},
					{
						title:
							"Annecy : une association interpelle les candidats sur l'intelligence artificielle",
						source: 'ODS Radio',
						url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle'
					},
					{
						title: "Pause IA s'incruste dans les municipales",
						source: 'Contexte',
						url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807'
					},
					{
						title:
							"Risques IA : l'association interpelle les candidats aux municipales de Toulouse",
						source: "L'Opinion",
						url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner clairement » (Nice)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/'
					},
					{
						title: "Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'IA",
						source: "Place Gre'net",
						url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506'
					},
					{
						title: "Isère / Grenoble : Pause IA appelle les candidats à s'engager sur sa charte",
						source: 'Le Dauphiné Libéré',
						url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte'
					},
					{
						title: "Nice : Jean-Marc Governatori s'engage sur la charte de Pause IA",
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/'
					}
				]
			},
			en: {
				text: 'Pause AI challenged candidates in the March 2026 municipal elections to sign a charter with 14 commitments on AI risks. The campaign mobilized across France and received national media coverage.',
				results: [
					{ label: 'Signatories', value: '12 candidates' },
					{ label: 'Cities', value: '11 cities' },
					{ label: 'Full charters', value: '7 signatories (14/14)' },
					{ label: 'Press', value: '10 articles + 1 broadcast (France Culture)' }
				],
				articles: [
					{
						title: "Quand l'IA s'invite dans les municipales",
						source: 'Next',
						url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/'
					},
					{
						title: 'Journal de 18h, vendredi 13 mars 2026',
						source: 'France Culture',
						url: 'https://www.radiofrance.fr/franceculture/podcasts/journal-de-18h/journal-de-18h-emission-du-vendredi-13-mars-2026-9405796'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner » (Avignon)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/avignon-clemence-peyrot-les-candidats-aux-municipales-doivent-se-positionner/'
					},
					{
						title:
							"Annecy : une association interpelle les candidats sur l'intelligence artificielle",
						source: 'ODS Radio',
						url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle'
					},
					{
						title: "Pause IA s'incruste dans les municipales",
						source: 'Contexte',
						url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807'
					},
					{
						title:
							"Risques IA : l'association interpelle les candidats aux municipales de Toulouse",
						source: "L'Opinion",
						url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner clairement » (Nice)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/'
					},
					{
						title: "Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'IA",
						source: "Place Gre'net",
						url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506'
					},
					{
						title: "Isère / Grenoble : Pause IA appelle les candidats à s'engager sur sa charte",
						source: 'Le Dauphiné Libéré',
						url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte'
					},
					{
						title: "Nice : Jean-Marc Governatori s'engage sur la charte de Pause IA",
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/'
					}
				]
			}
		},
		fr: {
			title: 'Élections municipales 2026',
			description:
				"Les élections municipales de mars 2026 sont une opportunité d'agir localement. Interpellez les candidats de votre ville et invitez-les à signer la charte Pause IA.",
			cta: 'Participer à la campagne'
		},
		en: {
			title: 'Municipal elections 2026',
			description:
				'The March 2026 municipal elections are an opportunity to act locally. Challenge candidates in your city and invite them to sign the Pause AI charter.',
			cta: 'Join the campaign'
		}
	}
]

const MONTHS_FR = [
	'jan.',
	'fév.',
	'mars',
	'avr.',
	'mai',
	'juin',
	'juil.',
	'août',
	'sept.',
	'oct.',
	'nov.',
	'déc.'
]
const MONTHS_EN = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
]

/** Format a YYYY-MM string as "juin 2026" / "Jun 2026". */
export function formatCampaignDate(yyyymm: string, lang: 'fr' | 'en'): string {
	const [year, month] = yyyymm.split('-')
	const m = parseInt(month, 10) - 1
	const months = lang === 'en' ? MONTHS_EN : MONTHS_FR
	return `${months[m]} ${year}`
}

const byStartDateDesc = (a: Campaign, b: Campaign) => b.startDate.localeCompare(a.startDate)

/** Active campaigns first (newest first), then ended ones (newest first). */
export function getSortedCampaigns(): Campaign[] {
	const active = campaigns.filter((c) => c.status === 'active').sort(byStartDateDesc)
	const ended = campaigns.filter((c) => c.status === 'ended').sort(byStartDateDesc)
	return [...active, ...ended]
}
