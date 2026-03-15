<script lang="ts">
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import EmploiAvisForm from '$components/EmploiAvisForm.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import A from '$components/custom/a.svelte'
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

	// Sort testimonials by date descending (most recent first)
	testimonials.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0
		const dateB = b.date ? new Date(b.date).getTime() : 0
		return dateB - dateA
	})

	// Sort articleShowcaseItems by date descending
	articleShowcaseItems.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0
		const dateB = b.date ? new Date(b.date).getTime() : 0
		return dateB - dateA
	})

	// Set default image for articleShowcaseItems if undefined
	articleShowcaseItems = articleShowcaseItems.map((item) => ({
		...item,
		image: item.image || '/emploi-ia/article-placeholder.svg'
	}))
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

	<div>
		<h2>{t.emploi_ia.who_we_are_title}</h2>

		<p>{t.emploi_ia.who_we_are_text}</p>

		<h2>{t.emploi_ia.resources_title}</h2>
		<p>{t.emploi_ia.resources_intro}</p>
		<ul>
			<li>
				<A href="#enquete">{t.emploi_ia.resource_survey}</A>
			</li>
			<li>
				<A href="#temoignage">{t.emploi_ia.resource_testimonials}</A>
			</li>
			<li><A href="#revue">{t.emploi_ia.resource_press}</A></li>
			<li>
				<A href="#evolution">{t.emploi_ia.resource_chart}</A>
			</li>
			<li>
				<A href="#avis-form">{t.emploi_ia.resource_feedback}</A>
			</li>
		</ul>

		<h2>{t.emploi_ia.threat_title}</h2>
		<p>
			{t.emploi_ia.threat_text_1}<a
				href="https://fr.wikipedia.org/wiki/Intelligence_artificielle_g%C3%A9n%C3%A9rale"
				target="_blank"
				rel="noopener noreferrer">{t.emploi_ia.threat_link_agi}</a
			>{t.emploi_ia.threat_text_2}
		</p>

		<section id="enquete" aria-labelledby="enquete-heading">
			<h2 id="enquete-heading">{t.emploi_ia.survey_section_title}</h2>
			<p>{t.emploi_ia.survey_section_text}</p>

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

		<section id="avis-form" aria-labelledby="avis-heading">
			<h2 id="avis-heading">{t.emploi_ia.feedback_section_title}</h2>
			<p>{t.emploi_ia.feedback_section_text}</p>

			<EmploiAvisForm {lang} />
		</section>
	</div>
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 2rem;
	}

	section:not(:last-child) {
		margin-bottom: 5rem;
	}
</style>
