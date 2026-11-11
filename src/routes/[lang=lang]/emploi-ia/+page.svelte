<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { onMount } from 'svelte'
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialSlideshow from '$components/TestimonialSlideshow.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { ArticleShowcaseItem } from '$lib/types'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let data: PageData

	interface PageData {
		lang: Lang
		articleShowcaseItems: ArticleShowcaseItem[]
	}

	$: t = getT(data.lang)
	$: lang = data.lang

	let articleShowcaseItems = data.articleShowcaseItems

	articleShowcaseItems.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0
		const dateB = b.date ? new Date(b.date).getTime() : 0
		return dateB - dateA
	})

	articleShowcaseItems = articleShowcaseItems.map((item) => ({
		...item,
		image: item.image || '/emploi-ia/article-placeholder.svg'
	}))

	const ACTIVOICE_CAMPAIGN_ID = 'lia-ne-detruira-pas-que-votre-emploi'

	const pressArticles = [
		{
			title: "« De la réticence au refus, ces cadres qui vivent mal l'injonction d'utiliser l'IA »",
			source: 'Le Monde',
			date: '6 juin 2026',
			url: 'https://www.lemonde.fr/emploi/article/2026/06/05/de-la-reticence-au-refus-ces-cadres-qui-vivent-mal-l-injonction-d-utiliser-l-ia_6697853_1698637.html',
			featured: true,
			excerpt:
				"Article s'appuyant notamment sur les résultats de la campagne de témoignages de Pause IA."
		},
		{
			title: 'Pause IA à la matinale ICI Paris Île-de-France (1er mai)',
			source: 'ICI Paris Île-de-France',
			date: '1er mai 2026',
			url: 'https://www.dailymotion.com/video/xa7pbcq?start=4708'
		},
		{
			title:
				"IA et travail : une poignée d'hommes de la Silicon Valley doit-elle être en mesure de remodeler tout notre contrat social ?",
			source: 'Le Nouvel Obs',
			date: '1er mai 2026',
			url: 'https://www.nouvelobs.com/economie/20260501.OBS114604/ia-et-travail-une-poignee-d-hommes-de-la-silicon-valley-doit-elle-etre-en-mesure-de-remodeler-tout-notre-contrat-social.html'
		},
		{
			title:
				"1er mai – Pause IA alerte sur les enjeux sociaux et démocratiques de la course à l'IA",
			source: "L'Est en Val",
			date: '1er mai 2026',
			url: 'https://www.esteval.fr/article.46137.expertises-1er-mai-pause-ia-alerte-sur-les-enjeux-sociaux-et-democratiques-de-la-course-a-l-ia'
		},
		{
			title: "Manifestation de Pause IA devant l'Assemblée le 1er mai",
			source: 'MesInfos',
			date: '1er mai 2026',
			url: 'https://mesinfos.fr/75000-paris/manifestation-de-pause-ia-devant-l-assemblee-le-1er-mai-245348.html'
		},
		{
			title: 'Clémence Peyrot de l’association Pause IA, à la manif du 1er mai Périgueux',
			source: 'Radios Libres en Périgord',
			date: '1er mai 2026',
			url: 'https://www.radioslibresenperigord.com/audio/clemence-peyrot-de-lassociation-pause-ia-a-la-manif-du-1er-mai-perigueux/'
		},
		{
			title: "De l'impact social de l'IA",
			source: 'La Vie Économique',
			date: 'Mai 2026',
			url: 'https://www.vie-economique.com/actualites/de-limpact-social-de-lia/'
		},
		{
			title:
				"« La question de la sécurité n'est pas posée » : le collectif Pause IA demande un moratoire sur le développement de l'intelligence artificielle",
			source: 'Dordogne Libre',
			date: 'Mai 2026',
			url: 'https://www.dordognelibre.fr/dordogne/la-question-de-la-securite-n-est-pas-posee-le-collectif-pause-ia-demande-un-moratoire-sur-le-developpement-de-l-intelligence-artificielle-28895566.php'
		}
	]

	onMount(() => {
		const SCRIPT_SRC = 'https://app.activoice.org/embed/v1/loader.js'

		function initEmbed() {
			const w = window as Window & {
				Activoice?: { init: (opts: Record<string, unknown>) => void }
			}
			if (!w.Activoice) return
			w.Activoice.init({
				container: '#av-embed-container',
				campaignId: ACTIVOICE_CAMPAIGN_ID,
				embedOptions: { spinnerColor: 'var(--brand)' }
			})
		}

		const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
		if (existing) {
			if ((window as Window & { Activoice?: unknown }).Activoice) {
				initEmbed()
			} else {
				existing.addEventListener('load', initEmbed, { once: true })
			}
			return
		}

		const script = document.createElement('script')
		script.src = SCRIPT_SRC
		script.async = true
		script.addEventListener('load', initEmbed, { once: true })
		document.head.appendChild(script)
	})
</script>

<PostMeta
	title={t.emploi_ia.meta_title}
	description={t.emploi_ia.meta_desc}
	image="/emploi-ia/emploi-IA.png"
/>

<article>
	<!-- En-tête au modèle des autres campagnes : étiquette de statut, titre
	     resserré. Cette page gardait le titre au filet dégradé et n’avait
	     aucun surtitre, seule de toutes les pages de campagne. -->
	<hgroup>
		<span class="badge">{lang === 'en' ? 'Campaign under way' : 'Campagne en cours'}</span>
		<h1>{t.emploi_ia.title}</h1>
	</hgroup>

	<p class="lead">{t.emploi_ia.intro_lead}</p>

	<p>{t.emploi_ia.intro_text}</p>

	<a class="stat-block" href="https://jobloss.ai/" target="_blank" rel="noopener noreferrer">
		<span class="stat-number">{t.emploi_ia.stat_number}</span>
		<div class="stat-text">
			<span class="stat-label">{t.emploi_ia.stat_label}</span>
			<span class="stat-source">{t.emploi_ia.stat_source}</span>
		</div>
	</a>

	<a class="primary-cta" href="#ecrire-elus">
		<span class="primary-cta-label">{t.emploi_ia.hero_cta_label}</span>
		<span class="primary-cta-sub">{t.emploi_ia.hero_cta_sub}</span>
		<span class="primary-cta-arrow" aria-hidden="true">→</span>
	</a>

	<section id="temoignage" aria-labelledby="temoignage-heading">
		<h2 id="temoignage-heading">{t.emploi_ia.testimonials_section_title}</h2>
		<TestimonialSlideshow {lang} />

		<div id="enquete" class="survey-block">
			<h3>{t.emploi_ia.survey_section_title}</h3>
			<EmploiForm {lang} />
		</div>
	</section>

	<section id="analyses" aria-labelledby="analyses-heading">
		<h2 id="analyses-heading">{t.emploi_ia.analyses_section_title}</h2>
		<p>{t.emploi_ia.analyses_section_text}</p>
		<div class="article-cards">
			<a class="article-card" href={t.emploi_ia.article1_url}>
				<span class="card-meta">Article 1/3 &middot; 4 min</span>
				<h3 class="article-card-title">{t.emploi_ia.article1_title}</h3>
				<p class="article-card-desc">{t.emploi_ia.article1_desc}</p>
				<span class="article-card-link">{t.emploi_ia.analyses_read} &rarr;</span>
			</a>
			<a class="article-card" href={t.emploi_ia.article2_url}>
				<span class="card-meta">Article 2/3 &middot; 5 min</span>
				<h3 class="article-card-title">{t.emploi_ia.article2_title}</h3>
				<p class="article-card-desc">{t.emploi_ia.article2_desc}</p>
				<span class="article-card-link">{t.emploi_ia.analyses_read} &rarr;</span>
			</a>
			<a class="article-card article-card-featured" href={t.emploi_ia.article3_url}>
				<span class="article-badge">{t.emploi_ia.article3_badge}</span>
				<span class="card-meta">Article 3/3 &middot; 7 min</span>
				<h3 class="article-card-title">{t.emploi_ia.article3_title}</h3>
				<p class="article-card-desc">{t.emploi_ia.article3_desc}</p>
				<span class="article-card-link">{t.emploi_ia.analyses_read} &rarr;</span>
			</a>
		</div>
	</section>

	<section id="ecrire-elus" aria-labelledby="ecrire-elus-heading" class="bigger-problem">
		<h2 id="ecrire-elus-heading">{t.emploi_ia.bigger_problem_title}</h2>
		<p>{t.emploi_ia.elus_intro}</p>

		<p class="cta-callout">{t.emploi_ia.elus_models}</p>

		<figure class="elus-example">
			<figcaption>{t.emploi_ia.elus_example_label}</figcaption>
			<blockquote>{t.emploi_ia.elus_example_quote}</blockquote>
		</figure>

		<p class="cta-detail">{t.emploi_ia.cta_callout_detail}</p>
		<p class="cta-guide">{t.emploi_ia.elus_guide}</p>

		<div id="av-embed-container" class="av-embed"></div>
	</section>

	<section id="presse-campagne" aria-labelledby="presse-campagne-heading">
		<h2 id="presse-campagne-heading">Pause IA dans la presse</h2>
		<p>Articles parus lors de la manifestation du 1er mai et des actions locales de la campagne.</p>

		<div class="press-list">
			{#each pressArticles as article}
				<a
					href={article.url}
					target="_blank"
					rel="noopener noreferrer"
					class="press-item"
					class:press-item-featured={article.featured}
				>
					{#if article.featured}
						<span class="press-badge">À la une</span>
					{/if}
					<div class="press-item-meta">
						<span class="press-source">{article.source}</span>
						<span class="press-date">{article.date}</span>
					</div>
					<span class="press-title">{article.title}</span>
					{#if article.excerpt}
						<p class="press-excerpt">{article.excerpt}</p>
					{/if}
				</a>
			{/each}
		</div>
	</section>

	{#if articleShowcaseItems.length}
		<section id="revue" aria-labelledby="revue-heading">
			<h2 id="revue-heading">{t.emploi_ia.press_section_title}</h2>
			<p>{t.emploi_ia.press_section_text}</p>
			<ArticleShowcase articles={articleShowcaseItems} {lang} />
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: var(--width-content);
		width: 100%;
		margin-inline: auto;
		margin-top: 2rem;
		padding: 0 1rem;
		overflow-x: clip;
	}

	section:not(:last-child) {
		margin-bottom: 5rem;
	}

	/* ── Bloc questionnaire, regroupé sous les témoignages ── */
	.survey-block {
		margin-top: 2.5rem;
		padding-top: 1.75rem;
		border-top: 1px solid var(--border);
		scroll-margin-top: 5.5rem;
	}

	.survey-block h3 {
		margin: 0 0 0.5rem;
		font-size: 1.25rem;
	}

	/* ── Lead callout ── */
	.badge {
		display: inline-block;
		margin-bottom: 1rem;
		padding: 0.3rem 0.7rem;
		border-radius: 3px;
		background: var(--brand);
		color: var(--on-brand);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	hgroup h1 {
		font-size: clamp(2.1rem, 6vw, 3.2rem);
		line-height: 1.06;
		letter-spacing: -0.025em;
		margin-bottom: 1.5rem;
	}

	.lead {
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--brand-subtle);
		border-left: 4px solid var(--brand);
		background: var(--brand-light);
		padding: 1rem 1.25rem;
		margin: 1.5rem 0 1.5rem;
	}

	/* ── Stat block ── */
	.stat-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1.25rem;
		border: 1px solid rgba(var(--brand-rgb), 0.35);
		border-radius: var(--radius-md);
		padding: 0.9rem 1.5rem;
		margin: 2rem 0 3rem;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.stat-block:hover {
		border-color: var(--brand);
		box-shadow: 0 2px 12px rgba(var(--brand-rgb), 0.12);
	}

	.stat-number {
		font-size: clamp(2rem, 5.5vw, 3rem);
		font-weight: 800;
		line-height: 1;
		color: var(--brand-subtle);
		letter-spacing: -0.02em;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.stat-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.stat-label {
		font-size: 0.95rem;
		color: var(--text);
		line-height: 1.3;
	}

	.stat-source {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	@media (max-width: 540px) {
		.stat-block {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.4rem;
			padding: 0.8rem 1rem;
		}

		.stat-number {
			font-size: 2.2rem;
		}
	}

	/* ── Primary CTA (action n°1 : écrire aux élus) ── */
	.primary-cta {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		position: relative;
		background: var(--brand);
		color: var(--on-brand);
		text-decoration: none;
		padding: 1.1rem 3rem 1.1rem 1.5rem;
		border-radius: var(--radius-md);
		margin: 0 0 3rem;
		box-shadow: 0 2px 14px rgba(var(--brand-rgb), 0.28);
		transition:
			transform 0.15s,
			box-shadow 0.2s,
			background 0.2s;
	}

	.primary-cta:hover {
		background: var(--brand);
		transform: translateY(-1px);
		box-shadow: 0 4px 18px rgba(var(--brand-rgb), 0.35);
	}

	.primary-cta-label {
		font-size: 1.15rem;
		font-weight: 800;
		line-height: 1.2;
	}

	.primary-cta-sub {
		font-size: 0.9rem;
		/* Sur l'aplat orange, le texte reste foncé (le blanc n'y donne que 2,2:1). */
		color: var(--on-brand-muted);
		line-height: 1.3;
	}

	.primary-cta-arrow {
		position: absolute;
		right: 1.4rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 1.5rem;
		font-weight: 700;
	}

	/* ── Article cards ── */
	.article-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-top: 1.5rem;
	}

	@media (max-width: 640px) {
		.article-cards {
			grid-template-columns: 1fr;
		}
	}

	.card-meta {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.04em;
	}

	.article-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1.1rem 1.2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background: var(--bg-card);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.article-card:hover {
		border-color: var(--brand);
		box-shadow: 0 2px 12px rgba(var(--brand-rgb), 0.12);
	}

	/* ── Carte mise en avant : le bilan de la campagne ── */
	.article-card-featured {
		border-color: var(--brand);
		border-width: 2px;
		background: var(--brand-light);
		box-shadow: 0 2px 12px rgba(var(--brand-rgb), 0.14);
	}

	:global([data-theme='dark']) .article-card-featured {
		background: rgba(var(--brand-rgb), 0.08);
	}

	.article-badge {
		align-self: flex-start;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--on-brand);
		background: var(--brand);
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
	}

	.article-card-title {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
		margin: 0;
	}

	.article-card-desc {
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.5;
		margin: 0;
		flex: 1;
	}

	.article-card-link {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--brand-subtle);
	}

	.article-card:hover .article-card-link {
		color: var(--brand-subtle);
	}

	/* ── Bigger-problem section ── */
	.bigger-problem {
		background: var(--bg-subtle);
		border-radius: var(--radius-md);
		padding: 2rem 2.25rem;
		/* Décale l'ancre (#ecrire-elus) sous l'en-tête fixe lors du scroll. */
		scroll-margin-top: 5.5rem;
	}

	:global([data-theme='dark']) .bigger-problem {
		background: rgba(var(--on-dark-rgb), 0.04);
	}

	.bigger-problem h2 {
		margin-top: 0;
	}

	/* ── CTA callout ── */
	.cta-callout {
		font-weight: 600;
		color: var(--brand-subtle);
		border-left: 4px solid var(--brand);
		background: var(--brand-light);
		padding: 0.85rem 1.1rem;
		margin: 1.5rem 0 0.5rem;
		line-height: 1.5;
	}

	.cta-detail {
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin: 0 0 0.25rem;
	}

	.cta-guide {
		font-weight: 700;
		color: var(--brand-subtle);
		margin: 0.75rem 0 0.25rem;
	}

	/* ── Élus email example ── */
	.elus-example {
		margin: 1.25rem 0;
	}

	.elus-example figcaption {
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
		margin-bottom: 0.4rem;
	}

	.elus-example blockquote {
		margin: 0;
		padding: 1rem 1.25rem;
		border-left: 3px solid var(--brand);
		background: var(--bg);
		border-radius: 0 8px 8px 0;
		font-style: italic;
		line-height: 1.6;
		color: var(--text);
	}

	:global([data-theme='dark']) .elus-example blockquote {
		background: rgba(var(--on-dark-rgb), 0.03);
	}

	/* ── Press list ── */
	.press-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.press-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.85rem 1.1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.press-item:hover {
		border-color: var(--brand);
		box-shadow: 0 2px 8px rgba(var(--brand-rgb), 0.1);
	}

	.press-item-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.press-source {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-subtle);
	}

	.press-date {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.press-date::before {
		content: '·';
		margin-right: 0.5rem;
	}

	.press-title {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text);
		line-height: 1.4;
	}

	.press-item:hover .press-title {
		color: var(--brand-subtle);
	}

	.press-item-featured {
		position: relative;
		padding: 1.25rem 1.4rem 1.1rem;
		border-width: 2px;
		border-color: var(--brand);
		background: rgba(var(--brand-rgb), 0.04);
	}

	.press-badge {
		position: absolute;
		top: -0.65rem;
		left: 1rem;
		background: var(--brand);
		color: var(--on-brand);
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.2rem 0.55rem;
		border-radius: 4px;
		line-height: 1.2;
	}

	.press-item-featured .press-title {
		font-size: 1.05rem;
		font-weight: 600;
		margin-top: 0.15rem;
	}

	.press-excerpt {
		font-size: 0.875rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin: 0.3rem 0 0;
	}

	/* ── ActiVoice embed ── */
	.av-embed {
		margin-top: 1.5rem;
		width: 100%;
		max-width: 100%;
	}

	.av-embed :global(iframe) {
		width: 100% !important;
		max-width: 100% !important;
		min-height: 400px;
		border: 0;
		display: block;
	}
</style>
