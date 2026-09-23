import nodemailer from 'nodemailer'
import { env as privateEnv } from '$env/dynamic/private'

// Envoi d'e-mails transactionnels via SMTP (AWS SES). Mêmes variables que le
// bot de relance des adhésions (Romain-Deleglise/bot-relance-hello-asso), pour
// pouvoir reprendre sa configuration telle quelle :
//   SMTP_HOST, SMTP_PORT (587), SMTP_USER, SMTP_PASSWORD,
//   SMTP_USE_SSL (false : STARTTLS sur 587 ; true : TLS direct, port 465),
//   MAIL_FROM (adresse), MAIL_FROM_NAME (« Pause IA »), MAIL_REPLY_TO,
//   MAIL_BCC (copie cachée d'archivage),
//   MAIL_REDIRECT_TO (mode test : tous les e-mails partent vers cette adresse).

export interface Mail {
	to: string
	subject: string
	text: string
	html: string
}

const bool = (v: string | undefined) => /^(1|true|yes|oui|on)$/i.test((v ?? '').trim())

export function isMailConfigured(): boolean {
	return Boolean(
		privateEnv.SMTP_HOST && privateEnv.SMTP_USER && privateEnv.SMTP_PASSWORD && privateEnv.MAIL_FROM
	)
}

export async function sendMail(mail: Mail): Promise<void> {
	if (!isMailConfigured()) throw new Error('SMTP non configuré')
	const ssl = bool(privateEnv.SMTP_USE_SSL)
	const transport = nodemailer.createTransport({
		host: privateEnv.SMTP_HOST,
		port: Number(privateEnv.SMTP_PORT || (ssl ? 465 : 587)),
		secure: ssl,
		requireTLS: !ssl, // STARTTLS obligatoire : jamais d'identifiants en clair
		auth: { user: privateEnv.SMTP_USER, pass: privateEnv.SMTP_PASSWORD },
		connectionTimeout: 10_000,
		greetingTimeout: 10_000,
		socketTimeout: 15_000
	})
	const redirect = privateEnv.MAIL_REDIRECT_TO?.trim()
	await transport.sendMail({
		from: { name: privateEnv.MAIL_FROM_NAME || 'Pause IA', address: privateEnv.MAIL_FROM ?? '' },
		replyTo: privateEnv.MAIL_REPLY_TO || undefined,
		bcc: privateEnv.MAIL_BCC || undefined,
		...mail,
		to: redirect || mail.to,
		subject: redirect ? `[TEST → ${mail.to}] ${mail.subject}` : mail.subject
	})
}
