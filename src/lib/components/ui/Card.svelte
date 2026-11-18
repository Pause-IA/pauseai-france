<script lang="ts">
	/**
	 * Carte de la charte : fond --bg-card, bordure --border, rayon --radius-lg.
	 * `accent` reprend l'encadré orange des pages campagne.
	 */
	export let variant: 'default' | 'accent' | 'plain' = 'default'
	/** Rend la carte cliquable dans son ensemble (léger soulèvement au survol). */
	export let href: string | undefined = undefined
	export let padding: 'normal' | 'compact' = 'normal'
	/** Réaction au survol sans lien : la carte est pilotée par un gestionnaire. */
	export let interactive = false
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- Le rôle et le tabindex arrivent via $$restProps, que le linter ne voit pas. -->
<svelte:element
	this={href ? 'a' : 'div'}
	{href}
	{...$$restProps}
	class="ui-card {variant} {padding} {$$restProps.class ?? ''}"
	class:interactive={interactive || Boolean(href)}
	on:click
	on:keydown
>
	<slot />
</svelte:element>

<style>
	.ui-card {
		display: block;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 2rem;
		color: inherit;
		text-decoration: none;
	}

	.default {
		background: var(--bg-card);
		box-shadow: var(--shadow-card);
	}

	/* Panneau d'appel : blanc, détaché par sa bordure orange — même règle que
	   Callout et que les sections d'appel des pages campagne. */
	.accent {
		background: var(--panneau-bg);
		border-color: var(--brand);
	}

	.plain {
		background: transparent;
	}

	.compact {
		padding: 1.25rem;
	}

	.interactive {
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			border-color 0.15s ease;
	}

	.interactive:hover,
	.interactive:focus-visible {
		transform: translateY(-2px);
		box-shadow: var(--shadow-raised);
		border-color: var(--brand);
	}

	@media (max-width: 600px) {
		.ui-card {
			padding: 1.25rem;
		}
	}
</style>
