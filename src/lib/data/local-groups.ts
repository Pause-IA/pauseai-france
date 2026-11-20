// Source unique des groupes locaux Pause IA.
// Utilisé par la carte (LocalGroupsMap.svelte) ET par la page groupes-locaux
// (liste des villes + compteurs), pour éviter que les chiffres divergent.

export interface LocalGroup {
	name: string
	lat: number
	lon: number
	/** true = groupe en cours de création (pas encore actif). */
	forming?: boolean
	/**
	 * true = groupe en sommeil, qui attend quelqu’un pour le relancer.
	 * Distinct de `forming` : ces groupes ont existé et peuvent repartir, donc
	 * les afficher a du sens, mais les compter comme actifs serait faux.
	 * Plus aucun groupe n’est dans cet état ; le champ reste pour le jour où.
	 */
	inactif?: boolean
	/**
	 * Adresse de contact du groupe, de la forme ville@pauseia.fr.
	 *
	 * Ce sont des groupes Google : le message part aux référents du groupe
	 * local. Les groupes en création n’ont pas encore de référent, leur
	 * adresse fonctionne quand même et arrive à l’équipe nationale — c’est
	 * justement par là qu’on en trouve un.
	 *
	 * Aucune adresse personnelle de référent ne doit apparaître sur le site.
	 */
	email: string
}

export const localGroups: LocalGroup[] = [
	{ name: 'Angers', lat: 47.47, lon: -0.55, forming: true, email: 'angers@pauseia.fr' },
	{ name: 'Bordeaux', lat: 44.84, lon: -0.58, email: 'bordeaux@pauseia.fr' },
	{
		name: 'Clermont-Ferrand',
		lat: 45.78,
		lon: 3.08,
		email: 'clermont-ferrand@pauseia.fr'
	},
	{ name: 'Dijon', lat: 47.32, lon: 5.04, email: 'dijon@pauseia.fr' },
	{ name: 'Dordogne', lat: 45.18, lon: 0.72, email: 'dordogne@pauseia.fr' },
	{ name: 'Grenoble', lat: 45.19, lon: 5.72, email: 'grenoble@pauseia.fr' },
	{ name: 'Lille', lat: 50.63, lon: 3.06, email: 'lille@pauseia.fr' },
	{ name: 'Limoges', lat: 45.83, lon: 1.26, email: 'limoges@pauseia.fr' },
	{ name: 'Lyon', lat: 45.76, lon: 4.84, forming: true, email: 'lyon@pauseia.fr' },
	{ name: 'Marseille', lat: 43.3, lon: 5.37, forming: true, email: 'marseille@pauseia.fr' },
	{ name: 'Montpellier', lat: 43.61, lon: 3.88, email: 'montpellier@pauseia.fr' },
	{ name: 'Nantes', lat: 47.22, lon: -1.55, forming: true, email: 'nantes@pauseia.fr' },
	{ name: 'Paris', lat: 48.86, lon: 2.35, email: 'paris@pauseia.fr' },
	{ name: 'Poitiers', lat: 46.58, lon: 0.34, forming: true, email: 'poitiers@pauseia.fr' },
	{ name: 'Strasbourg', lat: 48.58, lon: 7.75, email: 'strasbourg@pauseia.fr' },
	{ name: 'Toulouse', lat: 43.6, lon: 1.44, email: 'toulouse@pauseia.fr' }
]

export const activeGroupsCount = localGroups.filter((g) => !g.forming && !g.inactif).length
export const formingGroupsCount = localGroups.filter((g) => g.forming).length
export const inactifGroupsCount = localGroups.filter((g) => g.inactif).length

/**
 * Lancement des groupes locaux Pause IA (mars 2026).
 * Source unique : la page groupes-locaux s’en sert pour afficher « tout cela
 * en N mois », donc le compteur ne peut pas se désynchroniser de la date.
 */
export const LANCEMENT_GROUPES = { annee: 2026, mois: 3 } as const

/** Nombre de mois révolus depuis le lancement, à la date donnée. */
export function moisDepuisLancement(maintenant: Date = new Date()): number {
	const mois =
		(maintenant.getFullYear() - LANCEMENT_GROUPES.annee) * 12 +
		(maintenant.getMonth() + 1 - LANCEMENT_GROUPES.mois)
	return Math.max(0, mois)
}
