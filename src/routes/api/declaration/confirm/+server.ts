import { json, type RequestHandler } from '@sveltejs/kit'

import {
	confirmComment,
	groupStatus,
	logActivity,
	newsletterGroups,
	publicGroup,
	setGroups,
	signatoriesGroup
} from '$lib/server/declarationCivi'
import { verifyToken } from '$lib/server/declarationToken'

// Confirmation de signature de la déclaration PauseAI, appelée par la page
// /[lang]/declaration/confirmer (bouton « Confirmer ») avec le jeton reçu par
// e-mail. Un POST et non un simple lien : les antivirus de messagerie
// ouvrent les liens des e-mails et confirmeraient à la place de la personne.
// Idempotent : recliquer sur le lien ne compte pas deux fois.
export const prerender = false

export const POST: RequestHandler = async ({ request }) => {
	let token = ''
	try {
		token = String(((await request.json()) as { token?: unknown }).token ?? '')
	} catch {
		/* corps invalide : traité comme un jeton absent */
	}
	const claims = token ? verifyToken(token) : null
	if (!claims) return json({ error: 'invalid' }, { status: 400 })

	try {
		const already = (await groupStatus(claims.c, signatoriesGroup())) === 'Added'
		const groups = [signatoriesGroup()]
		if (claims.p) groups.push(publicGroup())
		if (claims.n) groups.push(...newsletterGroups())
		await Promise.all([
			setGroups(claims.c, groups, 'Added'),
			claims.m ? confirmComment(claims.m) : Promise.resolve()
		])

		if (!already) {
			await logActivity(
				claims.c,
				`Signature déclaration PauseAI (confirmée)${claims.n ? ' + Newsletter' : ''}`
			)
		}
		return json({ success: true, alreadyConfirmed: already, listed: claims.p })
	} catch (e) {
		console.error('[declaration] confirmation impossible :', e)
		return json({ error: 'unavailable' }, { status: 500 })
	}
}
