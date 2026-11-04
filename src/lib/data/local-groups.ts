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
	 * true = groupe en sommeil, qui attend quelqu'un pour le relancer.
	 * Distinct de `forming` : ces groupes ont existé et peuvent repartir, donc
	 * les afficher a du sens, mais les compter comme actifs serait faux.
	 */
	inactif?: boolean
}

export const localGroups: LocalGroup[] = [
	{ name: 'Angers', lat: 47.47, lon: -0.55 },
	{ name: 'Bordeaux', lat: 44.84, lon: -0.58 },
	{ name: 'Clermont-Ferrand', lat: 45.78, lon: 3.08 },
	{ name: 'Colmar', lat: 48.08, lon: 7.36, inactif: true },
	{ name: 'Dijon', lat: 47.32, lon: 5.04 },
	{ name: 'Dordogne', lat: 45.18, lon: 0.72 },
	{ name: 'Grenoble', lat: 45.19, lon: 5.72 },
	{ name: 'Lille', lat: 50.63, lon: 3.06 },
	{ name: 'Lyon', lat: 45.76, lon: 4.84 },
	{ name: 'Marseille', lat: 43.3, lon: 5.37, forming: true },
	{ name: 'Melun', lat: 48.54, lon: 2.66, inactif: true },
	{ name: 'Montpellier', lat: 43.61, lon: 3.88 },
	{ name: 'Nantes', lat: 47.22, lon: -1.55 },
	{ name: 'Paris', lat: 48.86, lon: 2.35 },
	{ name: 'Poitiers', lat: 46.58, lon: 0.34 },
	{ name: 'Toulouse', lat: 43.6, lon: 1.44 }
]

export const activeGroupsCount = localGroups.filter((g) => !g.forming && !g.inactif).length
export const formingGroupsCount = localGroups.filter((g) => g.forming).length
export const inactifGroupsCount = localGroups.filter((g) => g.inactif).length

/**
 * Lancement des groupes locaux Pause IA (mars 2026).
 * Source unique : la page groupes-locaux s'en sert pour afficher « tout cela
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
