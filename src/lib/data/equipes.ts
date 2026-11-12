/**
 * Les équipes de Pause IA, pour la page « Qui sommes-nous ».
 *
 * Une ligne par équipe, et une seule. La version précédente donnait pour
 * chacune ce qu’elle cherche à obtenir PUIS un exemple de tâche : sept fois
 * trois lignes, soit un mur de texte que personne ne lit en entier. Le but
 * n’est pas de documenter l’organisation (le salon « Contribuer » du Discord
 * le fait, et les référents le tiennent à jour), mais qu’un visiteur voie en
 * vingt secondes de quoi l’association est faite et où il pourrait servir.
 *
 * Chaque phrase nomme donc des choses concrètes plutôt que des intentions :
 * c’est ce qui permet de comprendre sans développer.
 *
 * Le référent n’est nommé que si la personne a donné son nom POUR le site. Le
 * Discord est un espace interne : y figurer comme référent n’équivaut pas à
 * consentir à apparaître sur une page publique. D’où le champ optionnel : une
 * équipe sans référent nommé n’affiche rien, plutôt qu’un prénom publié sans
 * qu’on ait demandé.
 *
 * La liste des postes ouverts n’y figure pas non plus : elle se périme sans
 * que personne s’en aperçoive et donne à la page un air d’offre d’emploi.
 */
export interface Equipe {
	nom: string
	/** Le nom de l'équipe en anglais. */
	nomEn: string
	/** Une phrase courte, qui nomme des choses concrètes. */
	description: string
	/** La même phrase en anglais. */
	descriptionEn: string
	/**
	 * Prénom et nom du référent, uniquement s’il les a donnés pour le site.
	 * Laisser vide tant que la personne n’a pas répondu : l’absence se lit,
	 * un nom publié sans accord ne se rattrape pas.
	 */
	referent?: string
}

export const equipes: Equipe[] = [
	{
		nom: 'Communication',
		nomEn: 'Communications',
		description:
			'Fait exister le sujet dans le débat public : communiqués, réseaux sociaux, vidéo, newsletter.',
		descriptionEn:
			'Keeps the subject alive in public debate: press releases, social media, video, newsletter.'
	},
	{
		nom: 'Plaidoyer',
		nomEn: 'Advocacy',
		description: 'Porte nos demandes au Parlement, dans les ministères et les institutions.',
		descriptionEn: 'Carries our demands to Parliament, to ministries and to public institutions.',
		referent: 'Hedi Meziou'
	},
	{
		nom: 'Initiatives locales',
		nomEn: 'Local initiatives',
		description: 'Fait vivre Pause IA partout en France, aux côtés des groupes locaux.',
		descriptionEn: 'Keeps Pause IA alive across France, alongside the local groups.',
		referent: 'Antonin Peronnet'
	},
	{
		nom: 'Événements et mobilisations',
		nomEn: 'Events and mobilisation',
		description: 'Monte les colloques, forums et mobilisations qui nous rendent visibles.',
		descriptionEn: 'Puts together the conferences, forums and marches that make us visible.'
	},
	{
		nom: 'Communauté et accueil',
		nomEn: 'Community and welcome',
		description: 'Accueille les nouveaux venus et anime la vie interne de l’association.',
		descriptionEn: 'Welcomes newcomers and keeps the life of the association going from within.'
	},
	{
		nom: 'Technique',
		nomEn: 'Engineering',
		description: 'Tient le site, le Discord et les outils sur lesquels tout le reste repose.',
		descriptionEn: 'Runs the website, the Discord and the tools everything else rests on.'
	},
	{
		nom: 'Financement et partenariats',
		nomEn: 'Funding and partnerships',
		description: 'Cherche les financements et les partenariats qui nous donnent les moyens d’agir.',
		descriptionEn: 'Seeks the funding and the partnerships that give us the means to act.'
	}
]
