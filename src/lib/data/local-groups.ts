// Source unique des groupes locaux Pause IA.
// Utilisé par la carte (LocalGroupsMap.svelte) ET par la page groupes-locaux
// (liste des villes + compteurs), pour éviter que les chiffres divergent.
//
// Le contenu ne vit plus ici : il vient de la table Notion « Groupes locaux »,
// relue à chaque déploiement par scripts/groupes-locaux-notion.mjs, qui écrit
// l'instantané local-groups.json. Ce fichier-ci garde le type, les compteurs
// et les coordonnées, qui ne sont pas l'affaire de Notion.
//
// Si Notion ne répond pas, l'instantané versionné reste en ligne : le site ne
// dépend pas de Notion pour s'afficher.

import instantane from './local-groups.json'

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
	 * local.
	 *
	 * Facultatif, et absent pour les groupes en création : ils n’ont pas
	 * encore de référent, donc personne pour répondre. Publier une adresse
	 * sans destinataire, c’est laisser un message sans réponse — ces villes
	 * sont sur la carte mais renvoient vers le formulaire d’inscription.
	 * Une adresse n’est ajoutée ici que lorsqu’elle est dans la table Notion.
	 *
	 * Aucune adresse personnelle de référent ne doit apparaître sur le site.
	 */
	email?: string
}

export const localGroups: LocalGroup[] = instantane.groupes

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
