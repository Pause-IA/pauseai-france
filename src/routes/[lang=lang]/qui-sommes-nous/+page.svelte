<script lang="ts">
	import Who from '$components/home/who.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang

	$: title = lang === 'en' ? 'Who are we? - Pause AI' : 'Qui sommes-nous ? - Pause IA'
	$: description =
		lang === 'en'
			? 'Discover the Pause AI France team: leadership, scientific council and volunteers committed to responsible governance of artificial intelligence.'
			: "Découvrez l'équipe de Pause IA France : direction, conseil scientifique et bénévoles engagés pour une gouvernance responsable de l'intelligence artificielle."
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<Who teamMembers={data.teamMembers} {lang} />
