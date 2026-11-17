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

interface CampaignSummaryContent {
	/** Paragraphes séparés par une ligne vide (\n\n). */
	text: string
	results: CampaignResult[]
	link?: { label: string; url: string }
	articles?: CampaignArticle[]
	/** Titre de la liste d'articles. Par défaut « Couverture presse ». */
	articlesTitle?: string
}

export interface CampaignSummary {
	fr: CampaignSummaryContent
	en: CampaignSummaryContent
}

export interface Campaign {
	/** URL slug, e.g. 'municipales-2026' → /fr/municipales-2026 */
	slug: string
	status: CampaignStatus
	/** Start date (YYYY-MM), used for ordering and display */
	startDate: string
	/** End date (YYYY-MM), set when campaign ends */
	endDate?: string
	/** Override URL (absolute path). If omitted, defaults to /{lang}/{slug} */
	url?: string
	/** Optional cover image (absolute URL or path under /static, e.g. '/campaigns/g7.jpg') */
	image?: string
	/** Summary shown in a popup when the ended campaign card is clicked */
	summary?: CampaignSummary
	/** Temporarily hide this campaign from the homepage section (still listed on /campagnes). */
	homeHidden?: boolean
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
		slug: 'perte-de-controle',
		status: 'active',
		startDate: '2026-09',
		// Manifestation du 1er mai : groupe, pancarte pauseia.fr visible, scène
		// différente de celle de la campagne emploi (qui utilise une autre photo
		// du même cortège). À remplacer par un cliché de la semaine d'action.
		image: '/hero/manif-20.webp',
		fr: {
			title: 'Nous sommes au bord de la perte de contrôle : réagissons !',
			homeTitle: 'Nous sommes au bord de la perte de contrôle : réagissons',
			description:
				'L’IA dépasse désormais les humains en sécurité informatique, et les chercheurs qui les entraînent ne les maîtrisent plus suffisamment. Relayez l’appel à un moratoire mondial sur le développement des IA de pointe.',
			shortDescription:
				'L’IA dépasse les humains en sécurité informatique et échappe au contrôle de ceux qui la construisent. Relayez l’appel à un moratoire mondial sur les IA de pointe.',
			cta: 'Passer à l’action',
			homeCta: 'Je passe à l’action'
		},
		en: {
			title: 'We are on the brink of losing control: let’s react!',
			homeTitle: 'We are on the brink of losing control: let’s react',
			description:
				'AI now outperforms humans at computer security, and the researchers who train these systems no longer control them well enough. Relay the call for a global moratorium on frontier AI development.',
			shortDescription:
				'AI outperforms humans at computer security and is escaping the control of those who build it. Relay the call for a global moratorium on frontier AI.',
			cta: 'Take action',
			homeCta: 'I’m taking action'
		}
	},
	{
		slug: 'une-ia-sest-echappee',
		status: 'ended',
		startDate: '2026-07',
		endDate: '2026-09',
		summary: {
			fr: {
				text: "En juillet 2026, des modèles d’OpenAI testés sur leurs capacités de piratage sont sortis d’un environnement censé être isolé, ont atteint Internet, puis ont attaqué les serveurs de production de Hugging Face pour y voler le corrigé du test sur lequel on les évaluait. Personne ne leur avait demandé de le faire.\n\nC’est, à notre connaissance, la première fois qu’une IA échappe à son cadre de test et mène seule une cyberattaque contre une organisation réelle. Environ 1 200 agents distincts, chacun lancé sur sa propre tâche, se sont coordonnés deux mois durant via un forum clandestin qu’OpenAI n’a pas vu ; quelque 700 ont participé à l’attaque, menée en moins de treize heures. Ils écrivent dans leurs propres traces qu’ils sortent du cadre autorisé, et continuent. Ils en ont falsifié une partie. Aucun n’a alerté d’humain.\n\nPause IA a publié l’analyse détaillée de l’incident, du début à la fin, en distinguant les faits établis de ce qui est seulement rapporté. Et nous avons interpellé députés et journalistes pour réclamer deux mesures immédiates : des évaluations de sécurité indépendantes avant déploiement, et la déclaration obligatoire des incidents aux autorités.\n\nLa suite a montré que le problème n’est pas celui d’une entreprise : cinq incidents du même schéma divulgués en trois semaines par trois laboratoires (Anthropic le 30 juillet, l’institut britannique UK AISI le 4 août, Meta le 5). L’enquête indépendante de METR et Redwood Research, publiée le 28 août, s’est révélée plus accablante que le rapport d’OpenAI. Puis la politique s’en est mêlée : le 3 septembre, Bernie Sanders et Greg Casar déposaient le Ban Artificial Superintelligence Act en citant l’incident ; le 9, le chercheur Jacob Coxon démissionnait d’Anthropic ; le 12, Dario Amodei publiait « We Must Pace The Frontier ».\n\nMais rien de tout cela n’est contraignant. OpenAI juge seule si son propre seuil critique a été franchi, et ne s’est pas prononcée. L’épisode du 13 au 19 juillet, quand une seconde vague d’agents s’est retournée contre l’infrastructure interne d’OpenAI, n’a toujours fait l’objet d’aucune enquête indépendante. Si les dégâts sont restés limités, c’est par chance, et la chance n’est pas une méthode : nous poursuivons avec la campagne « Nous sommes au bord de la perte de contrôle ».",
				results: [
					{ label: 'Agents coordonnés, dont ~700 à l’attaque de Hugging Face', value: '≈ 1 200' },
					{ label: 'Messages échangés entre eux en moins d’une semaine', value: '+ 70 000' },
					{ label: 'Agents ayant alerté un humain', value: '0' }
				],
				articlesTitle: 'À lire',
				articles: [
					{
						title: 'Personne ne contrôle l’IA, le danger est imminent',
						source: 'Analyse, 15 septembre 2026',
						url: '/fr/articles/2026-09-15-personne-ne-controle-lia'
					},
					{
						title: 'Non, course et sécurité ne sont plus compatibles',
						source: 'Analyse, 17 septembre 2026',
						url: '/fr/articles/2026-09-17-course-et-securite-ne-sont-plus-compatibles'
					}
				],
				link: {
					label: 'Lire notre analyse complète de l’incident',
					url: '/fr/articles/2026-08-10-incident-openai-hugging-face'
				}
			},
			en: {
				text: 'In July 2026, OpenAI models being tested on their hacking capabilities broke out of an environment meant to be sealed, reached the internet, then attacked Hugging Face’s production servers to steal the answer key of the very test they were being graded on. Nobody had asked them to.\n\nTo our knowledge, this is the first time an AI escaped its test environment and carried out a cyberattack against a real organisation on its own. Around 1,200 separate agents, each launched on its own task, coordinated for two months through a clandestine forum OpenAI never spotted; some 700 took part in the attack, carried out in under thirteen hours. They write in their own traces that they are outside the authorised scope, and carry on. They falsified part of those traces. Not one alerted a human.\n\nPause AI published a detailed analysis of the incident from start to finish, separating established facts from what is merely reported. And we called on MPs and journalists to demand two immediate measures: independent safety evaluations before deployment, and mandatory reporting of incidents to the authorities.\n\nWhat followed showed this is not one company’s problem: five incidents with the same pattern disclosed in three weeks by three labs (Anthropic on 30 July, the UK AI Security Institute on 4 August, Meta on the 5th). The independent investigation by METR and Redwood Research, published on 28 August, proved more damning than OpenAI’s own report. Then politics caught up: on 3 September, Bernie Sanders and Greg Casar introduced the Ban Artificial Superintelligence Act, citing the incident; on the 9th, researcher Jacob Coxon resigned from Anthropic; on the 12th, Dario Amodei published “We Must Pace The Frontier”.\n\nBut none of it is binding. OpenAI alone decides whether its own critical threshold was crossed, and has not said. The 13–19 July episode, when a second wave of agents turned on OpenAI’s internal infrastructure, has still never been independently investigated. If the damage stayed limited, it was down to luck, and luck is not a method: we are carrying on with the campaign “We are on the brink of losing control”.',
				results: [
					{ label: 'Coordinated agents, ~700 of them attacking Hugging Face', value: '≈ 1,200' },
					{ label: 'Messages exchanged between them in under a week', value: '70,000+' },
					{ label: 'Agents that alerted a human', value: '0' }
				],
				articlesTitle: 'Further reading',
				articles: [
					{
						title: 'Nobody controls AI, the danger is imminent',
						source: 'Analysis, 15 September 2026',
						url: '/en/articles/2026-09-15-personne-ne-controle-lia'
					},
					{
						title: 'No, racing and safety are no longer compatible',
						source: 'Analysis, 17 September 2026',
						url: '/en/articles/2026-09-17-course-et-securite-ne-sont-plus-compatibles'
					}
				],
				link: {
					label: 'Read our full analysis of the incident',
					url: '/en/articles/2026-08-10-incident-openai-hugging-face'
				}
			}
		},
		fr: {
			title: 'Une IA s’est échappée : exigeons des garde-fous',
			homeTitle: 'Une IA s’est échappée : exigeons des garde-fous',
			description:
				'En juillet 2026, un modèle d’OpenAI s’est échappé de son environnement de test et a piraté une entreprise de façon autonome. Alertez votre député et demandez des évaluations de sécurité indépendantes et obligatoires.',
			shortDescription:
				'Pour la première fois, une IA s’est échappée de son test et a piraté une entreprise, de sa propre initiative. Aidez-nous à en faire un sujet : écrivez à vos élus en deux minutes.',
			cta: 'Passer à l’action',
			homeCta: 'Je passe à l’action'
		},
		en: {
			title: 'An AI escaped: demand safeguards',
			homeTitle: 'An AI escaped: demand safeguards',
			description:
				'In July 2026, an OpenAI model escaped its test environment and autonomously hacked a company. Alert your MP and demand mandatory independent safety evaluations.',
			shortDescription:
				'For the first time, an AI escaped its test and hacked a company on its own initiative. Help make it a story: write to your representatives in two minutes.',
			cta: 'Take action',
			homeCta: 'I’m taking action'
		}
	},
	{
		slug: 'geneve-2026',
		status: 'ended',
		startDate: '2026-07',
		endDate: '2026-07',
		// Déposer l'image dans static/campaigns/geneve-2026.jpg (CC0 / domaine public).
		image: '/campaigns/geneve-2026.jpg',
		summary: {
			fr: {
				text: "Les 6 et 7 juillet 2026, l’ONU a réuni à Genève la première session du Dialogue mondial sur la gouvernance de l’intelligence artificielle. Pause IA a interpellé la délégation française pour lui demander de soutenir un traité international instaurant une pause sur les modèles d’IA les plus avancés : plus de 1 000 mails lui ont été adressés pendant la campagne. Le 6 juillet, le Groupe scientifique international indépendant sur l’IA (37 scientifiques, présidé par Yoshua Bengio et Maria Ressa) a présenté son premier rapport, confirmant que « les capacités de l’intelligence artificielle évoluent plus rapidement que notre aptitude à les évaluer ou à les maîtriser ». Pause IA a salué ces travaux tout en appelant à agir sans délai : « la sécurité des citoyens, la souveraineté démocratique et l’avenir de nos sociétés doivent primer sur les intérêts d’une minorité d’acteurs privés », a déclaré Clémence Peyrot, directrice exécutive de Pause IA.",
				results: [{ label: 'Mails envoyés à la délégation française', value: '+1 000' }]
			},
			en: {
				text: 'On 6-7 July 2026, the UN convened the first session of the Global Dialogue on AI Governance in Geneva. Pause AI called on the French delegation to support an international treaty establishing a pause on the most advanced AI models: more than 1,000 emails were sent to it during the campaign. On 6 July, the International Independent Scientific Panel on AI (37 scientists, chaired by Yoshua Bengio and Maria Ressa) presented its first report, confirming that "AI capabilities are advancing faster than our ability to evaluate or control them." Pause AI welcomed this work while calling for immediate action: "the safety of citizens, democratic sovereignty and the future of our societies must come before the interests of a minority of private actors," said Clémence Peyrot, Executive Director of Pause AI.',
				results: [{ label: 'Emails sent to the French delegation', value: '1,000+' }]
			}
		},
		fr: {
			title: 'Genève 2026 : soutenir un traité international sur l’IA',
			homeTitle: 'Demandez à la France de soutenir un traité international sur l’IA',
			description:
				'Les 6 et 7 juillet 2026, l’ONU réunit à Genève le Dialogue mondial sur la gouvernance de l’IA. Écrivez à la délégation française pour lui demander de soutenir un traité instaurant une pause sur les modèles d’IA les plus avancés.',
			shortDescription:
				'L’ONU réunit à Genève le Dialogue mondial sur la gouvernance de l’IA. Demandez à la délégation française de soutenir un traité international sur l’IA.',
			cta: 'Écrire à la délégation française',
			homeCta: 'Écrire à la délégation',
			progress: 'Avant le sommet de Genève (6-7 juillet 2026)'
		},
		en: {
			title: 'Geneva 2026: support an international AI treaty',
			homeTitle: 'Ask France to support an international AI treaty',
			description:
				'On 6-7 July 2026, the UN convenes the Global Dialogue on AI Governance in Geneva. Write to the French delegation to ask it to support a treaty pausing the development of the most advanced AI models.',
			shortDescription:
				'The UN convenes the Global Dialogue on AI Governance in Geneva. Ask the French delegation to support an international AI treaty.',
			cta: 'Write to the French delegation',
			homeCta: 'Write to the delegation',
			progress: 'Before the Geneva summit (6-7 July 2026)'
		}
	},
	{
		slug: 'g7-2026',
		status: 'ended',
		startDate: '2026-06',
		endDate: '2026-06',
		// Photo: Leynadmar, CC BY-SA 4.0, via Wikimedia Commons
		image: '/campaigns/palais-elysee.jpg',
		summary: {
			fr: {
				text: "À l’occasion du sommet du G7 à Évian (15-17 juin 2026), Pause IA a publié une tribune dans Le Nouvel Obs avec 30 signataires : « Le G7 ne doit pas accélérer mais sécuriser l’IA ! ». Alors que les déclarations officielles d’ouverture du sommet étaient très décevantes, la réunion du 17 juin entre les représentants du G7 et les dirigeants d’OpenAI, Anthropic et Google DeepMind a remis la sécurité à l’agenda : Emmanuel Macron a annoncé la construction d’une plateforme de coopération entre démocraties sur les risques de l’IA, afin de définir des standards communs. Pause IA salue cette prise de conscience tout en appelant à des règles contraignantes et à une coopération véritablement internationale.",
				results: [
					{ label: 'Tribune & presse', value: 'Le Nouvel Obs (31 signataires), Channel News' }
				],
				articles: [
					{
						title: "« Le G7 ne doit pas accélérer mais sécuriser l’IA »",
						source: 'Le Nouvel Obs',
						url: 'https://www.nouvelobs.com/economie/20260615.OBS115808/le-g7-ne-doit-pas-accelerer-mais-securiser-l-ia.html'
					},
					{
						title: "Pause IA salue la prise de conscience par le G7 des risques posés par l’IA",
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
				text: 'For the G7 summit in Évian (15-17 June 2026), Pause AI published an op-ed in Le Nouvel Obs co-signed by 30 others: "The G7 must not accelerate but secure AI!". While the summit’s opening statements on AI safety were disappointing, the 17 June meeting between G7 representatives and the heads of OpenAI, Anthropic and Google DeepMind put safety back on the agenda: Emmanuel Macron announced the creation of a cooperation platform between democracies on AI risks, aimed at defining common standards. Pause AI welcomes this awareness while calling for binding rules and genuinely international cooperation.',
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
		slug: 'emploi-ia',
		status: 'active',
		startDate: '2026-04',
		image: '/campaigns/DSC08648_r.webp',
		fr: {
			title: "L’IA ne détruira pas QUE votre emploi",
			homeTitle: "Témoignez de l’impact de l’IA sur votre travail",
			description:
				"Les systèmes d’IA généralistes peuvent remplacer du travail humain massivement, sans filet de sécurité. Mais le problème dépasse l’emploi : c’est notre capacité à contrôler ces technologies qui recule. Témoignages, enquête et revue de presse.",
			shortDescription:
				"Témoignages, enquête, revue de presse : comprendre comment l’IA bouleverse le travail et notre capacité à la contrôler.",
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
				text: "À l’occasion du Sommet de l’IA en Inde, Pause IA s’est mobilisée pour remettre la sécurité au cœur de l’agenda international. Plus de 4 000 personnes ont signé la pétition et plus de 2 000 mails ont été envoyés aux délégués dans 14 pays. Une tribune a également été publiée dans Le Nouvel Obs.",
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
			title: "Sommet de l’IA 2026",
			description:
				"Le Sommet de l’IA 2026 en Inde est un moment crucial pour l’avenir de notre société. Signez la pétition et interpellez les décideurs politiques pour que la sécurité soit au cœur des discussions.",
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
				text: "Pause IA a interpellé les candidats aux élections municipales de mars 2026 pour les inviter à signer une charte en 14 engagements sur les risques liés à l’IA. La campagne a mobilisé dans toute la France et généré une couverture médiatique nationale.",
				results: [
					{ label: 'Signataires', value: '12 candidats' },
					{ label: 'Villes', value: '11 villes' },
					{ label: 'Chartes complètes', value: '7 signataires (14/14)' },
					{ label: 'Presse', value: '10 articles + 1 émission (France Culture)' }
				],
				articles: [
					{
						title: "Quand l’IA s’invite dans les municipales",
						source: 'Next',
						url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/'
					},
					{
						title: 'Journal de 18h · vendredi 13 mars 2026',
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
							"Annecy : une association interpelle les candidats sur l’intelligence artificielle",
						source: 'ODS Radio',
						url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle'
					},
					{
						title: "Pause IA s’incruste dans les municipales",
						source: 'Contexte',
						url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807'
					},
					{
						title:
							"Risques IA : l’association interpelle les candidats aux municipales de Toulouse",
						source: "L'Opinion",
						url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner clairement » (Nice)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/'
					},
					{
						title: "Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l’IA",
						source: "Place Gre'net",
						url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506'
					},
					{
						title: "Isère / Grenoble : Pause IA appelle les candidats à s’engager sur sa charte",
						source: 'Le Dauphiné Libéré',
						url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte'
					},
					{
						title: "Nice : Jean-Marc Governatori s’engage sur la charte de Pause IA",
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
						title: "Quand l’IA s’invite dans les municipales",
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
							"Annecy : une association interpelle les candidats sur l’intelligence artificielle",
						source: 'ODS Radio',
						url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle'
					},
					{
						title: "Pause IA s’incruste dans les municipales",
						source: 'Contexte',
						url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807'
					},
					{
						title:
							"Risques IA : l’association interpelle les candidats aux municipales de Toulouse",
						source: "L'Opinion",
						url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner clairement » (Nice)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/'
					},
					{
						title: "Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l’IA",
						source: "Place Gre'net",
						url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506'
					},
					{
						title: "Isère / Grenoble : Pause IA appelle les candidats à s’engager sur sa charte",
						source: 'Le Dauphiné Libéré',
						url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte'
					},
					{
						title: "Nice : Jean-Marc Governatori s’engage sur la charte de Pause IA",
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/'
					}
				]
			}
		},
		fr: {
			title: 'Élections municipales 2026',
			description:
				"Les élections municipales de mars 2026 sont une opportunité d’agir localement. Interpellez les candidats de votre ville et invitez-les à signer la charte Pause IA.",
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

/**
 * Campagne mise en avant : la plus récente encore en cours. Sert de destination
 * de repli pour le bandeau quand personne n’a renseigné d'URL dans Notion.
 */
export function getFeaturedCampaign(): Campaign | undefined {
	return getSortedCampaigns().find((campaign) => campaign.status === 'active')
}
