import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RequestEvent } from '@sveltejs/kit'
import type { DeclarationStats } from '../src/routes/api/declaration/+server'

// Faux CiviCRM et faux pauseai.info : on intercepte fetch et on rejoue des
// réponses API4 selon l'entité et l'action appelées.
const mail = vi.hoisted(() => ({
	configured: true,
	sent: [] as { to: string; subject: string; text: string }[]
}))
vi.mock('$lib/server/mailer', () => ({
	isMailConfigured: () => mail.configured,
	sendMail: (m: { to: string; subject: string; text: string }) => {
		mail.sent.push(m)
		return Promise.resolve()
	}
}))

vi.mock('$env/dynamic/private', () => ({
	env: {
		CIVICRM_BASE_URL: 'https://civicrm.test',
		CIVICRM_API_KEY: 'key',
		CIVICRM_SITE_KEY: 'site',
		CIVICRM_NEWSLETTER_GROUP_ID: '3',
		CIVICRM_CALL_TO_ACTION_GROUP_ID: '22',
		CIVICRM_NEWSLETTER_API_CONTACT_ID: '1'
	}
}))

type Handler = (params: Record<string, unknown>) => unknown
interface Call {
	entity: string
	action: string
	params: Record<string, unknown>
}

let calls: Call[] = []
let civi: Record<string, Handler> = {}
let globalResponse: () => Response

function installFetch() {
	const fake = vi.fn((input: string | URL | Request, init?: RequestInit) => {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
		if (url.startsWith('https://pauseai.info/')) return Promise.resolve(globalResponse())
		const m = /\/civicrm\/ajax\/api4\/([^/]+)\/([^/?]+)/.exec(url)
		if (!m) return Promise.reject(new Error(`unexpected fetch ${url}`))
		return Promise.resolve(m).then(async ([, entity, action]) => {
			const body = new URLSearchParams(String(init?.body ?? ''))
			const params = JSON.parse(body.get('params') ?? '{}') as Record<string, unknown>
			calls.push({ entity, action, params })
			const handler = civi[`${entity}.${action}`] as Handler | undefined
			if (!handler) return Response.json({ values: [] })
			return Response.json(await handler(params))
		})
	})
	vi.stubGlobal('fetch', fake)
	return fake
}

const post = async (body: Record<string, unknown>) => {
	const { POST } = await import('../src/routes/api/declaration/+server')
	const request = new Request('https://pauseia.fr/api/declaration', {
		method: 'POST',
		body: JSON.stringify(body)
	})
	const res = await POST({ request } as unknown as RequestEvent)
	return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}

const get = async () => {
	const { GET } = await import('../src/routes/api/declaration/+server')
	const headers: Record<string, string> = {}
	const res = await GET({
		fetch,
		setHeaders: (h: Record<string, string>) => Object.assign(headers, h)
	} as unknown as RequestEvent)
	return { body: (await res.json()) as DeclarationStats, headers }
}

const groupSave = () => calls.find((c) => c.entity === 'GroupContact' && c.action === 'save')
const savedRecords = () =>
	(groupSave()?.params.records as { group_id: number; status: string }[] | undefined)?.map(
		(r) => `${r.group_id}:${r.status}`
	)

const confirm = async (token: string) => {
	const { POST } = await import('../src/routes/api/declaration/confirm/+server')
	const request = new Request('https://pauseia.fr/api/declaration/confirm', {
		method: 'POST',
		body: JSON.stringify({ token })
	})
	const res = await POST({ request } as unknown as RequestEvent)
	return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}

/** Extrait le jeton du lien contenu dans le dernier e-mail envoyé. */
const tokenFromMail = () => {
	const m = /confirmer\?t=([^\s]+)/.exec(mail.sent.at(-1)?.text ?? '')
	return m ? decodeURIComponent(m[1]) : ''
}

const existingContact = (first: string | null, last: string | null, status?: string) => {
	civi['Email.get'] = () => ({
		values: [
			{
				contact_id: 7,
				'contact_id.first_name': first,
				'contact_id.last_name': last,
				'contact_id.job_title': null
			}
		]
	})
	civi['GroupContact.get'] = () => ({ values: status ? [{ group_id: 73, status }] : [] })
}

const globalOk = () =>
	Response.json({
		totalCount: 2500,
		signatories: [
			{ name: 'Old One', country: 'France', date: '2025-01-01', private: false },
			{ name: 'Anonymous', country: 'Germany', date: '2025-02-01', private: true },
			{ name: 'Jane Doe', country: 'United States', bio: 'Researcher', date: '2025-06-01' },
			{ name: 'Marie Curie', country: 'France', date: '2025-05-01', private: false },
			{ name: 'Anonymous', country: 'France', date: '2025-03-01', private: true }
		]
	})

beforeEach(() => {
	vi.resetModules()
	calls = []
	civi = {}
	mail.configured = true
	mail.sent = []
	globalResponse = globalOk
	installFetch()
})
afterEach(() => {
	vi.unstubAllGlobals()
})

describe('POST /api/declaration (signature → e-mail de confirmation)', () => {
	it('nouveau contact : en attente dans le groupe 73, e-mail envoyé, rien de compté', async () => {
		civi['Email.get'] = () => ({ values: [] })
		civi['Contact.create'] = () => ({ values: [{ id: 42 }] })

		const res = await post({
			firstName: ' Ada ',
			lastName: 'Lovelace',
			email: 'ADA@example.org',
			title: 'Mathématicienne',
			showName: true
		})

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ success: true, pending: true, alreadySigned: false })
		const created = calls.find((c) => c.entity === 'Contact' && c.action === 'create')
		expect(created?.params.values).toMatchObject({
			first_name: 'Ada',
			last_name: 'Lovelace',
			job_title: 'Mathématicienne'
		})
		// E-mail créé dans le même appel (chaîné), pas d'aller-retour supplémentaire.
		expect(created?.params.chain).toMatchObject({
			email: ['Email', 'create', { values: { contact_id: '$id', email: 'ada@example.org' } }]
		})
		// Nouveau contact : ni lecture de groupes ni vérification de renvoi.
		expect(calls.map((c) => `${c.entity}.${c.action}`)).toEqual([
			'Email.get',
			'Contact.create',
			'GroupContact.save',
			'Activity.create'
		])
		// Seulement « Pending » dans le 73 : ni groupe public ni newsletter avant confirmation.
		expect(savedRecords()).toEqual(['73:Pending'])
		expect(mail.sent).toHaveLength(1)
		expect(mail.sent[0].to).toBe('ada@example.org')
		expect(mail.sent[0].subject).toMatch(/Confirmez votre signature/)
		expect(mail.sent[0].text).toContain('/fr/declaration/confirmer?t=')
		const { verifyToken } = await import('../src/lib/server/declarationToken')
		expect(verifyToken(tokenFromMail())).toMatchObject({ c: 42, p: true, n: false })
		const logged = calls.find((c) => c.entity === 'Activity' && c.action === 'create')
		expect((logged?.params.values as { subject: string }).subject).toMatch(/e-mail de confirmation/)
	})

	it('page anglaise : e-mail en anglais et lien /en/', async () => {
		existingContact('Ada', 'Lovelace')
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr', lang: 'en' })
		expect(mail.sent[0].subject).toMatch(/Confirm your signature/)
		expect(mail.sent[0].text).toContain('/en/declaration/confirmer?t=')
	})

	it('SMTP non configuré : 503, rien n’est enregistré', async () => {
		mail.configured = false
		const res = await post({ firstName: 'A', lastName: 'B', email: 'a@b.fr' })
		expect(res.status).toBe(503)
		expect(calls).toHaveLength(0)
	})

	it('déjà signataire confirmé, rien de nouveau : pas d’e-mail', async () => {
		existingContact('Ada', 'Lovelace', 'Added')
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({ success: true, alreadySigned: true })
		expect(res.body.pending).toBeUndefined()
		expect(mail.sent).toHaveLength(0)
		expect(groupSave()).toBeUndefined()
	})

	it('déjà signataire qui demande la newsletter : nouvel e-mail, statut inchangé', async () => {
		existingContact('Ada', 'Lovelace', 'Added')
		const res = await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			newsletter: true
		})
		expect(res.body).toMatchObject({ pending: true, alreadySigned: true })
		expect(groupSave()).toBeUndefined()
		const { verifyToken } = await import('../src/lib/server/declarationToken')
		expect(verifyToken(tokenFromMail())).toMatchObject({ c: 7, n: true })
	})

	const sentMinutesAgo = (min: number) => () => ({
		values: [
			{
				'activity_id.details': `sent_at=${new Date(Date.now() - min * 60000).toISOString()}`,
				// Heure de Paris, en avance sur UTC : ne doit jouer aucun rôle.
				'activity_id.activity_date_time': '2099-01-01 00:00:00'
			}
		]
	})

	it('e-mail envoyé il y a 4 minutes : pas de renvoi, et la réponse le dit', async () => {
		existingContact('Ada', 'Lovelace', 'Pending')
		civi['ActivityContact.get'] = sentMinutesAgo(4)
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({
			success: true,
			pending: true,
			resent: false,
			retryInMinutes: 6
		})
		expect(mail.sent).toHaveLength(0)
	})

	it('e-mail envoyé il y a 11 minutes : renvoi (bug du fuseau horaire corrigé)', async () => {
		existingContact('Ada', 'Lovelace', 'Removed')
		civi['ActivityContact.get'] = sentMinutesAgo(11)
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({ success: true, pending: true })
		expect(res.body.resent).toBeUndefined()
		expect(mail.sent).toHaveLength(1)
		// Contact retiré à la main du groupe 73 : il repasse « en attente ».
		expect(savedRecords()).toEqual(['73:Pending'])
	})

	it('ancienne activité sans horodatage : ne bloque pas l’envoi', async () => {
		existingContact('Ada', 'Lovelace')
		civi['ActivityContact.get'] = () => ({ values: [{ 'activity_id.details': null }] })
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(mail.sent).toHaveLength(1)
	})

	it('l’activité « e-mail envoyé » porte l’heure d’envoi en UTC', async () => {
		existingContact('Ada', 'Lovelace')
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		const logged = calls.find(
			(c) =>
				c.entity === 'Activity' &&
				(c.params.values as { subject: string }).subject.includes('e-mail de confirmation')
		)
		expect((logged?.params.values as { details: string }).details).toMatch(
			/^sent_at=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
		)
	})

	it('contact existant avec un autre nom : le nom enregistré n’est pas écrasé', async () => {
		existingContact('Jean', 'Dupont')
		await post({ firstName: 'Usurpateur', lastName: 'X', email: 'jean@dupont.fr', showName: true })
		expect(calls.some((c) => c.entity === 'Contact' && c.action === 'update')).toBe(false)
	})

	it('contact existant sans nom : complète le nom et la fonction', async () => {
		existingContact(null, null)
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr', title: 'Députée' })
		const update = calls.find((c) => c.entity === 'Contact' && c.action === 'update')
		expect(update?.params.values).toEqual({
			first_name: 'Ada',
			last_name: 'Lovelace',
			job_title: 'Députée'
		})
	})

	it('commentaire : enregistré « Scheduled », son ID part dans le jeton', async () => {
		existingContact('Ada', 'Lovelace')
		civi['Activity.create'] = (p) =>
			(p.values as { subject: string }).subject.includes('commentaire')
				? { values: [{ id: 555 }] }
				: { values: [{ id: 1 }] }
		await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			showName: true,
			comment: '  Pour mes enfants.\r\n\r\n\r\nEt les vôtres.  '
		})
		const created = calls.find(
			(c) =>
				c.entity === 'Activity' &&
				(c.params.values as { subject: string }).subject.includes('commentaire')
		)
		expect(created?.params.values).toMatchObject({
			details: 'Pour mes enfants.\n\nEt les vôtres.',
			'status_id:name': 'Scheduled',
			target_contact_id: [7]
		})
		const { verifyToken } = await import('../src/lib/server/declarationToken')
		expect(verifyToken(tokenFromMail())).toMatchObject({ c: 7, p: true, m: 555 })
	})

	it('signataire confirmé qui ajoute un commentaire : e-mail de confirmation', async () => {
		existingContact('Ada', 'Lovelace', 'Added')
		civi['Activity.create'] = () => ({ values: [{ id: 556 }] })
		const res = await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			comment: 'Nouveau message'
		})
		expect(res.body).toMatchObject({ pending: true, alreadySigned: true })
		expect(mail.sent).toHaveLength(1)
	})

	it('commentaire tronqué à 500 caractères', async () => {
		existingContact('Ada', 'Lovelace')
		await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			comment: 'x'.repeat(900)
		})
		const created = calls.find(
			(c) =>
				c.entity === 'Activity' &&
				(c.params.values as { subject: string }).subject.includes('commentaire')
		)
		expect((created?.params.values as { details: string }).details).toHaveLength(500)
	})

	it('échec de l’enregistrement du commentaire : la signature passe quand même', async () => {
		existingContact('Ada', 'Lovelace')
		civi['Activity.create'] = (p) =>
			(p.values as { subject: string }).subject.includes('commentaire')
				? { error_message: 'boom' }
				: { values: [{ id: 1 }] }
		const res = await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			comment: 'x'
		})
		expect(res.body).toMatchObject({ success: true, pending: true })
		expect(mail.sent).toHaveLength(1)
		const { verifyToken } = await import('../src/lib/server/declarationToken')
		expect(verifyToken(tokenFromMail())?.m).toBeUndefined()
	})

	it('champ piège rempli : répond OK sans rien enregistrer ni envoyer', async () => {
		const res = await post({
			firstName: 'Bot',
			lastName: 'Bot',
			email: 'bot@spam.com',
			website: 'http://spam'
		})
		expect(res.body).toMatchObject({ success: true })
		expect(calls).toHaveLength(0)
		expect(mail.sent).toHaveLength(0)
	})

	it.each([
		[{ firstName: '', lastName: 'X', email: 'a@b.fr' }],
		[{ firstName: 'A', lastName: '  ', email: 'a@b.fr' }],
		[{ firstName: 'A', lastName: 'B', email: 'pas-un-email' }]
	])('refuse les données invalides %#', async (body) => {
		const res = await post(body)
		expect(res.status).toBe(400)
		expect(calls).toHaveLength(0)
	})

	it('CiviCRM en panne : erreur 500 avec message en français', async () => {
		civi['Email.get'] = () => ({ error_message: 'DB down' })
		const res = await post({ firstName: 'A', lastName: 'B', email: 'a@b.fr' })
		expect(res.status).toBe(500)
		expect(String(res.body.error)).toMatch(/réessayer/)
		expect(mail.sent).toHaveLength(0)
	})
})

describe('POST /api/declaration/confirm (clic dans l’e-mail)', () => {
	const token = async (claims: { c: number; p: boolean; n: boolean; m?: number }, now?: number) => {
		const { createToken } = await import('../src/lib/server/declarationToken')
		return createToken(claims, now)
	}

	it('confirme : 73 + 74 + newsletter en Added, activité journalisée', async () => {
		civi['GroupContact.get'] = () => ({ values: [{ group_id: 73, status: 'Pending' }] })
		const res = await confirm(await token({ c: 7, p: true, n: true }))
		expect(res.body).toMatchObject({ success: true, alreadyConfirmed: false, listed: true })
		expect(savedRecords()).toEqual(['73:Added', '74:Added', '3:Added', '22:Added'])
		expect(calls.some((c) => c.entity === 'Activity' && c.action === 'create')).toBe(true)
	})

	it('commentaire : l’activité passe en « Completed » à la confirmation', async () => {
		await confirm(await token({ c: 7, p: true, n: false, m: 555 }))
		const update = calls.find((c) => c.entity === 'Activity' && c.action === 'update')
		expect(update?.params).toMatchObject({
			values: { 'status_id:name': 'Completed' },
			where: [
				['id', '=', 555],
				['subject', '=', 'Déclaration PauseAI : commentaire']
			]
		})
	})

	it('sans nom public ni newsletter : 73 seulement', async () => {
		const res = await confirm(await token({ c: 7, p: false, n: false }))
		expect(res.body).toMatchObject({ success: true, listed: false })
		expect(savedRecords()).toEqual(['73:Added'])
	})

	it('deuxième clic : idempotent, pas de nouvelle activité', async () => {
		civi['GroupContact.get'] = () => ({ values: [{ group_id: 73, status: 'Added' }] })
		const res = await confirm(await token({ c: 7, p: false, n: false }))
		expect(res.body).toMatchObject({ success: true, alreadyConfirmed: true })
		expect(calls.some((c) => c.entity === 'Activity')).toBe(false)
	})

	it('jeton expiré (plus de 30 jours) : refusé', async () => {
		const old = Date.now() - 31 * 24 * 3600 * 1000
		const res = await confirm(await token({ c: 7, p: true, n: false }, old))
		expect(res.status).toBe(400)
		expect(calls).toHaveLength(0)
	})

	it('jeton falsifié : refusé', async () => {
		const t = await token({ c: 7, p: false, n: false })
		const [, mac] = t.split('.')
		const forged = `${Buffer.from(JSON.stringify({ c: 8, p: true, n: true, e: 9999999999 })).toString('base64url')}.${mac}`
		expect((await confirm(forged)).status).toBe(400)
		expect((await confirm('')).status).toBe(400)
		expect((await confirm('abc')).status).toBe(400)
		expect(calls).toHaveLength(0)
	})
})

describe('GET /api/declaration (compteur et listes)', () => {
	beforeEach(() => {
		civi['GroupContact.get'] = (p) => {
			const where = p.where as unknown[][]
			const group = where.find((w) => w[0] === 'group_id')?.[2]
			if (group === 73) return { count: 5, values: [] }
			return {
				values: [
					{
						contact_id: 11,
						'contact_id.first_name': 'Ada',
						'contact_id.last_name': 'Lovelace',
						'contact_id.job_title': 'Députée'
					},
					{ 'contact_id.first_name': null, 'contact_id.last_name': null }
				]
			}
		}
		// CiviCRM peut renvoyer le texte en HTML : il est ramené à du texte brut.
		civi['ActivityContact.get'] = () => ({
			values: [
				{ contact_id: 11, 'activity_id.details': '<p>Pour mes enfants &amp; les vôtres</p>' },
				{ contact_id: 11, 'activity_id.details': 'Ancien message' }
			]
		})
	})

	it('renvoie nos signataires et tous ceux de Global, anonymes compris (plus récents d’abord)', async () => {
		const { body, headers } = await get()
		expect(body.local).toEqual({
			count: 5,
			signatories: [
				{ name: 'Ada Lovelace', title: 'Députée', comment: 'Pour mes enfants & les vôtres' }
			]
		})
		const ac = calls.find((c) => c.entity === 'ActivityContact')
		expect(ac?.params.where).toContainEqual(['activity_id.status_id:name', '=', 'Completed'])
		expect(body.global?.totalCount).toBe(2500)
		expect(body.global?.franceCount).toBe(3)
		expect(body.global?.signatories).toEqual([
			{ name: 'Jane Doe', country: 'United States', bio: 'Researcher' },
			{ name: 'Marie Curie', country: 'France' },
			{ name: '', country: 'France', anonymous: true },
			{ name: '', country: 'Germany', anonymous: true },
			{ name: 'Old One', country: 'France' }
		])
		expect(headers['cache-control']).toMatch(/s-maxage/)
	})

	it('Global en panne : nos signataires restent disponibles, sans mise en cache', async () => {
		globalResponse = () => new Response('oops', { status: 500 })
		const { body, headers } = await get()
		expect(body.local?.count).toBe(5)
		expect(body.global).toBeNull()
		expect(headers['cache-control']).toBe('no-store')
	})

	it('Global renvoie un total à 0 (leur Airtable en panne) : ignoré', async () => {
		globalResponse = () => Response.json({ totalCount: 0, signatories: [] })
		const { body } = await get()
		expect(body.global).toBeNull()
	})

	it('Global tombe après un premier succès : on garde la dernière liste connue', async () => {
		await get()
		globalResponse = () => new Response('oops', { status: 503 })
		const { GET } = await import('../src/routes/api/declaration/+server')
		const res = await GET({ fetch, setHeaders: () => undefined } as unknown as RequestEvent)
		const body = (await res.json()) as { global: { totalCount: number } | null }
		expect(body.global?.totalCount).toBe(2500)
	})

	it('CiviCRM en panne : la liste de Global reste disponible', async () => {
		civi['GroupContact.get'] = () => ({ error_message: 'DB down' })
		const { body } = await get()
		expect(body.local).toBeNull()
		expect(body.global?.totalCount).toBe(2500)
	})
})
