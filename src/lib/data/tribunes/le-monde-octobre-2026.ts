/**
 * Signataires de la tribune publiée dans Le Monde en octobre 2026 (page
 * /fr/tribunes/le-monde-octobre-2026, aussi accessible sans /fr). Une
 * prochaine tribune : nouveau fichier dans ce dossier et nouvelle page sous
 * src/routes/[lang=lang]/tribunes/.
 *
 * La page n'affiche que cette liste, dans l'ordre ci-dessous. Tant qu'elle est
 * vide, la page indique que la liste est en cours de finalisation.
 *
 * Exemple :
 *   { nom: 'Prénom Nom', qualite: 'chercheuse en informatique, CNRS' },
 *   { nom: 'Prénom Nom' },
 */
export interface Signataire {
	nom: string
	/** Fonction, titre ou affiliation, affichée après le nom (facultatif). */
	qualite?: string
}

/** Date d'édition de la liste (AAAA-MM-JJ), affichée en haut de la page. */
export const miseAJour = '2026-10-16'

/** Titre de la tribune, affiché sous le titre de la page s'il est renseigné. */
export const tribuneTitre = ''

export const signataires: Signataire[] = [
	{ nom: 'Scott Alexander', qualite: 'auteur du blog Astral Codex Ten' },
	{ nom: 'Ben Auer', qualite: 'chercheur en alignement de l’IA à AFFINE' },
	{ nom: 'Éloïse Benito-Rodriguez', qualite: 'chercheuse indépendante en sécurité de l’IA' },
	{
		nom: 'Marius Bertolucci',
		qualite: 'maître de conférences en sciences de gestion à Aix-Marseille Université'
	},
	{
		nom: 'Angelica Chowdhury',
		qualite:
			'chercheuse au laboratoire Machine Intelligence and Normative Theory, Center for AI Risk Management and Alignment'
	},
	{ nom: 'Jaymari Chua', qualite: 'directeur chez Deloitte' },
	{ nom: 'Léo Dana', qualite: 'doctorant en mathématiques de l’IA à l’ENS Ulm et à Inria' },
	{ nom: 'Hugo De Bosschere', qualite: 'doctorant en sécurité de l’IA' },
	{
		nom: 'Florence Dellerie',
		qualite: 'vulgarisatrice scientifique et cofondatrice du Projet Méduses'
	},
	{
		nom: 'Baptiste Detombe',
		qualite: 'essayiste et éthicien des nouvelles technologies, publié chez Albin Michel'
	},
	{ nom: 'Adrien Fabre', qualite: 'économiste et chercheur au CNRS et au CIRED' },
	{ nom: 'Jean-Lou Fourquet', qualite: 'ingénieur et coauteur de La Dictature des algorithmes' },
	{
		nom: 'Maxime Fournes',
		qualite: 'président de Pause IA France et directeur de Pause AI Global'
	},
	{ nom: 'Ayoze García González', qualite: 'journaliste et directeur de Pause AI Espagne' },
	{ nom: 'Martin Gibert', qualite: 'philosophe et chercheur en éthique' },
	{
		nom: 'Karl Glazebrook',
		qualite:
			'professeur émérite d’astrophysique à l’Université de technologie de Swinburne et membre de l’Académie australienne des sciences'
	},
	{
		nom: 'Julien Gobin',
		qualite: 'philosophe, essayiste et enseignant à l’IÉSEG School of Management'
	},
	{
		nom: 'Élie Goudout',
		qualite: 'normalien et ancien chercheur en IA de confiance chez Thales'
	},
	{
		nom: 'Arthur Grimonpont',
		qualite: 'responsable du plaidoyer au Centre pour la sécurité de l’IA (CeSIA)'
	},
	{
		nom: 'Colin de la Higuera',
		qualite: 'professeur à Nantes Université et titulaire d’une chaire UNESCO'
	},
	{ nom: 'Corentin Jorel', qualite: 'enseignant-chercheur au GREYC et à l’Université de Caen' },
	{ nom: 'Michael Kerrison', qualite: 'directeur exécutif d’AI Safety Australia & New Zealand' },
	{ nom: 'Daniel Kokotajlo', qualite: 'directeur exécutif de l’AI Futures Project' },
	{
		nom: 'Yanni Kyriacos',
		qualite:
			'fondateur de Tara (Technical Alignment Research Accelerator) et d’AI Safety Australia & New Zealand'
	},
	{
		nom: 'Gabrielle du Marais',
		qualite:
			'chercheuse postdoctorale à l’Université technique de Berlin et à l’Institut de Potsdam pour la recherche sur les impacts climatiques (PIK)'
	},
	{ nom: 'Guillaume Martres', qualite: 'directeur de Pause AI Suisse' },
	{ nom: 'Joseph Miller', qualite: 'directeur de Pause AI Royaume-Uni' },
	{ nom: 'Michael Noetel', qualite: 'professeur associé à l’Université du Queensland' },
	{
		nom: 'James Norris',
		qualite:
			'fondateur et directeur exécutif du Center for Existential Safety et de l’International AI Governance Alliance'
	},
	{ nom: 'Jérémy Perret', qualite: 'chercheur indépendant en sécurité de l’IA' },
	{ nom: 'Clémence Peyrot', qualite: 'directrice exécutive de Pause IA France' },
	{ nom: 'Abel Quentin', qualite: 'écrivain' },
	{ nom: 'Thibaud Rahier', qualite: 'chercheur en machine learning à Criteo' },
	{ nom: 'Alexandre Ramé', qualite: 'docteur et chercheur en alignement et sécurité de l’IA' },
	{ nom: 'Benjamin Schmidt', qualite: 'directeur de Pause AI Allemagne' },
	{ nom: 'Gaëtan Selle', qualite: 'réalisateur, producteur et cofondateur de The Flares' },
	{
		nom: 'Charbel-Raphaël Segerie',
		qualite: 'directeur exécutif du Centre pour la sécurité de l’IA (CeSIA)'
	},
	{ nom: 'Peter Slattery', qualite: 'chercheur au Massachusetts Institute of Technology (MIT)' },
	{ nom: 'Matteo Tacchi-Bénard', qualite: 'chargé de recherche au CNRS' },
	{ nom: 'Alex Waswa', qualite: 'directeur de Pause AI Ouganda' }
]
