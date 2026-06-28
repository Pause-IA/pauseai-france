// Source unique des groupes locaux Pause IA.
// Utilisé par la carte (LocalGroupsMap.svelte) ET par la page groupes-locaux
// (liste des villes + compteurs), pour éviter que les chiffres divergent.

export interface LocalGroup {
	name: string
	lat: number
	lon: number
	/** true = groupe en cours de création (pas encore actif). */
	forming?: boolean
}

export const localGroups: LocalGroup[] = [
	{ name: 'Paris', lat: 48.86, lon: 2.35 },
	{ name: 'Lyon', lat: 45.76, lon: 4.84 },
	{ name: 'Toulouse', lat: 43.6, lon: 1.44 },
	{ name: 'Bordeaux', lat: 44.84, lon: -0.58 },
	{ name: 'Colmar', lat: 48.08, lon: 7.36 },
	{ name: 'Poitiers', lat: 46.58, lon: 0.34 },
	{ name: 'Dordogne', lat: 45.18, lon: 0.72 },
	{ name: 'Strasbourg', lat: 48.57, lon: 7.75 },
	{ name: 'Grenoble', lat: 45.19, lon: 5.72 },
	{ name: 'Lille', lat: 50.63, lon: 3.06, forming: true },
	{ name: 'Genève', lat: 46.2, lon: 6.14 }
]

export const activeGroupsCount = localGroups.filter((g) => !g.forming).length
export const formingGroupsCount = localGroups.filter((g) => g.forming).length
