<script lang="ts">
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'
	import { Toaster } from 'svelte-french-toast'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'

	import Footer from '$components/Footer.svelte'
	import Header from '$components/Header.svelte'
	// import Toc from '$components/Toc.svelte'
	import { bannerStore } from '$lib/stores/banner'
	import type { Banner } from '$lib/notion'
	import { jsonLdTag } from '$lib/jsonLd'
	import { onMount } from 'svelte'
	import type { Lang } from '$lib/i18n'

	import '@fontsource/ibm-plex-sans/latin-200.css' // extra-light, latin subset only
	import '@fontsource/ibm-plex-sans/latin-400.css' // regular, latin subset only
	import '@fontsource/ibm-plex-sans/latin-500.css' // medium, latin subset only
	import '@fontsource/ibm-plex-sans/latin-700.css' // bold, latin subset only

	import '../reset.css'
	import '../app.css'

	$: lang = ($page.data.lang as Lang | undefined) ?? 'fr'
	$: bgWhite =
		$page.url.pathname == '/' ||
		$page.url.pathname === `/${lang}` ||
		$page.url.pathname === `/${lang}/`

	// Fetch banner from Notion API on all pages
	onMount(async () => {
		try {
			const res = await fetch('/api/banner')
			if (res.ok) {
				const banner = (await res.json()) as Banner | null
				if (banner) {
					bannerStore.set(banner)
				}
			}
		} catch {
			// Silently fall back to default banner
		}
	})
	// Données structurées de l'organisation, présentes sur toutes les pages.
	const organisationJsonLd = jsonLdTag({
		'@context': 'https://schema.org',
		'@type': ['Organization', 'NGO'],
		name: 'PauseAI France',
		url: 'https://pauseia.fr',
		logo: 'https://pauseia.fr/favicon.png',
		sameAs: [
			'https://www.facebook.com/Pause.IA/',
			'https://twitter.com/pause_ia',
			'https://www.linkedin.com/company/pause-ia/',
			'https://www.instagram.com/pause_ia/',
			'https://www.youtube.com/@Pause_IA',
			'https://www.tiktok.com/@pause_ia',
			'https://pauseia.substack.com/',
			'https://www.threads.net/@pause_ia'
		]
		// eslint-disable-next-line no-useless-escape -- la barre oblique doit rester
		// échappée : la balise fermante littérale terminerait ce bloc de script.
	})
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html organisationJsonLd}
</svelte:head>

<!-- Ancre de retour en haut de page. C'était un <h2> masqué : il s'insérait
     avant le <h1> de chaque page et cassait la hiérarchie des titres. -->
<span id="top" style="position: absolute; width: 0; height: 0; overflow: hidden;"></span>

<div class="layout" class:bgWhite>
	<Header {lang} />

	{#key $page.url.pathname}
		<main in:fade>
			<slot />
		</main>
	{/key}

	<Footer {lang} />
</div>

<Toaster
	toastOptions={{
		style: 'background-color: var(--bg-subtle); color: var(--text)',
		iconTheme: {
			primary: 'var(--brand)',
			secondary: 'white'
		}
	}}
/>
<!-- 
{#if !['/', '/outcomes', '/pdoom', '/quotes'].includes(data.url)}
	<Toc />
{/if} -->

<ProgressBar color="var(--brand)" />

<style>
	/* Réserve la place de la barre de défilement en permanence : évite que le
	   contenu centré se décale horizontalement quand un scroll apparaît
	   (ex. en dépliant un accordéon de la FAQ). */
	:global(html) {
		scrollbar-gutter: stable;
	}

	/* @import url('$lib/reset.css');
	@import url('$lib/theme.css'); */

	/* .wrapper {
		color: var(--t-text);
		max-width: var(--width-content);
		margin: auto;
	} */
	.layout {
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-auto-columns: 100%;
		/* margin-inline: auto; */
		/* padding: 1rem; */
		background-color: var(--bg-subtle);
	}

	.layout.bgWhite {
		background-color: var(--bg);
	}

	main {
		/* padding-block: 1rem; */
		/* margin-bottom: 5rem; */
		padding: 0 1rem 1rem;
		display: flex;
		flex-direction: column;
	}

	/* Dans une colonne flex, un enfant centré par marges automatiques prend la
	   largeur de son contenu : la page s'élargissait (et bougeait) dès qu'un
	   bloc s'ouvrait (FAQ, filtres…). Chaque page occupe donc toute la largeur
	   disponible, dans la limite de sa propre largeur maximale. */
	main > :global(*) {
		inline-size: 100%;
	}

	@media (min-width: 640px) {
		main {
			padding: 0rem 2rem 7.5rem 2rem;
		}
	}

	@media (min-width: 768px) {
		main {
			padding: 0rem 4rem 7.5rem 4rem;
		}
	}
	@media (min-width: 1024px) {
		main {
			padding: 0rem 6rem 7.5rem 6rem;
		}
	}

	@media (min-width: --page-width) {
		/* .layout {
			padding: 0;
	} */
	}
</style>
