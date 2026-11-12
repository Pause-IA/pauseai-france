<script lang="ts">
	import { theme } from '$lib/stores/theme'

	/**
	 * Identifiant du calendrier Luma, visible dans l'URL d'intégration :
	 * https://luma.com/embed/calendar/<calendarId>/events
	 * ex. « cal-PLtig5in051g5mM »
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
	/**
	 * Replie le calendrier derrière un résumé cliquable. Utile quand l'embed
	 * s'insère dans une liste d'actions : il ne prend alors qu'une ligne tant
	 * que le visiteur ne l'ouvre pas.
	 */
	export let collapsible = false
	/** Libellé du résumé quand `collapsible` est actif. */
	export let summary = 'Voir les prochaines dates'
	/** Ouvre le calendrier dès l'arrivée sur la page (avec `collapsible`). */
	export let open = false

	// Luma expose un paramètre `lt` (light/dark) : on le synchronise avec le
	// thème du site pour que l'embed ne reste pas blanc en mode sombre.
	$: src = `https://luma.com/embed/calendar/${calendarId}/events?lt=${$theme === 'dark' ? 'dark' : 'light'}`
</script>

{#if collapsible}
	<details class="luma-details" {open}>
		<summary>{summary}</summary>
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
	</details>
{:else}
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
{/if}

<style>
	.luma {
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
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
		color: var(--accent);
		font-weight: 600;
	}

	/* Le résumé porte toute la découvrabilité du calendrier : sans habillage,
	   un simple lien se confondait avec le texte et personne ne le dépliait. */
	.luma-details summary {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		font-weight: 700;
		padding: 0.85rem 1.1rem;
		color: var(--text);
		background: var(--bg);
		border: 2px solid var(--border);
		border-radius: var(--radius-btn);
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.luma-details summary::-webkit-details-marker {
		display: none;
	}

	.luma-details summary::marker {
		content: '';
	}

	.luma-details summary:hover,
	.luma-details summary:focus-visible {
		border-color: var(--brand);
		box-shadow: 0 2px 10px rgb(255 148 22 / 22%);
	}

	/* Chevron : indique sans ambiguïté que la rangée se déplie. */
	.luma-details summary::after {
		content: '';
		flex: none;
		inline-size: 0.55rem;
		block-size: 0.55rem;
		border-right: 2.5px solid var(--accent);
		border-bottom: 2.5px solid var(--accent);
		transform: rotate(45deg) translateY(-15%);
		transition: transform 0.2s ease;
	}

	.luma-details[open] summary::after {
		transform: rotate(225deg) translateY(-15%);
	}

	.luma-details[open] summary {
		margin-bottom: 0.85rem;
	}

	@media (max-width: 600px) {
		iframe {
			height: var(--luma-h-mobile);
		}
	}
</style>
