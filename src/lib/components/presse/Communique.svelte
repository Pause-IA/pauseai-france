<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { ArrowLeft, ArrowRight, ExternalLink, Calendar, Maximize2, X } from 'lucide-svelte'
	/**
	 * Page d'un communiqué de presse, locale ou nationale.
	 *
	 * Les deux routes étaient deux fichiers de 440 et 453 lignes qui ne
	 * différaient que par treize : la pastille de département, et le segment
	 * d'URL des liens précédent/suivant. Tout le reste — en-tête, contenu ou
	 * iframe, navigation, plein écran, et quelque 280 lignes de style — était
	 * recopié à l'identique.
	 */
	export let data: {
		pressRelease: {
			title: string
			description?: string
			date?: string
			url: string
			department?: string
		}
		content?: string | null
		hasContent?: boolean
		newer?: { slug: string; title: string } | null
		older?: { slug: string; title: string } | null
		lang: 'fr' | 'en'
	}
	/** Sous-rubrique, pour les liens précédent/suivant. */
	export let base: 'local' | 'national'

	$: lang = data.lang
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

<PostMeta title={data.pressRelease.title} description={data.pressRelease.description} />

<div class="page">
	<nav class="breadcrumb">
		<a href="{prefix}/presse" class="back-link">
			<ArrowLeft size="1rem" />
			{lang === 'en' ? 'Press Room' : 'Espace Presse'}
		</a>
	</nav>

	<header class="pr-header">
		{#if data.pressRelease.department}
			<div class="dept-badge">{data.pressRelease.department}</div>
		{/if}
		<h1>{data.pressRelease.title}</h1>
		<div class="pr-meta">
			{#if data.pressRelease.date}
				<span class="date">
					<Calendar size="1rem" />
					{formatDate(data.pressRelease.date)}
				</span>
			{/if}
			<a
				href={data.pressRelease.url}
				target="_blank"
				rel="noopener noreferrer"
				class="original-link"
			>
				<ExternalLink size="0.875rem" />
				{lang === 'en' ? 'View original' : "Voir l'original"}
			</a>
		</div>
	</header>

	<article class="pr-content">
		{#if data.hasContent}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		{:else}
			<iframe
				src={data.pressRelease.url}
				title={data.pressRelease.title}
				class="pr-iframe"
				sandbox="allow-same-origin"
			></iframe>
		{/if}
	</article>

	<nav class="pr-nav">
		<div class="nav-link-wrapper">
			{#if data.newer}
				<a href="{prefix}/presse/{base}/{data.newer.slug}" class="nav-link nav-prev">
					<ArrowLeft size="1.25rem" />
					<span class="nav-label">
						<span class="nav-direction">{lang === 'en' ? 'Newer' : 'Plus récent'}</span>
						<span class="nav-title">{data.newer.title}</span>
					</span>
				</a>
			{/if}
		</div>
		<div class="nav-link-wrapper nav-link-right">
			{#if data.older}
				<a href="{prefix}/presse/{base}/{data.older.slug}" class="nav-link nav-next">
					<span class="nav-label">
						<span class="nav-direction">{lang === 'en' ? 'Older' : 'Plus ancien'}</span>
						<span class="nav-title">{data.older.title}</span>
					</span>
					<ArrowRight size="1.25rem" />
				</a>
			{/if}
		</div>
	</nav>

	<footer class="pr-footer">
		<a href="{prefix}/presse" class="back-link">
			<ArrowLeft size="1rem" />
			{lang === 'en' ? 'Back to press room' : "Retour à l'espace presse"}
		</a>
	</footer>
</div>

{#if fullscreen}
	<div class="fullscreen-overlay">
		<div class="fullscreen-header">
			<span class="fullscreen-title">{data.pressRelease.title}</span>
			<button
				class="fullscreen-close"
				on:click={toggleFullscreen}
				aria-label={lang === 'en' ? 'Close fullscreen' : 'Fermer le plein écran'}
			>
				<X size="1.25rem" />
			</button>
		</div>
		<div class="fullscreen-body">
			{#if data.hasContent}
				<div class="pr-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html data.content}
				</div>
			{:else}
				<iframe
					src={data.pressRelease.url}
					title={data.pressRelease.title}
					class="pr-iframe fullscreen-iframe"
					sandbox="allow-same-origin"
				></iframe>
			{/if}
		</div>
	</div>
{/if}

<button
	class="fullscreen-btn"
	on:click={toggleFullscreen}
	aria-label={lang === 'en' ? 'Read fullscreen' : 'Lire en plein écran'}
>
	<Maximize2 size="1.25rem" />
</button>

<style>
	/* Modèle « note » : un communiqué est un texte long. Colonne de lecture
	   étroite, corps fluide, et le filet de séparation en orange de marque
	   plutôt qu'en gris. */
	.page {
		max-width: var(--width-text);
		margin: 0 auto;
		padding: 1.5rem 0.5rem 3rem;
		font-size: clamp(1.0625rem, 0.97rem + 0.42vw, 1.1875rem);
		line-height: 1.62;
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
		color: var(--accent);
	}

	.pr-header {
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(var(--brand-rgb), 0.4);
	}

	.pr-header h1 {
		font-size: clamp(2.1rem, 6vw, 3.2rem);
		line-height: 1.06;
		letter-spacing: -0.025em;
		font-weight: 700;
	}

	/* Étiquette du modèle : noir sur l'orange de marque, comme le surtitre
	   des autres pages. L'ancien fond orange à 10 % derrière un texte orange
	   foncé se voyait à peine. */
	.dept-badge {
		display: inline-block;
		padding: 0.3rem 0.7rem;
		margin-bottom: 0.75rem;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--on-brand);
		background-color: var(--brand);
		border-radius: 3px;
	}

	.pr-header h1 {
		font-size: 2rem;
		font-weight: 800;
		line-height: 1.3;
		margin: 0 0 1rem;
	}

	.pr-meta {
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
		color: var(--accent);
	}

	.pr-content {
		overflow: hidden;
	}

	/* Responsive: constrain widths without destroying layout */
	.pr-content :global(table) {
		max-width: 100% !important;
	}

	.pr-content :global(td),
	.pr-content :global(th) {
		max-width: 100%;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.pr-content :global(img) {
		max-width: 100%;
		height: auto !important;
	}

	.pr-content :global(div),
	.pr-content :global(span) {
		max-width: 100% !important;
	}

	/* Links */
	.pr-content :global(a) {
		color: var(--accent);
	}

	.pr-content :global(a:hover) {
		opacity: 0.8;
	}

	.pr-iframe {
		width: 100%;
		min-height: 80vh;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	.pr-nav {
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
		background: var(--bg-card);
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

	.pr-footer {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
	}

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

		.pr-header h1 {
			font-size: 2.5rem;
		}
	}
</style>
