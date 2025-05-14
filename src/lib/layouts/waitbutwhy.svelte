<svelte:head>
	<script>
		window.popupContent = {
			blue: new Map(),
			gray: new Map()
		}

		window.addEventListener('DOMContentLoaded', () => {
			// Refresh popup content
			document.querySelectorAll('.blue-popup').forEach((popup) => {
				const number = popup.dataset.number
				const content = window.popupContent.blue.get(number)
				popup.querySelector('.popup-content').innerHTML = content
			})

			document.querySelectorAll('.gray-popup').forEach((popup) => {
				const number = popup.dataset.number
				const content = window.popupContent.gray.get(number)
				popup.querySelector('.popup-content').innerHTML = content
			})

			// Close popups when clicking outside
			document.addEventListener(
				'click',
				(e) => {
					// if (!e.target.matches('.popup-trigger')) {
					document.querySelectorAll('.popup-content').forEach((content) => {
						if (content !== e.target.nextElementSibling) {
							content.style.display = 'none'
						}
					})
					// }
				},
				true
			)

			// Function to position popup
			function positionPopup(trigger, content) {
				const rect = trigger.getBoundingClientRect()
				const spaceBelow = window.innerHeight - rect.bottom
				const spaceAbove = rect.top

				const isOnTop = content.style.bottom === '100%'

				if (isOnTop && spaceAbove > 200) {
					// Keep it on top
					content.style.top = 'auto'
					content.style.bottom = '100%'
					content.style.marginTop = '0'
					content.style.marginBottom = '12px'
				} else if (!isOnTop && spaceBelow > 200) {
					// Keep it on bottom
					content.style.top = '100%'
					content.style.bottom = 'auto'
					content.style.marginTop = '12px'
					content.style.marginBottom = '0'
				} else if (spaceBelow > spaceAbove) {
					// Move to bottom
					content.style.top = '100%'
					content.style.bottom = 'auto'
					content.style.marginTop = '12px'
					content.style.marginBottom = '0'
				} else {
					// Move to top
					content.style.top = 'auto'
					content.style.bottom = '100%'
					content.style.marginTop = '0'
					content.style.marginBottom = '12px'
				}
			}

			// Click handlers
			document.querySelectorAll('.popup-trigger').forEach((trigger) => {
				trigger.addEventListener('click', (e) => {
					// const content = e.target.nextElementSibling
					// content.style.left = '0'
					// content.style.top = '100%'
					// content.style.display = content.style.display === 'block' ? 'none' : 'block'

					const content = e.target.nextElementSibling
					if (content.style.display === 'block') {
						content.style.transform = 'scale(0)'
						content.style.opacity = '0'
						setTimeout(() => (content.style.display = 'none'), 200)
					} else {
						positionPopup(trigger, content)
						content.style.display = 'block'
						content.style.transform = 'scale(0)'
						requestAnimationFrame(() => {
							content.style.transform = 'scale(1)'
							content.style.opacity = '1'
						})
					}
				})
			})

			// Scroll handler
			window.addEventListener('scroll', () => {
				document.querySelectorAll('.popup-content').forEach((content) => {
					if (content.style.display === 'block') {
						const trigger = content.previousElementSibling
						positionPopup(trigger, content)
					}
				})
			})
		})
	</script>
</svelte:head>

<div class="wbw-container">
	<article class="wbw-content">
		<slot />
	</article>
</div>

<style>
	:global(.wbw-container) {
		background-color: white;
		min-height: 100vh;
		padding: 2rem;
		width: 100vw; /* Use viewport width */
		margin-left: calc(-50vw + 50%); /* Center the container */
		margin-right: calc(-50vw + 50%);
		position: relative; /* Establish positioning context */
	}

	:global(.wbw-content) {
		max-width: 800px;
		margin: 0 auto;
		font-family: 'Noto Sans', Helvetica, Arial, sans-serif;
		font-size: 100%;
		line-height: 1.6;
	}

	:global(.wbw-content img) {
		max-width: 85%;
		height: auto;
		display: block;
		margin: 2rem auto;
	}

	:global(.wbw-content a) {
		color: #0066cc;
		text-decoration: none;
	}

	:global(.wbw-content a:hover) {
		text-decoration: underline;
	}

	:global(.wbw-centered) {
		text-align: center;
		margin: 2rem auto;
	}

	/* Round blue triggers */
	:global(.blue-popup .popup-trigger) {
		background: #5fa1cc;
		color: white;
		border-radius: 50%;
		padding: 2px 6px;
		font-size: 0.75em;
		vertical-align: super;
		cursor: pointer;
	}
	/* Lighter blue when hovering */
	:global(.blue-popup .popup-trigger:hover) {
		background: #94c0dd;
	}
	/* Darker blue when inside a blue box */
	:global(.bluebox .blue-popup .popup-trigger) {
		background: #2b6a99;
	}

	/* Lighter blue when inside a blue box */
	:global(.bluebox2 .blue-popup .popup-trigger) {
		background: #4891c1;
	}

	/* Square gray triggers */
	:global(.gray-popup .popup-trigger) {
		background: #cccccc;
		color: white;
		padding: 1px 4px;
		font-size: 0.6em;
		vertical-align: super;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	/* Darker gray when hovering */
	:global(.gray-popup .popup-trigger:hover) {
		background: #909090;
	}

	/* Style for content displayed when we clicked on the trigger. Force black on white background */
	:global(.popup-content) {
		display: none;
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 10px;
		width: max-content;
		color: black;
		max-width: 40ch;
		white-space: normal;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		z-index: 100;
		top: 100%;
		left: 0;
		margin-top: 12px;

		transform-origin: 10% 0;
		transition:
			transform 0.2s,
			opacity 0.2s;
		transform: scale(0);
		opacity: 0;
	}

	/* Appearing animation */
	:global(.popup-content[style*='display: block']) {
		transform: scale(1);
		opacity: 1;
	}
	/* Appearing animation */
	:global(.popup-content[style*='bottom: 100%']) {
		transform-origin: 10% 100%;
	}

	/* Arrow pointing to the trigger 1/3 */
	:global(.popup-content::before) {
		content: '';
		position: absolute;
		top: -8px;
		left: 10px;
		width: 15px;
		height: 15px;
		background: white;
		border-left: 1px solid #ccc;
		border-top: 1px solid #ccc;
		transform: rotate(45deg);
	}
	/* Arrow pointing to the trigger 2/3 */
	:global(.popup-content[style*='bottom: 100%']::before) {
		top: auto;
		bottom: -8px;
		transform: rotate(225deg);
	}
	/* Arrow pointing to the trigger 3/3 */
	:global(.blue-popup),
	:global(.gray-popup) {
		position: relative;
	}

	/* Blue box */
	:global(.bluebox) {
		background-color: #4c96c6;
		padding: 12px;
		color: white;
		margin: 8px 0;
	}
	:global(.bluebox a) {
		color: #afffc0;
	}

	/* Blue box (darker) */
	:global(.bluebox2) {
		background-color: #1d6391;
		padding: 12px;
		color: white;
		margin: 8px 0;
	}
	:global(.bluebox2 a) {
		color: #afffc0;
	}

	:global(.graybox) {
		background-color: #efefef;
		padding: 12px;
		color: black;
		margin: 8px 0;
		margin-left: 40px;
	}
</style>
