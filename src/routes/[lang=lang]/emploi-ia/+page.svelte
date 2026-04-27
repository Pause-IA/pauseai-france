<script lang="ts">
	import { onMount } from 'svelte'
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Testimonial, ArticleShowcaseItem } from '$lib/types'
	import type { Lang } from '$lib/i18n'
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

	const ACTIVOICE_CAMPAIGN_ID = '6b7ceb0e-22b1-48de-b8ae-5617c4920d05'

	onMount(() => {
		const init = () => {
			// @ts-expect-error - Activoice global injected by external script
			if (typeof window.Activoice !== 'undefined') {
				// @ts-expect-error
				window.Activoice.init({
					container: '#av-embed-container',
					campaignId: ACTIVOICE_CAMPAIGN_ID,
					embedOptions: { spinnerColor: '#FF9416' }
				})
			} else {
				setTimeout(init, 100)
			}
		}
		init()
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
	<script src="https://beta.app.activoice.org/embed/v1/loader.js"></script>
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
		<h2 id="temoignage-heading">{t.emploi_ia.testimonials_section_title}</h2>
		<p>
			{t.emploi_ia.testimonials_section_text_1}<a href="/{lang}/emploi-ia/questionnaire"
				>{t.emploi_ia.testimonials_section_link}</a
			>{t.emploi_ia.testimonials_section_text_2}
		</p>
		<TestimonialCarousel {testimonials} {lang} />
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

	/* ── ActiVoice embed ── */
	.av-embed {
		margin-top: 1.5rem;
		max-width: 100%;
		overflow: hidden;
	}
</style>
