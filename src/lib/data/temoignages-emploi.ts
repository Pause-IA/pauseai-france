// Métadonnées des témoignages illustrés du diaporama /emploi-ia.
// Elles servent à générer un texte réel (nom, métier) et un attribut `alt`
// riche (la citation) : sans cela, le contenu des cartes serait invisible
// pour les moteurs de recherche et les lecteurs d’écran.
//
// La clé `file` correspond au nom du fichier image dans
// src/assets/emploi-ia/temoignages/. Si vous ajoutez/retirez un visuel,
// mettez cette liste à jour en conséquence.

export interface TemoignageEmploi {
	file: string
	name: string
	age: string
	role: string
	quote: string
}

export const temoignagesEmploi: TemoignageEmploi[] = [
	{
		file: '01.webp',
		name: 'Ludovic',
		age: '22',
		role: 'Ancien étudiant en informatique',
		quote:
			"Face au constat que je ne trouverais sans doute aucun travail dans ce domaine, j’ai arrêté mes études en informatique, à contrecœur."
	},
	{
		file: '02.webp',
		name: 'Antonin',
		age: '35',
		role: 'Enseignant contractuel',
		quote: "Je sais que d’ici quelques années l’IA fera le travail de prof mieux que moi."
	},
	{
		file: '03.webp',
		name: 'Aurélia',
		age: '54',
		role: "Professeur d’anglais",
		quote:
			"J’utilise l’IA au quotidien pour mes cours mais mes étudiants aussi pour générer leurs devoirs. Et donc certains n’apprennent pas. Ou plus."
	},
	{
		file: '04.webp',
		name: 'Manuel',
		age: '43',
		role: 'Motion designer, directeur artistique',
		quote:
			"Les plateformes sont saturées de contenus IA, et les gens s’extasient sur des morceaux générés sans le savoir. L’IA enlève tout son sens à la création humaine."
	},
	{
		file: '05.webp',
		name: 'Florent',
		age: '34',
		role: 'Ingénieur calcul structures',
		quote:
			"Je crains qu’il y ait des freins à l’embauche, notamment pour les jeunes. Et je suis presque persuadé qu’un jour mon travail, aussi complexe soit-il, pourra être exécuté par une IA."
	},
	{
		file: '06.webp',
		name: 'Bertrande',
		age: '30',
		role: 'Anthropologue',
		quote:
			"Nous devons totalement repenser notre manière d’enseigner et surtout d’évaluer. L’IA reconfigure entièrement le rapport au savoir et son évaluation, et j’ai l’impression que le corps enseignant n’en prend pas du tout la mesure."
	},
	{
		file: '07.webp',
		name: 'Tanya',
		age: '55',
		role: 'Éditrice',
		quote: "Le déploiement de l’IA dans mon entreprise va faire disparaître un service entier."
	},
	{
		file: '08.webp',
		name: 'Giovanna',
		age: '72',
		role: 'Traductrice juridique',
		quote:
			'Du jour au lendemain, une expertise acquise pendant 40 ans est devenue quantité négligeable, voire risible.'
	},
	{
		file: '09.webp',
		name: 'Laura',
		age: '30',
		role: 'Musicienne',
		quote:
			"Quatre instrumentistes professionnels ont failli, sans le savoir, n’être que des pantins exécutant des compositions 100 % générées par l’IA."
	},
	{
		file: '10.webp',
		name: 'Marie',
		age: '40',
		role: 'Enseignante en philosophie',
		quote:
			"Dans un monde où tant de sources seront remplacées par l’IA, qui ose encore s’arrêter, réfléchir, vérifier ?"
	},
	{
		file: '11.webp',
		name: 'Christine',
		age: '40',
		role: 'Traductrice audiovisuel',
		quote:
			"J’ai encore quelques contrats, mais j’ai connu pour la première fois trois mois sans aucun travail rémunéré. Cela a mis en péril une partie de mes projets de vie : aujourd’hui, je vis au jour le jour."
	},
	{
		file: '12.webp',
		name: 'Emi',
		age: '42',
		role: 'Responsable de service IT',
		quote:
			"Côté développement, on génère déjà du code avec l’IA en gagnant un temps considérable. Notre manager veut anticiper des coupes budgétaires en déployant des agents IA."
	},
	{
		file: '13.webp',
		name: 'Jessica',
		age: '39',
		role: 'Artiste 3D',
		quote:
			"L’idée qu’un nouveau modèle puisse rendre obsolètes des années d’expertise en un claquement de doigts pèse en permanence sur le moral."
	},
	{
		file: '14.webp',
		name: 'Vincent',
		age: '33',
		role: 'Post-doctorant en mathématiques',
		quote:
			"Bientôt nous aurons des modèles qui feront de vraies et bonnes mathématiques mieux que nous. J’ai du mal à croire que, moins de deux ans après, ça ait encore du sens pour les humains d’en faire."
	},
	{
		file: '15.webp',
		name: 'Nathan',
		age: '19',
		role: 'Étudiant en médecine',
		quote:
			"Mon but n’était pas de devenir assistant d’IA, or j’ai l’impression de me diriger vers ça."
	},
	{
		file: '16.webp',
		name: 'Julien',
		age: '43',
		role: 'Ingénieur informaticien',
		quote:
			"Je suis devenu un coordinateur d’IA qui lui donne du travail et vérifie la qualité. Mais peut-être que mon rôle ne sera bientôt plus utile… je réfléchis à une reconversion."
	},
	{
		file: '17.webp',
		name: 'Florent',
		age: '35',
		role: 'Ingénieur',
		quote:
			"Plusieurs directeurs veulent que je cible les activités que je pourrais remplacer par de l’IA."
	},
	{
		file: '18.webp',
		name: 'Aurélie',
		age: '36',
		role: 'Professeure de dessin',
		quote:
			'Je me rends compte des changements chez les enfants : de moins en moins enclins à réfléchir seuls, à imaginer, à chercher une idée en discutant avec moi.'
	},
	{
		file: '19.webp',
		name: 'Aurélie',
		age: '36',
		role: 'Marketing / chargé de communication',
		quote:
			"Ma question est aujourd’hui fondamentale : quelle place reste-t-il pour l’expert métier, quand sa mission principale devient de déléguer définitivement sa valeur ajoutée à une machine ?"
	}
]
