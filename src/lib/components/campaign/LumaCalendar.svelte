<script lang="ts">
	import { theme } from '$lib/stores/theme'

	/**
	 * Identifiant du calendrier Luma, visible dans l'URL d'intégration :
	 * https://luma.com/embed/calendar/<calendarId>/events
	 * ex. « cal-5ZNtr1GO7aUSyiY »
	 */
	export let calendarId: string
	/** Titre accessible de l'iframe. */
	export let title = 'Calendrier des événements Pause IA'
	/** Hauteur en pixels sur desktop. */
	export let height = 560
	/** Hauteur en pixels sur mobile. */
	export let mobileHeight = 620
	/** Lien « Voir tous les événements » affiché sous le calendrier. */
	export let calendarUrl = ''
	/** Libellé de ce lien. */
	export let calendarLinkLabel = 'Voir tous les événements sur Luma'

	// Luma expose un paramètre `lt` (light/dark) : on le synchronise avec le
	// thème du site pour que l'embed ne reste pas blanc en mode sombre.
	$: src = `https://luma.com/embed/calendar/${calendarId}/events?lt=${$theme === 'dark' ? 'dark' : 'light'}`
</script>

<div class="luma" style="--luma-h: {height}px; --luma-h-mobile: {mobileHeight}px;">
	{#key src}
		<iframe {src} {title} loading="lazy" allowfullscreen></iframe>
	{/key}
</div>

{#if calendarUrl}
	<p class="luma-link">
		<a href={calendarUrl} target="_blank" rel="noopener noreferrer">{calendarLinkLabel} ↗</a>
	</p>
{/if}

<style>
	.luma {
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		background: var(--bg);
	}

	iframe {
		display: block;
		width: 100%;
		height: var(--luma-h);
		border: 0;
	}

	.luma-link {
		margin: 0.85rem 0 0;
		text-align: left;
		font-size: 0.95rem;
	}

	.luma-link a {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	@media (max-width: 600px) {
		iframe {
			height: var(--luma-h-mobile);
		}
	}
</style>
