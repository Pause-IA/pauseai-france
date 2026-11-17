// Parsing partagé de la FAQ (src/posts/faq.md) pour la page d'accueil (teaser)
// et la page dédiée /faq. La FAQ est écrite en markdown : « ## » = catégorie,
// « ### » = question, le reste = réponse. On en tire une version HTML statique
// (bonne pour le SEO) et une version texte (pour la recherche et le JSON-LD).

export interface FaqItem {
	id: string
	question: string
	/** Réponse en markdown brut. */
	answerMd: string
	/** Réponse en HTML (paragraphes, gras, liens). */
	answerHtml: string
	/** Réponse en texte simple (recherche, JSON-LD). */
	answerText: string
	category: string
}

export interface FaqCategory {
	category: string
	items: FaqItem[]
}

function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Rendu markdown minimal suffisant pour nos réponses : gras et liens. Les liens
 * externes (sources) s'ouvrent dans un nouvel onglet. */
function renderInline(s: string): string {
	return escapeHtml(s)
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m: string, text: string, href: string) => {
			const external = /^https?:\/\//.test(href)
			const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
			return `<a href="${href}"${attrs}>${text}</a>`
		})
}

function renderAnswerHtml(md: string): string {
	return md
		.trim()
		.split(/\n{2,}/)
		.map((para) => `<p>${renderInline(para.trim())}</p>`)
		.join('\n')
}

/** Identifiant stable dérivé du texte de la question (pour les ancres #). */
function slugify(s: string): string {
	return s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60)
}

function stripMarkdown(md: string): string {
	return md
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/_([^_]+)_/g, '$1')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

/** Découpe le markdown de la FAQ en catégories → questions. */
/** Apostrophe typographique, comme le fait le plugin sur le reste du site. */
const apostrophe = (t: string) =>
	t.replace(/([A-Za-zÀ-ÖØ-öø-ÿ])'([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1\u2019$2')

export function parseFaq(raw: string): FaqCategory[] {
	// Retire le frontmatter éventuel.
	// L'apostrophe typographique est appliquée ici : cette page lit le
	// Markdown brut, sans passer par mdsvex, donc le plugin de typographie ne
	// la voit jamais. Ses questions s'affichaient avec l'apostrophe droite,
	// seules de tout le site.
	const body = apostrophe(raw.replace(/^---\n[\s\S]*?\n---\n/, ''))
	const lines = body.split('\n')
	const categories: FaqCategory[] = []
	let current: FaqCategory | null = null
	let question = ''
	let answer = ''
	const usedIds = new Set<string>()

	const flush = () => {
		if (!question || !current) return
		// Id stable dérivé du texte (ancres #), avec suffixe en cas de doublon.
		let id = slugify(question) || 'question'
		if (usedIds.has(id)) {
			let n = 2
			while (usedIds.has(`${id}-${n}`)) n++
			id = `${id}-${n}`
		}
		usedIds.add(id)
		current.items.push({
			id,
			question,
			answerMd: answer.trim(),
			answerHtml: renderAnswerHtml(answer),
			answerText: stripMarkdown(answer),
			category: current.category
		})
		question = ''
		answer = ''
	}

	for (const line of lines) {
		if (line.startsWith('## ')) {
			flush()
			current = { category: line.replace('## ', '').trim(), items: [] }
			categories.push(current)
		} else if (line.startsWith('### ')) {
			flush()
			question = line.replace('### ', '').trim()
			answer = ''
		} else if (question) {
			answer += line + '\n'
		}
	}
	flush()
	return categories.filter((c) => c.items.length > 0)
}

/** Liste plate de toutes les questions. */
export function flattenFaq(categories: FaqCategory[]): FaqItem[] {
	return categories.flatMap((c) => c.items)
}
/** JSON-LD FAQPage (rich snippets Google). */
/** Données structurées FAQPage. La mise en balise revient à `jsonLdTag`. */
export function faqJsonLd(items: FaqItem[]): unknown {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answerText }
		}))
	}
}
