/**
 * Page « Contact » : les catégories du menu déroulant.
 *
 * Textes repris mot pour mot du cahier des charges de l'équipe onboarding
 * (Notion, « Cahier des charges page contacter », 20/11/2026). Ne pas les
 * réécrire ici : c'est dans Notion qu'ils se décident.
 *
 * Les adresses de destination ne sont PAS ici, ce fichier est envoyé au
 * navigateur : elles sont dans `$lib/server/contact.ts`, et le navigateur
 * n'envoie que la clé de la catégorie. Sans cela, le formulaire servirait à
 * envoyer des courriels à n'importe qui depuis notre domaine.
 */

/** Un morceau de paragraphe : du texte, éventuellement un lien. */
export interface Segment {
	t: string
	href?: string
}

export interface Categorie {
	cle: string
	libelle: string
	/** Paragraphes affichés avant le formulaire (ou à la place). */
	texte: Segment[][]
	/** Phrase juste au-dessus du formulaire, s'il y en a une. */
	avantFormulaire?: string
	/** La catégorie mène-t-elle à un formulaire ? */
	formulaire: boolean
}

const DISCORD = 'https://discord.gg/vyXGd7AeGc'

/** Repère visible pour un texte que le cahier des charges ne donne pas encore. */
export const A_ECRIRE = '[texte à écrire]'

export const CATEGORIES: Categorie[] = [
	{
		cle: 'question',
		libelle: 'Clarifier une question spécifique sur l’IA ou sur notre projet de Pause ?',
		texte: [
			[{ t: 'La plupart de nos ressources sont disponibles sur notre site web.' }],
			[
				{ t: 'Vous pouvez consulter les réponses à nos ' },
				{ t: 'objections fréquentes', href: '/fr/idees-recues' },
				{ t: ' ou bien explorer nos ' },
				{ t: 'ressources généralistes', href: '/fr/ressources' },
				{ t: '.' }
			],
			[
				{ t: 'Tous les échanges approfondis ont lieu sur ' },
				{ t: 'Discord', href: DISCORD },
				{ t: '.' }
			]
		],
		formulaire: false
	},
	{
		cle: 'fresque',
		libelle: 'Participer, animer ou réutiliser la Fresque de l’IA ?',
		texte: [
			[
				{ t: 'La présentation du projet est sur notre ' },
				{ t: 'site', href: '/fr/fresque' },
				{ t: '. Vous pouvez directement vous inscrire à une session.' }
			]
		],
		avantFormulaire:
			'Pour nous aider à déployer cette fresque ou la réutiliser, contactez nous ici :',
		formulaire: true
	},
	{
		cle: 'local',
		libelle: 'Agir près de chez vous ?',
		texte: [
			[
				{
					t: 'Nous vous invitons à consulter cette page, qui vous permettra de contacter directement le groupe le plus proche de chez vous : '
				},
				{ t: 'pauseia.fr/fr/groupes-locaux', href: '/fr/groupes-locaux' }
			]
		],
		avantFormulaire: 'Si vous avez une question supplémentaire, vous pouvez la poser ici :',
		formulaire: true
	},
	{
		cle: 'benevolat',
		libelle: 'Vous impliquer dans l’association et sensibiliser autour de vous',
		texte: [[{ t: `Avant de nous écrire, nous vous conseillons de consulter ${A_ECRIRE}` }]],
		formulaire: true
	},
	{
		cle: 'elu',
		libelle: 'Contacter ou répondre à votre élu ?',
		texte: [[{ t: 'Notre équipe plaidoyer vous recontactera dès que possible.' }]],
		formulaire: true
	},
	{
		cle: 'technique',
		libelle: 'Résoudre un problème technique (site web, Discord, etc.)',
		texte: [],
		formulaire: true
	},
	{
		cle: 'presse',
		libelle: 'Couvrir nos actions en tant que journaliste ?',
		texte: [
			[
				{ t: 'Nous vous invitons à vous rendre sur notre ' },
				{ t: 'espace presse', href: '/fr/presse' },
				{ t: '.' }
			]
		],
		avantFormulaire: 'Vous pouvez également nous contacter directement :',
		formulaire: true
	},
	{
		cle: 'alignement',
		libelle: 'Nous partager une idée pour résoudre le problème de l’alignement ?',
		texte: [
			[
				{
					t: 'Suite à de trop nombreuses requêtes à ce sujet et faute de ressources, nous ne pouvons pas faire suite à votre demande.'
				}
			],
			[
				{
					t: 'Nous vous invitons à contacter des experts en sécurité de l’IA, par exemple via le site '
				},
				{ t: 'sécurité de l’IA Paris', href: 'https://www.aisafety.paris/' },
				{ t: '.' }
			]
		],
		formulaire: false
	}
]

export const categorie = (cle: string): Categorie | undefined =>
	CATEGORIES.find((c) => c.cle === cle)

/** Limites, partagées par le formulaire et le serveur. */
export const LIMITES = { message: 5000, telephone: 30, discord: 64, email: 254 }
