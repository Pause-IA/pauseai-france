import { json, type RequestHandler } from '@sveltejs/kit'
import { createHash, timingSafeEqual } from 'crypto'

import { env as privateEnv } from '$env/dynamic/private'
import { messageDepuisNotion } from '$lib/server/bienvenueGroupeLocal'

/**
 * Reçoit l'action « Envoyer un webhook » de l'automatisation Notion de la base
 * « Inscriptions aux groupes locaux » et poste une ligne dans #bienvenue.
 *
 * Variables (Netlify) :
 * - NOTION_BIENVENUE_SECRET : valeur de l'en-tête `X-PauseIA-Secret` réglé dans Notion ;
 * - DISCORD_BIENVENUE_WEBHOOK_URL : webhook du salon #bienvenue.
 *
 * Notion ne réessaie pas et met l'automatisation en pause après un échec : on
 * répond 200 pour tout ce qui est simplement ignoré (message vide, autre base).
 * Les journaux ne contiennent aucune donnée personnelle.
 */

const egal = (a: string, b: string) =>
	timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())

export const POST: RequestHandler = async ({ request }) => {
	const secret = (privateEnv.NOTION_BIENVENUE_SECRET || '').trim()
	const webhook = (privateEnv.DISCORD_BIENVENUE_WEBHOOK_URL || '').trim()
	if (!secret || !webhook) {
		console.error('[bienvenue] configuration manquante (secret ou webhook Discord)')
		return json({ ok: false, error: 'not configured' }, { status: 503 })
	}

	const recu = (request.headers.get('x-pauseia-secret') || '').trim()
	if (!recu || !egal(recu, secret)) {
		return json({ ok: false, error: 'unauthorized' }, { status: 401 })
	}

	let body: unknown
	try {
		body = await request.json()
	} catch {
		console.warn('[bienvenue] message illisible, ignoré')
		return json({ ok: true, ignored: 'invalid json' })
	}

	const content = messageDepuisNotion(body)
	if (!content) {
		console.warn('[bienvenue] ni pseudo ni département trouvés, ignoré')
		return json({ ok: true, ignored: 'no data' })
	}

	const res = await fetch(webhook, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ content, allowed_mentions: { parse: [] } })
	}).catch(() => null)

	if (!res || !res.ok) {
		console.error(`[bienvenue] échec de l'envoi à Discord (${res ? res.status : 'réseau'})`)
		return json({ ok: false, error: 'discord' }, { status: 502 })
	}
	console.log('[bienvenue] message posté dans #bienvenue')
	return json({ ok: true })
}
