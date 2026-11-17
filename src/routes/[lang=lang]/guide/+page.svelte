<script lang="ts">
	/**
	 * Guide de contribution : la feuille A4 qu'on distribue en main propre,
	 * reprise à l'identique pour le web.
	 *
	 * La forme est celle du document imprimé, pas celle du site : cette page
	 * n'est pas référencée, on y arrive par le QR code de la feuille ou par un
	 * lien donné de la main à la main, et le visiteur doit retrouver
	 * exactement ce qu'il a entre les mains.
	 *
	 * Le balisage et la feuille de style viennent de
	 * scripts/pdf/guide-contribution.html, qui sert aussi à fabriquer le PDF
	 * (scripts/pdf-guide.mjs). Les deux doivent rester identiques : quand une
	 * étape change, elle change dans le HTML source, puis on recopie ici et on
	 * relance le script.
	 *
	 * Ajouts propres au web : la feuille s'adapte aux petits écrans (le A4 est
	 * figé en millimètres), un bouton de téléchargement, et des cases à cocher
	 * qui fonctionnent — sur le papier on les coche au stylo.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import { onMount } from 'svelte'

	const ETAPES = 8
	const CLE = 'guide-contribution-etapes'

	let faites: boolean[] = Array(ETAPES).fill(false)

	// L'avancement est propre au navigateur de la personne : rien n'est envoyé,
	// et une mémoire indisponible (navigation privée, cookies bloqués) ne doit
	// pas empêcher la page de fonctionner.
	onMount(() => {
		try {
			const brut = localStorage.getItem(CLE)
			if (!brut) return
			const lu = JSON.parse(brut)
			if (Array.isArray(lu)) faites = Array.from({ length: ETAPES }, (_, i) => lu[i] === true)
		} catch {
			/* tant pis : on repart de cases vides */
		}
	})

	function basculer(i: number) {
		faites[i] = !faites[i]
		try {
			localStorage.setItem(CLE, JSON.stringify(faites))
		} catch {
			/* l'état reste valable pour la visite en cours */
		}
	}

	$: nombreFaites = faites.filter(Boolean).length
	$: toutFait = nombreFaites === ETAPES
</script>

<PostMeta
	title="Guide de contribution"
	description="Vous voulez contribuer à Pause IA mais vous ne savez pas par où commencer : huit étapes, de dix minutes à quelques heures."
/>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:wght@900&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700;900&display=swap"
		rel="stylesheet"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="feuille">
	<p class="avancement" class:fini={toutFait}>
		{nombreFaites} étape{nombreFaites > 1 ? 's' : ''} sur 8
	</p>

	<p class="telecharger">
		<a href="/pdfs/guide-contribution.pdf"> Télécharger la feuille (PDF) </a>
	</p>

	<div class="a4-page">
		<div>
			<!-- Header Section -->
			<header class="header">
				<div>
					<!-- Le logo du site, pas celui servi par GitHub : la source du
							     PDF y pointe parce qu'elle doit marcher hors du site. -->
					<img src="/logo.svg" width="200px" alt="Pause IA" />
				</div>
				<div class="main-title">
					Vous voulez contribuer à PauseIA,<br />
					mais vous ne savez pas où commencer? <br />
					Suivez le guide! <br />
				</div>
			</header>

			<!-- Steps Section -->
			<section class="steps-container">
				<!-- Step 1 -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[0]}
						aria-pressed={faites[0]}
						aria-label="Marquer l’étape 1 comme faite"
						on:click={() => basculer(0)}
					></button>
					<div class="step-content">
						<div class="step-title">
							1. Inscrivez-vous à nos canaux de communication officiels (10min)
						</div>
						<div class="step-desc">
							Sur notre site, explorez les différents onglets pour découvrir comment participer à
							notre communication.
							<i>Si vous le pouvez</i>, suivez-nous sur au moins <b>deux réseaux différents</b>.
							<br />
							Visitez notre blog et inscrivez-vous à notre
							<b>Newsletter</b>.
						</div>
						<a href="/fr/" class="step-link"> https://pauseia.fr </a>
					</div>
					<span class="box-symbol">📖</span>
				</div>

				<!-- Step 2 -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[1]}
						aria-pressed={faites[1]}
						aria-label="Marquer l’étape 2 comme faite"
						on:click={() => basculer(1)}
					></button>
					<div class="step-content">
						<div class="step-title">2. Envoyez un mail à vos représentants (10min)</div>
						<div class="step-desc">
							Sur notre site web, rendez-vous sur l'espace «
							<b>Écrire à vos élus ou à la presse</b> »
							<br />
							Suivez le guide. Si vous avez une réponse, contactez-nous à l'aide d'un des liens ci-dessous.
						</div>
						<a href="/fr/ecrire-a-mes-elus" class="step-link"
							>https://pauseia.fr/fr/ecrire-a-mes-elus</a
						>
					</div>
					<span class="box-symbol">✉️</span>
				</div>

				<!-- Step 3 (NEW: PauseAction) -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[2]}
						aria-pressed={faites[2]}
						aria-label="Marquer l’étape 3 comme faite"
						on:click={() => basculer(2)}
					></button>
					<div class="step-content">
						<div class="step-title">3. Rejoignez PauseAction (5min)</div>
						<div class="step-desc">Pour facilement nous aider lors de nos actions (optionnel).</div>
						<a
							href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU"
							target="_blank"
							class="step-link"
						>
							https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU
						</a>
					</div>
					<span class="box-symbol">💬</span>
				</div>

				<!-- Step 4 (Former Step 3) -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[3]}
						aria-pressed={faites[3]}
						aria-label="Marquer l’étape 4 comme faite"
						on:click={() => basculer(3)}
					></button>
					<div class="step-content">
						<div class="step-title">4. Adhérez à l'association (10min)</div>
						<div class="step-desc">
							Adhérez à l'association, et contribuez selon vos moyens (aucune obligation de
							participer si vous n'avez pas de revenus stables).
						</div>
						<a href="/fr/rejoindre" class="step-link">https://pauseia.fr/fr/rejoindre</a>
					</div>
					<span class="box-symbol">🎫</span>
				</div>

				<!-- Step 5 (Split: Community - Reduced time) -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[4]}
						aria-pressed={faites[4]}
						aria-label="Marquer l’étape 5 comme faite"
						on:click={() => basculer(4)}
					></button>
					<div class="step-content">
						<div class="step-title">5. Rejoignez notre communauté (40min)</div>
						<div class="step-desc">
							Présentez-vous sur notre Discord, ou par mail si ce n'est pas possible pour vous.
							<br />
							Lisez au moins deux articles sur notre blog.
							<br />
							Sur discord, rendez-vous dans le salon
							<span class="inline-code">#contribuer</span>
							pour participer à au moins un projet.
							<br />
							Si vous le souhaitez, rejoignez un groupe local près de chez vous.
						</div>
						<a href="/fr/rejoindre" class="step-link">https://pauseia.fr/fr/rejoindre</a>
					</div>
					<span class="box-symbol">👥</span>
				</div>

				<!-- Step 6 (Split: Talk to friends - New) -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[5]}
						aria-pressed={faites[5]}
						aria-label="Marquer l’étape 6 comme faite"
						on:click={() => basculer(5)}
					></button>
					<div class="step-content">
						<div class="step-title">6. Parlez à vos proches (1h)</div>
						<div class="step-desc">
							Parlez de PauseIA à au moins 2 membres de votre famille ou 2 de vos amis, et essayez
							de les convaincre de signer notre déclaration.
						</div>
						<a href="/fr/declaration" class="step-link">https://pauseia.fr/fr/declaration</a>
					</div>
					<span class="box-symbol">🙏</span>
				</div>

				<!-- Step 7 (Former Step 5) -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[6]}
						aria-pressed={faites[6]}
						aria-label="Marquer l’étape 7 comme faite"
						on:click={() => basculer(6)}
					></button>
					<div class="step-content">
						<div class="step-title">7. Approfondissez le sujet des risques de l'IA (3h)</div>
						<div class="step-desc">
							Découvrez nos dernières analyses sur notre chaîne YouTube, et explorez notre FAQ sur
							notre site.
							<br />
							Si vous êtes disponible, inscrivez-vous à une session de la «
							<b>Fresque des risques de l'IA</b> » en ligne.
						</div>
						<a href="https://fresquedesrisquesdelia.org" target="_blank" class="step-link"
							>https://fresquedesrisquesdelia.org</a
						>
					</div>
					<span class="box-symbol">🧩</span>
				</div>

				<!-- Step 8 (Former Step 6) -->
				<div class="step-card">
					<button
						type="button"
						class="custom-checkbox"
						class:cochee={faites[7]}
						aria-pressed={faites[7]}
						aria-label="Marquer l’étape 8 comme faite"
						on:click={() => basculer(7)}
					></button>
					<div class="step-content">
						<div class="step-title">8. Formez-vous au recrutement (durée libre)</div>
						<div class="step-desc">
							Découvrez notre guide de «
							<b>Recrutement relationnel</b> » pour convaincre au moins une personne dans votre réseau
							personnel de rejoindre PauseIA. Donnez-lui une copie de cette feuille.
						</div>
						<a href="/fr/guide-sensibilisation" class="step-link">
							https://pauseia.fr/fr/guide-sensibilisation
						</a>
					</div>
					<span class="box-symbol">📢</span>
				</div>
			</section>

			<!-- Ligne d'arrivée : la bannière était prévue dans le document
			     d'origine mais n'y était jamais affichée. Elle ne sert qu'ici,
			     quand les huit étapes sont faites. -->
			{#if toutFait}
				<div class="finish-banner">
					<p class="finish-title">Les huit étapes sont faites. Merci !</p>
					<p class="finish-sub">
						Vous en savez assez pour en parler autour de vous. Donnez une copie de cette feuille à
						la prochaine personne que vous convainquez.
					</p>
				</div>
			{/if}
		</div>

		<div>
			<!-- Contacts Section (Above Finish Line) -->
			<section class="contacts-wrapper">
				<div class="contacts-grid">
					<div class="contact-item">
						<div class="contact-label">Nous poser une question</div>
						<div class="contact-card">
							<a href="mailto:contact@pauseia.fr" target="_blank">contact@pauseia.fr</a>
						</div>
					</div>
					<div class="contact-item">
						<div class="contact-label">Version en ligne du guide</div>
						<div class="contact-card highlight">
							<a href="/fr/guide">pauseia.fr/fr/guide</a>
						</div>
					</div>
				</div>
			</section>
		</div>

		<!-- Questionnaire de satisfaction -->
		<span class="survey-note"
			>N'oubliez pas le questionnaire de satisfaction en bas de la page!</span
		>
		<svg class="survey-arrow" width="78" height="46" viewBox="0 0 78 46" fill="none">
			<path
				d="M72 28 C 62 48, 26 48, 5 29"
				stroke="#ff7a00"
				stroke-width="2.5"
				stroke-linecap="round"
			/>
			<path
				d="M7.3 37.7 L 5 29 L 13.7 31.3"
				stroke="#ff7a00"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</div>
</div>

<style>
	/* stylelint-disable color-no-hex -- Cette page reproduit la feuille A4
	   imprimée, qui a sa propre palette et ne suit pas la charte du site :
	   elle est distribuée en main propre et doit se reconnaître d'un coup
	   d'œil. Les couleurs sont donc celles du document source
	   (scripts/pdf/guide-contribution.html), recopiées telles quelles. Passer
	   par les tokens du site changerait l'apparence de la feuille. */

	:root {
		--primary-orange: #ff7a00;
		--soft-orange: #fff2e6;
		--dark-black: #111111;
		--gray-text: #555555;
		--font-main-title: 'Roboto', sans-serif;
		--font-title: 'Poppins', sans-serif;
		--font-body: 'Inter', sans-serif;
	}

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	/* A4 Document Container */
	.a4-page {
		width: 210mm;
		height: 297mm;
		background: #ffffff;
		padding: 10mm 10mm;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: relative;
		background-size: cover;
	}

	/* Header Section */
	.header {
		display: flex;
		justify-content: space-around;
		margin-bottom: 8px;
	}

	.main-title {
		font-family: var(--font-main-title);
		font-size: 18px;
		font-weight: 900;
		margin: 10px;
		color: var(--dark-black);
		line-height: 1.3;
		text-align: center;
		padding: 0 10px;
	}

	/* Step Boxes Section */
	.steps-container {
		display: flex;
		flex-direction: column;
		gap: 9px;
		margin-top: 4px;
	}

	.step-card {
		border: 1px solid var(--primary-orange);
		border-radius: 8px;
		padding: 8px 10px;
		display: flex;
		align-items: flex-start;
		gap: 12px;
		background: #ffffff;
		position: relative;
	}

	.custom-checkbox {
		width: 20px;
		height: 20px;
		border: 2px solid var(--primary-orange);
		border-radius: 4px;
		margin-top: 2px;
		flex-shrink: 0;
		background: #ffffff;
		/* Au-dessus du lien qui couvre la carte, sinon cocher une case
		   emmenait sur la page de l'étape. */
		position: relative;
		z-index: 2;
		padding: 0;
		cursor: pointer;
		display: grid;
		place-items: center;
		line-height: 1;
	}

	.custom-checkbox::before {
		content: '✓';
		color: #ffffff;
		font-size: 14px;
		font-weight: 700;
		opacity: 0;
	}

	.custom-checkbox.cochee {
		background: var(--primary-orange);
	}

	.custom-checkbox.cochee::before {
		opacity: 1;
	}

	.custom-checkbox:focus-visible {
		outline: 2px solid var(--dark-black);
		outline-offset: 2px;
	}

	/* Ligne d'arrivée, reprise telle quelle du document d'origine. */
	.finish-banner {
		background-color: var(--soft-orange);
		border: 1px dashed var(--primary-orange);
		padding: 10px 12px;
		border-radius: 6px;
		text-align: center;
		margin-top: 10px;
		animation: arrivee 0.5s ease-out;
	}

	.finish-title {
		margin: 0;
		font-family: var(--font-title);
		font-size: 15px;
		font-weight: 700;
		color: var(--primary-orange);
		letter-spacing: 0.5px;
	}

	.finish-sub {
		margin: 4px 0 0;
		font-size: 13px;
		line-height: 1.35;
		color: var(--gray-text);
	}

	/* Une seule apparition, courte : la page est une liste de tâches, pas un
	   jeu. */
	@keyframes arrivee {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	/* Quelqu'un qui a demandé moins d'animations voit la bannière apparaître
	   sans mouvement. */
	@media (prefers-reduced-motion: reduce) {
		.finish-banner {
			animation: none;
		}
	}

	/* Compteur d'avancement : il n'existe que sur le web, le papier n'en a pas
	   besoin. */
	.avancement.fini {
		color: var(--primary-orange);
	}

	.avancement {
		margin: 0;
		font-family: var(--font-title);
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--gray-text);
	}

	.step-content {
		flex-grow: 1;
		padding-right: 40px;
	}

	.step-title {
		font-family: var(--font-title);
		font-size: 14.5px;
		font-weight: 700;
		color: var(--dark-black);
		margin-bottom: 3px;
		line-height: 1.3;
	}

	.step-desc {
		font-size: 13.5px;
		color: var(--gray-text);
		line-height: 1.3;
	}

	.inline-code {
		font-family: monospace;
		background-color: #f0f0f0;
		padding: 1px 4px;
		border-radius: 4px;
	}

	.step-link {
		display: inline-block;
		margin-top: 4px;
		color: var(--primary-orange);
		font-weight: 700;
		font-size: 12.5px;
		text-decoration: underline;
	}

	/* Toute la carte est cliquable, pas seulement l'adresse écrite en bas :
	   sur la feuille imprimée on lit l'adresse et on la recopie, ici on clique
	   où on veut. Le lien s'étire sur la carte entière plutôt que d'envelopper
	   le contenu, ce qui garde un seul lien par étape pour les lecteurs
	   d'écran, et laisse le texte sélectionnable. */
	.step-link::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 8px;
	}

	.step-card:hover {
		background: #fffaf5;
		box-shadow: 0 2px 10px rgba(255, 122, 0, 0.18);
	}

	.step-card:focus-within {
		outline: 2px solid var(--primary-orange);
		outline-offset: 2px;
	}

	/* Icon positioned on the far right and enlarged */
	.box-symbol {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 25px;
		line-height: 1;
		user-select: none;
	}

	/* Contacts Section (Higher than finish line) */
	.contacts-wrapper {
		margin-top: 6px;
	}

	.contacts-grid {
		display: flex;
		justify-content: center;
		gap: 24px;
	}

	.contact-item {
		text-align: center;
	}

	.contact-label {
		font-size: 11px;
		font-weight: 700;
		color: var(--gray-text);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 3px;
	}

	.contact-card {
		border: 1.5px solid var(--primary-orange);
		background-color: var(--soft-orange);
		padding: 6px 16px;
		border-radius: 6px;
		display: inline-block;
	}

	.contact-card a {
		color: var(--dark-black);
		font-weight: 700;
		font-size: 13px;
		text-decoration: none;
	}

	.contact-card a:hover {
		color: var(--primary-orange);
	}

	.contact-card.highlight {
		background-color: var(--primary-orange);
	}

	.contact-card.highlight a {
		color: #ffffff;
	}

	/* Satisfaction survey reminder, bottom right */
	.survey-note {
		position: absolute;
		right: 30px;
		bottom: 40px;
		max-width: 130px;
		font-family: var(--font-title);
		font-size: 12.5px;
		font-weight: 700;
		color: var(--primary-orange);
		line-height: 1.25;
		text-align: center;
		transform: rotate(-4deg);
	}

	/* Arrow from under the note, up and left to the online guide box */
	.survey-arrow {
		position: absolute;
		left: 606px;
		bottom: 16px;
	}

	/* ─── Adaptations au web ───────────────────────────────────────────
	   Le document d'origine est figé en millimètres : il déborde dès que la
	   fenêtre est plus étroite qu'une feuille A4. Ici la feuille garde ses
	   proportions tant qu'elle tient, puis se laisse couler. */
	.feuille {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem 1rem 4rem;
		background: #e5e5e5;
	}

	.feuille :global(.a4-page) {
		inline-size: min(210mm, 100%);
		block-size: auto;
		min-block-size: 0;
		padding: clamp(0.6rem, 3vw, 10mm);
	}

	/* Le rappel du questionnaire et sa flèche sont placés au millimètre pour
	   le papier : sur un écran étroit, ils se superposeraient au texte. */
	@media (max-width: 760px) {
		.feuille :global(.survey-note),
		.feuille :global(.survey-arrow) {
			display: none;
		}

		/* Le pictogramme est posé au millimètre à droite de la carte : sur une
		   colonne étroite il passait par-dessus le texte. */
		.feuille :global(.box-symbol) {
			display: none;
		}

		.feuille :global(.step-content) {
			padding-right: 0;
		}

		.feuille :global(.contacts-grid) {
			flex-direction: column;
			align-items: center;
		}

		.feuille :global(.header) {
			flex-direction: column;
			align-items: center;
		}
	}

	.telecharger {
		margin: 0;
	}

	.telecharger a {
		display: inline-block;
		padding: 0.6rem 1.2rem;
		border: 2px solid var(--primary-orange);
		border-radius: 6px;
		background: #ffffff;
		color: var(--dark-black);
		font-family: var(--font-title);
		font-weight: 700;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.telecharger a:hover {
		background: var(--primary-orange);
		color: #ffffff;
	}
</style>
