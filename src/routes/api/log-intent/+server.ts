import { json, type RequestHandler } from '@sveltejs/kit'

import { env as privateEnv } from '$env/dynamic/private'

// Journalise une *intention* d'envoi depuis la page « Écrire à mes élus ».
//
// IMPORTANT : ceci ne prouve PAS qu'un email a été envoyé. Le lien `mailto:`
// ouvre le client mail de l'utilisateur et le site n'a aucun retour sur l'envoi
// réel. On enregistre donc seulement le clic « Ouvrir mon email » comme une
// intention (un minorant haut de la mobilisation). Le compteur *fiable* des
// envois réels reste la copie cachée (BCC) reçue à campagne@pauseia.fr.
//
// Aucune donnée personnelle n'est transmise : ni le nom, ni l'email, ni le
// contenu rédigé par l'utilisateur. On ne logue que l'élu visé et les réglages
// du message (angle, longueur), à des fins d'agrégat.

interface IntentRequest {
	eluId?: string
	eluNom?: string
	role?: string
	departement?: string
	circo?: number | null
	angle?: string
	version?: string
}

interface Api4Result<T = Record<string, unknown>> {
	values?: T[]
	error_message?: string
}

async function callApi4<T = Record<string, unknown>>(
	entity: string,
	action: string,
	params: Record<string, unknown> = {}
): Promise<Api4Result<T>> {
	const base = (privateEnv.CIVICRM_BASE_URL || '').replace(/\/+$/, '')
	const apiKey = privateEnv.CIVICRM_API_KEY || ''
	const siteKey = (privateEnv.CIVICRM_SITE_KEY || '').trim()
	if (!base || !apiKey || !siteKey) throw new Error('Missing required CiviCRM configuration')

	const url = `${base}/civicrm/ajax/api4/${encodeURIComponent(entity)}/${encodeURIComponent(action)}`
	const headers: Record<string, string> = {
		'X-Requested-With': 'XMLHttpRequest',
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
		'X-Civi-Auth': `Bearer ${apiKey}`,
		'X-Civi-Key': siteKey,
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	const body = new URLSearchParams({ params: JSON.stringify(params) }).toString()

	const response = await fetch(url, { method: 'POST', headers, body })
	if (!response.ok) throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`)
	const data = (await response.json()) as Api4Result<T>
	if (data.error_message) throw new Error(data.error_message)
	return data
}

export const POST: RequestHandler = async ({ request }) => {
	let data: IntentRequest
	try {
		data = (await request.json()) as IntentRequest
	} catch {
		return json({ ok: false }, { status: 400 })
	}

	// Type d'activité « Intention d'écrire à un élu » (CiviCRM, ID 76 par défaut).
	// Surchargé par CIVICRM_ELU_INTENT_ACTIVITY_ID si défini.
	const activityTypeId = Number(privateEnv.CIVICRM_ELU_INTENT_ACTIVITY_ID || 76)
	const apiContactId = Number(privateEnv.CIVICRM_NEWSLETTER_API_CONTACT_ID)

	// Journalisation best-effort : si CiviCRM n'est pas configuré pour cela, on
	// répond simplement ok:false sans jamais bloquer l'utilisateur.
	if (!Number.isFinite(activityTypeId) || !Number.isFinite(apiContactId)) {
		return json({ ok: false, logged: false })
	}

	const cible = [data.eluNom, data.role, data.departement && `dépt ${data.departement}`]
		.filter(Boolean)
		.join(' · ')
	const reglages = [
		data.angle && `angle: ${data.angle}`,
		data.version && `version: ${data.version}`
	]
		.filter(Boolean)
		.join(' · ')

	try {
		await callApi4('Activity', 'create', {
			checkPermissions: false,
			values: {
				activity_type_id: activityTypeId,
				subject: `Intention d'écrire à un élu${cible ? ` : ${cible}` : ''}`,
				details: reglages,
				source_contact_id: apiContactId,
				'status_id:name': 'Completed'
			}
		})
		return json({ ok: true, logged: true })
	} catch (err) {
		console.warn('[log-intent] failed (non-fatal):', err)
		return json({ ok: false, logged: false })
	}
}
