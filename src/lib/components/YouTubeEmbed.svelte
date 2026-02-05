<script lang="ts">
	export let id: string
	export let title: string = 'Vidéo YouTube'
</script>

<div class="video-container">
	<iframe
		src="https://www.youtube-nocookie.com/embed/{id}"
		{title}
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
		loading="lazy"
	></iframe>
</div>

<style>
	.video-container {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		background-color: #000;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.video-container:hover {
		transform: translateY(-2px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -4px rgba(0, 0, 0, 0.1);
	}

	iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: none;
	}
</style>
