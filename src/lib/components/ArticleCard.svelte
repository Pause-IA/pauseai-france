<script lang="ts">
	import { MoveUpRight } from 'lucide-svelte'

	export let title: string
	export let blurb: string
	export let category: string = ''
	export let url: string
	export let linkText: string = "Lire l'article"
</script>

<a class="article-link" href={url}>
	<article>
		<div class="content">
			<h3>{title}</h3>
			<p>{blurb}</p>
		</div>
		<div class="footer">
			<span class="category">{category}</span>
			<span class="read-more">
				{linkText}
				<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
			</span>
		</div>
	</article>
</a>

<style>
	.article-link {
		text-decoration: none;
		display: block;
		height: 100%;
		border-radius: 0.75rem;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.article-link:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
	}

	.article-link:hover article {
		border-color: var(--primary, #ff9416);
	}

	.article-link:hover .read-more {
		color: var(--primary, #ff9416);
	}

	article {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--bg-subtle);
		border: 2px solid transparent;
		border-radius: 0.75rem;
		transition: border-color 0.2s ease;
	}

	.content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
	}

	p {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text-2);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}

	.category {
		font-size: 0.8125rem;
		color: var(--text-2);
		font-weight: 500;
	}

	.read-more {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		transition: color 0.2s ease;
	}

	.link-icon {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.article-link:hover .link-icon {
		transform: translate(2px, -2px);
	}
</style>
