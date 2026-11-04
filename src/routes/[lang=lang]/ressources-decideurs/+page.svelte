<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { Card, PageHero } from '$components/ui'
	import { miseAJour, sections } from '$lib/data/ressources-decideurs'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: title = isEn ? 'Resources for decision-makers' : 'Ressources pour les décideur·euses'
	$: description = isEn
		? 'The sources Pause IA relies on, gathered for elected officials, their staff and public administrations.'
		: 'Les sources sur lesquelles Pause IA s’appuie, rassemblées pour les élus, leurs équipes et les administrations.'
	$: dateMaj = new Intl.DateTimeFormat(isEn ? 'en-GB' : 'fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(miseAJour))
</script>

<!-- Page de plaidoyer, hors menu et hors sitemap : on la partage par son lien,
     lors d'un rendez-vous ou dans un courrier. D'où le « noindex » et l'absence
     dans `EXCLUDED` de src/lib/routes.ts. Les références sont au format
     bibliographique pour être reprises telles quelles dans une note. -->
<PostMeta {title} {description} />
<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<PageHero eyebrow={isEn ? 'Understand' : 'Comprendre'} lede={description}>
		{title}
	</PageHero>

	<p class="maj">
		{isEn ? 'Links checked on' : 'Liens vérifiés le'}
		{dateMaj}
	</p>

	{#each sections as section (section.id)}
		<section class="bloc" aria-labelledby={section.id}>
			<h2 id={section.id}>{isEn ? section.titreEn : section.titre}</h2>
			{#if section.intro}
				<p class="intro">{isEn ? (section.introEn ?? section.intro) : section.intro}</p>
			{/if}

			<ul class="liste">
				{#each section.ressources as ressource (ressource.url)}
					<li>
						<Card padding="compact">
							<p class="apport">{ressource.apport}</p>
							<p class="reference">
								<a href={ressource.url} target="_blank" rel="noopener noreferrer">
									{ressource.reference}
								</a>
								{#if ressource.langue === 'en'}
									<span class="langue">{isEn ? '' : 'en anglais'}</span>
								{/if}
							</p>
						</Card>
					</li>
				{/each}
			</ul>
		</section>
	{/each}

	<p class="contact">
		{isEn
			? 'A question, a document you would like us to look at, a meeting to arrange:'
			: 'Une question, un document à nous soumettre, un rendez-vous à organiser :'}
		<a href="mailto:contact@pauseia.fr">contact@pauseia.fr</a>
	</p>
</div>

<style>
	.page {
		inline-size: 100%;
		max-inline-size: var(--width-content);
		margin-inline: auto;
		margin-block: 3rem 5rem;
		padding-inline: 1.5rem;
	}

	.maj {
		margin: 0 0 3rem;
		font-size: 0.9rem;
		color: var(--text-muted, var(--text));
		opacity: 0.75;
	}

	.bloc {
		margin-block: 0 3rem;
	}

	.bloc h2 {
		font-size: 1.45rem;
		line-height: 1.25;
		margin: 0 0 0.6rem;
	}

	.intro {
		margin: 0 0 1.25rem;
		line-height: 1.6;
	}

	.liste {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1rem;
	}

	.apport {
		margin: 0 0 0.5rem;
		line-height: 1.5;
	}

	.reference {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		opacity: 0.85;
	}

	.langue {
		white-space: nowrap;
		opacity: 0.8;
	}

	.langue::before {
		content: ' · ';
	}

	.contact {
		margin: 3rem 0 0;
		padding-top: 1.5rem;
		border-top: 1px solid var(--border);
		line-height: 1.6;
	}
</style>
