<script lang="ts">
	import type { SubscribeResponse } from '$lib/types'
	import Button from '$lib/components/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: isEn = lang === 'en'

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
			message = isEn
				? 'Please enter a valid email address'
				: 'Veuillez saisir une adresse e-mail valide'
			return
		}

		if (!subscribeNewsletter && !subscribeSubstack && !subscribePolicyProposals) {
			isError = true
			message = isEn ? 'Select at least one option' : 'Sélectionnez au moins une option'
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
			const json = (await res.json()) as SubscribeResponse
			if (res.ok && json.success) {
				message =
					json.message ||
					(isEn ? 'Thank you, registration confirmed.' : 'Merci, inscription enregistrée.')
				firstName = ''
				lastName = ''
				email = ''
			} else {
				isError = true
				message = json.error || (isEn ? 'An error occurred.' : 'Une erreur est survenue.')
			}
		} catch (e) {
			isError = true
			message = isEn ? 'Network error, please try again.' : 'Erreur réseau, réessayez.'
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	{#if isEn}
		<meta
			name="description"
			content="Report from the Senate colloquium on October 31, 2025: key points, executive summary and recommendations for controlling artificial intelligence."
		/>
		<title>Senate Colloquium · Report & Recommendations | Pause AI</title>
	{:else}
		<meta
			name="description"
			content="Compte-rendu du colloque au Sénat du 31 octobre 2025 : points clés, résumé exécutif et recommandations pour maîtriser l'intelligence artificielle."
		/>
		<title>Colloque Sénat · Compte-rendu & recommandations | Pause IA</title>
	{/if}
</svelte:head>

<section class="wrap">
	<!-- Hero Section -->
	<div class="hero">
		<img
			src="/senat-2025-colloque.png"
			alt={isEn
				? 'Senate Colloquium · Artificial Intelligence: Securing Practices, Containing Risks'
				: 'Colloque Sénat · Intelligence Artificielle : Sécuriser les pratiques, contenir les risques'}
		/>
		<div class="hero-text">
			<h1>{isEn ? 'SENATE COLLOQUIUM · OCTOBER 31, 2025' : 'COLLOQUE SÉNAT · 31 OCTOBRE 2025'}</h1>
			<p class="subtitle">
				{isEn
					? 'Artificial Intelligence: Securing Practices, Containing Risks'
					: 'Intelligence Artificielle : Sécuriser les Pratiques, Contenir les Risques'}
			</p>
			<p class="cta">{isEn ? 'Report available' : 'Compte-rendu disponible'}</p>
		</div>
	</div>

	<div class="content">
		<!-- CTA Download Button -->
		<div class="download-cta">
			<Button href="/pdfs/compte-rendu-senat-2025.pdf" target="_blank" rel="noopener noreferrer">
				{isEn
					? '📥 Download the full report (PDF)'
					: '📥 Télécharger le compte-rendu complet (PDF)'}
			</Button>
		</div>

		<!-- Key Points Section -->
		<section class="key-points">
			<h2>{isEn ? 'Key points' : 'Points clés'}</h2>
			{#if isEn}
				<div class="key-point-card">
					<p>
						<strong>AI capabilities double every 4 to 7 months.</strong> Our regulatory cycles remain
						constant. This exponential progression creates a growing gap between technological advancement
						and our collective ability to manage it.
					</p>
				</div>
				<div class="key-point-card">
					<p>
						<strong>The risks are not hypothetical, they are already materializing</strong> across
						all domains: childhood and cognitive development, democracy and public debate,
						employment and concentration of power, cybersecurity and national security.
						<em>(See sections 3 to 7 for details on risks)</em>
					</p>
				</div>
				<div class="key-point-card">
					<p>
						<strong>The root cause: we are deploying "black box" systems</strong> whose internal workings
						and all behaviors we cannot control. Current alignment techniques are insufficient and provide
						no reliable guarantees.
					</p>
				</div>
				<div class="key-point-card">
					<p>
						<strong>Concrete levers for action exist</strong>: proactive regulation, legal
						liability, mandatory evaluations, investment in AI safety, protection of the EU AI Act,
						algorithm transparency, international red lines.
						<em>(See section 8 for detailed recommendations)</em>
					</p>
				</div>
			{:else}
				<div class="key-point-card">
					<p>
						<strong>Les capacités de l'IA doublent tous les 4 à 7 mois.</strong> Nos cycles réglementaires
						restent constants. Cette progression exponentielle crée un fossé croissant entre avancée
						technologique et capacité collective à la maîtriser.
					</p>
				</div>
				<div class="key-point-card">
					<p>
						<strong>Les risques ne sont pas hypothétiques, ils se matérialisent déjà</strong> dans
						tous les domaines : enfance et développement cognitif, démocratie et débat public,
						emploi et concentration du pouvoir, cybersécurité et sécurité nationale.
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
			{/if}
		</section>

		<!-- Executive Summary Section -->
		<section class="executive-summary">
			<h2>{isEn ? 'Executive Summary' : 'Résumé exécutif'}</h2>

			{#if isEn}
				<p>
					<strong
						>Today, AI systems can autonomously perform tasks that would take a human approximately
						2 hours</strong
					>. <strong>This autonomous capability doubles every 4 to 7 months.</strong> The exponential
					progression of capabilities, at the cost of phenomenal growth in energy consumption and investments
					($500 billion announced by the United States), is widening at a dizzying speed the gap between
					technological advancement and our collective ability to manage its consequences.
				</p>

				<p>
					The October 31, 2025 colloquium at the Senate, organized by the Pause AI association with
					the support of Senator Ghislaine Senée and Senator Thomas Dossus, brought together
					experts, civil society and parliamentarians around a dual observation:
				</p>

				<p>
					<strong
						>1. The risks of AI are not science fiction, they are already materializing.</strong
					> Chatbots encouraging teenagers to commit suicide, cyberattacks paralyzing hospitals, recommendation
					algorithms fragmenting our shared reality, unprecedented use of resources and concentration
					of economic power: the concrete impacts affect every aspect of our society. And these risks
					are amplifying at the pace of capability progression.
				</p>

				<p>
					<strong>2. Regulation is not a brake on innovation, it is its condition.</strong> Aviation
					and the pharmaceutical industry demonstrate this: it is a reassuring regulatory framework that
					builds trust and allows for beneficial deployment of technology. Faced with a frantic race
					led by a handful of private actors, public authorities must take back control to ensure that
					AI serves the public interest.
				</p>

				<h3>The identified dangers are serious and numerous</h3>

				<p>
					<strong>Childhood and cognitive development.</strong> 64% of children aged 9 to 17 already
					use AI. Yet these systems were not designed for developing brains. They create risks of addiction,
					cognitive atrophy and emotional manipulation through "parasocial relationships" with machines
					that simulate empathy without feeling it.
				</p>

				<p>
					<strong>Democracy and public debate.</strong> Social media recommendation algorithms are opaque
					and optimized for engagement rather than truth. They polarize our societies and undermine the
					foundations of democratic debate. YouTube's algorithms already controlled 700 million hours
					per day in 2018, equivalent to the teaching of 25,000 teachers over their entire careers. Generative
					AI can only massively amplify this phenomenon.
				</p>

				<p>
					<strong>Economy and employment.</strong> The automation of cognitive tasks threatens entire
					swaths of skilled employment. Between 17% and 30% of current work could be automated. Without
					political anticipation, this shock will lead to massive precariousness and a concentration
					of economic power in the hands of predominantly non-European technology actors, making any
					redistribution of wealth nearly impossible.
				</p>

				<p>
					<strong>Cybersecurity and biorisks.</strong> AI drastically lowers the skill threshold needed
					to carry out sophisticated cyberattacks or design new biological weapons. Our critical infrastructure
					is on the front line. Models show that the economic damage from cyberattacks could multiply
					by 4 to 8 in the coming years.
				</p>

				<h3>Current AI systems are inherently uncontrollable</h3>

				<p>
					The fundamental problem is that "black box" systems are being deployed at scale whose
					internal workings and all behaviors no one controls. No one programmed ChatGPT to
					encourage teenagers to commit suicide, yet it happens. Current alignment techniques are
					insufficient and provide no reliable guarantees. The scientific community, including Nobel
					and Turing Prize winners, is sounding the alarm: continuing on this trajectory means
					accepting a progressive loss of control.
				</p>

				<h3>Levers for action</h3>

				<p>
					France and Europe can become leaders, not in the race for power, but in the mastery of AI.
					This requires strong political actions:
				</p>

				<ol class="action-list">
					<li>
						<strong>Adopt proactive regulation</strong> that legislates for tomorrow's technologies,
						not yesterday's, anticipating future developments and integrating strict precautionary principles.
					</li>
					<li>
						<strong>Establish clear legal liability</strong>: AI developers and companies that
						deploy their applications must be held responsible for damages caused. The "black box"
						nature cannot be an excuse.
					</li>
					<li>
						<strong>Require mandatory and independent risk assessments</strong> before any high-risk
						AI deployment, modeled on aviation or pharmaceuticals.
					</li>
					<li>
						<strong>Massively invest in a French and European AI safety sector</strong>: support
						research on AI robustness, transparency and control. Strengthen INESIA's resources and
						create a center of excellence.
					</li>
					<li>
						<strong>Protect European regulation</strong>: the EU AI Act is under intense lobbying
						pressure (tech invests more in lobbying than automotive, pharma and aeronautics
						combined). Defending and strengthening this regulatory framework is crucial.
					</li>
					<li>
						<strong>Impose transparency on recommendation algorithms</strong> and explore models of democratic
						governance to protect public debate from manipulation.
					</li>
					<li>
						<strong>Bring to the international level the establishment of "red lines"</strong> on dangerous
						autonomous capabilities and unacceptable uses of AI.
					</li>
				</ol>

				<p>
					These measures are not aimed at slowing down the French ecosystem, but at framing the
					high-risk race toward Artificial General Intelligence led by a handful of international
					laboratories.
				</p>

				<h3>Going further</h3>

				<p>
					This colloquium opened an essential dialogue. The Pause AI association and the mobilized
					experts are fully available to parliamentarians to deepen these subjects, organize
					hearings and contribute to working groups aimed at translating these levers into concrete
					legislative proposals.
				</p>
			{:else}
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
					Le colloque du 31 octobre 2025 au Sénat, organisé par l'association Pause IA avec le
					soutien de la sénatrice Ghislaine Senée et du sénateur Thomas Dossus, a réuni experts,
					société civile et parlementaires autour d'un double constat :
				</p>

				<p>
					<strong
						>1. Les risques de l'IA ne relèvent pas de la science-fiction, ils se matérialisent
						déjà.</strong
					> Chatbots encourageant des adolescents au suicide, cyberattaques paralysant des hôpitaux,
					algorithmes de recommandation fragmentant notre réalité commune, utilisation de ressources
					et concentration du pouvoir économique sans précédent : les impacts concrets touchent tous
					les pans de notre société. Et ces risques s'amplifient au rythme de la progression des capacités.
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
					<strong>Enfance et développement cognitif.</strong> 64% des enfants de 9 à 17 ans utilisent
					déjà l'IA. Or, ces systèmes ne sont pas conçus pour des cerveaux en développement. Ils créent
					des risques de dépendance, d'atrophie cognitive et de manipulation émotionnelle via des "relations
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
					<strong>Économie et emploi.</strong> L'automatisation des tâches cognitives menace des pans
					entiers de l'emploi qualifié. Entre 17% et 30% du travail actuel pourrait être automatisée.
					Sans anticipation politique, ce choc entraînera une précarisation massive et une concentration
					du pouvoir économique entre les mains d'acteurs technologiques majoritairement non-européens,
					rendant toute redistribution des richesses quasi-impossible.
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
					dont personne ne maîtrrise ni le fonctionnement interne, ni tous les comportements.
					Personne n'a programmé ChatGPT pour encourager des adolescents au suicide, pourtant cela
					arrive. Les techniques actuelles d'alignement sont insuffisantes et ne fournissent aucune
					garantie fiable. La communauté scientifique, incluant des prix Nobel et Turing, tire la
					sonnette d'alarme : continuer sur cette trajectoire, c'est accepter une perte de contrôle
					progressive.
				</p>

				<h3>Les leviers d'action</h3>

				<p>
					La France et l'Europe peuvent devenir leaders, non dans la course à la puissance, mais
					dans la maîtrise de l'IA. Cela exige des actions politiques fortes :
				</p>

				<ol class="action-list">
					<li>
						<strong>Adopter une réglementation proactive</strong> qui légifère pour les technologies
						de demain, pas celles d'hier, en anticipant les évolutions futures et en intégrant des principes
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
						<strong>Protéger la régulation européenne</strong> : l'EU AI Act est sous pression
						intense des <em>lobbies</em> (le numérique investit plus en lobbying que l'automobile, la
						pharmacie et l'aéronautique réunis). Défendre et renforcer ce cadre réglementaire est crucial.
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
					Ces mesures ne visent pas à freiner l'écosystème français, mais à encadrer la course à
					haut risque vers l'Intelligence Artificielle Générale menée par une poignée de
					laboratoires internationaux.
				</p>

				<h3>Pour aller plus loin</h3>

				<p>
					Ce colloque a ouvert un dialogue essentiel. L'association Pause IA et les experts
					mobilisés se tiennent à l'entière disposition des parlementaires pour approfondir ces
					sujets, organiser des auditions et contribuer à des groupes de travail visant à traduire
					ces leviers en propositions législatives concrètes.
				</p>
			{/if}

			<div class="download-cta-bottom">
				<Button href="/pdfs/compte-rendu-senat-2025.pdf" target="_blank" rel="noopener noreferrer">
					{isEn
						? '📥 Download the full report (PDF)'
						: '📥 Télécharger le compte-rendu complet (PDF)'}
				</Button>
			</div>
		</section>

		<!-- Newsletter Section -->
		<section class="newsletter-section">
			<h2>{isEn ? 'Stay informed' : 'Restez informé·e'}</h2>
			<p class="newsletter-intro">
				{isEn
					? 'Sign up to receive the full report, our legislative proposals and our upcoming actions.'
					: 'Inscrivez-vous pour recevoir le compte-rendu complet, nos propositions législatives et nos prochaines actions.'}
			</p>

			<form on:submit|preventDefault={submitForm} class="form">
				<div class="grid">
					<label>
						<span>{isEn ? 'First name' : 'Prénom'}</span>
						<input type="text" bind:value={firstName} autocomplete="given-name" />
					</label>
					<label>
						<span>{isEn ? 'Last name' : 'Nom'}</span>
						<input type="text" bind:value={lastName} autocomplete="family-name" />
					</label>
				</div>

				<label>
					<span>{isEn ? 'Email address' : 'Adresse e-mail'}</span>
					<input type="email" bind:value={email} required autocomplete="email" />
				</label>

				<fieldset class="choices">
					<legend>{isEn ? 'Subscription choices' : "Choix d'abonnement"}</legend>
					<label class="check">
						<input
							type="checkbox"
							bind:checked={subscribePolicyProposals}
							disabled={isSubmitting}
						/>
						<span>{isEn ? 'Our legislative proposals' : 'Nos propositions législatives'}</span>
					</label>
					<label class="check">
						<input type="checkbox" bind:checked={subscribeNewsletter} disabled={isSubmitting} />
						<span>Pause {isEn ? 'AI' : 'IA'} Newsletter</span>
					</label>
					<label class="check">
						<input type="checkbox" bind:checked={subscribeSubstack} disabled={isSubmitting} />
						<span>Pause {isEn ? 'AI' : 'IA'} Substack Blog</span>
					</label>
				</fieldset>

				{#if message}
					<div class:msg-error={isError} class="msg">{message}</div>
				{/if}

				<button type="submit" disabled={isSubmitting}>{isEn ? 'Submit' : 'Envoyer'}</button>
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
		border-radius: var(--radius-md);
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
			rgba(var(--ink-rgb), 0) 0%,
			rgba(var(--ink-rgb), 0.55) 60%,
			rgba(var(--ink-rgb), 0.75) 100%
		);
		color: var(--on-dark);
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
		background: var(--bg-card);
		border-left: 4px solid var(--brand);
		padding: 1.25rem;
		margin-bottom: 1rem;
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-card);
	}

	.key-point-card p {
		margin: 0;
		line-height: 1.6;
	}

	/* Executive Summary Section */
	.executive-summary {
		margin: 3rem 0;
		padding: 2rem;
		background: var(--bg-secondary);
		border-radius: var(--radius-md);
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
		color: var(--text);
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
		background: var(--brand-light);
		border-radius: var(--radius-md);
		border: 2px solid var(--border);
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
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		font-size: 1rem;
	}

	/* Cases à cocher : cible d'au moins 24 px, doigt compris. */
	input[type='checkbox'] {
		inline-size: 1.5rem;
		block-size: 1.5rem;
		accent-color: var(--brand);
	}

	fieldset.choices {
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		padding: 0.75rem 1rem;
		background: var(--bg-card);
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
		color: var(--error);
	}

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--brand);
		color: var(--on-brand);
		border: 0;
		padding: 0.7rem 1.1rem;
		border-radius: var(--radius-sm);
		font-weight: 700;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(var(--ink-rgb), 0.15);
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
