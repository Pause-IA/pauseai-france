/** Types partagés par les composants du module « page campagne ». */

export interface CampaignStat {
	value: string
	label: string
}

export interface TimelineEvent {
	date: string
	text: string
}

export interface TimelinePhase {
	/** Étiquette courte, ex. « Phase 1 ». Facultative. */
	tag?: string
	label: string
	/** Période affichée en italique, ex. « mai à juillet ». */
	period?: string
	/** Passe la phase en rouge (moment critique de la chronologie). */
	accent?: boolean
	events: TimelineEvent[]
}

export interface CampaignAction {
	title: string
	description: string
	/** Libellé du bouton. */
	cta: string
	href: string
	/** Ouvre dans un nouvel onglet. */
	external?: boolean
	/** Mise en avant visuelle de l'action principale. */
	featured?: boolean
}
