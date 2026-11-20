/**
 * Formulaire de la page Contact : envoie le message à l'adresse de la
 * catégorie choisie (`$lib/server/contact.ts`), avec l'adresse de la personne
 * en « Répondre à ». Rien n'est conservé : pas de base, pas de journal du
 * contenu (seulement la catégorie, pour savoir que ça fonctionne).
 */
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { isMailConfigured, sendMail } from '$lib/server/mailer'
import { courriel, valider, type Demande } from '$lib/server/contact'

export const POST: RequestHandler = async ({ request }) => {
	let data: Demande
	try {
		data = (await request.json()) as Demande
	} catch {
		return json({ error: 'Requête invalide' }, { status: 400 })
	}

	// Robot : on fait semblant d'accepter, sans rien envoyer.
	if (data.website) return json({ success: true })

	const d = valider(data)
	if ('erreur' in d) return json({ error: d.erreur }, { status: 400 })

	if (!isMailConfigured()) {
		console.error('[contact] SMTP non configuré')
		return json(
			{ error: 'L’envoi est indisponible pour le moment. Écrivez-nous à contact@pauseia.fr.' },
			{ status: 503 }
		)
	}
	try {
		await sendMail(courriel(d))
	} catch (e) {
		console.error('[contact] envoi impossible', d.cle, e instanceof Error ? e.message : e)
		return json(
			{ error: 'L’envoi a échoué. Réessayez, ou écrivez-nous à contact@pauseia.fr.' },
			{ status: 502 }
		)
	}
	console.log('[contact] message envoyé', d.cle)
	return json({ success: true })
}
