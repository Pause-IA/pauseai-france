<script lang="ts">
	/**
	 * Mention « (en anglais) » à placer à l'intérieur d'un lien écrit à la main
	 * dans une page Svelte, là où custom/a.svelte (pages en Markdown) ne passe
	 * pas : <a href={url}>Titre<MentionAnglais href={url} /></a>.
	 *
	 * N'affiche rien si le site n'est pas dans la liste de src/lib/liensAnglais.ts,
	 * ni sur le site anglais.
	 */
	import { page } from '$app/stores'
	import { estEnAnglais } from '$lib/liensAnglais'

	export let href: string

	$: lang = ($page.data.lang as string | undefined) ?? 'fr'
</script>

{#if lang !== 'en' && estEnAnglais(href)}<span class="en-anglais">&nbsp;(en anglais)</span>{/if}
