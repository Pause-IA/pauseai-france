import { SKIP, visit } from 'unist-util-visit'
import { toHtml } from 'hast-util-to-html'
import { cp } from 'fs'

const BLUE_POPUP_INDICATOR = /\(\((\d+)\)\)/g
const GRAY_POPUP_INDICATOR = /\{\((\d+)\)\}/g
const BLUE_SINGLE_LINE_CONTENT_START_PATTERN = /^\((\d+)\)\s*:(?!@\()/
const GRAY_SINGLE_LINE_CONTENT_START_PATTERN = /^\{(\d+)\}\s*:(?!@\()/
const BLUE_MULTILINE_CONTENT_START_PATTERN = /^\((\d+)\)\s*:@\($/m
const GRAY_MULTILINE_CONTENT_START_PATTERN = /^\{(\d+)\}\s*:@\($/m
const SINGLE_LINE_CONTENT_END_PATTERN = /\n/m
const MULTILINE_CONTENT_END_PATTERN = /^\)$/m
// const GRAY_MULTILINE_CONTENT = /^\{(\d+)\}\s*:<\s?([\s\S]*?)\s?>$/gm
const BLUEBOX_START_PATTERN = /bluebox\-start/g
const BLUEBOX2_START_PATTERN = /bluebox2\-start/g
const GRAYBOX_START_PATTERN = /graybox\-start/g
const COLOR_BOX_ALL_END_PATTERN = /colorbox\-end/g
// const BLUEBOX2_END_PATTERN = /bluebox2\-end/g
const BLUE_POPUP_CLASS = 'blue-popup'
const GRAY_POPUP_CLASS = 'gray-popup'
const POPUP_TRIGGER_CLASS = 'popup-trigger'
const POPUP_CONTENT_CLASS = 'popup-content'
const BLUEBOX_CLASS = 'bluebox'
const BLUEBOX2_CLASS = 'bluebox2'
const GRAYBOX_CLASS = 'graybox'

export function rehypeWBWPopups2() {
	return (/** @type {any} */ tree) => {
		const debugDisplayOn = 1

		// First pass: Process regular popups
		visit(tree, 'text', (node, index, parent) => {
			if (!parent || typeof index !== 'number') return

			const value = node.value

			// if (debugDisplayOn === 1) {
			// 	console.log('Node value :', value)
			// }

			// Process indicators
			const blueIndicators = [...value.matchAll(BLUE_POPUP_INDICATOR)].map((match) => ({
				number: match[1],
				fullMatch: match[0],
				html: `<span class="${BLUE_POPUP_CLASS}" data-number="${match[1]}">
			<span class="${POPUP_TRIGGER_CLASS}">${match[1]}</span>
			<span class="${POPUP_CONTENT_CLASS}">fake content</span>
		  </span>`
			}))

			const grayIndicators = [...value.matchAll(GRAY_POPUP_INDICATOR)].map((match) => ({
				number: match[1],
				fullMatch: match[0],
				html: `<span class="${GRAY_POPUP_CLASS}" data-number="${match[1]}">
			<span class="${POPUP_TRIGGER_CLASS}">${match[1]}</span>
			<span class="${POPUP_CONTENT_CLASS}">fake content</span>
		  </span>`
			}))

			// Apply transformations
			let newValue = value

			const allIndicators = [...blueIndicators, ...grayIndicators]
			// Replace indicators with HTML spans
			allIndicators.forEach(({ fullMatch, html }) => {
				newValue = newValue.replace(fullMatch, html)
			})

			// Update node if changes were made
			if (newValue !== value) {
				const htmlNode = {
					type: 'raw',
					value: newValue
				}
				parent.children.splice(index, 1, htmlNode)
			}
		})

		// Second pass: Process multiline content
		processMultilineContent(tree)

		return tree
	}
}

// Helper function to process multiline content
function processMultilineContent(/** @type {any} */ tree) {
	// Process each parent node that might contain children
	function processNode(/** @type {any} */ node) {
		if (!node.children || node.children.length === 0) return

		// Linear loop through children
		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i]

			// Process nested children first (depth-first)
			if (child.children) {
				processNode(child)
			}

			let nodeToCheck
			// Check if this is a text node with a multiline start pattern
			if (child.type === 'text') {
				nodeToCheck = child
			} else if (child?.tagName === 'p' && child?.children?.[0]?.type === 'text') {
				nodeToCheck = child?.children?.[0]
			}

			if (nodeToCheck) {
				let isBlue = false
				let isGray = false
				let isMultiline = false
				let startPattern
				let endPattern

				if (BLUE_SINGLE_LINE_CONTENT_START_PATTERN.test(nodeToCheck.value)) {
					isBlue = true
					startPattern = BLUE_SINGLE_LINE_CONTENT_START_PATTERN
				} else if (GRAY_SINGLE_LINE_CONTENT_START_PATTERN.test(nodeToCheck.value)) {
					isGray = true
					startPattern = GRAY_SINGLE_LINE_CONTENT_START_PATTERN
				} else if (BLUE_MULTILINE_CONTENT_START_PATTERN.test(nodeToCheck.value)) {
					isBlue = true
					isMultiline = true
					startPattern = BLUE_MULTILINE_CONTENT_START_PATTERN
				} else if (GRAY_MULTILINE_CONTENT_START_PATTERN.test(nodeToCheck.value)) {
					isGray = true
					isMultiline = true
					startPattern = GRAY_MULTILINE_CONTENT_START_PATTERN
				}

				if (isMultiline) {
					endPattern = MULTILINE_CONTENT_END_PATTERN
				} else {
					endPattern = SINGLE_LINE_CONTENT_END_PATTERN
				}

				// console.log ('Value checked :', nodeToCheck.value)
				if (isBlue || isGray) {
					// console.log('Child value:', child.value)
					// console.log('Is blue popup:', isBlue)
					// console.log('Is gray popup:', isGray)
					// console.log('Is multiline:', isMultiline)
					// console.log('Pattern used:', startPattern)

					const match = nodeToCheck.value.match(startPattern)
					// console.log('Match result:', match)

					const popupNumber = match?.[1]
					const fullMatch = match?.[0]

					// console.log('Popup number:', popupNumber)

					if (!popupNumber) continue

					// Collect nodes until end pattern, including the one containing the start and end patterns
					const contentNodes = []
					let j = i
					let endFound = false

					while (j < node.children.length && !endFound) {
						const currentNode = node.children[j]
						// if (!isMultiline) {
						// 	// console.log(
						// 	// 	'Processing node',
						// 	// 	j,
						// 	// 	'of',
						// 	// 	node.children.length,
						// 	// 	'type:',
						// 	// 	currentNode.type,
						// 	// 	'with value:',
						// 	// 	JSON.stringify(currentNode?.value)
						// 	// )
						// }

						let addCurrentNode = true

						if (currentNode.type === 'text') {
							endFound = endPattern.test(currentNode.value)
							if (endFound) {
								currentNode.value = currentNode.value.replace(endPattern, '')
								if (currentNode.value.length === 0) {
									addCurrentNode = false
								}
							}
							// currentNode.value = currentNode.value.replace('\n', '<br>')
						} else if (node?.tagName === 'p') {
							const firstChild = node?.children?.[0]
							if (firstChild?.type === 'text') {
								endFound = endPattern.test(firstChild.value)
								if (endFound) {
									firstChild.value = firstChild.value.replace(endPattern, '')
									if (firstChild.value.length === 0) {
										addCurrentNode = false
									}
								}
							}
						}
						if (addCurrentNode) {
							contentNodes.push(currentNode)
						}

						if (!endFound || isMultiline) {
							j++
						}
					}

					if (endFound) {
						nodeToCheck.value = nodeToCheck.value.replace(fullMatch, '')

						// Convert collected nodes to HTML
						const htmlContent = contentNodes.map((n) => toHtml(n)).join('')
						const popupType = isBlue ? 'blue' : 'gray'

						// Create script node
						const scriptNode = {
							type: 'raw',
							value: `<script>window.popupContent.${popupType}.set('${popupNumber}', ${JSON.stringify(htmlContent)});</script>`
						}

						// console.log('Inserted script node:', JSON.stringify(scriptNode))
						// Replace all nodes (start pattern, content nodes, and end pattern) with script
						const deleteCount = j - i
						// console.log('Replacing', deleteCount, 'nodes')
						node.children.splice(i, deleteCount, scriptNode)

						// Continue from the new position
						i = i + 1
					}
				}
			}
		}
	}
	// console.log('Tree:', JSON.stringify(tree, null, 2));
	// Start processing from the root
	processNode(tree)
}

export function rehypeWBWColorBoxes() {
	return (/** @type {any} */ tree) => {
		if (!tree || !tree.children) {
			return tree
		}

		function processColorBoxes(/** @type {any} */ nodes) {
			const /** @type {any} */ newNodes = []
			let i = 0

			while (i < nodes.length) {
				const node = nodes[i]
				// console.log('Processing node:', node)
				let pushNodeUnchanged = false
				if (node.tagName === 'p') {
					const startNodeValue = node.children?.[0]?.value
					const isBlueBox1 = BLUEBOX_START_PATTERN.test(startNodeValue)
					const isBlueBox2 = BLUEBOX2_START_PATTERN.test(startNodeValue)
					const isGrayBox1 = GRAYBOX_START_PATTERN.test(startNodeValue)

					// console.log('Is box1:', isBlueBox1)
					// console.log('Is box2:', isBlueBox2)

					if (isBlueBox1 || isBlueBox2 || isGrayBox1) {
						// console.log('Node value:', startNodeValue)
						// Determine box type
						const boxClass = isBlueBox1
							? BLUEBOX_CLASS
							: isBlueBox2
								? BLUEBOX2_CLASS
								: GRAYBOX_CLASS
						// console.log('Box class:', boxClass)

						// Collect nodes until matching end tag
						const boxNodes = []
						let depth = 1
						i++

						while (i < nodes.length && depth > 0) {
							if (nodes[i].tagName === 'p') {
								const value = nodes[i].children?.[0]?.value
								// console.log('Processing inner node value:', value)

								const isBoxStart =
									BLUEBOX_START_PATTERN.test(value) ||
									BLUEBOX2_START_PATTERN.test(value) ||
									GRAYBOX_START_PATTERN.test(value)
								const isBoxEnd = COLOR_BOX_ALL_END_PATTERN.test(value)
								// console.log('Is box start:', isBoxStart)
								// console.log('Is box end:', isBoxEnd)
								if (isBoxStart) {
									depth++
								}
								if (isBoxEnd) {
									depth--
								}
								// console.log('Current depth:', depth)

								if (depth > 0) {
									boxNodes.push(nodes[i])
								}
							} else {
								boxNodes.push(nodes[i])
							}
							i++
						}
						// console.log('Collected box nodes:', boxNodes)

						// Process nested boxes recursively
						const processedChildren = processColorBoxes(boxNodes)
						// console.log('Processed children:', processedChildren)

						// Create box container
						newNodes.push({
							type: 'element',
							tagName: 'div',
							properties: { className: boxClass },
							children: processedChildren
						})
					} else {
						pushNodeUnchanged = true
					}
				} else {
					pushNodeUnchanged = true
				}
				if (pushNodeUnchanged) {
					newNodes.push(node)
					i++
				}
			}
			return newNodes
		}

		// Start processing from root
		tree.children = processColorBoxes(tree.children)

		// console.log('End result:', JSON.stringify(tree.children, null, 2))
	}
}
