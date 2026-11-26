/**
 * Page « Contact » : où part chaque message, et sa mise en forme.
 *
 * Adresses données par le cahier des charges de l'équipe onboarding. Elles ne
 * quittent jamais le serveur (voir `$lib/contact.ts`).
 */
import { LIMITES, categorie } from '$lib/contact'

export const DESTINATAIRES: Record<string, string> = {
	fresque: 'contact@pauseia.fr',
	local: 'initiatives@pauseia.fr',
	benevolat: 'benevoles@pauseia.fr',
	elu: 'plaidoyer@pauseia.fr',
	technique: 'tech@pauseia.fr',
	presse: 'presse@pauseia.fr'
}

export interface Demande {
	categorie?: unknown
	email?: unknown
	telephone?: unknown
	discord?: unknown
	message?: unknown
	/** Champ piège invisible : rempli uniquement par les robots. */
	website?: unknown
}

export interface DemandeValide {
	cle: string
	libelle: string
	destinataire: string
	email: string
	telephone: string
	discord: string
	message: string
}

const ligne = (s: unknown, max: number) =>
	typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : ''

/** Garde les retours à la ligne, pas plus de deux d'affilée. */
const texte = (s: unknown, max: number) =>
	typeof s === 'string'
		? s
				.replace(/\r\n?/g, '\n')
				.replace(/[^\S\n]+/g, ' ')
				.replace(/\n{3,}/g, '\n\n')
				.trim()
				.slice(0, max)
		: ''

/** La demande nettoyée, ou le message d'erreur à afficher. */
export function valider(d: Demande): DemandeValide | { erreur: string } {
	const cle = typeof d.categorie === 'string' ? d.categorie : ''
	const c = categorie(cle)
	const destinataire = DESTINATAIRES[cle]
	if (!c || !c.formulaire || !destinataire) return { erreur: 'Choisissez un motif de contact.' }
	const email = ligne(d.email, LIMITES.email).toLowerCase()
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
		return { erreur: 'Merci d’indiquer une adresse e-mail valide.' }
	const message = texte(d.message, LIMITES.message)
	if (message.length < 10) return { erreur: 'Merci d’écrire votre message.' }
	return {
		cle,
		libelle: c.libelle,
		destinataire,
		email,
		telephone: ligne(d.telephone, LIMITES.telephone),
		discord: ligne(d.discord, LIMITES.discord).replace(/^@+/, ''),
		message
	}
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** Le courriel envoyé à l'équipe. Répondre au courriel répond à la personne. */
export function courriel(d: DemandeValide) {
	const champs: [string, string][] = [
		['Motif', d.libelle],
		['E-mail', d.email],
		['Téléphone', d.telephone || '—'],
		['Discord', d.discord || '—']
	]
	const debut = d.message.replace(/\s+/g, ' ').slice(0, 60)
	return {
		to: d.destinataire,
		replyTo: d.email,
		subject: `[Contact site] ${debut}${d.message.length > 60 ? '…' : ''}`,
		text: `${champs.map(([k, v]) => `${k} : ${v}`).join('\n')}\n\n${d.message}\n`,
		html:
			`<table cellpadding="4">${champs
				.map(([k, v]) => `<tr><th align="left">${esc(k)}</th><td>${esc(v)}</td></tr>`)
				.join('')}</table>` + `<p style="white-space:pre-wrap">${esc(d.message)}</p>`
	}
}
