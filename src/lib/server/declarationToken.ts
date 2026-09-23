import { createHmac, timingSafeEqual } from 'node:crypto'
import { env as privateEnv } from '$env/dynamic/private'

// Jeton du lien de confirmation envoyé par e-mail. Il est signé (HMAC) plutôt
// que stocké : pas de table à maintenir, et il ne peut pas être forgé sans le
// secret. Il porte le contact et les options choisies dans le formulaire, qui
// ne prennent effet qu'une fois l'adresse confirmée.

export interface DeclarationClaims {
	/** ID du contact CiviCRM. */
	c: number
	/** Afficher le nom dans la liste publique. */
	p: boolean
	/** S'abonner à la newsletter. */
	n: boolean
	/** ID de l'activité « commentaire » à valider, s'il y en a un. */
	m?: number
	/** Expiration (secondes depuis l'epoch). */
	e: number
}

const VALIDITY_S = 30 * 24 * 3600

function secret(): string {
	// Secret dédié si fourni, sinon dérivé de la clé CiviCRM (déjà secrète).
	const s = privateEnv.DECLARATION_TOKEN_SECRET || privateEnv.CIVICRM_API_KEY
	if (!s) throw new Error('Missing DECLARATION_TOKEN_SECRET')
	return `declaration:${s}`
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export function createToken(claims: Omit<DeclarationClaims, 'e'>, now = Date.now()): string {
	const full: DeclarationClaims = { ...claims, e: Math.floor(now / 1000) + VALIDITY_S }
	const payload = Buffer.from(JSON.stringify(full)).toString('base64url')
	return `${payload}.${sign(payload)}`
}

/** Renvoie les données du jeton, ou null s'il est invalide ou expiré. */
export function verifyToken(token: string, now = Date.now()): DeclarationClaims | null {
	const parts = token.split('.')
	if (parts.length !== 2) return null
	const [payload, mac] = parts
	const expected = Buffer.from(sign(payload))
	const given = Buffer.from(mac)
	if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null
	try {
		const raw = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Record<string, unknown>
		const { c, e } = raw
		if (typeof c !== 'number' || !Number.isInteger(c) || c <= 0) return null
		if (typeof e !== 'number' || e * 1000 < now) return null
		const m = typeof raw.m === 'number' && Number.isInteger(raw.m) && raw.m > 0 ? raw.m : undefined
		return { c, p: raw.p === true, n: raw.n === true, m, e }
	} catch {
		return null
	}
}
