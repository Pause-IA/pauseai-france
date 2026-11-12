/**
 * Les chiffres de crédibilité affichés en page d'accueil.
 *
 * Ils sont rassemblés ici, et nulle part ailleurs, parce qu'ils vieillissent :
 * une page d'accueil qui annonce « 45 retombées presse » deux ans plus tard
 * dessert l'association plus qu'elle ne la sert. Un seul fichier à ouvrir pour
 * les mettre à jour, avec la date de la dernière vérification.
 *
 * Règle : on n'affiche que ce qui est public et vérifiable. Les rencontres
 * d'élus, la proposition de loi et les projets de résolution n'ont rien à
 * faire ici.
 */

export const verifieLe = '2026-11-12'

export interface Preuve {
	/** Le chiffre, mis en avant. Laisser vide pour une preuve sans chiffre. */
	chiffre: string
	/** Ce que le chiffre mesure, en une ligne. */
	libelle: string
	/** La précision qui rend le chiffre crédible. */
	detail: string
	/** Page du site qui permet de vérifier. */
	href?: string
	lien?: string
}

export const preuves: Preuve[] = [
	{
		chiffre: '5 millions',
		libelle: 'de vues pour nos contenus',
		detail: 'Et plus de 45 retombées dans la presse française depuis la création.',
		href: '/presse',
		lien: 'Voir la revue de presse'
	},
	{
		chiffre: '2 tribunes',
		libelle: 'dans Le Monde et Le Nouvel Obs',
		detail: 'Dont une signée par quarante chercheurs, et un colloque au Sénat.',
		href: '/tribunes/le-monde-octobre-2026',
		lien: 'Lire la tribune'
	},
	{
		chiffre: '1 800',
		libelle: 'personnes sur notre Discord',
		detail:
			'Avec des groupes locaux dans toute la France : le premier mouvement citoyen français sur le risque IA.',
		href: '/groupes-locaux',
		lien: 'Voir les groupes'
	}
]

/**
 * Médias ayant parlé de Pause IA.
 *
 * Chaque nom doit correspondre à une retombée réellement présente dans
 * src/lib/press-coverage-static.ts ou dans la base Notion de la revue de
 * presse. Ne pas en ajouter « de mémoire » : la page presse est à un clic.
 */
export const vuDans = [
	'Le Monde',
	'Le Nouvel Obs',
	'France Culture',
	'BFM TV',
	'La Tribune',
	'01net',
	'Next',
	'Contexte'
]

export interface Demande {
	titre: string
	texte: string
}

/** Reprises du one pager, et détaillées sur /propositions. */
export const demandes: Demande[] = [
	{
		titre: 'Un moratoire sur les systèmes de pointe',
		texte:
			'Arrêter l’entraînement des modèles les plus puissants tant que personne ne sait les rendre sûrs ni les garder sous contrôle démocratique.'
	},
	{
		titre: 'Des évaluations de sécurité indépendantes',
		texte:
			'Les laboratoires ne peuvent pas être seuls juges de la sécurité de ce qu’ils construisent. L’évaluation doit leur être extérieure.'
	},
	{
		titre: 'La déclaration publique des incidents',
		texte:
			'Ce que ces systèmes font d’imprévu doit être rendu public, comme pour l’aviation ou le médicament, afin que chacun puisse en tirer les leçons.'
	}
]
