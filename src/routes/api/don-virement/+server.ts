import { json, type RequestHandler } from '@sveltejs/kit'

import { env as privateEnv } from '$env/dynamic/private'

interface DonVirementRequest {
	prenom: string
	nom: string
	email: string
	montant: number
}

interface Api4Result<T = Record<string, unknown>> {
	version?: number
	count?: number
	values?: T[]
	error_message?: string
	error_code?: number
}

interface ContactRecord {
	id: number
}

interface EmailRecord {
	id: number
	contact_id: number
	email: string
}

async function callApi4<T = Record<string, unknown>>(
	entity: string,
	action: string,
	params: Record<string, unknown> = {}
): Promise<Api4Result<T>> {
	const base = (privateEnv.CIVICRM_BASE_URL || '').replace(/\/+$/, '')
	const apiKey = privateEnv.CIVICRM_API_KEY || ''
	if (!base || !apiKey) throw new Error('Missing required CiviCRM configuration')

	const url = `${base}/civicrm/ajax/api4/${encodeURIComponent(entity)}/${encodeURIComponent(action)}`

	const headers: Record<string, string> = {
		'X-Requested-With': 'XMLHttpRequest',
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
		'X-Civi-Auth': `Bearer ${apiKey}`,
		'Content-Type': 'application/x-www-form-urlencoded'
	}

	const siteKey = (privateEnv.CIVICRM_SITE_KEY || '').trim()
	if (!siteKey) {
		throw new Error('Missing required CiviCRM site key')
	}
	headers['X-Civi-Key'] = siteKey

	const payloadEncoded = new URLSearchParams({ params: JSON.stringify(params) }).toString()

	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: payloadEncoded
	})

	if (!response.ok) {
		let bodyText = ''
		try {
			bodyText = await response.text()
		} catch {
			// ignore
		}
		const snippet = bodyText ? `\nBody: ${bodyText.substring(0, 500)}` : ''
		throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}${snippet}`)
	}

	const data = (await response.json()) as Api4Result<T>

	if (data.error_message) {
		throw new Error(data.error_message)
	}

	return data
}

function generateReference(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	const suffix = Array.from(
		{ length: 6 },
		() => chars[Math.floor(Math.random() * chars.length)]
	).join('')
	return `DON-${suffix}`
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = (await request.json()) as DonVirementRequest

		// Validate required fields
		if (!data.prenom || !data.prenom.trim()) {
			return json({ success: false, error: 'Le prénom est requis' }, { status: 400 })
		}
		if (!data.nom || !data.nom.trim()) {
			return json({ success: false, error: 'Le nom est requis' }, { status: 400 })
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!data.email || !emailRegex.test(data.email)) {
			return json({ success: false, error: "Format d'adresse e-mail invalide" }, { status: 400 })
		}

		if (!data.montant || data.montant < 1) {
			return json({ success: false, error: 'Le montant minimum est de 1€' }, { status: 400 })
		}

		const reference = generateReference()

		// Find contact by email
		const emailResult = await callApi4<EmailRecord>('Email', 'get', {
			select: ['id', 'contact_id', 'email'],
			where: [['email', '=', data.email]],
			orderBy: { id: 'ASC' },
			limit: 1
		})

		let contactId: number
		let needsEmailCreation = false

		if (emailResult.count && emailResult.count > 0 && emailResult.values) {
			const emailRecord = emailResult.values[0]
			const candidateId = Number(emailRecord.contact_id)
			if (candidateId && candidateId > 0) {
				// Verify contact exists (guard against orphaned email)
				const contactLookup = await callApi4<ContactRecord>('Contact', 'get', {
					select: ['id'],
					where: [['id', '=', candidateId]],
					limit: 1
				})
				if (contactLookup.count && contactLookup.values && contactLookup.values.length > 0) {
					contactId = candidateId
				} else {
					// Orphaned email: create contact and reassign email
					const contactResult = await callApi4<ContactRecord>('Contact', 'create', {
						values: {
							contact_type: 'Individual',
							first_name: data.prenom.trim(),
							last_name: data.nom.trim(),
							display_name: `${data.prenom.trim()} ${data.nom.trim()}`,
							source: 'pauseia.fr'
						}
					})
					if (!contactResult.values || contactResult.values.length === 0) {
						throw new Error('Failed to create contact')
					}
					contactId = contactResult.values[0].id
					await callApi4('Email', 'save', {
						match: ['id'],
						records: [
							{
								id: emailRecord.id,
								contact_id: contactId,
								is_primary: true,
								'location_type_id:label': 'Domicile'
							}
						]
					})
				}
			} else {
				// No valid contact_id: create contact and reassign email
				const contactResult = await callApi4<ContactRecord>('Contact', 'create', {
					values: {
						contact_type: 'Individual',
						first_name: data.prenom.trim(),
						last_name: data.nom.trim(),
						display_name: `${data.prenom.trim()} ${data.nom.trim()}`,
						source: 'pauseia.fr'
					}
				})
				if (!contactResult.values || contactResult.values.length === 0) {
					throw new Error('Failed to create contact')
				}
				contactId = contactResult.values[0].id
				await callApi4('Email', 'save', {
					match: ['id'],
					records: [
						{
							id: emailRecord.id,
							contact_id: contactId,
							is_primary: true,
							'location_type_id:label': 'Domicile'
						}
					]
				})
			}
		} else {
			// No email found: create contact and email
			const contactResult = await callApi4<ContactRecord>('Contact', 'create', {
				values: {
					contact_type: 'Individual',
					first_name: data.prenom.trim(),
					last_name: data.nom.trim(),
					display_name: `${data.prenom.trim()} ${data.nom.trim()}`,
					source: 'pauseia.fr'
				}
			})
			if (!contactResult.values || contactResult.values.length === 0) {
				throw new Error('Failed to create contact')
			}
			contactId = contactResult.values[0].id
			needsEmailCreation = true
		}

		if (needsEmailCreation) {
			await callApi4('Email', 'create', {
				values: {
					contact_id: contactId,
					email: data.email,
					is_primary: true,
					'location_type_id:label': 'Domicile'
				}
			})
		}

		// Create the contribution as Pending
		await callApi4('Contribution', 'create', {
			values: {
				contact_id: contactId,
				'financial_type_id:label': 'Don',
				total_amount: data.montant,
				'contribution_status_id:name': 'Pending',
				'payment_instrument_id:label': 'Virement bancaire',
				source: 'Virement bancaire - Site web',
				trxn_id: reference
			}
		})

		return json({ success: true, reference })
	} catch (error) {
		console.error('[don-virement] error:', error)
		return json(
			{
				success: false,
				error: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.'
			},
			{ status: 500 }
		)
	}
}
