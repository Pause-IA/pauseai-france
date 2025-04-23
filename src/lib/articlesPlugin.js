import { SKIP, visit } from 'unist-util-visit'
import path from 'path'

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('unified').Plugin<[], Root>} Plugin
 * @typedef {import('vfile').VFile} VFile
 */

/**
 * Creates an HTML node for ArticleCard
 * @param {string} title
 * @param {string} blurb
 * @param {string} url
 * @returns {HTML}
 */
function ArticleCard(title, blurb, url) {
	return {
		type: 'html',
		value: `<ArticleCard title="${title}" blurb="${blurb}" url="${url}" />`
	}
}

/** @type {Plugin} */
export function articlesPlugin() {
	return (tree, vfile) => {
		const customFile = /** @type {VFile & {filename: string}} */ (vfile)
		const filename = path.basename(customFile.filename)

		if (filename !== 'articles.md') {
			return
		}

		let articlesCount = 0

		// Filtrer les métadonnées du frontmatter
		tree.children = tree.children.filter(
			(node) => node.type !== 'yaml' && node.type !== 'text' && node.type !== 'heading'
		)

		visit(tree, 'list', (node) => {
			/** @type {List} */
			const listNode = node
			/** @type {HTML[]} */
			const articles = []

			listNode.children.slice(0, 6).forEach((item) => {
				if (item.type !== 'listItem') return

				const article = { title: '', blurb: '', url: '' }

				visit(item, 'paragraph', (para) => {
					para.children.forEach((child) => {
						if (child.type === 'text') {
							const lines = child.value.split('\n')
							lines.forEach((line) => {
								const titleMatch = line.match(/title\s*:\s*(.+)/)
								if (titleMatch) article.title = titleMatch[1].trim()

								const blurbMatch = line.match(/blurb\s*:\s*(.+)/)
								if (blurbMatch) article.blurb = blurbMatch[1].trim()
							})
						}
						if (child.type === 'link') article.url = child.url
					})
				})

				if (article.title && article.blurb && article.url) {
					articles.push(ArticleCard(article.title, article.blurb, article.url))
					articlesCount++
				}
			})

			// Créer la grille avec suppression des puces
			Object.assign(listNode, {
				type: 'html',
				value: `
          <ul>
            ${articles.map((article) => `<li>${article.value}</li>`).join('')}
          </ul>
        `,
				children: []
			})
		})
	}
}
