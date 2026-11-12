<script lang="ts">
	import { MoveUpRight, Calendar, Mail } from 'lucide-svelte'

	export let title: string
	export let description = ''
	export let url: string
	export let slug = ''
	export let date = ''
	export let image = ''

	$: href = slug ? `/newsletters/${slug}` : url
	$: isExternal = !slug

	function formatDate(dateStr: string): string {
		if (!dateStr) return ''
		try {
			const d = new Date(dateStr)
			return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
		} catch {
			return dateStr
		}
	}
</script>

<a
	class="card-link"
	{href}
	target={isExternal ? '_blank' : undefined}
	rel={isExternal ? 'noopener noreferrer' : undefined}
>
	<article class="card" class:has-image={!!image}>
		{#if image}
			<div class="card-image">
				<img src={image} alt={title} loading="lazy" />
			</div>
		{/if}
		<div class="card-body">
			<div class="card-badge">
				<Mail size="0.875rem" />
				<span>Newsletter</span>
			</div>
			<h3 class="card-title">{title}</h3>
			{#if description}
				<p class="card-description">{description}</p>
			{/if}
			<div class="card-footer">
				{#if date}
					<span class="card-date">
						<Calendar size="0.875rem" />
						{formatDate(date)}
					</span>
				{/if}
				<span class="card-action">
					Lire
					<MoveUpRight size="1rem" />
				</span>
			</div>
		</div>
	</article>
</a>

<style>
	.card-link {
		text-decoration: none;
		display: block;
		height: 100%;
		border-radius: 1rem;
		overflow: hidden;
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
	}

	.card-link:hover {
		transform: translateY(-6px);
		box-shadow: 0 20px 40px -12px rgba(var(--ink-rgb), 0.12);
	}

	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 1rem;
		overflow: hidden;
		transition:
			border-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	.card-link:hover .card {
		border-color: var(--brand);
	}

	.card-image {
		position: relative;
		width: 100%;
		height: 180px;
		overflow: hidden;
		background: var(--bg-subtle);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.card-link:hover .card-image img {
		transform: scale(1.05);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		padding: 1.25rem 1.5rem 1.5rem;
	}

	.card-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: var(--accent);
		background: rgba(var(--brand-rgb), 0.1);
		padding: 0.25rem 0.625rem;
		border-radius: var(--radius-sm);
		width: fit-content;
		margin-bottom: 0.75rem;
	}

	.card-title {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
	}

	.card-description {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text-secondary);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		flex-grow: 1;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.card-date {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
	}

	.card-action {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		transition: color 0.2s ease;
		margin-left: auto;
	}

	.card-link:hover .card-action {
		color: var(--accent);
	}

	.card-action :global(svg) {
		transition: transform 0.2s ease;
	}

	.card-link:hover .card-action :global(svg) {
		transform: translate(2px, -2px);
	}

	@media (min-width: 640px) {
		.card-image {
			height: 200px;
		}
	}
</style>
