<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Maximize2, X } from 'lucide-svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)
	$: prefix = `/${lang}`

	let fullscreen = false

	function formatDate(dateStr: string): string {
		if (!dateStr) return ''
		try {
			const d = new Date(dateStr)
			const locale = lang === 'en' ? 'en-GB' : 'fr-FR'
			return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
		} catch {
			return dateStr
		}
	}

	function toggleFullscreen() {
		fullscreen = !fullscreen
		if (fullscreen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}
</script>

<PostMeta title={data.newsletter.title} description={data.newsletter.description} />

<div class="page">
	<nav class="breadcrumb">
		<a href="{prefix}/newsletters" class="back-link">
			<ArrowLeft size="1rem" />
			{t.newsletters.all_newsletters}
		</a>
	</nav>

	<header class="newsletter-header">
		<h1>{data.newsletter.title}</h1>
		<div class="newsletter-meta">
			{#if data.newsletter.date}
				<span class="date">
					<Calendar size="1rem" />
					{formatDate(data.newsletter.date)}
				</span>
			{/if}
			<a href={data.newsletter.url} target="_blank" rel="noopener noreferrer" class="original-link">
				<ExternalLink size="0.875rem" />
				{t.newsletters.view_original}
			</a>
		</div>
	</header>

	<article class="newsletter-content">
		{#if data.hasContent}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		{:else}
			<iframe
				src={data.newsletter.url}
				title={data.newsletter.title}
				class="newsletter-iframe"
				sandbox="allow-same-origin"
			></iframe>
		{/if}
	</article>

	<nav class="newsletter-nav">
		<div class="nav-link-wrapper">
			{#if data.prev}
				<a href="{prefix}/newsletters/{data.prev.slug}" class="nav-link nav-prev">
					<ArrowLeft size="1.25rem" />
					<span class="nav-label">
						<span class="nav-direction">{t.newsletters.newer}</span>
						<span class="nav-title">{data.prev.title}</span>
					</span>
				</a>
			{/if}
		</div>
		<div class="nav-link-wrapper nav-link-right">
			{#if data.next}
				<a href="{prefix}/newsletters/{data.next.slug}" class="nav-link nav-next">
					<span class="nav-label">
						<span class="nav-direction">{t.newsletters.older}</span>
						<span class="nav-title">{data.next.title}</span>
					</span>
					<ArrowRight size="1.25rem" />
				</a>
			{/if}
		</div>
	</nav>

	<footer class="newsletter-footer">
		<a href="{prefix}/newsletters" class="back-link">
			<ArrowLeft size="1rem" />
			{t.newsletters.back_to_newsletters}
		</a>
	</footer>
</div>

<!-- Fullscreen overlay -->
{#if fullscreen}
	<div class="fullscreen-overlay">
		<div class="fullscreen-header">
			<span class="fullscreen-title">{data.newsletter.title}</span>
			<button
				class="fullscreen-close"
				on:click={toggleFullscreen}
				aria-label={t.newsletters.close_fullscreen}
			>
				<X size="1.25rem" />
			</button>
		</div>
		<div class="fullscreen-body">
			{#if data.hasContent}
				<div class="newsletter-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.content}
				</div>
			{:else}
				<iframe
					src={data.newsletter.url}
					title={data.newsletter.title}
					class="newsletter-iframe fullscreen-iframe"
					sandbox="allow-same-origin"
				></iframe>
			{/if}
		</div>
	</div>
{/if}

<!-- Floating fullscreen button (mobile only) -->
<button
	class="fullscreen-btn"
	on:click={toggleFullscreen}
	aria-label={t.newsletters.read_fullscreen}
>
	<Maximize2 size="1.25rem" />
</button>

<style>
	.page {
		max-width: var(--width-content);
		margin: 0 auto;
		padding: 1.5rem 0.5rem 3rem;
	}

	.breadcrumb {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.9375rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--brand-subtle);
	}

	.newsletter-header {
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--border);
	}

	.newsletter-header h1 {
		font-size: 2rem;
		font-weight: 800;
		line-height: 1.3;
		margin: 0 0 1rem;
	}

	.newsletter-meta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.date {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary);
		font-size: 0.9375rem;
	}

	.original-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.original-link:hover {
		color: var(--brand-subtle);
	}

	/* Newsletter content container */
	.newsletter-content {
		overflow: hidden;
	}

	/* Responsive: constrain widths without destroying layout */
	.newsletter-content :global(table) {
		max-width: 100% !important;
	}

	.newsletter-content :global(td),
	.newsletter-content :global(th) {
		max-width: 100%;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.newsletter-content :global(img) {
		max-width: 100%;
		height: auto !important;
	}

	.newsletter-content :global(div),
	.newsletter-content :global(span) {
		max-width: 100% !important;
	}

	/* Links */
	.newsletter-content :global(a) {
		color: var(--brand-subtle);
	}

	.newsletter-content :global(a:hover) {
		opacity: 0.8;
	}

	.newsletter-iframe {
		width: 100%;
		min-height: 80vh;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	/* Prev/Next navigation */
	.newsletter-nav {
		display: flex;
		gap: 1rem;
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 2px solid var(--border);
	}

	.nav-link-wrapper {
		flex: 1;
		min-width: 0;
	}

	.nav-link-right {
		text-align: right;
	}

	.nav-link {
		display: inline-flex;
		align-items: flex-start;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text);
		padding: 0.75rem 1rem;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border);
		background: var(--bg-secondary);
		transition:
			background 0.2s,
			border-color 0.2s,
			box-shadow 0.2s;
		max-width: 100%;
	}

	.nav-link:hover {
		background: var(--bg);
		border-color: var(--brand);
		box-shadow: var(--shadow-card);
	}

	.nav-next {
		flex-direction: row;
		justify-content: flex-end;
	}

	.nav-label {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		min-width: 0;
	}

	.nav-direction {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.03em;
		font-weight: 600;
	}

	.nav-title {
		font-size: 0.9375rem;
		font-weight: 500;
		line-height: 1.3;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.newsletter-footer {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}

	/* Floating fullscreen button */
	.fullscreen-btn {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: none;
		background: var(--brand);
		color: var(--on-brand);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px rgba(var(--ink-rgb), 0.25);
		cursor: pointer;
		z-index: 50;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.fullscreen-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(var(--ink-rgb), 0.3);
	}

	/* Fullscreen overlay */
	.fullscreen-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: var(--bg);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.fullscreen-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		flex-shrink: 0;
	}

	.fullscreen-title {
		font-weight: 700;
		font-size: 0.9375rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 0;
	}

	.fullscreen-close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		cursor: pointer;
		transition: background 0.2s;
	}

	.fullscreen-close:hover {
		background: var(--border);
	}

	.fullscreen-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		padding: 1rem;
		line-height: 1.7;
	}

	.fullscreen-iframe {
		height: 100%;
		min-height: 0;
		border: none;
	}

	@media (min-width: 480px) {
		.page {
			padding: 2rem 1rem 4rem;
		}
	}

	@media (min-width: 640px) {
		.page {
			padding: 3rem 2rem 6rem;
		}

		.newsletter-header h1 {
			font-size: 2.5rem;
		}
	}
</style>
