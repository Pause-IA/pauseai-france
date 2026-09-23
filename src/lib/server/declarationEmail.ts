import type { Mail } from './mailer'

// E-mail de confirmation de signature de la déclaration PauseAI.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export function confirmationEmail(opts: {
	to: string
	firstName: string
	link: string
	lang: 'fr' | 'en'
}): Mail {
	const { to, firstName, link, lang } = opts
	const en = lang === 'en'
	const subject = en
		? 'Confirm your signature of the PauseAI statement'
		: 'Confirmez votre signature de la déclaration PauseAI'
	const hello = en ? `Hello ${firstName},` : `Bonjour ${firstName},`
	const intro = en
		? 'Thank you for signing the PauseAI statement. One last step: please confirm your email address so that your signature is counted.'
		: 'Merci d’avoir signé la déclaration PauseAI. Dernière étape : confirmez votre adresse e-mail pour que votre signature soit comptabilisée.'
	const button = en ? 'Confirm my signature' : 'Confirmer ma signature'
	const statement = en
		? '“We call on the governments of the world to sign an international treaty implementing a pause on the training of the most powerful general AI systems, until we know how to build them safely and keep them under democratic control.”'
		: '« Nous appelons les gouvernements du monde entier à signer un traité international instaurant une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants, jusqu’à ce que nous sachions les construire de manière sûre et les maintenir sous contrôle démocratique. »'
	const ignore = en
		? 'If you did not sign this statement, simply ignore this email: nothing will be recorded in your name.'
		: 'Si vous n’avez pas signé cette déclaration, ignorez simplement cet e-mail : rien ne sera enregistré à votre nom.'
	const validity = en
		? 'One click is enough. This link is valid for 30 days.'
		: 'Un clic suffit. Ce lien est valable 30 jours.'
	const sign = en ? 'The Pause IA team' : 'L’équipe Pause IA'

	const text = [
		hello,
		'',
		intro,
		'',
		`${button} : ${link}`,
		'',
		statement,
		'',
		ignore,
		validity,
		'',
		sign,
		'https://pauseia.fr'
	].join('\n')

	const footer = en
		? 'You are receiving this email because this address was used to sign the PauseAI statement on pauseia.fr.'
		: 'Vous recevez cet e-mail car cette adresse a été utilisée pour signer la déclaration PauseAI sur pauseia.fr.'
	const p = 'margin:0 0 15px;line-height:1.6;color:#555555;font-size:15px;'

	// Même gabarit que les e-mails CiviCRM de Pause IA : logo, colonne de 700px,
	// Arial 15px, citation encadrée, gros bouton. Tout en styles en ligne et en
	// tableaux, seule mise en page fiable dans les clients mail.
	const html = `<!doctype html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#ffffff;">
<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr><td align="center" style="padding:20px 0;">
		<img alt="Pause IA" src="https://civicrm.pauseia.fr/public/media/images/Pause%20IA%20Fond%20Blanc.png" width="150" style="width:150px;max-width:100%;height:auto;border:0;" />
	</td></tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:700px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;">
	<tr><td style="padding:15px;">
		<p style="margin:0 0 10px;font-size:15px;color:#1a1a1a;">${esc(hello)}</p>
		<p style="${p}">${esc(intro)}</p>

		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:30px 0;">
			<tr><td align="center">
				<a href="${esc(link)}" style="display:inline-block;background-color:#ff9416;color:#1a1a1a;padding:18px 44px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:18px;">✍️ ${esc(button)}</a>
				<p style="font-size:13px;color:#7f8c8d;margin:12px 0 0;font-style:italic;">${esc(validity)}</p>
			</td></tr>
		</table>

		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fff5e8;border-left:4px solid #ff9416;margin:20px 0 30px;">
			<tr><td style="padding:20px;">
				<p style="margin:0;line-height:1.7;color:#2c3e50;font-size:15px;font-style:italic;">${esc(statement)}</p>
			</td></tr>
		</table>

		<p style="${p}">${esc(ignore)}</p>
		<p style="margin:0 0 20px;font-size:12px;color:#7f8c8d;line-height:1.5;word-break:break-all;">${esc(en ? 'If the button does not work, copy this link into your browser:' : 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :')}<br />${esc(link)}</p>

		<p style="margin:30px 0 0;line-height:1.6;color:#555555;text-align:center;font-size:15px;">${esc(en ? 'Thank you for your commitment,' : 'Merci pour votre engagement,')}<br /><strong>${esc(sign)}</strong></p>

		<hr style="border:none;border-top:1px solid #ecf0f1;margin:30px 0;" />
		<p style="font-size:11px;color:#7f8c8d;line-height:1.6;margin:0;"><strong>Pause IA</strong><br />${esc(en ? 'Website' : 'Site web')} : <a href="https://pauseia.fr/" style="color:#a85400;">https://pauseia.fr/</a><br />${esc(footer)}</p>
	</td></tr>
</table>
</body>
</html>`

	return { to, subject, text, html }
}
