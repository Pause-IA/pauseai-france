/**
 * Député·es européen·nes élu·es en France, pour « Écrire à vos élus ».
 *
 * Depuis 2019, la France élit ses député·es européen·nes dans une seule
 * circonscription nationale : on ne peut pas retrouver « son » élu·e par le
 * code postal. L'outil propose donc de choisir un groupe politique, puis
 * d'écrire aux élu·es français·es de ce groupe.
 *
 * Données : eurodeputes.json, généré par scripts/generate-eurodeputes.mjs
 * depuis le service de données ouvertes du Parlement européen.
 */
import data from './eurodeputes.json'

export interface Eurodepute {
	id: string
	nom: string
	civ: 'M' | 'Mme' | null
	groupe: string | null
	email: string | null
	contactUrl: string
	photo: string
}

export interface GroupeEuropeen {
	/** Sigle tel que le Parlement le publie (`api:political-group`). */
	sigle: string
	fr: string
	en: string
}

/**
 * Groupes politiques du Parlement européen, de la gauche à la droite de
 * l'hémicycle. Un sigle absent de cette liste est affiché tel quel, en fin de
 * liste : un nouveau groupe n'est jamais perdu.
 */
export const GROUPES_EUROPEENS: GroupeEuropeen[] = [
	{ sigle: 'The Left', fr: 'La Gauche', en: 'The Left' },
	{ sigle: 'S&D', fr: 'Socialistes et Démocrates', en: 'Socialists and Democrats' },
	{ sigle: 'Verts/ALE', fr: 'Les Verts/ALE', en: 'Greens/EFA' },
	{ sigle: 'Renew', fr: 'Renew Europe', en: 'Renew Europe' },
	{ sigle: 'PPE', fr: 'Parti populaire européen', en: 'European People’s Party' },
	{
		sigle: 'ECR',
		fr: 'Conservateurs et réformistes européens',
		en: 'European Conservatives and Reformists'
	},
	{ sigle: 'PfE', fr: 'Patriotes pour l’Europe', en: 'Patriots for Europe' },
	{ sigle: 'ESN', fr: 'Europe des nations souveraines', en: 'Europe of Sovereign Nations' },
	{ sigle: 'NI', fr: 'Non-inscrits', en: 'Non-attached' }
]

export const eurodeputes: Eurodepute[] = (data.eurodeputes as Eurodepute[]).filter((e) => e.email)

/** Les groupes qui comptent au moins un·e élu·e français·e, dans l'ordre de l'hémicycle. */
export function groupesPresents(): (GroupeEuropeen & { nombre: number })[] {
	const compte = new Map<string, number>()
	for (const e of eurodeputes) {
		const g = e.groupe ?? 'NI'
		compte.set(g, (compte.get(g) ?? 0) + 1)
	}
	const connus = GROUPES_EUROPEENS.filter((g) => compte.has(g.sigle))
	const inconnus = [...compte.keys()]
		.filter((s) => !GROUPES_EUROPEENS.some((g) => g.sigle === s))
		.map((s) => ({ sigle: s, fr: s, en: s }))
	return [...connus, ...inconnus].map((g) => ({ ...g, nombre: compte.get(g.sigle) ?? 0 }))
}

export function eurodeputesDuGroupe(sigle: string): Eurodepute[] {
	return eurodeputes.filter((e) => (e.groupe ?? 'NI') === sigle)
}

export const eurodeputesGeneratedAt: string = data.generatedAt
