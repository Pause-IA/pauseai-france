<script lang="ts">
	import { onMount } from 'svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	const label_id = 'logos-title'

	let logosData: { src: string; alt: string; url: string }[] = []

	// Vos paramètres existants
	let logoWidth = 110
	let logoHeight = 110
	let logoGap = 50
	let logoMargin = 0
	let sectionPaddingTop = 10
	let sectionPaddingBottom = 10
	let hoverScale = 1.1
	let maxLogos = 10

	let containerRef: HTMLDivElement
	let useScrollMode = false

	function updateDisplayMode() {
		if (!containerRef) return

		// Utiliser la largeur du conteneur réelle au lieu de window.innerWidth
		const containerWidth = containerRef.getBoundingClientRect().width

		// Calculer la largeur totale nécessaire pour afficher tous les logos
		const totalRequiredWidth = logosData.length * (logoWidth + 2 * logoMargin + logoGap)

		// Ajouter une marge de sécurité (10% de la largeur du conteneur)
		const safetyMargin = containerWidth * 0.15

		// Activer le mode défilement si l'espace est insuffisant
		useScrollMode = containerWidth - safetyMargin < totalRequiredWidth

		console.log({
			containerWidth,
			totalRequiredWidth,
			useScrollMode
		})
	}

	onMount(() => {
		// Charger les données des logos
		loadLogos()

		// Configurer le listener de redimensionnement
		updateDisplayMode()
		window.addEventListener('resize', updateDisplayMode)

		// Cleanup function conforme au type attendu par onMount
		return () => {
			window.removeEventListener('resize', updateDisplayMode)
		}
	})

	// Déplacer le chargement des logos dans une fonction séparée
	async function loadLogos() {
		try {
			const response = await fetch('/src/posts/vu-sur.md')
			if (!response.ok) {
				console.error('Échec du chargement du fichier vu-sur.md:', response.statusText)
				return
			}

			const text = await response.text()

			// Traiter le fichier Markdown comme avant
			const lines = text
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => line)
			const maxLogosLine = lines.find((line) => line.startsWith('#maxLogos='))
			if (maxLogosLine) {
				maxLogos = parseInt(maxLogosLine.replace('#maxLogos=', '').trim(), 10) || maxLogos
				lines.splice(lines.indexOf(maxLogosLine), 1)
			}
			const logosLines = lines.filter(
				(line) => !line.startsWith('#') && !line.startsWith('<!--') && line.includes('|')
			)
			logosData = logosLines
				.slice(0, maxLogos + 1)
				.map((line) => {
					const parts = line.split('|').map((part) => part.trim())
					if (parts.length !== 3) {
						console.warn(`Format de ligne invalide : "${line}"`)
						return null
					}
					const [src, alt, url] = parts
					return { src, alt, url }
				})
				.filter(
					(logo): logo is { src: string; alt: string; url: string } =>
						logo !== null && isValidLogo(logo)
				)

			// Mettre à jour l'affichage une fois les logos chargés
			setTimeout(updateDisplayMode, 0)
		} catch (error) {
			console.error('Erreur lors du chargement des logos:', error)
		}
	}

	function isValidLogo(logo: { src: string; alt: string; url: string }): boolean {
		return (
			typeof logo.src === 'string' &&
			logo.src.trim() !== '' &&
			typeof logo.alt === 'string' &&
			logo.alt.trim() !== '' &&
			typeof logo.url === 'string' &&
			logo.url.trim() !== ''
		)
	}

	function handleImageError(event: Event, src: string) {
		console.error('Image introuvable :', src)
		const target = event.currentTarget as HTMLImageElement
		target.style.display = 'none'
	}
</script>

<section
	aria-labelledby={label_id}
	class="logos-section"
	style="padding-top: {sectionPaddingTop}px; padding-bottom: {sectionPaddingBottom}px;"
>
	<UnderlinedTitle id={label_id}>Nos apparitions médiatiques</UnderlinedTitle>

	<!-- Utiliser bind:this pour obtenir la référence au conteneur -->
	<div bind:this={containerRef} class="logos-outer-container">
		<!-- Conteneur standard (affiché seulement si assez d'espace) -->
		{#if !useScrollMode}
			<div class="logos-container standard-view" style="gap: {logoGap}px;">
				{#each logosData as logo}
					<a
						href={logo.url}
						target="_blank"
						rel="noopener noreferrer"
						class="logo-wrapper"
						style="margin-left: {logoMargin}px; margin-right: {logoMargin}px;"
					>
						<img
							src={logo.src}
							alt={logo.alt}
							class="logo"
							style="width: {logoWidth}px; height: {logoHeight}px;"
							on:error={(event) => handleImageError(event, logo.src)}
						/>
					</a>
				{/each}
			</div>
		{:else}
			<!-- Conteneur avec défilement (affiché si pas assez d'espace) -->
			<div class="logos-scroller">
				<div class="logos-scroll-container">
					{#each logosData as logo}
						<a href={logo.url} target="_blank" rel="noopener noreferrer" class="logo-wrapper">
							<img
								src={logo.src}
								alt={logo.alt}
								class="logo"
								style="width: {logoWidth}px; height: {logoHeight}px;"
								on:error={(event) => handleImageError(event, logo.src)}
							/>
						</a>
					{/each}

					<!-- Duplication pour défilement continu -->
					{#each logosData as logo}
						<a href={logo.url} target="_blank" rel="noopener noreferrer" class="logo-wrapper">
							<img
								src={logo.src}
								alt={logo.alt}
								class="logo"
								style="width: {logoWidth}px; height: {logoHeight}px;"
								on:error={(event) => handleImageError(event, logo.src)}
							/>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Style de la section principale */
	.logos-section {
		width: 100%;
		text-align: left;
	}

	/* Vue standard pour grands écrans */
	.logos-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* Vue défilante - avec espace vertical supplémentaire */
	.logos-scroller {
		width: 100%;
		overflow: hidden;
		margin: 2rem 0;
		padding: 10px 0; /* Marge verticale supplémentaire */
	}

	.logos-scroll-container {
		display: flex;
		animation: scroll-logos 30s linear infinite;
		width: fit-content;
		padding: 5px 0; /* Espace supplémentaire pour éviter la coupure */
	}

	.logo-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		transition:
			transform 0.3s ease,
			filter 0.3s ease;
		padding: 0 1rem;
	}

	.logo {
		width: 100%;
		height: 100%;
		object-fit: contain;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
		border-radius: 8px;
	}

	.logo-wrapper:hover,
	.logo-wrapper:focus {
		transform: scale(1.1);
		filter: brightness(1.1);
	}

	/* Animation de défilement */
	@keyframes scroll-logos {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%); /* La moitié car nous avons dupliqué les logos */
		}
	}

	/* Pause sur survol */
	.logos-scroll-container:hover {
		animation-play-state: paused;
	}

	.logos-outer-container {
		width: 100%;
		box-sizing: border-box;
	}
</style>
