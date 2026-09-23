import { json, type RequestHandler } from '@sveltejs/kit'

import { url as siteUrl } from '$config'
import {
	callApi4,
	confirmedComments,
	createPendingComment,
	groupStatuses,
	resendWaitMs,
	sentAtDetails,
	logActivity,
	publicGroup,
	setGroups,
	signatoriesGroup
} from '$lib/server/declarationCivi'
import { confirmationEmail } from '$lib/server/declarationEmail'
import { fetchGlobalSignatories, type GlobalSignatories } from '$lib/server/declarationGlobal'
import { createToken } from '$lib/server/declarationToken'
import { isMailConfigured, sendMail } from '$lib/server/mailer'

// Déclaration PauseAI (page /fr/declaration).
//
// Les signatures sont recueillies par NOTRE formulaire, en français, et
// stockées dans NOTRE CiviCRM : la page continue de fonctionner quoi qu'il
// arrive au site de PauseAI Global.
//   - gid 73 : signataires. « Pending » tant que l'adresse n'est pas
//     confirmée, « Added » ensuite (seuls ceux-là sont comptés).
//   - gid 74 : signataires confirmés qui acceptent que leur nom soit affiché.
//     Retirer quelqu'un de ce groupe le masque de la page (modération), le
//     retirer du 73 annule sa signature.
// Le nom affiché est le prénom + nom du contact, la ligne sous le nom est son
// champ standard « Fonction » (job_title).
//
// Double opt-in : la signature envoie un e-mail (SMTP AWS SES) contenant un
// lien signé vers /[lang]/declaration/confirmer ; c'est la confirmation
// (/api/declaration/confirm) qui compte la signature, publie le nom et abonne
// à la newsletter.
//
// La liste de pauseai.info (total + noms) est affichée à côté de la nôtre :
// si elle est injoignable, on renvoie la dernière valeur connue, et la page se
// rabat sinon sur la copie figée au déploiement (/api/declaration/global.json).
export const prerender = false

const MAX_PUBLIC = 5000
const EMAIL_SENT_SUBJECT = 'Déclaration PauseAI : e-mail de confirmation envoyé'
/** Délai minimal entre deux e-mails de confirmation à la même adresse. */
const RESEND_DELAY_MS = 10 * 60 * 1000

// ── Lecture : compteur et liste publique ────────────────────────────────

export interface DeclarationSignatory {
	name: string
	title?: string
	/** Pourquoi c'est important pour la personne (commentaire confirmé). */
	comment?: string
}

export interface DeclarationStats {
	/** Signatures recueillies sur pauseia.fr (null si CiviCRM est injoignable). */
	local: {
		count: number
		/** Signataires qui acceptent d'être affichés, du plus récent au plus ancien. */
		signatories: DeclarationSignatory[]
	} | null
	/** Liste de pauseai.info (null si elle n'a pas pu être récupérée). */
	global: GlobalSignatories | null
}

// Dernière liste de Global connue, conservée tant que la fonction reste
// chaude : un incident passager chez eux ne vide pas la page. Au-delà, la page
// se rabat sur la copie figée au déploiement (/api/declaration/global.json).
let lastGlobal: GlobalSignatories | null = null

async function getGlobal(fetchFn: typeof fetch): Promise<GlobalSignatories | null> {
	try {
		lastGlobal = await fetchGlobalSignatories(fetchFn)
	} catch (e) {
		console.warn('[declaration] liste de Global indisponible (ignoré) :', e)
	}
	return lastGlobal
}

async function fetchLocalStats(): Promise<NonNullable<DeclarationStats['local']>> {
	const allGroup = signatoriesGroup()
	const pubGroup = publicGroup()

	const [all, pub] = await Promise.all([
		callApi4('GroupContact', 'get', {
			checkPermissions: false,
			select: ['row_count'],
			where: [
				['group_id', '=', allGroup],
				['status', '=', 'Added'],
				['contact_id.is_deleted', '=', false]
			]
		}),
		callApi4<{
			contact_id: number
			'contact_id.first_name'?: string | null
			'contact_id.last_name'?: string | null
			'contact_id.job_title'?: string | null
		}>('GroupContact', 'get', {
			checkPermissions: false,
			select: [
				'contact_id',
				'contact_id.first_name',
				'contact_id.last_name',
				'contact_id.job_title'
			],
			where: [
				['group_id', '=', pubGroup],
				['status', '=', 'Added'],
				['contact_id.is_deleted', '=', false]
			],
			orderBy: { id: 'DESC' },
			limit: MAX_PUBLIC
		})
	])

	const rows = pub.values ?? []
	// Les commentaires ne sont qu'un complément : leur lecture ne doit pas
	// empêcher d'afficher la liste.
	const comments = await confirmedComments(rows.map((v) => Number(v.contact_id))).catch(
		(e: unknown) => {
			console.warn('[declaration] lecture des commentaires impossible (ignoré) :', e)
			return new Map<number, string>()
		}
	)
	const signatories = rows
		.map((v) => ({
			name: [v['contact_id.first_name'], v['contact_id.last_name']]
				.filter(Boolean)
				.join(' ')
				.trim(),
			title: v['contact_id.job_title']?.trim() || undefined,
			comment: comments.get(Number(v.contact_id))
		}))
		.filter((s) => s.name)

	return { count: all.count ?? all.countMatched ?? 0, signatories }
}

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	// Les deux sources sont indépendantes : la panne de l'une n'empêche pas
	// d'afficher l'autre.
	const [local, global] = await Promise.all([
		fetchLocalStats().catch((e: unknown) => {
			console.error('[declaration] lecture CiviCRM impossible :', e)
			return null
		}),
		getGlobal(fetch)
	])

	if (local && global) setHeaders({ 'cache-control': 'public, max-age=60, s-maxage=300' })
	else setHeaders({ 'cache-control': 'no-store' })
	const body: DeclarationStats = { local, global }
	return json(body)
}

// ── Écriture : signer la déclaration ────────────────────────────────────

interface SignRequest {
	firstName?: string
	lastName?: string
	email?: string
	title?: string
	comment?: string
	showName?: boolean
	newsletter?: boolean
	lang?: string
	/** Champ piège invisible : rempli uniquement par les robots. */
	website?: string
}

const clean = (s: unknown, max: number) =>
	typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : ''

/** Comme clean, mais conserve les retours à la ligne (paragraphes du commentaire). */
const cleanText = (s: unknown, max: number) =>
	typeof s === 'string'
		? s
				.replace(/\r\n?/g, '\n')
				.replace(/[^\S\n]+/g, ' ')
				.replace(/\n{3,}/g, '\n\n')
				.trim()
				.slice(0, max)
		: ''

const COMMENT_MAX = 500

interface KnownContact {
	id: number
	first_name?: string | null
	last_name?: string | null
	job_title?: string | null
}

/**
 * Retrouve le contact par son e-mail, ou le crée (contact + e-mail en un seul
 * appel chaîné). Chaque aller-retour vers CiviCRM se voit dans le temps de
 * réponse du bouton « Je signe » : on les limite au strict nécessaire.
 */
async function findOrCreateContact(
	email: string,
	firstName: string,
	lastName: string,
	title: string
): Promise<{ contact: KnownContact; created: boolean }> {
	const found = await callApi4<{
		contact_id: number | null
		'contact_id.first_name'?: string | null
		'contact_id.last_name'?: string | null
		'contact_id.job_title'?: string | null
	}>('Email', 'get', {
		checkPermissions: false,
		select: ['contact_id', 'contact_id.first_name', 'contact_id.last_name', 'contact_id.job_title'],
		where: [
			['email', '=', email],
			['contact_id.is_deleted', '=', false]
		],
		orderBy: { is_primary: 'DESC', id: 'ASC' },
		limit: 1
	})
	const existing = found.values?.[0]
	if (existing?.contact_id) {
		return {
			contact: {
				id: Number(existing.contact_id),
				first_name: existing['contact_id.first_name'],
				last_name: existing['contact_id.last_name'],
				job_title: existing['contact_id.job_title']
			},
			created: false
		}
	}

	const created = await callApi4<{ id: number }>('Contact', 'create', {
		checkPermissions: false,
		values: {
			contact_type: 'Individual',
			first_name: firstName,
			last_name: lastName,
			job_title: title || undefined,
			source: 'pauseia.fr/declaration',
			contact_sub_type: ['Sympathisant']
		},
		chain: {
			email: [
				'Email',
				'create',
				{
					checkPermissions: false,
					values: {
						contact_id: '$id',
						email,
						is_primary: true,
						'location_type_id:label': 'Domicile'
					}
				}
			]
		}
	})
	const id = created.values?.[0]?.id
	if (!id) throw new Error('Failed to create contact')
	return { contact: { id: Number(id) }, created: true }
}

/** Complète le nom et la fonction du contact s'ils sont vides (jamais d'écrasement). */
async function completeContact(
	c: KnownContact,
	firstName: string,
	lastName: string,
	title: string
) {
	const values: Record<string, unknown> = {}
	if (!c.first_name) values.first_name = firstName
	if (!c.last_name) values.last_name = lastName
	if (title && !c.job_title) values.job_title = title
	if (!Object.keys(values).length) return
	await callApi4('Contact', 'update', {
		checkPermissions: false,
		values,
		where: [['id', '=', c.id]]
	})
}

export const POST: RequestHandler = async ({ request }) => {
	let data: SignRequest
	try {
		data = (await request.json()) as SignRequest
	} catch {
		return json({ error: 'Requête invalide' }, { status: 400 })
	}

	// Robot : on fait semblant d'accepter, sans rien enregistrer.
	if (data.website) return json({ success: true, pending: true })

	const lang = data.lang === 'en' ? 'en' : 'fr'
	const en = lang === 'en'
	const firstName = clean(data.firstName, 64)
	const lastName = clean(data.lastName, 64)
	const email = clean(data.email, 254).toLowerCase()
	const title = clean(data.title, 120)
	const comment = cleanText(data.comment, COMMENT_MAX)

	if (!firstName || !lastName) {
		return json(
			{
				error: en
					? 'Please enter your first and last name.'
					: 'Merci d’indiquer votre prénom et votre nom.'
			},
			{ status: 400 }
		)
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json(
			{ error: en ? 'Invalid email address.' : 'Adresse e-mail invalide.' },
			{ status: 400 }
		)
	}
	if (!isMailConfigured()) {
		console.error('[declaration] SMTP non configuré : impossible d’envoyer la confirmation')
		return json(
			{
				error: en
					? 'Signing is temporarily unavailable. Please try again later.'
					: 'La signature est momentanément indisponible. Merci de réessayer plus tard.'
			},
			{ status: 503 }
		)
	}

	try {
		const { contact, created } = await findOrCreateContact(email, firstName, lastName, title)

		// Appels indépendants, lancés en parallèle.
		const [, statuses, waitMs] = await Promise.all([
			created ? Promise.resolve() : completeContact(contact, firstName, lastName, title),
			created
				? Promise.resolve({} as Record<number, string>)
				: groupStatuses(contact.id, [signatoriesGroup(), publicGroup()]),
			created ? Promise.resolve(0) : resendWaitMs(contact.id, EMAIL_SENT_SUBJECT, RESEND_DELAY_MS)
		])
		const confirmed = statuses[signatoriesGroup()] === 'Added'
		const wantsPublic = Boolean(data.showName) && statuses[publicGroup()] !== 'Added'

		// Déjà signataire confirmé, et rien de nouveau à confirmer.
		if (confirmed && !wantsPublic && !data.newsletter && !comment) {
			return json({ success: true, alreadySigned: true })
		}

		// Évite qu'un formulaire soumis en boucle inonde une boîte mail.
		if (waitMs > 0) {
			if (!confirmed) await setGroups(contact.id, [signatoriesGroup()], 'Pending')
			// Dit la vérité à l'écran : aucun nouvel e-mail n'est parti.
			return json({
				success: true,
				pending: true,
				alreadySigned: confirmed,
				resent: false,
				retryInMinutes: Math.ceil(waitMs / 60000)
			})
		}

		const [, commentId] = await Promise.all([
			confirmed ? Promise.resolve() : setGroups(contact.id, [signatoriesGroup()], 'Pending'),
			// Le commentaire est un complément : son échec n'empêche pas de signer.
			comment
				? createPendingComment(contact.id, comment).catch((e: unknown) => {
						console.warn('[declaration] commentaire non enregistré (ignoré) :', e)
						return undefined
					})
				: Promise.resolve(undefined)
		])

		const token = createToken({
			c: contact.id,
			p: Boolean(data.showName),
			n: Boolean(data.newsletter),
			...(commentId ? { m: commentId } : {})
		})
		const link = `${siteUrl}/${lang}/declaration/confirmer?t=${encodeURIComponent(token)}`
		await sendMail(confirmationEmail({ to: email, firstName, link, lang }))
		await logActivity(contact.id, EMAIL_SENT_SUBJECT, sentAtDetails())

		return json({ success: true, pending: true, alreadySigned: confirmed })
	} catch (e) {
		console.error('[declaration] signature impossible :', e)
		return json(
			{
				error: en
					? 'Your signature could not be recorded. Please try again later.'
					: 'La signature n’a pas pu être enregistrée. Merci de réessayer plus tard.'
			},
			{ status: 500 }
		)
	}
}
