<script lang="ts">
	import { MoveUpRight } from 'lucide-svelte'

	export let title
	export let blurb
	export let category = ''
	export let url
	export let linkText = "Lire l'article"
</script>

<a class="article-link" href={url}>
	<article>
		<h3>{title}</h3>
		<p>{blurb}</p>
		<div class="footer small-text">
			<span>{category}</span>
			<span class="read-more">
				{linkText}<span class="link-icon"><MoveUpRight size="1.5rem" /></span>
			</span>
		</div>
	</article>
</a>

<style>
	h3 {
		margin: 0;
	}
	.footer {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.small-text {
		font-size: 0.875rem;
	}
	article {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		gap: 1.25rem;
		background-color: var(--bg-subtle);
	}
	p {
		margin: 0;
		/* ça pose un problème overflow sur les écrans qui ne sont pas larges
		width: 40rem;
		*/
		flex-grow: 1;
	}
	.link-icon {
		line-height: 0;
		margin-left: 1rem;
	}
	.read-more {
		display: flex;
		align-items: end;
		text-decoration: none;
		color: black;
	}
	.article-link {
		text-decoration: none;
		background-color: var(--bg-subtle);
		border-radius: 0.625rem;
		overflow: hidden;
	}
	.article-link:hover {
		color: inherit;
	}
</style>
