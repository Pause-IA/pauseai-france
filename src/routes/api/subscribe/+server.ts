import { json, type RequestHandler } from '@sveltejs/kit'

import { env as privateEnv } from '$env/dynamic/private'

interface SubscriptionRequest {
	email: string
	subscribeNewsletter: boolean
	subscribeSubstack: boolean
	subscribeConferenceReport?: boolean
	firstName?: string
	lastName?: string
	subscribePolicyProposals?: boolean
	source?: string
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

const WEBSITE_SIGNUP_ACTIVITY_ID = 75

type ContactIdParam = number | '$id'

function buildActivityValues(
	activityTypeId: number,
	subject: string,
	sourceContactId: ContactIdParam,
	targetContactIds: ContactIdParam[]
) {
	return {
		activity_type_id: activityTypeId,
		subject,
		source_contact_id: sourceContactId,
		target_contact_id: targetContactIds,
		'status_id:name': 'Completed'
	} as Record<string, unknown>
}

//

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

	// Site key guard (required)
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

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = (await request.json()) as SubscriptionRequest

		// Validate email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!data.email || !emailRegex.test(data.email)) {
			return json({ error: "Format d'adresse e-mail invalide" }, { status: 400 })
		}

		// At least one subscription must be selected
		if (
			!data.subscribeNewsletter &&
			!data.subscribeSubstack &&
			!data.subscribeConferenceReport &&
			!data.subscribePolicyProposals
		) {
			return json(
				{ error: "Au moins une option d'abonnement doit être sélectionnée" },
				{ status: 400 }
			)
		}

		// Determine subject text for activity
		const subscriptionTypes: string[] = []
		if (data.subscribeNewsletter) subscriptionTypes.push('Newsletter Pause IA')
		if (data.subscribeSubstack) subscriptionTypes.push('Blog Substack Pause IA')
		if (data.subscribeConferenceReport) subscriptionTypes.push('Compte-rendu Conférence Sénat')
		if (data.subscribePolicyProposals) subscriptionTypes.push('Propositions législatives')
		const subjectText = `Inscription: ${subscriptionTypes.join(' + ')}`

		// Find contact by email using Email entity (API v4 approach)
		const emailResult = await callApi4<EmailRecord>('Email', 'get', {
			select: ['id', 'contact_id', 'email', 'location_type_id', 'is_primary'],
			where: [['email', '=', data.email]],
			orderBy: { id: 'ASC' },
			limit: 1
		})

		let contactId: number
		let createdNewContact = false
		let needsEmailCreation = false // Track whether we need to create email record

		if (emailResult.count && emailResult.count > 0 && emailResult.values) {
			const emailRecord = emailResult.values[0]
			const candidateId = Number(emailRecord.contact_id)
			if (candidateId && candidateId > 0) {
				// Verify contact actually exists (guard against orphaned email)
				const contactLookup = await callApi4<ContactRecord>('Contact', 'get', {
					select: ['id'],
					where: [['id', '=', candidateId]],
					limit: 1
				})
				if (contactLookup.count && contactLookup.values && contactLookup.values.length > 0) {
					contactId = candidateId
				} else {
					// Orphan email: create contact, then reassign the email to this contact
					const contactResult = await callApi4<ContactRecord>('Contact', 'create', {
						values: {
							contact_type: 'Individual',
							display_name:
								data.firstName || data.lastName
									? [data.firstName, data.lastName].filter(Boolean).join(' ')
									: data.email,
							first_name: data.firstName || undefined,
							last_name: data.lastName || undefined,
							source: data.source || 'pauseia.fr',
							contact_sub_type: ['Sympathisant']
						}
					})
					if (!contactResult.values || contactResult.values.length === 0) {
						throw new Error('Failed to create contact')
					}
					contactId = contactResult.values[0].id
					createdNewContact = true
					// Reassign existing email to the new contact
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
					needsEmailCreation = false // Email was reassigned, don't create new one
				}
			} else {
				// No valid contact_id on Email row: create contact and reassign email
				const contactResult = await callApi4<ContactRecord>('Contact', 'create', {
					values: {
						contact_type: 'Individual',
						display_name:
							data.firstName || data.lastName
								? [data.firstName, data.lastName].filter(Boolean).join(' ')
								: data.email,
						first_name: data.firstName || undefined,
						last_name: data.lastName || undefined,
						source: data.source || 'pauseia.fr',
						contact_sub_type: ['Sympathisant']
					}
				})
				if (!contactResult.values || contactResult.values.length === 0) {
					throw new Error('Failed to create contact')
				}
				contactId = contactResult.values[0].id
				createdNewContact = true
				// Reassign existing email to the new contact
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
				needsEmailCreation = false // Email was reassigned, don't create new one
			}
		} else {
			// No email row found: create contact and email record
			const contactResult = await callApi4<ContactRecord>('Contact', 'create', {
				values: {
					contact_type: 'Individual',
					display_name:
						data.firstName || data.lastName
							? [data.firstName, data.lastName].filter(Boolean).join(' ')
							: data.email,
					first_name: data.firstName || undefined,
					last_name: data.lastName || undefined,
					source: data.source || 'pauseia.fr',
					contact_sub_type: ['Sympathisant']
				}
			})

			if (!contactResult.values || contactResult.values.length === 0) {
				throw new Error('Failed to create contact')
			}

			contactId = contactResult.values[0].id
			createdNewContact = true
			needsEmailCreation = true // Need to create new email record
		}

		// Optionally update existing contact names if provided
		if (!createdNewContact && (data.firstName || data.lastName)) {
			try {
				await callApi4('Contact', 'create', {
					values: {
						id: contactId,
						first_name: data.firstName || undefined,
						last_name: data.lastName || undefined,
						display_name:
							data.firstName || data.lastName
								? [data.firstName, data.lastName].filter(Boolean).join(' ')
								: undefined
					}
				})
			} catch (e) {
				console.warn('[subscribe] failed to update contact name (continuing):', e)
			}
		}

		// Create email record if needed (when no email existed before)
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

		// Resolve group IDs at runtime
		const newsletterGroupId = Number(privateEnv.CIVICRM_NEWSLETTER_GROUP_ID)
		const substackGroupId = Number(privateEnv.CIVICRM_SUBSTACK_GROUP_ID)
		const conferenceGroupId = Number(privateEnv.CIVICRM_CONFERENCE_GROUP_ID)
		const policyProposalsGroupId = Number(privateEnv.CIVICRM_POLICY_GROUP_ID)
		const callToActionGroupId = Number(privateEnv.CIVICRM_CALL_TO_ACTION_GROUP_ID)
		if (
			(data.subscribeNewsletter && !Number.isFinite(newsletterGroupId)) ||
			(data.subscribeSubstack && !Number.isFinite(substackGroupId)) ||
			(data.subscribeConferenceReport && !Number.isFinite(conferenceGroupId)) ||
			(data.subscribePolicyProposals && !Number.isFinite(policyProposalsGroupId))
		) {
			throw new Error('Missing group configuration')
		}

		// Query existing group memberships to tailor message
		const existingMemberships = await callApi4<{ group_id: number }>('GroupContact', 'get', {
			select: ['group_id'],
			where: [
				['contact_id', '=', contactId],
				['status', '=', 'Added'],
				[
					'group_id',
					'IN',
					[
						Number.isFinite(newsletterGroupId) ? newsletterGroupId : undefined,
						Number.isFinite(substackGroupId) ? substackGroupId : undefined,
						Number.isFinite(conferenceGroupId) ? conferenceGroupId : undefined,
						Number.isFinite(policyProposalsGroupId) ? policyProposalsGroupId : undefined,
						Number.isFinite(callToActionGroupId) ? callToActionGroupId : undefined
					].filter((v) => Number.isFinite(Number(v)))
				]
			]
		})

		const alreadyInNewsletter = Boolean(
			existingMemberships.values?.some((g) => g.group_id === newsletterGroupId)
		)
		const alreadyInSubstack = Boolean(
			existingMemberships.values?.some((g) => g.group_id === substackGroupId)
		)
		const alreadyInConference = Boolean(
			existingMemberships.values?.some((g) => g.group_id === conferenceGroupId)
		)
		const alreadyInPolicyProposals = Boolean(
			existingMemberships.values?.some((g) => g.group_id === policyProposalsGroupId)
		)
		const alreadyInCallToAction = Boolean(
			existingMemberships.values?.some((g) => g.group_id === callToActionGroupId)
		)

		// Upsert groups via GroupContact.save with match on contact_id + group_id
		const groupRecords: Array<{ contact_id: number; group_id: number; status?: string }> = []
		if (data.subscribeNewsletter && !alreadyInNewsletter)
			groupRecords.push({ contact_id: contactId, group_id: newsletterGroupId, status: 'Added' })
		// Automatically add to "Call to Action" group when subscribing to newsletter
		if (data.subscribeNewsletter && !alreadyInCallToAction && Number.isFinite(callToActionGroupId))
			groupRecords.push({ contact_id: contactId, group_id: callToActionGroupId, status: 'Added' })
		if (data.subscribeSubstack && !alreadyInSubstack)
			groupRecords.push({ contact_id: contactId, group_id: substackGroupId, status: 'Added' })
		if (data.subscribeConferenceReport && !alreadyInConference)
			groupRecords.push({ contact_id: contactId, group_id: conferenceGroupId, status: 'Added' })
		if (data.subscribePolicyProposals && !alreadyInPolicyProposals)
			groupRecords.push({
				contact_id: contactId,
				group_id: policyProposalsGroupId,
				status: 'Added'
			})
		if (groupRecords.length > 0) {
			await callApi4('GroupContact', 'save', {
				match: ['contact_id', 'group_id'],
				records: groupRecords
			})
		}

		// Log activity (non-fatal)
		try {
			await callApi4('Activity', 'create', {
				checkPermissions: false,
				values: buildActivityValues(
					WEBSITE_SIGNUP_ACTIVITY_ID,
					subjectText,
					Number(privateEnv.CIVICRM_NEWSLETTER_API_CONTACT_ID || ''),
					[contactId]
				)
			})
		} catch (err) {
			console.warn('[subscribe] failed to log activity (continuing):', err)
		}

		// Clear, concise response message
		const selections = [
			data.subscribeNewsletter
				? alreadyInNewsletter
					? 'Newsletter: déjà inscrit·e'
					: 'Newsletter: inscription confirmée'
				: null,
			data.subscribeSubstack
				? alreadyInSubstack
					? 'Substack: déjà inscrit·e'
					: 'Substack: inscription confirmée'
				: null,
			data.subscribeConferenceReport
				? alreadyInConference
					? 'Compte-rendu: déjà inscrit·e'
					: 'Compte-rendu: inscription confirmée'
				: null,
			data.subscribePolicyProposals
				? alreadyInPolicyProposals
					? 'Propositions législatives: déjà inscrit·e'
					: 'Propositions législatives: inscription confirmée'
				: null
		].filter(Boolean) as string[]

		const message = selections.length ? selections.join(' • ') : 'Inscription réussie!'
		return json({ success: true, message, contact_id: contactId })
	} catch (error) {
		console.error('Subscription error:', error)

		return json(
			{
				error: "Échec de l'inscription",
				details: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		)
	}
}

// Optional: Handle OPTIONS for CORS if needed
export const OPTIONS: RequestHandler = () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	})
}
