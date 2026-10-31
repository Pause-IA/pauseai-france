<script lang="ts">
	/**
	 * Carte-lien des pages « hub » (gabarit Hub) : une destination, une phrase,
	 * la carte entière est cliquable. Photo facultative en tête de carte (la
	 * page Fresque a montré que les photos donnent vie aux hubs).
	 */
	export let href: string
	export let title: string
	/** Emoji ou court symbole, affiché devant le titre. */
	export let icon: string | undefined = undefined
	/** Photo d'illustration (chemin sous /static), recadrée en 16:9. */
	export let image: string | undefined = undefined
	/** Mise en avant : bordure orange, pour l'action prioritaire d'un hub. */
	export let featured = false

	$: external = /^https?:/.test(href)
</script>

<a
	class="link-card"
	class:featured
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'noopener noreferrer' : undefined}
>
	{#if image}<img src={image} alt="" loading="lazy" />{/if}
	<span class="body">
		<strong>
			{#if icon}<span class="icon" aria-hidden="true">{icon}</span>{/if}
			{title}
		</strong>
		{#if $$slots.default}<span class="text"><slot /></span>{/if}
		<span class="arrow" aria-hidden="true">{external ? '↗' : '→'}</span>
	</span>
</a>

<style>
	.link-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--bg-card);
		box-shadow: var(--shadow-card);
		color: var(--text);
		text-decoration: none;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.link-card:hover,
	.link-card:focus-visible {
		transform: translateY(-2px);
		border-color: var(--brand);
		box-shadow: var(--shadow-raised);
	}

	.featured {
		border: 2px solid var(--brand);
	}

	img {
		display: block;
		inline-size: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		flex: 1;
		padding: 1.25rem 1.35rem 1.1rem;
	}

	strong {
		font-size: 1.1rem;
		line-height: 1.3;
	}

	.icon {
		margin-inline-end: 0.35rem;
	}

	.text {
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text-2);
	}

	.arrow {
		margin-top: auto;
		padding-top: 0.5rem;
		align-self: flex-end;
		font-size: 1.2rem;
		color: var(--brand-subtle);
	}
</style>
