/**
 * Module « page campagne » — briques réutilisables pour monter rapidement
 * une page de campagne conforme à la charte graphique de Pause IA.
 *
 * Voir docs/module-campagne.md pour le mode d'emploi.
 */
export { default as CampaignPage } from './CampaignPage.svelte'
export { default as CampaignHero } from './CampaignHero.svelte'
export { default as CampaignSection } from './CampaignSection.svelte'
export { default as CampaignStats } from './CampaignStats.svelte'
export { default as CampaignTimeline } from './CampaignTimeline.svelte'
export { default as CampaignActions } from './CampaignActions.svelte'
export { default as CampaignEmbed } from './CampaignEmbed.svelte'
export { default as LumaCalendar } from './LumaCalendar.svelte'

export type { CampaignStat, CampaignAction, TimelineEvent, TimelinePhase } from './types'
