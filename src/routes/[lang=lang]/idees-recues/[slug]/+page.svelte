<script lang="ts">
	// Une idée reçue : la réponse courte (« En bref »), puis l'argumentaire et les
	// sources, lus dans le corps de la page Notion. Adresse : /fr/idees-recues/<slug>.
	import PostMeta from '$components/PostMeta.svelte'
	import TexteNotion from '$components/TexteNotion.svelte'
	import { PageHero } from '$components/ui'
	import { ArrowLeft, Check, Share2 } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: idee = data.idee
	$: title = `« ${idee.objection}… » : notre réponse`

	// Partager : la feuille de partage du téléphone si elle existe, sinon copie du lien.
	let copie = false
	async function partager() {
		const url = window.location.href
		try {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- absent de certains navigateurs
			if (navigator.share) {
				await navigator.share({ title, text: idee.reponseCourte, url })
				return
			}
			await navigator.clipboard.writeText(url)
			copie = true
			setTimeout(() => (copie = false), 2500)
		} catch {
			// Partage annulé par la personne : rien à faire.
		}
	}
</script>

<PostMeta {title} description={idee.reponseCourte} />

<article>
	<a class="retour" href="/{data.lang}/idees-recues">
		<ArrowLeft size={16} aria-hidden="true" /> Idées reçues
	</a>
	<PageHero eyebrow={idee.categorie}>«&nbsp;{idee.objection}…&nbsp;»</PageHero>

	{#if idee.auteur || data.publieLe || data.misAJourLe}
		<p class="signature">
			{#if idee.auteur}<span>Par {idee.auteur}</span>{/if}
			{#if data.publieLe}<span>Publié le {data.publieLe}</span>{/if}
			{#if data.misAJourLe}<span>Mis à jour le {data.misAJourLe}</span>{/if}
		</p>
	{/if}

	{#if idee.themes.length}
		<ul class="themes">
			{#each idee.themes as t}<li>{t}</li>{/each}
		</ul>
	{/if}

	<section class="en-bref">
		<h2>En bref</h2>
		<p>{idee.reponseCourte}</p>
		<button type="button" on:click={partager}>
			{#if copie}
				<Check size={15} aria-hidden="true" /> Lien copié
			{:else}
				<Share2 size={15} aria-hidden="true" /> Partager
			{/if}
		</button>
	</section>

	{#if data.argumentaire.length}
		<section class="argumentaire">
			<h2>L’argumentaire</h2>
			{#each data.argumentaire as bloc}
				{#if bloc.type === 'titre'}
					{#if bloc.niveau === 2}
						<h2><TexteNotion segments={bloc.segments} /></h2>
					{:else}
						<h3><TexteNotion segments={bloc.segments} /></h3>
					{/if}
				{:else if bloc.type === 'paragraphe'}
					<p><TexteNotion segments={bloc.segments} /></p>
				{:else if bloc.type === 'citation'}
					<blockquote><p><TexteNotion segments={bloc.segments} /></p></blockquote>
				{:else if bloc.numerotee}
					<ol>
						{#each bloc.elements as element}<li><TexteNotion segments={element} /></li>{/each}
					</ol>
				{:else}
					<ul>
						{#each bloc.elements as element}<li><TexteNotion segments={element} /></li>{/each}
					</ul>
				{/if}
			{/each}
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: 46rem;
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.retour {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-bottom: 1.25rem;
		color: var(--brand-subtle);
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
	}

	.retour:hover {
		text-decoration: underline;
	}

	.signature {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem 0.75rem;
		margin: -0.5rem 0 1rem;
		color: var(--text-2);
		font-size: 0.9rem;
	}

	/* Séparateur entre les mentions, sans l'écrire dans le balisage : il ne doit pas
	   apparaître quand une seule des trois est renseignée. */
	.signature span + span::before {
		content: '· ';
	}

	.themes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0 0 1.5rem;
		padding: 0;
		list-style: none;
	}

	.themes li {
		padding: 0.12rem 0.55rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		color: var(--text-2);
		font-size: 0.8rem;
	}

	.en-bref {
		margin-bottom: 0; /* annule la marge globale des <section> */
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-lg);
		background: var(--bg-subtle);
	}

	.en-bref h2 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
	}

	.en-bref p {
		margin: 0 0 1rem;
		line-height: 1.6;
	}

	.en-bref button {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background: var(--bg-card);
		color: var(--text);
		font-family: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
	}

	.en-bref button:hover {
		border-color: var(--brand);
	}

	.argumentaire {
		margin-top: 2.5rem;
		margin-bottom: 0;
	}

	.argumentaire h2 {
		margin: 2rem 0 0.5rem;
		font-size: 1.5rem;
	}

	.argumentaire > h2:first-child {
		margin-top: 0;
	}

	.argumentaire h3 {
		margin: 1.5rem 0 0.4rem;
		font-size: 1.08rem;
	}

	.argumentaire p,
	.argumentaire li {
		color: var(--text-2);
		line-height: 1.65;
	}

	.argumentaire p {
		margin: 0 0 0.9rem;
	}

	.argumentaire :global(a) {
		color: var(--brand-subtle);
	}

	blockquote {
		margin: 0 0 1rem;
		padding-inline-start: 1rem;
		border-inline-start: 3px solid var(--brand);
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
