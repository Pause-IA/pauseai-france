<script lang="ts">
	import Button from '$lib/components/Button.svelte'

	let firstName = ''
	let lastName = ''
	let email = ''
	let subscribeNewsletter = true
	let subscribeSubstack = false
	let subscribePolicyProposals = true
	let isSubmitting = false
	let message = ''
	let isError = false

	async function submitForm(event: Event) {
		event.preventDefault()
		isError = false
		message = ''

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			isError = true
			message = 'Veuillez saisir une adresse e-mail valide'
			return
		}

		// Require at least one subscription option
		if (!subscribeNewsletter && !subscribeSubstack && !subscribePolicyProposals) {
			isError = true
			message = 'Sélectionnez au moins une option'
			return
		}

		isSubmitting = true
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribeNewsletter,
					subscribeSubstack,
					subscribePolicyProposals,
					firstName: firstName || undefined,
					lastName: lastName || undefined,
					source: 'senat2025'
				})
			})
			const json = await res.json()
			if (res.ok && json.success) {
				message = json.message || 'Merci, inscription enregistrée.'
				firstName = ''
				lastName = ''
				email = ''
				// Keep defaults for toggles for faster multiple entries
			} else {
				isError = true
				message = json.error || 'Une erreur est survenue.'
			}
		} catch (e) {
			isError = true
			message = 'Erreur réseau, réessayez.'
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	<meta
		name="description"
		content="Compte-rendu du colloque au Sénat du 31 octobre 2025 : points clés, résumé exécutif et recommandations pour maîtriser l'intelligence artificielle."
	/>
	<title>Colloque Sénat — Compte-rendu & recommandations | Pause IA</title>
</svelte:head>

<section class="wrap">
	<!-- Hero Section -->
	<div class="hero">
		<img
			src="/senat-2025-colloque.png"
			alt="Colloque Sénat — Intelligence Artificielle : Sécuriser les pratiques, contenir les risques"
		/>
		<div class="hero-text">
			<h1>COLLOQUE SÉNAT — 31 OCTOBRE 2025</h1>
			<p class="subtitle">
				Intelligence Artificielle : Sécuriser les Pratiques, Contenir les Risques
			</p>
			<p class="cta">Compte-rendu disponible</p>
		</div>
	</div>

	<div class="content">
		<!-- CTA Download Button -->
		<div class="download-cta">
			<Button href="/pdfs/compte-rendu-senat-2025.pdf" target="_blank" rel="noopener noreferrer">
				📥 Télécharger le compte-rendu complet (PDF)
			</Button>
		</div>

		<!-- Points Clés Section -->
		<section class="key-points">
			<h2>Points clés</h2>
			<div class="key-point-card">
				<p>
					<strong>Les capacités de l'IA doublent tous les 4 à 7 mois.</strong> Nos cycles réglementaires
					restent constants. Cette progression exponentielle crée un fossé croissant entre avancée technologique
					et capacité collective à la maîtriser.
				</p>
			</div>

			<div class="key-point-card">
				<p>
					<strong>Les risques ne sont pas hypothétiques, ils se matérialisent déjà</strong> dans
					tous les domaines : enfance et développement cognitif, démocratie et débat public, emploi
					et concentration du pouvoir, cybersécurité et sécurité nationale.
					<em>(Voir sections 3 à 7 pour le détail des risques)</em>
				</p>
			</div>

			<div class="key-point-card">
				<p>
					<strong>La cause profonde : nous déployons des systèmes "boîtes noires"</strong> dont nous
					ne maîtrisons ni le fonctionnement interne, ni tous les comportements. Les techniques actuelles
					d'alignement sont insuffisantes et ne fournissent aucune garantie fiable.
				</p>
			</div>

			<div class="key-point-card">
				<p>
					<strong>Des leviers d'action concrets existent</strong> : régulation proactive,
					responsabilité juridique, évaluations obligatoires, investissement dans la sécurité de
					l'IA, protection de l'EU AI Act, transparence des algorithmes, lignes rouges
					internationales. <em>(Voir section 8 pour les recommandations détaillées)</em>
				</p>
			</div>
		</section>

		<!-- Executive Summary Section -->
		<section class="executive-summary">
			<h2>Résumé exécutif</h2>

			<p>
				<strong
					>Aujourd'hui, les systèmes d'intelligence artificielle peuvent effectuer de manière
					autonome des tâches demandant environ 2 heures à un humain</strong
				>. <strong>Cette durée d'autonomie double tous les 4 à 7 mois.</strong> La progression exponentielle
				des capacités, au prix d'une croissance phénoménale de la consommation énergétique et des investissements
				(500 milliards de dollars annoncés par les États-Unis), creuse à une vitesse vertigineuse le
				fossé entre l'avancée technologique et notre capacité collective à en maîtriser les conséquences.
			</p>

			<p>
				Le colloque du 31 octobre 2025 au Sénat, organisé par l'association Pause IA avec le soutien
				de la sénatrice Ghislaine Senée et du sénateur Thomas Dossus, a réuni experts, société
				civile et parlementaires autour d'un double constat :
			</p>

			<p>
				<strong
					>1. Les risques de l'IA ne relèvent pas de la science-fiction, ils se matérialisent déjà.</strong
				> Chatbots encourageant des adolescents au suicide, cyberattaques paralysant des hôpitaux, algorithmes
				de recommandation fragmentant notre réalité commune, utilisation de ressources et concentration
				du pouvoir économique sans précédent : les impacts concrets touchent tous les pans de notre société.
				Et ces risques s'amplifient au rythme de la progression des capacités.
			</p>

			<p>
				<strong
					>2. La régulation n'est pas un frein à l'innovation, elle en est la condition.</strong
				> L'aviation et l'industrie pharmaceutique le démontrent : c'est un cadre réglementaire sécurisant
				qui bâtit la confiance et permet un déploiement bénéfique de la technologie. Face à une course
				effrénée menée par une poignée d'acteurs privés, la puissance publique doit reprendre la main
				pour garantir que l'IA serve l'intérêt général.
			</p>

			<h3>Les dangers identifiés sont graves et nombreux</h3>

			<p>
				<strong>Enfance et développement cognitif.</strong> 64% des enfants de 9 à 17 ans utilisent déjà
				l'IA. Or, ces systèmes ne sont pas conçus pour des cerveaux en développement. Ils créent des
				risques de dépendance, d'atrophie cognitive et de manipulation émotionnelle via des "relations
				parasociales" avec des machines qui simulent l'empathie sans la ressentir.
			</p>

			<p>
				<strong>Démocratie et débat public.</strong> Les algorithmes de recommandation des médias sociaux
				sont opaques et optimisés pour l'engagement plutôt que la vérité. Ils polarisent nos sociétés
				et sapent les fondations du débat démocratique. Ceux de YouTube contrôlaient déjà 700 millions
				d'heures par jour en 2018, soit l'équivalent de l'enseignement de 25 000 professeurs sur leur
				carrière entière. Les IA génératives ne pourront qu'amplifier massivement ce phénomène.
			</p>

			<p>
				<strong>Économie et emploi.</strong> L'automatisation des tâches cognitives menace des pans entiers
				de l'emploi qualifié. Entre 17% et 30% du travail actuel pourrait être automatisée. Sans anticipation
				politique, ce choc entraînera une précarisation massive et une concentration du pouvoir économique
				entre les mains d'acteurs technologiques majoritairement non-européens, rendant toute redistribution
				des richesses quasi-impossible.
			</p>

			<p>
				<strong>Cybersécurité et biorisques.</strong> L'IA abaisse drastiquement le seuil de compétence
				nécessaire pour mener des cyberattaques sophistiquées ou concevoir de nouvelles armes biologiques.
				Nos infrastructures critiques sont en première ligne. Les modélisations montrent que les dommages
				économiques des cyberattaques pourraient être multipliés par 4 à 8 dans les prochaines années.
			</p>

			<h3>Les systèmes d'IA actuels sont incontrôlables par nature</h3>

			<p>
				Le problème fondamental est que se déploient à grande échelle des systèmes "boîtes noires"
				dont personne ne maîtrrise ni le fonctionnement interne, ni tous les comportements. Personne
				n'a programmé ChatGPT pour encourager des adolescents au suicide, pourtant cela arrive. Les
				techniques actuelles d'alignement sont insuffisantes et ne fournissent aucune garantie
				fiable. La communauté scientifique, incluant des prix Nobel et Turing, tire la sonnette
				d'alarme : continuer sur cette trajectoire, c'est accepter une perte de contrôle
				progressive.
			</p>

			<h3>Les leviers d'action</h3>

			<p>
				La France et l'Europe peuvent devenir leaders, non dans la course à la puissance, mais dans
				la maîtrise de l'IA. Cela exige des actions politiques fortes :
			</p>

			<ol class="action-list">
				<li>
					<strong>Adopter une réglementation proactive</strong> qui légifère pour les technologies de
					demain, pas celles d'hier, en anticipant les évolutions futures et en intégrant des principes
					de précaution stricts.
				</li>
				<li>
					<strong>Établir une responsabilité juridique claire</strong> : les développeurs d'IA et les
					entreprises qui en déploient les applications doivent être tenus responsables des dommages
					causés. La nature "boîte noire" ne peut être une excuse.
				</li>
				<li>
					<strong>Exiger des évaluations de risques obligatoires et indépendantes</strong> avant tout
					déploiement d'IA à haut risque, sur le modèle de l'aviation ou du médicament.
				</li>
				<li>
					<strong
						>Investir massivement dans une filière française et européenne de la sécurité de l'IA</strong
					>
					: soutenir la recherche sur la robustesse, la transparence et le contrôle des IA. Renforcer
					les moyens de l'INESIA et créer une filière d'excellence.
				</li>
				<li>
					<strong>Protéger la régulation européenne</strong> : l'EU AI Act est sous pression intense
					des <em>lobbies</em> (le numérique investit plus en lobbying que l'automobile, la pharmacie
					et l'aéronautique réunis). Défendre et renforcer ce cadre réglementaire est crucial.
				</li>
				<li>
					<strong>Imposer la transparence des algorithmes de recommandation</strong> et explorer des
					modèles de gouvernance démocratique pour protéger le débat public de la manipulation.
				</li>
				<li>
					<strong>Porter au niveau international l'établissement de "lignes rouges"</strong> sur les
					capacités autonomes dangereuses et les usages inacceptables de l'IA.
				</li>
			</ol>

			<p>
				Ces mesures ne visent pas à freiner l'écosystème français, mais à encadrer la course à haut
				risque vers l'Intelligence Artificielle Générale menée par une poignée de laboratoires
				internationaux.
			</p>

			<h3>Pour aller plus loin</h3>

			<p>
				Ce colloque a ouvert un dialogue essentiel. L'association Pause IA et les experts mobilisés
				se tiennent à l'entière disposition des parlementaires pour approfondir ces sujets,
				organiser des auditions et contribuer à des groupes de travail visant à traduire ces leviers
				en propositions législatives concrètes.
			</p>

			<div class="download-cta-bottom">
				<Button href="/pdfs/compte-rendu-senat-2025.pdf" target="_blank" rel="noopener noreferrer">
					📥 Télécharger le compte-rendu complet (PDF)
				</Button>
			</div>
		</section>

		<!-- Newsletter Section -->
		<section class="newsletter-section">
			<h2>Restez informé·e</h2>
			<p class="newsletter-intro">
				Inscrivez-vous pour recevoir le compte-rendu complet, nos propositions législatives et nos
				prochaines actions.
			</p>

			<form on:submit|preventDefault={submitForm} class="form">
				<div class="grid">
					<label>
						<span>Prénom</span>
						<input type="text" bind:value={firstName} autocomplete="given-name" />
					</label>
					<label>
						<span>Nom</span>
						<input type="text" bind:value={lastName} autocomplete="family-name" />
					</label>
				</div>

				<label>
					<span>Adresse e-mail</span>
					<input type="email" bind:value={email} required autocomplete="email" />
				</label>

				<fieldset class="choices">
					<legend>Choix d'abonnement</legend>
					<label class="check">
						<input
							type="checkbox"
							bind:checked={subscribePolicyProposals}
							disabled={isSubmitting}
						/>
						<span>Nos propositions législatives</span>
					</label>
					<label class="check">
						<input type="checkbox" bind:checked={subscribeNewsletter} disabled={isSubmitting} />
						<span>Newsletter Pause IA</span>
					</label>
					<label class="check">
						<input type="checkbox" bind:checked={subscribeSubstack} disabled={isSubmitting} />
						<span>Blog Substack Pause IA</span>
					</label>
				</fieldset>

				{#if message}
					<div class:msg-error={isError} class="msg">{message}</div>
				{/if}

				<button type="submit" disabled={isSubmitting}>Envoyer</button>
			</form>
		</section>
	</div>
</section>

<style>
	.wrap {
		max-width: 960px;
		margin: 0 auto;
		padding: 1.5rem 1rem 3rem;
	}

	/* Hero Section */
	.hero {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		margin-bottom: 2rem;
	}
	.hero img {
		width: 100%;
		display: block;
		object-fit: cover;
		max-height: 360px;
	}
	.hero-text {
		position: absolute;
		inset: auto 0 0 0;
		padding: 1rem;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.55) 60%,
			rgba(0, 0, 0, 0.75) 100%
		);
		color: #fff;
	}
	.hero-text h1 {
		margin: 0 0 0.25rem 0;
		font-size: 1.25rem;
	}
	.hero-text .subtitle {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
	}
	.hero-text .cta {
		margin: 0;
		opacity: 0.9;
	}

	/* Download CTA */
	.download-cta {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.download-cta-bottom {
		display: flex;
		justify-content: center;
		margin: 2.5rem 0 1rem;
	}

	/* Key Points Section */
	.key-points {
		margin: 3rem 0;
	}

	.key-points h2 {
		text-align: center;
		margin-bottom: 1.5rem;
		font-size: 2rem;
	}

	.key-point-card {
		background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
		border-left: 4px solid var(--brand, #ffd42a);
		padding: 1.25rem;
		margin-bottom: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.key-point-card p {
		margin: 0;
		line-height: 1.6;
	}

	/* Executive Summary Section */
	.executive-summary {
		margin: 3rem 0;
		padding: 2rem;
		background: #fafafa;
		border-radius: 12px;
	}

	.executive-summary h2 {
		margin-top: 0;
		font-size: 2rem;
		margin-bottom: 1.5rem;
	}

	.executive-summary h3 {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
		color: var(--text, #333);
	}

	.executive-summary p {
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	.action-list {
		padding-left: 1.5rem;
		line-height: 1.7;
	}

	.action-list li {
		margin-bottom: 1rem;
	}

	/* Newsletter Section */
	.newsletter-section {
		margin: 3rem 0 2rem;
		padding: 2.5rem 2rem;
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border-radius: 12px;
		border: 2px solid #bae6fd;
	}

	.newsletter-section h2 {
		margin-top: 0;
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.newsletter-intro {
		text-align: center;
		margin-bottom: 1.5rem;
		font-size: 1.05rem;
	}

	/* Form Styles */
	.form {
		margin-top: 1rem;
		display: grid;
		gap: 1rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 600px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	label span {
		display: block;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	input[type='text'],
	input[type='email'] {
		width: 100%;
		padding: 0.6rem 0.7rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
	}

	fieldset.choices {
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		padding: 0.75rem 1rem;
		background: white;
	}

	fieldset.choices legend {
		padding: 0 0.25rem;
		font-weight: 600;
	}

	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.25rem 0;
	}

	.msg {
		margin: 0.25rem 0 0;
		font-weight: 600;
		text-align: center;
	}

	.msg-error {
		color: #b00020;
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--brand, #ffd42a);
		color: var(--black, #000);
		border: 0;
		padding: 0.7rem 1.1rem;
		border-radius: 8px;
		font-weight: 700;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.hero-text h1 {
			font-size: 1rem;
		}

		.key-points h2,
		.executive-summary h2 {
			font-size: 1.5rem;
		}

		.executive-summary h3 {
			font-size: 1.25rem;
		}

		.executive-summary {
			padding: 1.5rem;
		}

		.newsletter-section {
			padding: 1.5rem 1rem;
		}
	}
</style>
