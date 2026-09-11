<script lang="ts">
	/** URL de l'iframe à intégrer. */
	export let src: string
	/** Titre accessible de l'iframe (obligatoire pour les lecteurs d'écran). */
	export let title: string
	/** Hauteur en pixels sur desktop. */
	export let height = 450
	/** Hauteur en pixels sur mobile. */
	export let mobileHeight = 560
	/** Autorise le plein écran (vidéos). */
	export let allowFullscreen = true
	/** Légende affichée sous l'iframe. */
	export let caption = ''
</script>

<div class="embed" style="--embed-h: {height}px; --embed-h-mobile: {mobileHeight}px;">
	<iframe {src} {title} loading="lazy" allowfullscreen={allowFullscreen}></iframe>
</div>
{#if caption}
	<p class="caption">{caption}</p>
{/if}

<style>
	.embed {
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		background: var(--bg);
	}

	iframe {
		display: block;
		width: 100%;
		height: var(--embed-h);
		border: 0;
	}

	.caption {
		margin: 0.75rem 0 0;
		font-size: 0.9rem;
		text-align: left;
		color: var(--text-2);
	}

	@media (max-width: 600px) {
		iframe {
			height: var(--embed-h-mobile);
		}
	}
</style>
