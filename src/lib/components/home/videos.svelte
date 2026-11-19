<script lang="ts">
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import YouTubeEmbed from '$components/YouTubeEmbed.svelte'
	import type { Video } from '$lib/notion'
	import type { Lang } from '$lib/i18n'

	export let videos: Video[] = []
	export let lang: Lang = 'fr'

	const label_id = 'videos-title'

	// Fallback videos if Notion data is not available
	const fallbackVideos: Video[] = [
		{ id: '1', title: 'Présentation Pause IA', youtubeId: '9tpzIk5Polo', order: 1, visible: true },
		{ id: '2', title: "Les risques de l'IA", youtubeId: 'NRa2MC974tc', order: 2, visible: true },
		{
			id: '3',
			title: 'Pourquoi agir maintenant',
			youtubeId: 'XQv_3gO7Zxo',
			order: 3,
			visible: true
		},
		{
			id: '4',
			title: 'Intelligence artificielle : faut-il en avoir peur ?',
			youtubeId: 'Y3MTcvOyj0s',
			order: 4,
			visible: true
		}
	]

	$: displayVideos = (videos.length > 0 ? videos : fallbackVideos).slice(0, 4)
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id} as="h3"
		>{lang === 'en' ? 'Videos worth watching' : 'Vidéos à voir'}</UnderlinedTitle
	>
	<div class="video-grid">
		{#each displayVideos as video (video.id)}
			<YouTubeEmbed id={video.youtubeId} title={video.title} />
		{/each}
	</div>
	<div class="button-container">
		<Button href="https://www.youtube.com/@Pause_IA"
			>{lang === 'en' ? 'Our YouTube channel' : 'Notre chaîne YouTube'}</Button
		>
	</div>
</section>

<style>
	section {
		margin-bottom: 1rem;
	}

	.video-grid {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 2rem;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	.button-container {
		display: flex;
		justify-content: center;
	}

	/* Tablet and up: 2 columns with max-width */
	@media (min-width: 640px) {
		.video-grid {
			grid-template-columns: repeat(2, 1fr);
			max-width: 800px;
		}
	}

	/* Large screens: 4 columns */
	@media (min-width: 1024px) {
		.video-grid {
			grid-template-columns: repeat(4, 1fr);
			max-width: none;
		}
	}
	/* Sur téléphone la page faisait douze écrans : quatre vignettes en une
	   colonne, c'est près de mille pixels pour un bloc secondaire. On en montre
	   deux, le bouton « voir tout » juste en dessous mène au reste. Les quatre
	   restent dans le HTML (référencement, et rien à recharger au
	   redimensionnement), seules les deux dernières sont masquées. */
	@media (max-width: 639px) {
		.video-grid > :global(:nth-child(n + 3)) {
			display: none;
		}
	}
</style>
