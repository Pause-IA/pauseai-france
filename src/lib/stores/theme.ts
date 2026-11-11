import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'light' | 'dark'

function createThemeStore() {
	// Le thème est posé avant le premier rendu par le script en tête de
	// src/app.html ; on ne le réécrit pas ici. Les deux doivent répondre la même
	// chose, défaut compris : le site n'a aucun style qui suit
	// prefers-color-scheme, tout passe par [data-theme]. Quand app.html suivait
	// le système et ce store retombait sur « clair », un OS en sombre donnait un
	// premier rendu sombre puis un retour au clair — un flash sur chaque page.
	const stored = browser ? localStorage.getItem('theme') : null
	const initial: Theme = stored === 'dark' ? 'dark' : 'light'

	const { subscribe, set, update } = writable<Theme>(initial)

	return {
		subscribe,
		toggle() {
			update((current) => {
				const next: Theme = current === 'light' ? 'dark' : 'light'
				localStorage.setItem('theme', next)
				document.documentElement.setAttribute('data-theme', next)
				return next
			})
		},
		set(theme: Theme) {
			set(theme)
			if (browser) {
				localStorage.setItem('theme', theme)
				document.documentElement.setAttribute('data-theme', theme)
			}
		}
	}
}

export const theme = createThemeStore()
