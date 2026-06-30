import { SKIP, visit } from 'unist-util-visit'
import path from 'path'

/**
 * @typedef {import('hast').Element} HastElement
 * @typedef {import('unified').Plugin<[], HastElement>} Plugin
 */

/**
 * Creates an Accordion element compatible with HAST structure.
 * @constructor
 * @param {number} accordionCount - The accordion count for generating ID
 * @param {HastElement} node - The HAST element to manipulate
 */
function Accordion(accordionCount, node) {
	/** @type {'element'} */
	this.type = 'element'

	/** @type {string} */
	this.tagName = 'Accordion'

	/** @type {import('hast').Properties} */
	this.properties = { id: `accordion${accordionCount.toString()}` }

	/** @type {HastElement[]} */
	this.children = [
		{
			type: 'element',
			tagName: 'svelte:fragment',
			properties: { slot: 'head' },
			children: node.children.length > 0 ? [node.children[0]] : []
		},
		{
			type: 'element',
			tagName: 'svelte:fragment',
			properties: { slot: 'details' },
			children: []
		}
	]
}

/**
 * @type {Plugin}
 */
export function faqPlugin() {
	return function transformer(tree, file) {
		// file with the wrong type is passed to the plugin so cast it
		const customFile = /** @type {import('vfile').VFile & {filename: string}} */ (file)

		// Only process FAQ files (faq.md or a localized variant like faq.en.md)
		if (!/^faq(\.[a-z]{2})?\.md$/.test(path.basename(customFile.filename))) {
			return
		}

		/** @type { Accordion | null} */
		let currentAccordion = null
		let accordionCount = 0

		visit(tree, 'element', (node, index, parent) => {
			if (parent && index) {
				if (node.tagName === 'h2') {
					// Category separator: add a class and reset the current accordion
					node.properties = { ...node.properties, class: 'faq-category' }
					currentAccordion = null
				} else if (node.tagName === 'h3') {
					// This is a new question, create a new Accordion
					accordionCount++
					currentAccordion = new Accordion(accordionCount, node)
					// replace current node with the accordion
					parent.children[index] = currentAccordion
				} else if (currentAccordion) {
					// This is content for the current question, add it to the details slot
					currentAccordion.children[1].children.push(node)
					// Then remove the current node
					parent.children.splice(index, 1)
				}
				// Never traverse children, we only need the first level of the tree
				return SKIP
			}
		})
	}
}
