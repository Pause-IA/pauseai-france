/**
 * Ouverture d'un formulaire Activoice intégré.
 *
 * Le script d’Activoice pose `window.Activoice` et ajoute `openWithId` sur son
 * élément d’intégration ; rien de tout cela n’est typé par la bibliothèque, on
 * décrit donc ici le peu qu'on utilise.
 */

interface ActivoiceApi {
	bootstrap: () => Promise<void>
}

interface ActivoiceEmbed extends HTMLElement {
	openWithId?: (formId: string) => void
}

/**
 * Ouvre le formulaire `formId` dans l’élément `embedElementId`.
 * Sans script chargé ou sans élément, la fonction ne fait rien : le lien de
 * repli affiché à côté du formulaire reste utilisable.
 */
export async function openActivoiceForm(embedElementId: string, formId: string): Promise<void> {
	if (typeof window === 'undefined') return

	const api = (window as Window & { Activoice?: ActivoiceApi }).Activoice
	const embed = document.getElementById(embedElementId) as ActivoiceEmbed | null
	if (!api || !embed) return

	await api.bootstrap()
	embed.openWithId?.(formId)
}
