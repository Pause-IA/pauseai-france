import { env as privateEnv } from '$env/dynamic/private'

// Accès CiviCRM (API4) partagé par la signature et la confirmation de la
// déclaration PauseAI.

export const WEBSITE_SIGNUP_ACTIVITY_ID = 75

export interface Api4Result<T = Record<string, unknown>> {
	count?: number
	countMatched?: number
	values?: T[]
	error_message?: string
}

export async function callApi4<T = Record<string, unknown>>(
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

// Groupes CiviCRM (gid 73 et 74 sur civicrm.pauseia.fr), surchargeables par
// variable d'environnement.
const DEFAULT_GROUPS: Record<string, number> = {
	CIVICRM_DECLARATION_GROUP_ID: 73,
	CIVICRM_DECLARATION_PUBLIC_GROUP_ID: 74
}

function groupId(name: string): number {
	const id = Number(privateEnv[name] || DEFAULT_GROUPS[name])
	if (!Number.isFinite(id) || id <= 0) throw new Error(`Missing ${name}`)
	return id
}

/** Tous les signataires confirmés (statut Added) ; « Pending » en attente de l'e-mail. */
export const signatoriesGroup = () => groupId('CIVICRM_DECLARATION_GROUP_ID')
/** Signataires confirmés qui acceptent d'être affichés. */
export const publicGroup = () => groupId('CIVICRM_DECLARATION_PUBLIC_GROUP_ID')

/** Groupes ajoutés quand la case newsletter est cochée (Newsletter + Call to Action). */
export function newsletterGroups(): number[] {
	return [privateEnv.CIVICRM_NEWSLETTER_GROUP_ID, privateEnv.CIVICRM_CALL_TO_ACTION_GROUP_ID]
		.map(Number)
		.filter((id) => Number.isFinite(id) && id > 0)
}

/** Statuts du contact dans plusieurs groupes : { [group_id]: 'Added' | 'Pending' | 'Removed' }. */
export async function groupStatuses(
	contactId: number,
	groups: number[]
): Promise<Record<number, string>> {
	const res = await callApi4<{ group_id: number; status: string }>('GroupContact', 'get', {
		checkPermissions: false,
		select: ['group_id', 'status'],
		where: [
			['contact_id', '=', contactId],
			['group_id', 'IN', groups]
		]
	})
	return Object.fromEntries((res.values ?? []).map((v) => [Number(v.group_id), v.status]))
}

/** Statut du contact dans un groupe (Added, Pending, Removed), ou null. */
export async function groupStatus(contactId: number, group: number): Promise<string | null> {
	return (await groupStatuses(contactId, [group]))[group] ?? null
}

export async function setGroups(contactId: number, groups: number[], status: 'Added' | 'Pending') {
	if (!groups.length) return
	await callApi4('GroupContact', 'save', {
		checkPermissions: false,
		match: ['contact_id', 'group_id'],
		records: groups.map((group_id) => ({ contact_id: contactId, group_id, status }))
	})
}

function activityValues(
	contactId: number,
	subject: string,
	details?: string,
	status = 'Completed'
) {
	return {
		activity_type_id: WEBSITE_SIGNUP_ACTIVITY_ID,
		subject,
		details,
		source_contact_id: Number(privateEnv.CIVICRM_NEWSLETTER_API_CONTACT_ID || ''),
		target_contact_id: [contactId],
		'status_id:name': status
	}
}

/** Journalise une activité sur le contact (non bloquant). */
export async function logActivity(
	contactId: number,
	subject: string,
	details?: string
): Promise<void> {
	try {
		await callApi4('Activity', 'create', {
			checkPermissions: false,
			values: activityValues(contactId, subject, details)
		})
	} catch (e) {
		console.warn('[declaration] journalisation de l’activité impossible (ignoré) :', e)
	}
}

// Commentaire du signataire (« pourquoi c'est important pour moi »), stocké
// dans une activité : « Scheduled » tant que l'adresse n'est pas confirmée,
// « Completed » ensuite. Seuls les commentaires confirmés des signataires
// affichés publiquement apparaissent sur la page. Modération : modifier ou
// supprimer l'activité dans CiviCRM.
export const COMMENT_SUBJECT = 'Déclaration PauseAI : commentaire'

/** Enregistre un commentaire en attente de confirmation ; renvoie l'ID de l'activité. */
export async function createPendingComment(contactId: number, comment: string): Promise<number> {
	const res = await callApi4<{ id: number }>('Activity', 'create', {
		checkPermissions: false,
		values: activityValues(contactId, COMMENT_SUBJECT, comment, 'Scheduled')
	})
	const id = Number(res.values?.[0]?.id)
	if (!id) throw new Error('Failed to create comment activity')
	return id
}

export async function confirmComment(activityId: number): Promise<void> {
	await callApi4('Activity', 'update', {
		checkPermissions: false,
		values: { 'status_id:name': 'Completed' },
		where: [
			['id', '=', activityId],
			['subject', '=', COMMENT_SUBJECT]
		]
	})
}

const decodeEntities = (s: string) =>
	s
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<[^>]*>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&quot;/g, '"')
		.replace(/&#0?39;|&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')

/** Dernier commentaire confirmé de chaque contact. */
export async function confirmedComments(contactIds: number[]): Promise<Map<number, string>> {
	const out = new Map<number, string>()
	if (!contactIds.length) return out
	const res = await callApi4<{ contact_id: number; 'activity_id.details'?: string | null }>(
		'ActivityContact',
		'get',
		{
			checkPermissions: false,
			select: ['contact_id', 'activity_id.details'],
			where: [
				['contact_id', 'IN', contactIds],
				['record_type_id:name', '=', 'Activity Targets'],
				['activity_id.subject', '=', COMMENT_SUBJECT],
				['activity_id.status_id:name', '=', 'Completed']
			],
			orderBy: { activity_id: 'DESC' }
		}
	)
	for (const v of res.values ?? []) {
		const id = Number(v.contact_id)
		const text = decodeEntities(v['activity_id.details'] ?? '').trim()
		if (text && !out.has(id)) out.set(id, text)
	}
	return out
}

// Horodatage d'envoi, écrit dans le détail de l'activité en UTC. On ne se fie
// pas à activity_date_time : CiviCRM l'enregistre à l'heure de Paris, et une
// comparaison avec une heure UTC décalait la fenêtre de 1 à 2 heures (un
// second essai restait bloqué, sans e-mail).
const SENT_AT = /sent_at=(\S+)/

export const sentAtDetails = (now = Date.now()) => `sent_at=${new Date(now).toISOString()}`

/**
 * Temps restant (ms) avant de pouvoir renvoyer un e-mail de ce sujet au contact,
 * ou 0 si l'envoi est possible.
 */
export async function resendWaitMs(
	contactId: number,
	subject: string,
	delayMs: number,
	now?: number
): Promise<number> {
	const res = await callApi4<{ 'activity_id.details'?: string | null }>('ActivityContact', 'get', {
		checkPermissions: false,
		select: ['activity_id.details'],
		where: [
			['contact_id', '=', contactId],
			['record_type_id:name', '=', 'Activity Targets'],
			['activity_id.subject', '=', subject]
		],
		orderBy: { activity_id: 'DESC' },
		limit: 1
	})
	const m = SENT_AT.exec(res.values?.[0]?.['activity_id.details'] ?? '')
	const sentAt = m ? Date.parse(m[1]) : NaN
	if (Number.isNaN(sentAt)) return 0
	// Heure lue après la réponse de CiviCRM, pas avant l'appel.
	return Math.max(0, sentAt + delayMs - (now ?? Date.now()))
}
