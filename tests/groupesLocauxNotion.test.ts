import { describe, it, expect } from 'vitest'
import {
	construire,
	enCreation,
	enSommeil,
	valeur,
	propriete
} from '../scripts/groupes-locaux-notion.mjs'

/* La règle « une ville en création n'a pas d'adresse » est désormais appliquée
   à l'import, puisque la source est Notion et non plus le dépôt. C'est donc
   l'import qu'il faut tester : le test sur les données versionnées
   (groupesLocaux.test.ts) ne verrait le problème qu'après coup, une fois
   l'instantané déjà écrit.

   Aucun appel réseau ici : on fabrique des fiches Notion à la main. */

const COORDS: Record<string, [number, number]> = {
	Paris: [48.86, 2.35],
	Nantes: [47.22, -1.55],
	Lille: [50.63, 3.06]
}

function fiche(ville: string, statut: string, email?: string) {
	return {
		properties: {
			Ville: { title: [{ plain_text: ville }] },
			Statut: { select: { name: statut } },
			...(email === undefined ? {} : { 'Adresse mail': { email } })
		}
	}
}

describe('import des groupes locaux depuis Notion', () => {
	it('publie l’adresse d’un groupe actif', () => {
		const { groupes } = construire([fiche('Paris', 'Actif', 'paris@pauseia.fr')], COORDS)
		expect(groupes).toEqual([{ name: 'Paris', lat: 48.86, lon: 2.35, email: 'paris@pauseia.fr' }])
	})

	it('n’publie PAS l’adresse d’un groupe en création, même si Notion en contient une', () => {
		const { groupes, alertes } = construire(
			[fiche('Nantes', 'En création', 'nantes@pauseia.fr')],
			COORDS
		)
		expect(groupes[0]).toEqual({ name: 'Nantes', lat: 47.22, lon: -1.55, forming: true })
		expect(groupes[0].email).toBeUndefined()
		expect(alertes.join(' ')).toContain('Nantes')
	})

	it('écarte une adresse personnelle de référent', () => {
		const { groupes, alertes } = construire(
			[fiche('Lille', 'Actif', 'marie.durand@gmail.com')],
			COORDS
		)
		expect(groupes[0].email).toBeUndefined()
		expect(alertes.join(' ')).toContain('Lille')
	})

	it('ne met jamais l’adresse écartée dans le message d’alerte', () => {
		const { alertes } = construire([fiche('Lille', 'Actif', 'marie.durand@gmail.com')], COORDS)
		expect(alertes.join(' ')).not.toContain('marie.durand')
	})

	it('signale une ville sans coordonnées plutôt que de l’afficher au large', () => {
		const { groupes, alertes } = construire([fiche('Brest', 'Actif', 'brest@pauseia.fr')], COORDS)
		expect(groupes).toHaveLength(0)
		expect(alertes.join(' ')).toContain('Brest')
	})

	it('traite un statut inconnu comme « en création », pas comme actif', () => {
		const { groupes } = construire([fiche('Paris', 'À confirmer', 'paris@pauseia.fr')], COORDS)
		expect(groupes[0].forming).toBe(true)
		expect(groupes[0].email).toBeUndefined()
	})

	it('classe les villes par ordre alphabétique', () => {
		const { groupes } = construire(
			[fiche('Paris', 'Actif'), fiche('Lille', 'Actif'), fiche('Nantes', 'Actif')],
			COORDS
		)
		expect(groupes.map((g: { name: string }) => g.name)).toEqual(['Lille', 'Nantes', 'Paris'])
	})

	it('ignore une ville en double', () => {
		const { groupes, alertes } = construire(
			[fiche('Paris', 'Actif'), fiche('Paris', 'Actif')],
			COORDS
		)
		expect(groupes).toHaveLength(1)
		expect(alertes.join(' ')).toContain('deux fois')
	})

	it('ignore une fiche sans nom de ville', () => {
		expect(construire([fiche('', 'Actif', 'x@pauseia.fr')], COORDS).groupes).toHaveLength(0)
	})

	it('retrouve les colonnes quels que soient accents, casse et ponctuation', () => {
		const brut = {
			properties: {
				'  VILLE  ': { rich_text: [{ plain_text: 'Paris' }] },
				État: { status: { name: 'actif' } },
				Courriel: { email: 'paris@pauseia.fr' }
			}
		}
		expect(construire([brut], COORDS).groupes[0]).toEqual({
			name: 'Paris',
			lat: 48.86,
			lon: 2.35,
			email: 'paris@pauseia.fr'
		})
	})

	it('marque un groupe en sommeil sans le compter en création', () => {
		const { groupes } = construire([fiche('Paris', 'En sommeil')], COORDS)
		expect(groupes[0].inactif).toBe(true)
		expect(groupes[0].forming).toBeUndefined()
	})
})

describe('lecture des statuts', () => {
	it.each(['Actif', 'actif', 'Active', 'Lancé', 'Ouvert'])('« %s » est actif', (s) => {
		expect(enCreation(s)).toBe(false)
	})

	it.each(['En création', 'en creation', 'Création', 'En cours', 'Démarrage', ''])(
		'« %s » est en création',
		(s) => {
			expect(enCreation(s)).toBe(true)
		}
	)

	it.each(['En sommeil', 'Inactif', 'Suspendu'])('« %s » est en sommeil', (s) => {
		expect(enSommeil(s)).toBe(true)
	})
})

describe('lecture des propriétés Notion', () => {
	it('lit un titre, un texte, un choix, un statut et un courriel', () => {
		expect(valeur({ title: [{ plain_text: 'A' }, { plain_text: 'B' }] })).toBe('AB')
		expect(valeur({ rich_text: [{ plain_text: 'Texte' }] })).toBe('Texte')
		expect(valeur({ select: { name: 'Actif' } })).toBe('Actif')
		expect(valeur({ status: { name: 'Actif' } })).toBe('Actif')
		expect(valeur({ email: 'a@pauseia.fr' })).toBe('a@pauseia.fr')
		expect(valeur(undefined)).toBe('')
	})

	it('trouve une colonne par l’un de ses noms possibles', () => {
		const props = { 'Adresse e-mail': { email: 'a@pauseia.fr' } }
		expect(valeur(propriete(props, ['email', 'adresseemail']))).toBe('a@pauseia.fr')
		expect(propriete(props, ['ville'])).toBeUndefined()
	})

	// Le trait d'union de « Adresse e-mail » donne « adresseemail » une fois
	// normalisé, pas « adressemail » : la liste de candidats du script doit
	// contenir les deux. L'oubli avait été attrapé par ce test.
	it('reconnaît « Adresse e-mail » de bout en bout', () => {
		const brut = {
			properties: {
				Ville: { title: [{ plain_text: 'Paris' }] },
				Statut: { select: { name: 'Actif' } },
				'Adresse e-mail': { email: 'paris@pauseia.fr' }
			}
		}
		expect(construire([brut], COORDS).groupes[0].email).toBe('paris@pauseia.fr')
	})
})
