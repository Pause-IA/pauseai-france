import { beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => ({
	env: {} as Record<string, string>,
	options: null as Record<string, unknown> | null,
	sent: [] as Record<string, unknown>[]
}))

vi.mock('$env/dynamic/private', () => ({
	get env() {
		return h.env
	}
}))
vi.mock('nodemailer', () => ({
	default: {
		createTransport: (options: Record<string, unknown>) => {
			h.options = options
			return {
				sendMail: (m: Record<string, unknown>) => {
					h.sent.push(m)
					return Promise.resolve()
				}
			}
		}
	}
}))

const mail = { to: 'ada@example.org', subject: 'Sujet', text: 'txt', html: '<p>html</p>' }

beforeEach(() => {
	h.env = {
		SMTP_HOST: 'email-smtp.eu-west-3.amazonaws.com',
		SMTP_USER: 'user',
		SMTP_PASSWORD: 'pass',
		MAIL_FROM: 'contact@pauseia.fr'
	}
	h.options = null
	h.sent = []
})

describe('mailer (variables du bot de relance)', () => {
	it('non configuré sans SMTP_PASSWORD ou MAIL_FROM', async () => {
		const { isMailConfigured } = await import('../src/lib/server/mailer')
		expect(isMailConfigured()).toBe(true)
		delete h.env.SMTP_PASSWORD
		expect(isMailConfigured()).toBe(false)
	})

	it('par défaut : port 587, STARTTLS obligatoire, expéditeur « Pause IA »', async () => {
		const { sendMail } = await import('../src/lib/server/mailer')
		await sendMail(mail)
		expect(h.options).toMatchObject({ port: 587, secure: false, requireTLS: true })
		expect(h.sent[0]).toMatchObject({
			to: 'ada@example.org',
			subject: 'Sujet',
			from: { name: 'Pause IA', address: 'contact@pauseia.fr' }
		})
	})

	it('SMTP_USE_SSL=true : TLS direct sur 465', async () => {
		h.env.SMTP_USE_SSL = 'true'
		const { sendMail } = await import('../src/lib/server/mailer')
		await sendMail(mail)
		expect(h.options).toMatchObject({ port: 465, secure: true })
	})

	it('MAIL_REDIRECT_TO : tout part vers l’adresse de test, destinataire réel dans le sujet', async () => {
		h.env.MAIL_REDIRECT_TO = 'test@pauseia.fr'
		h.env.MAIL_BCC = 'archive@pauseia.fr'
		const { sendMail } = await import('../src/lib/server/mailer')
		await sendMail(mail)
		expect(h.sent[0]).toMatchObject({
			to: 'test@pauseia.fr',
			subject: '[TEST → ada@example.org] Sujet',
			bcc: 'archive@pauseia.fr'
		})
	})
})
