<script lang="ts">
	import { MoveUpRight } from 'lucide-svelte'

	export let title: string
	export let blurb: string
	export let category = ''
	export let url: string
	/** Langue de la carte : la date et le libellé du lien en dépendent. */
	export let lang: 'fr' | 'en' = 'fr'
	export let linkText: string | undefined = undefined
	export let date = ''

	$: libelle = linkText ?? (lang === 'en' ? 'Read the article' : 'Lire l’article')

	/* La date était formatée en fr-FR quelle que soit la langue : « 10 août
	   2026 » s'affichait tel quel sur le site anglais. */
	function formatDate(dateStr: string, l: 'fr' | 'en'): string {
		if (!dateStr) return ''
		try {
			const d = new Date(dateStr + 'T00:00:00')
			return d.toLocaleDateString(l === 'en' ? 'en-GB' : 'fr-FR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		} catch {
			return dateStr
		}
	}
</script>

<a class="article-link" href={url} draggable="false">
	<article>
		<div class="content">
			<h3>{title}</h3>
			<p>{blurb}</p>
		</div>
		<div class="footer">
			<span class="category">{category}</span>
			{#if date}
				<time class="date" datetime={date}>{formatDate(date, lang)}</time>
			{/if}
			<span class="read-more">
				{libelle}
				<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
			</span>
		</div>
	</article>
</a>

<style>
	.article-link {
		text-decoration: none;
		-webkit-user-drag: none;
		display: block;
		height: 100%;
		border-radius: var(--radius-md);
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.article-link:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px -8px rgba(var(--ink-rgb), 0.15);
	}

	.article-link:hover article {
		border-color: var(--brand);
	}

	.article-link:hover .read-more {
		color: var(--brand-subtle);
	}

	article {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--bg-card);
		border: 2px solid var(--border);
		/* Le texte reste sélectionnable malgré le lien qui enveloppe la carte. */
		user-select: text;
		border-radius: var(--radius-md);
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

	/* Classe doublée : garde à cette règle la priorité qu'elle avait en Svelte 4
	   face à `.section :global(p)` de CampaignSection (Svelte 5 ne gonfle plus
	   la spécificité des sélecteurs des composants). */
	.content.content p {
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
		border-top: 1px solid var(--border);
	}

	.category {
		font-size: 0.75rem;
		color: var(--brand-subtle);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background-color: rgba(var(--brand-rgb), 0.12);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	.category:empty {
		display: none;
	}

	.date {
		font-size: 0.75rem;
		color: var(--text-2);
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
