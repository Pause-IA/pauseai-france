<script lang="ts">
	// Page d'accueil de l'espace « Les faits » : une carte par section.
	// Une section s'ajoute ici (et dans svelte.config.js pour le prérendu).
	import PostMeta from '$components/PostMeta.svelte'
	import { Card, PageHero } from '$components/ui'
	import { BarChart3, LogOut, MessageSquareQuote } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: isEn = data.lang === 'en'
	$: title = isEn ? 'The facts' : 'Les faits'
	$: description = isEn
		? 'Researchers leaving the AI labs, warnings from scientists and industry leaders, expert surveys: what those who build AI say about its risks.'
		: 'Chercheurs qui quittent les labos, mises en garde de scientifiques et de dirigeants, sondages d’experts : ce que disent des risques de l’IA ceux qui la construisent.'

	$: sections = [
		{
			href: `/${data.lang}/faits/demissions`,
			titre: isEn ? 'Resignations' : 'Démissions',
			resume: isEn
				? 'Researchers who left the AI labs while warning about the risks.'
				: 'Des chercheurs quittent les labos d’IA en alertant sur les risques.',
			icone: LogOut
		},
		{
			href: `/${data.lang}/faits/declarations`,
			titre: isEn ? 'Statements' : 'Déclarations',
			resume: isEn
				? 'Joint statements and individual voices, in their own words.'
				: 'Textes collectifs et voix individuelles, dans leurs propres mots.',
			icone: MessageSquareQuote
		},
		{
			href: `/${data.lang}/faits/sondages`,
			titre: isEn ? 'Expert surveys' : 'Sondages d’experts',
			resume: isEn
				? 'What thousands of AI researchers estimate about the risks.'
				: 'Ce qu’estiment des milliers de chercheurs en IA sur les risques.',
			icone: BarChart3
		}
	]
</script>

<PostMeta {title} {description} />

<article>
	<PageHero>
		{title}
		<svelte:fragment slot="lede">{description}</svelte:fragment>
	</PageHero>

	<div class="sections">
		{#each sections as s (s.href)}
			<Card href={s.href} padding="compact" class="section">
				<div class="entete">
					<h2>{s.titre}</h2>
					<span class="icone" aria-hidden="true"><svelte:component this={s.icone} size={18} /></span
					>
				</div>
				<p>{s.resume}</p>
			</Card>
		{/each}
	</div>
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.sections {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
		gap: 1.25rem;
		max-inline-size: 48rem;
	}

	.entete {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
	}

	h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	.icone {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		inline-size: 2.4rem;
		block-size: 2.4rem;
		border: 1px solid var(--border);
		border-radius: 50%;
		color: var(--text-2);
		transition:
			background 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	:global(.section:hover) .icone,
	:global(.section:focus-visible) .icone {
		background: var(--brand);
		border-color: var(--brand);
		color: var(--on-brand);
	}

	p {
		margin: 0.6rem 0 0;
		color: var(--text-2);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
