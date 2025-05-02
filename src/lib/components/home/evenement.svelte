<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import eventData from '$posts/evenements.md'

	const label_id = 'evenements-title'

	// Valeurs par défaut
	let title = 'Nos évènements à venir'
	let buttonText = "S'inscrire aux événements"
	let buttonUrl = 'https://info.helloasso.com/'
	let displaySection = true // Par défaut, la section est visible

	// On récupère le contenu directement
	let EventComponent = eventData

	// Pour l'extraction des métadonnées et du contenu
	onMount(() => {
		setTimeout(() => {
			// Cibler directement les éléments cachés par ID
			const titleElem = document.querySelector('#meta-title')
			if (titleElem) {
				title = titleElem.textContent || title
				console.log('Found title:', title)
			}

			const buttonTextElem = document.querySelector('#meta-button-text')
			if (buttonTextElem) {
				buttonText = buttonTextElem.textContent || buttonText
				console.log('Found button text:', buttonText)
			}

			const buttonUrlElem = document.querySelector('#meta-button-url')
			if (buttonUrlElem) {
				buttonUrl = buttonUrlElem.textContent || buttonUrl
				console.log('Found button URL:', buttonUrl)
			}

			// Récupérer la valeur de Afficher_Section_Evenement
			const displayElem = document.querySelector('#Afficher_Section_Evenement')
			if (displayElem) {
				// Si displayElem.textContent est 'false', displaySection sera false
				// Dans tous les autres cas (y compris 'true'), displaySection sera true
				displaySection = displayElem.textContent?.trim().toLowerCase() !== 'false'
				console.log('Section display status:', displaySection)
			}

			console.log('Final values:', { title, buttonText, buttonUrl, displaySection })
		}, 100)
	})
</script>

{#if displaySection}
	<section aria-labelledby={label_id}>
		<UnderlinedTitle id={label_id}>Nos évènements</UnderlinedTitle>

		<div class="full-width-container">
			<div class="content-wrapper">
				<div class="content-container">
					<h3>{title}</h3>
					<div class="markdown-content">
						<svelte:component this={EventComponent} />
					</div>
				</div>
				<div class="button-container">
					<Button href={buttonUrl}>{buttonText}</Button>
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	/* Fond orange pleine largeur */
	.full-width-container {
		background-color: #ff9315;
		padding: 2rem 0 4rem;
		margin-top: 2rem;
		margin-bottom: 4rem; /* Marge en bas */
		width: 100vw; /* Largeur de la fenêtre */
		position: relative;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;
	}

	.content-wrapper {
		max-width: var(--max-width, 1200px);
		margin: 0 auto;
		padding: 0 1rem;
		box-sizing: border-box;
	}

	.content-container {
		max-width: 800px;
		margin: 0 auto 2rem;
		text-align: center;
		padding: 0 1rem;
	}

	.content-container h3 {
		color: black;
		margin-bottom: 1.5rem;
		font-size: 2.4rem; /* Titre nettement plus grand */
		font-weight: 700;
		line-height: 1.2; /* Ajustement de l'interligne pour grand titre */
	}

	/* Style appliqué globalement pour cibler le contenu Markdown */
	:global(.markdown-content p) {
		font-size: 1.4rem;
		line-height: 1.6;
		margin-bottom: 2.5rem; /* Plus d'espace avant le bouton */
		color: black;
		font-weight: 500;
	}

	.button-container {
		display: flex;
		justify-content: center;
		margin: 0 auto;
		width: 100%;
		text-align: center;
	}

	:global(.button-container a) {
		background-color: #222222 !important; /* Noir plus profond mais pas #000 */
		color: white !important;
		font-weight: bold !important;
		font-size: 1.2rem !important; /* Bouton légèrement plus grand */
		padding: 1rem 2.5rem !important; /* Plus de padding pour un bouton plus imposant */
		transition:
			transform 0.2s,
			background-color 0.2s !important;
		margin: 0 auto;
		border-radius: 4px !important; /* Coins légèrement arrondis */
	}

	:global(.button-container a:hover) {
		transform: translateY(-2px) !important;
		background-color: #000000 !important; /* Noir complet au survol */
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important; /* Ombre plus visible */
	}
</style>
