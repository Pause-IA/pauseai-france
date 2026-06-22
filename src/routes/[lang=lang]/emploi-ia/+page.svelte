<script lang="ts">
	import { onMount } from 'svelte'
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Testimonial, ArticleShowcaseItem } from '$lib/types'
	import type { Lang } from '$lib/i18n'
	import SurveyCharts from '$lib/components/SurveyCharts.svelte'
	import { getT } from '$lib/i18n'

	export let data: PageData

	interface PageData {
		lang: Lang
		testimonials: Testimonial[]
		articleShowcaseItems: ArticleShowcaseItem[]
	}

	$: t = getT(data.lang)
	$: lang = data.lang

	let testimonials = data.testimonials
	let articleShowcaseItems = data.articleShowcaseItems

	testimonials.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0
		const dateB = b.date ? new Date(b.date).getTime() : 0
		return dateB - dateA
	})

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
			title: "De l'impact social de l'IA",
			source: 'La Vie Économique',
			date: 'Mai 2026',
			url: 'https://www.vie-economique.com/actualites/de-limpact-social-de-lia/'
		},
		{
			title:
				"« La question de la sécurité n'est pas posée » — le collectif Pause IA demande un moratoire sur le développement de l'intelligence artificielle",
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
				embedOptions: { spinnerColor: '#FF9416' }
			})
		}

		const existing = document.querySelector(
			`script[src="${SCRIPT_SRC}"]`
		) as HTMLScriptElement | null
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

<svelte:head>
	<title>{t.emploi_ia.meta_title}</title>
	<meta name="description" content={t.emploi_ia.meta_desc} />
	<meta name="keywords" content={t.emploi_ia.keywords} />
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content={t.emploi_ia.meta_title} />
	<meta property="og:description" content={t.emploi_ia.meta_desc} />
	<meta property="og:image" content="https://pauseia.fr/emploi-ia/emploi-IA.png" />
	<meta property="og:url" content="https://pauseia.fr/emploi-ia" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={t.emploi_ia.meta_title} />
	<meta name="twitter:description" content={t.emploi_ia.meta_desc} />
	<meta name="twitter:image" content="https://pauseia.fr/emploi-ia/emploi-IA.png" />
</svelte:head>

<article>
	<hgroup>
		<UnderlinedTitle as="h1">{t.emploi_ia.title}</UnderlinedTitle>
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

	<section id="enquete" aria-labelledby="enquete-heading">
		<h2 id="enquete-heading">{t.emploi_ia.survey_section_title}</h2>
		<EmploiForm {lang} />
	</section>

	<section id="temoignage" aria-labelledby="temoignage-heading">
		<SurveyCharts {t} {lang} />

		<h2 id="temoignage-heading">{t.emploi_ia.testimonials_section_title}</h2>
		<div class="testimonials-cta">
			{t.emploi_ia.testimonials_section_text_1}<a href="/{lang}/emploi-ia/questionnaire"
				>{t.emploi_ia.testimonials_section_link}</a
			>{t.emploi_ia.testimonials_section_text_2}
		</div>

		<TestimonialCarousel {testimonials} {lang} />
	</section>

	<section id="analyses" aria-labelledby="analyses-heading">
		<h2 id="analyses-heading">{t.emploi_ia.analyses_section_title}</h2>
		<p>{t.emploi_ia.analyses_section_text}</p>
		<div class="article-cards">
			<a class="article-card" href={t.emploi_ia.article1_url}>
				<span class="card-meta">Article 1/2 &middot; 4 min</span>
				<h3 class="article-card-title">{t.emploi_ia.article1_title}</h3>
				<p class="article-card-desc">{t.emploi_ia.article1_desc}</p>
				<span class="article-card-link">{t.emploi_ia.analyses_read} &rarr;</span>
			</a>
			<a class="article-card" href={t.emploi_ia.article2_url}>
				<span class="card-meta">Article 2/2 &middot; 5 min</span>
				<h3 class="article-card-title">{t.emploi_ia.article2_title}</h3>
				<p class="article-card-desc">{t.emploi_ia.article2_desc}</p>
				<span class="article-card-link">{t.emploi_ia.analyses_read} &rarr;</span>
			</a>
		</div>
	</section>

	<section id="bigger-problem" aria-labelledby="bigger-problem-heading" class="bigger-problem">
		<h2 id="bigger-problem-heading">{t.emploi_ia.bigger_problem_title}</h2>
		<p>{t.emploi_ia.bigger_problem_text_1}</p>
		<p>{t.emploi_ia.bigger_problem_text_2}</p>

		<p class="cta-transition">{t.emploi_ia.cta_transition}</p>

		<p class="cta-callout">{t.emploi_ia.cta_callout}</p>
		<p class="cta-detail">{t.emploi_ia.cta_callout_detail}</p>

		<div id="av-embed-container" class="av-embed"></div>
	</section>

	<section id="evolution" aria-labelledby="evolution-heading">
		<h2 id="evolution-heading">{t.emploi_ia.evolution_section_title}</h2>
		<p>
			{t.emploi_ia.evolution_section_text_1}<strong>{t.emploi_ia.evolution_strong}</strong>{t
				.emploi_ia.evolution_section_text_2}
		</p>
		<p>{t.emploi_ia.evolution_section_text_3}</p>
		<p>
			<a href="https://jobloss.ai/" target="_blank" rel="noopener noreferrer">
				{t.emploi_ia.evolution_link}
			</a>
		</p>
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

	<section id="revue" aria-labelledby="revue-heading">
		<h2 id="revue-heading">{t.emploi_ia.press_section_title}</h2>
		<p>{t.emploi_ia.press_section_text}</p>
		<ArticleShowcase articles={articleShowcaseItems} {lang} />
	</section>
</article>

<style>
	article {
		max-inline-size: 50rem;
		width: 100%;
		margin-inline: auto;
		margin-top: 2rem;
		padding: 0 1rem;
		overflow-x: clip;
	}

	section:not(:last-child) {
		margin-bottom: 5rem;
	}

	/* ── Lead callout ── */
	.lead {
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--brand-subtle, #c96900);
		border-left: 4px solid var(--brand, #ff9416);
		background: var(--brand-light, #fff5e8);
		padding: 1rem 1.25rem;
		margin: 1.5rem 0 1.5rem;
	}

	/* ── Stat block ── */
	.stat-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1.25rem;
		border: 1px solid rgba(255, 148, 22, 0.35);
		border-radius: 10px;
		padding: 0.9rem 1.5rem;
		margin: 2rem 0 3rem;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.stat-block:hover {
		border-color: var(--brand, #ff9416);
		box-shadow: 0 2px 12px rgba(255, 148, 22, 0.12);
	}

	.stat-number {
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 800;
		line-height: 1;
		color: var(--brand-subtle, #c96900);
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
		color: var(--text, #111);
		line-height: 1.3;
	}

	.stat-source {
		font-size: 0.75rem;
		color: var(--text-secondary, #888);
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

	/* ── Article cards ── */
	.article-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
		gap: 1.25rem;
		margin-top: 1.5rem;
	}

	.card-meta {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary, #888);
		letter-spacing: 0.04em;
	}

	.article-card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 10px;
		background: var(--bg-card, #fafafa);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.article-card:hover {
		border-color: var(--brand, #ff9416);
		box-shadow: 0 2px 12px rgba(255, 148, 22, 0.12);
	}

	.article-card-title {
		font-size: 1rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text, #111);
		margin: 0;
	}

	.article-card-desc {
		font-size: 0.9rem;
		color: var(--text-secondary, #676e7a);
		line-height: 1.5;
		margin: 0;
		flex: 1;
	}

	.article-card-link {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--brand-subtle, #c96900);
	}

	.article-card:hover .article-card-link {
		color: var(--brand, #ff9416);
	}

	/* ── Bigger-problem section ── */
	.bigger-problem {
		background: var(--bg-subtle, #f7f7f5);
		border-left: 4px solid var(--brand, #ff9416);
		border-radius: 0 12px 12px 0;
		padding: 2rem 2.25rem;
	}

	:global([data-theme='dark']) .bigger-problem {
		background: rgba(255, 255, 255, 0.04);
	}

	.bigger-problem h2 {
		margin-top: 0;
	}

	/* ── CTA transition ── */
	.cta-transition {
		font-style: italic;
		color: var(--text-secondary, #555);
		margin: 1.5rem 0 0;
	}

	/* ── CTA callout ── */
	.cta-callout {
		font-weight: 600;
		color: var(--brand-subtle, #c96900);
		border-left: 4px solid var(--brand, #ff9416);
		background: var(--brand-light, #fff5e8);
		padding: 0.85rem 1.1rem;
		margin: 1.5rem 0 0.5rem;
		line-height: 1.5;
	}

	.cta-detail {
		font-size: 0.95rem;
		color: var(--text-secondary, #555);
		margin: 0 0 0.25rem;
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
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.press-item:hover {
		border-color: var(--brand, #ff9416);
		box-shadow: 0 2px 8px rgba(255, 148, 22, 0.1);
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
		color: var(--brand-subtle, #c96900);
	}

	.press-date {
		font-size: 0.75rem;
		color: var(--text-secondary, #888);
	}

	.press-date::before {
		content: '·';
		margin-right: 0.5rem;
	}

	.press-title {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text, #111);
		line-height: 1.4;
	}

	.press-item:hover .press-title {
		color: var(--brand-subtle, #c96900);
	}

	.press-item-featured {
		position: relative;
		padding: 1.25rem 1.4rem 1.1rem;
		border-width: 2px;
		border-color: var(--brand, #ff9416);
		background: rgba(255, 148, 22, 0.04);
	}

	.press-badge {
		position: absolute;
		top: -0.65rem;
		left: 1rem;
		background: var(--brand, #ff9416);
		color: white;
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
		color: var(--text-secondary, #555);
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
