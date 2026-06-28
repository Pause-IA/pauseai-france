// Moteur d'« actions » pour la page « Écrire à mes élus ».
//
// Chaque action définit le CONTENU de l'email (objet, accroches, angles, appel…)
// ET sa CIBLE :
//   - 'representatives' : les élus de l'utilisateur, trouvés par code postal
//     (comportement par défaut, générique).
//   - 'fixed' : une liste de destinataires précis (un ministre, les membres
//     d'une commission, le Premier ministre…), sans code postal.
//
// On sélectionne l'action via l'URL : /ecrire-a-mes-elus?action=<id>
// (sans paramètre → action « default »). L'équipe com peut donc lancer une
// action ciblée pour un moment-clé (un vote, une audition, le G7) en ajoutant
// une entrée ici, puis en partageant le lien correspondant.
//
// Règle de style : aucun tiret long (—) dans les textes destinés aux utilisateurs.

export type Bilingual = { fr: string; en: string }

/** Un destinataire précis pour une action ciblée (ministre, commission…). */
export interface FixedTarget {
	id: string
	nom: string
	/** Civilité, pour la formule d'appel quand on ne fournit pas `salutation`. */
	civ?: 'M' | 'Mme' | null
	role: 'depute' | 'senateur' | 'ministre' | 'autre'
	email: string | null
	contactUrl?: string | null
	photo?: string | null
	/** Fonction affichée sous le nom (ex. « Ministre chargé du Numérique »). */
	fonction?: Bilingual
	/** Formule d'appel sur mesure (ex. « Monsieur le Premier ministre, »). */
	salutation?: Bilingual
}

export interface ActionAngle {
	id: string
	label: Bilingual
	/** Paragraphe « focus » du message pour cet angle. */
	focus: Bilingual
	/** Paragraphe ajouté en version détaillée (facultatif). */
	complementLong?: Bilingual
}

export interface EluAction {
	id: string
	status: 'active' | 'ended'
	targeting: 'representatives' | 'fixed'
	/** Destinataires précis (requis si targeting = 'fixed'). */
	fixedTargets?: FixedTarget[]
	/** Intitulé du groupe de destinataires en mode 'fixed' (ex. « Le gouvernement »). */
	targetsHeading?: Bilingual
	/** Métadonnées SEO de la page. */
	meta: { title: Bilingual; description: Bilingual }
	/** Bandeau d'en-tête. */
	hero: { title: Bilingual; subtitle: Bilingual }
	/** Objets tournants (un tiré au hasard par visiteur). */
	subjects: Bilingual[]
	/** Accroches tournantes (une tirée au hasard par visiteur). */
	hooks: Bilingual[]
	/** Angles proposés (le 1er est l'angle par défaut). */
	angles: ActionAngle[]
	/** Sondage ajouté en version détaillée (facultatif). */
	poll?: Bilingual
	/** Reconnaissance des bénéfices, juste avant l'appel (toujours présent). */
	balance: Bilingual
	/** L'appel à l'action (toujours présent). */
	ask: Bilingual
	/** Proposer le choix courte / détaillée ? */
	hasDetailed: boolean
}

// ──────────────────────────────────────────────────────────────────────────
// Action par défaut : message générique vers les élus de l'utilisateur.
// (Contenu historique de la page.)
// ──────────────────────────────────────────────────────────────────────────
const DEFAULT_ACTION: EluAction = {
	id: 'default',
	status: 'active',
	targeting: 'representatives',
	meta: {
		title: {
			fr: 'Écrivez à vos élus | Pause IA',
			en: 'Write to your representatives | Pause AI'
		},
		description: {
			fr: "Prenez 2 minutes pour écrire à votre député et à votre sénateur sur les risques des systèmes d'IA. Entrez votre code postal et envoyez un email prêt à l'emploi.",
			en: 'Take 2 minutes to write to your MP and senator about the risks of advanced AI systems. Enter your postal code and send a ready-made email.'
		}
	},
	hero: {
		title: { fr: 'Écrivez à vos élus', en: 'Write to your representatives' },
		subtitle: {
			fr: 'Les IA les plus puissantes se développent sans véritable garde-fou. Vos élus peuvent changer ça. Écrivez-leur : cela prend deux minutes.',
			en: 'The most powerful AI is being built with no real safeguards. Your representatives can change that. Write to them: it takes two minutes.'
		}
	},
	subjects: [
		{
			fr: 'Encadrer le développement des IA les plus puissantes',
			en: 'Governing the most powerful AI systems'
		},
		{
			fr: "Mettre en pause l'IA la plus avancée tant qu'elle n'est pas sous contrôle",
			en: 'Pausing the most advanced AI until it is under control'
		},
		{
			fr: "Préoccupation d'un électeur sur les risques de l'IA",
			en: "A constituent's concern about the risks of AI"
		},
		{
			fr: "Pour une gouvernance démocratique de l'intelligence artificielle",
			en: 'For democratic governance of artificial intelligence'
		}
	],
	hooks: [
		{
			fr: "Je vous écris parce que je suis préoccupé par la vitesse à laquelle se développent les intelligences artificielles les plus puissantes. Ce qui m'inquiète n'est pas la science-fiction : ce sont les dirigeants de ces laboratoires eux-mêmes qui reconnaissent publiquement que leurs systèmes pourraient, à terme, échapper à notre contrôle.",
			en: 'I am writing because I am worried about the speed at which the most powerful artificial intelligence systems are being developed. What concerns me is not science fiction: it is the leaders of these very labs who publicly acknowledge that their systems could, in time, escape our control.'
		},
		{
			fr: "Je suis un citoyen inquiet de la tournure que prend le développement de l'intelligence artificielle. En mai 2023, des centaines de chercheurs et les dirigeants des principaux laboratoires d'IA ont signé une même phrase : « Atténuer le risque d'extinction lié à l'IA devrait être une priorité mondiale, au même titre que les pandémies ou la guerre nucléaire. » Quand ceux qui construisent cette technologie lancent eux-mêmes une telle alerte, il me semble que nous devons l'écouter.",
			en: 'I am a citizen worried about the direction AI development is taking. In May 2023, hundreds of researchers and the leaders of the main AI labs signed a single sentence: "Mitigating the risk of extinction from AI should be a global priority, alongside other societal-scale risks such as pandemics and nuclear war." When the very people building this technology raise such a warning, it seems to me we should listen.'
		},
		{
			fr: "Comme beaucoup, j'observe avec un mélange d'enthousiasme et d'inquiétude les progrès rapides de l'intelligence artificielle. L'inquiétude l'emporte quand des scientifiques parmi les plus respectés, comme les prix Turing Yoshua Bengio et Geoffrey Hinton, expliquent que personne ne sait aujourd'hui garantir le contrôle des systèmes les plus avancés.",
			en: 'Like many people, I watch the rapid progress of artificial intelligence with a mix of enthusiasm and concern. Concern wins out when some of the most respected scientists, such as Turing laureates Yoshua Bengio and Geoffrey Hinton, explain that no one today knows how to guarantee control of the most advanced systems.'
		}
	],
	angles: [
		{
			id: 'ensemble',
			label: { fr: "Vue d'ensemble", en: 'Overview' },
			focus: {
				fr: 'Ces dangers ne sont pas tous lointains : certains sont déjà là, comme la désinformation de masse ou la surveillance, tandis que la course à des systèmes toujours plus autonomes fait planer un risque bien plus grave encore.',
				en: 'These dangers are not all distant: some are already here, such as mass disinformation or surveillance, while the race toward ever more autonomous systems raises an even graver risk.'
			},
			complementLong: {
				fr: "Et même en mettant de côté ces effets immédiats, une question demeure : nous nous apprêtons à créer des intelligences supérieures à la nôtre sans aucune garantie de pouvoir les garder sous contrôle. C'est ce pari que je trouve déraisonnable.",
				en: 'And even setting aside these immediate effects, one question remains: we are about to create intelligences greater than our own with no guarantee of keeping them under control. It is this gamble that I find unreasonable.'
			}
		},
		{
			id: 'existentiel',
			label: { fr: 'Risque existentiel', en: 'Existential risk' },
			focus: {
				fr: "Ce qui me préoccupe le plus est le risque le plus extrême : en construisant des machines plus intelligentes que nous sans savoir les maîtriser, nous prenons un pari dont l'humanité pourrait ne jamais se relever. Ce n'est plus une crainte marginale, mais une inquiétude partagée au plus haut niveau de la recherche.",
				en: 'What worries me most is the most extreme risk: by building machines more intelligent than us without knowing how to control them, we are taking a gamble humanity might never recover from. This is no longer a fringe fear, but a concern shared at the highest levels of research.'
			},
			complementLong: {
				fr: "Ce risque n'efface pas les autres : vie privée, désinformation, emploi, armes autonomes. Tous appellent la même prudence, celle de prendre le temps de comprendre avant de déployer.",
				en: 'This risk does not erase the others: privacy, disinformation, jobs, autonomous weapons. They all call for the same caution, that of taking the time to understand before deploying.'
			}
		},
		{
			id: 'societe',
			label: { fr: 'Risques pour la société', en: 'Risks to society' },
			focus: {
				fr: "Au-delà du long terme, ces systèmes fragilisent déjà notre société : deepfakes et désinformation qui minent le débat démocratique, surveillance et profilage qui menacent la vie privée, automatisation qui déstabilise l'emploi et risque d'aggraver les inégalités.",
				en: 'Beyond the long term, these systems are already straining our society: deepfakes and disinformation that erode democratic debate, surveillance and profiling that threaten privacy, and automation that destabilises jobs and could deepen inequality.'
			},
			complementLong: {
				fr: "Et même en mettant de côté ces effets immédiats, une question demeure : nous nous apprêtons à créer des intelligences supérieures à la nôtre sans aucune garantie de pouvoir les garder sous contrôle. C'est ce pari que je trouve déraisonnable.",
				en: 'And even setting aside these immediate effects, one question remains: we are about to create intelligences greater than our own with no guarantee of keeping them under control. It is this gamble that I find unreasonable.'
			}
		}
	],
	poll: {
		fr: "Cette préoccupation est largement partagée : selon un récent sondage, seuls 8 % des Français souhaitent accélérer le développement de l'IA, et près de huit sur dix sont favorables à des accords internationaux interdisant les capacités d'IA qui menacent la vie humaine ou les droits fondamentaux.",
		en: 'This concern is widely shared: according to a recent poll, only 8% of French people want to accelerate AI development, and nearly eight in ten support international agreements banning AI capabilities that threaten human life or fundamental rights.'
	},
	balance: {
		fr: "Je ne suis pas opposé au progrès : l'IA peut rendre d'immenses services, en médecine, dans la recherche ou au quotidien. C'est précisément parce que cette technologie est puissante qu'elle mérite d'être développée avec prudence et sous contrôle démocratique.",
		en: 'I am not against progress: AI can bring immense benefits, in medicine, research and everyday life. It is precisely because this technology is so powerful that it deserves to be developed with caution and under democratic oversight.'
	},
	ask: {
		fr: "C'est pourquoi je vous demande de soutenir publiquement une gouvernance internationale visant à mettre en pause l'entraînement des modèles d'IA les plus avancés, tant que leur sûreté et leur contrôle démocratique ne sont pas démontrés, et de porter cette position aux niveaux français et européen. L'association Pause IA (pauseia.fr) se tient à votre disposition, ainsi que celle de votre équipe, pour en échanger.",
		en: 'That is why I ask you to publicly support international governance aimed at pausing the training of the most advanced AI models, until their safety and democratic control are demonstrated, and to carry this position at the French and European level. The Pause AI association (pauseia.fr) would be glad to discuss this with you or your team.'
	},
	hasDetailed: true
}

// ──────────────────────────────────────────────────────────────────────────
// Exemple d'action CIBLÉE (gabarit pour l'équipe com).
// Démontre le mode 'fixed' sans donnée inventée : on cible une fonction
// institutionnelle (pas une personne nommée), sans email mais avec un lien de
// contact officiel → l'utilisateur copie le texte et utilise le formulaire.
// À dupliquer / adapter pour un vrai moment-clé (un ministre, une commission).
// ──────────────────────────────────────────────────────────────────────────
const EXEMPLE_GOUVERNEMENT: EluAction = {
	...DEFAULT_ACTION,
	id: 'exemple-gouvernement',
	status: 'ended', // gabarit : non mis en avant
	targeting: 'fixed',
	targetsHeading: { fr: 'Le gouvernement', en: 'The government' },
	fixedTargets: [
		{
			id: 'premier-ministre',
			nom: 'Le Premier ministre',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.gouvernement.fr/nous-contacter',
			fonction: { fr: 'Chef du gouvernement', en: 'Head of government' },
			salutation: { fr: 'Monsieur le Premier ministre,', en: 'Dear Prime Minister,' }
		}
	],
	meta: {
		title: {
			fr: 'Écrire au gouvernement | Pause IA',
			en: 'Write to the government | Pause AI'
		},
		description: {
			fr: "Demandez au gouvernement d'agir pour encadrer les IA les plus puissantes.",
			en: 'Ask the government to act on governing the most powerful AI systems.'
		}
	},
	hero: {
		title: { fr: 'Écrire au gouvernement', en: 'Write to the government' },
		subtitle: {
			fr: "Demandez au gouvernement de porter une gouvernance internationale de l'IA. Un message prêt à personnaliser.",
			en: 'Ask the government to champion international AI governance. A ready-to-personalise message.'
		}
	}
}

export const eluActions: EluAction[] = [DEFAULT_ACTION, EXEMPLE_GOUVERNEMENT]

/** Renvoie l'action demandée, ou l'action par défaut si l'id est inconnu. */
export function getEluAction(id: string | null | undefined): EluAction {
	if (!id) return DEFAULT_ACTION
	return eluActions.find((a) => a.id === id) ?? DEFAULT_ACTION
}
