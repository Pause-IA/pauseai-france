<script lang="ts">
	import { formatFrenchDate } from '$lib/utils'

	export let category = ''
	export let image = ''
	export let date = ''
	export let title = ''
	export let summary = ''
	export let url = '#'
	export let langue = ''
</script>

<a class="card" href={url} target="_blank" title="Lire l'article {title}" rel="noopener noreferrer">
	<figure class="visual">
		<img src={image} alt={`Illustration de l'article ${String(title)}`} loading="lazy" />
		{#if langue}
			<span
				class="lang-badge"
				class:en={langue.toUpperCase() === 'EN'}
				class:fr={langue.toUpperCase() === 'FR'}
			>
				{#if langue.toUpperCase() === 'FR'}
					<svg class="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2">
						<path fill="#0055A4" d="M0 0h1v2H0z" />
						<path fill="#FFF" d="M1 0h1v2H1z" />
						<path fill="#EF4135" d="M2 0h1v2H2z" />
					</svg>
					FR
				{:else if langue.toUpperCase() === 'EN'}
					<svg class="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
						<clipPath id="s">
							<path d="M0 0v30h60V0z" />
						</clipPath>
						<path d="M0 0v30h60V0z" fill="#012169" />
						<path d="m0 0 60 30m0-30L0 30" stroke="#fff" stroke-width="6" />
						<path d="m0 0 60 30m0-30L0 30" clip-path="url(#s)" stroke="#c8102e" stroke-width="4" />
						<path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10" />
						<path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6" />
					</svg>
					EN
				{/if}
			</span>
		{/if}
	</figure>
	<div class="content">
		<span class="category">{category}</span>
		<time class="date" datetime={date}>{formatFrenchDate(date)}</time>
		<h3 class="title">{title}</h3>
		<p class="summary">{summary}</p>
		<span class="cta">Lire l’article</span>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--carousel-border);
		border-radius: 18px;
		overflow: hidden;
		text-decoration: none;
		background: var(--white);
		color: inherit;
		transition:
			transform 200ms ease,
			box-shadow 200ms ease;
		height: 100%;
		max-width: 100%;
	}

	.card:hover,
	.card:focus-visible {
		transform: translateY(-4px);
		box-shadow: 0 16px 30px rgba(var(--ink-rgb), 0.08);
		outline: none;
	}

	.visual {
		position: relative;
		width: 100%;
		height: 200px;
		flex-shrink: 0;
		background: linear-gradient(135deg, #f6ebdd, #fff7ed);
		overflow: hidden;
	}

	.lang-badge {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		background: rgba(var(--on-dark-rgb), 0.9);
		backdrop-filter: blur(8px);
		padding: 0.3rem 0.6rem;
		border-radius: var(--radius-sm);
		font-size: 0.65rem;
		font-weight: 800;
		color: var(--text);
		box-shadow: 0 4px 10px rgba(var(--ink-rgb), 0.1);
		display: flex;
		align-items: center;
		gap: 0.35rem;
		z-index: 2;
		letter-spacing: 0.02em;
		transition:
			transform 200ms ease,
			background 200ms ease;
		border: 1px solid rgba(var(--on-dark-rgb), 0.2);
	}

	.flag-icon {
		width: 16px;
		height: auto;
		border-radius: 1px;
		display: block;
		box-shadow: 0 1px 2px rgba(var(--ink-rgb), 0.1);
	}

	.card:hover .lang-badge {
		transform: translateY(-2px);
		background: var(--white);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.content {
		padding: 1.25rem 1.4rem 1.5rem;
		display: grid;
		grid-template-rows: auto auto auto 1fr auto;
		gap: 0.5rem;
		flex: 1;
		min-height: 0;
	}

	.category {
		background: var(--brand-light);
		color: var(--carousel-accent, var(--brand));
		padding: 0.3rem 0.7rem;
		border-radius: var(--radius-pill);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1;
		width: fit-content;
	}

	.date {
		font-size: 0.85rem;
		color: var(--text-secondary);
		line-height: 1.2;
		display: block;
	}

	.title {
		font-size: 1.05rem;
		font-weight: 600;
		line-height: 1.35;
		margin: 0;
		color: var(--text);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.summary {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-secondary);
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
		align-self: start;
	}

	.cta {
		padding: 0.55rem 1.15rem;
		border-radius: var(--radius-pill);
		background: var(--carousel-accent, var(--brand));
		color: var(--on-brand);
		font-weight: 600;
		font-size: 0.875rem;
		line-height: 1;
		transition: background 200ms ease;
		width: fit-content;
		display: inline-block;
		margin-top: 0.5rem;
	}

	.card:hover .cta,
	.card:focus-visible .cta {
		background: var(--btn-active-bg);
	}

	@media (max-width: 768px) {
		.visual {
			height: 180px;
		}

		.content {
			padding: 1rem 1.2rem 1.25rem;
		}

		.title {
			font-size: 1rem;
		}

		.summary {
			font-size: 0.875rem;
		}
	}
</style>
