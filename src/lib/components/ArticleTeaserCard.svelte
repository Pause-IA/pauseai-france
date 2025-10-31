<script lang="ts">
	import { formatFrenchDate } from '$lib/utils'

	export let category = ''
	export let image = ''
	export let date = ''
	export let title = ''
	export let summary = ''
	export let url = '#'
</script>

<a class="card" href={url} target="_blank" title="Lire l'article {title}" rel="noopener noreferrer">
	<figure class="visual">
		<img src={image} alt={`Illustration de l'article ${String(title)}`} loading="lazy" />
	</figure>
	<div class="content">
		<span class="category">{category}</span>
		<time class="date" datetime={date}>{formatFrenchDate(date)}</time>
		<h3 class="title">{title}</h3>
		<p class="summary">{summary}</p>
		<span class="cta">Lire l'article</span>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--carousel-border, #d9c7b0);
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
		box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
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
		background: #fff7ed;
		color: var(--carousel-accent, #ff9416);
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
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
		color: #353535;
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
		color: #545454;
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
		border-radius: 999px;
		background: var(--carousel-accent, var(--brand));
		color: var(--white);
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
