<script lang="ts">
	import Callout from '$components/Callout.svelte'
	import { base } from '$app/paths'
	
	// Import the infographic
	/* eslint-disable @typescript-eslint/ban-ts-comment */
	//@ts-expect-error Enhanced image import
	import infographic from '$assets/infographic.png?enhanced'
	/* eslint-enable @typescript-eslint/ban-ts-comment */
</script>

<svelte:head>
	<title>Devenez Recruteur pour Pause IA - Centre de Ressources</title>
	<meta name="description" content="Découvrez comment amplifier l'impact de Pause IA grâce au recrutement relationnel. Guides, PDFs et ressources pour devenir un recruteur efficace." />
</svelte:head>

<article class="recruitment-landing">
	<!-- Hero Section -->
	<header class="hero-section">
		<h1>Devenez Recruteur pour Pause IA</h1>
		<p class="hero-description">
			Vous voulez amplifier l'impact de Pause IA ? Le recrutement relationnel est l'un des leviers les plus puissants pour faire grandir notre mouvement. Cette page rassemble tous les outils dont vous avez besoin : guides pratiques, PDFs téléchargeables, et ressources pour maximiser votre impact.
		</p>
		<p class="hero-cta">Choisissez votre approche ci-dessous :</p>
	</header>

	<!-- Resources Section -->
	<section class="resources-section">
		<div class="resources-grid">
			<div class="resource-card highlight">
				<div class="card-icon">🚀</div>
				<h3>Guide Express (5-10 min)</h3>
				<p>Commencez rapidement avec l'essentiel du recrutement relationnel</p>
				<a href="#guide-express" class="card-button primary">Lire maintenant</a>
			</div>
			
			<div class="resource-card">
				<div class="card-icon">📚</div>
				<h3>Guide Complet (30+ min)</h3>
				<p>Maîtrisez tous les aspects du recrutement avec exemples détaillés</p>
				<a href="{base}/guide-recrutement" class="card-button secondary">Accéder au guide</a>
			</div>
			
			<div class="resource-card">
				<div class="card-icon">📄</div>
				<h3>PDF Express</h3>
				<p>Version portable du guide express pour imprimer ou lire hors ligne</p>
				<button class="card-button secondary" disabled>Bientôt disponible</button>
			</div>
			
			<div class="resource-card">
				<div class="card-icon">📄</div>
				<h3>PDF Complet</h3>
				<p>Version complète portable avec tous les détails et techniques</p>
				<button class="card-button secondary" disabled>Bientôt disponible</button>
			</div>
		</div>
	</section>

	<!-- Guide Express Content -->
	<section id="guide-express" class="guide-section">
		<header class="guide-header">
			<h2>📖 Guide Express : Lisez-le directement ici</h2>
			<div class="guide-subtitle">
				<span class="guide-title-main">Votre Guide Express :</span>
				<span class="guide-title-sub">Devenez un Moteur de Croissance pour Pause IA !</span>
			</div>
		</header>

		<Callout>
			<em>Et si…</em>
			
			<p>Et si un seul SMS pouvait, en quelques semaines, se transformer en :</p>
			<ul class="chain-list">
				<li>1 nouvelle recrue → 3 entrepreneurs mobilisés → 1 rencontre avec un député → 40 témoignages citoyens au Parlement ?</li>
			</ul>
			
			<p><strong>C'est exactement le type de cascade que produit le recrutement relationnel.</strong></p>
			
			<p>En recrutant pour Pause IA, vous ne faites pas qu'ajouter une personne : <strong>vous initiez une potentielle réaction en chaîne, amplifiant votre impact bien au-delà de votre action initiale.</strong></p>
			
			<p>Et ce n'est pas tout : cette démarche est aussi une formidable opportunité pour vous de <strong>développer des compétences précieuses</strong> (écoute active, communication persuasive, mobilisation) qui vous enrichiront personnellement et professionnellement.</p>
		</Callout>

		<div class="guide-content">
			<section>
				<h3>Pourquoi votre rôle de recruteur est déterminant :</h3>

				<h4>1. L'Effet Exponentiel</h4>
				<p>Chaque personne que vous ralliez peut, à son tour, en rallier d'autres. Imaginez : 1 personne en recrute 1 autre chaque mois. Si ce schéma se répète, on passe de 2 à 4, puis 8, 16... et plus de 4000 en un an !</p>
				
				<div class="infographic-container">
					<enhanced:img 
						src={infographic} 
						alt="L'effet exponentiel du recrutement peer-to-peer : de 1 personne à plus de 4000 en un an"
						class="infographic"
					/>
				</div>
				
				<p class="reference"><em>(Lire l'analyse complète : <a href="{base}/guide-recrutement#partie-1-pourquoi-votre-role-est-absolument-determinant">Guide de Recrutement Pause IA</a> – Partie 1 : Pourquoi votre rôle est absolument déterminant)</em></p>

				<h4>2. Une Course Contre la Montre</h4>
				<p>Les capacités des IA avancées progressent à une vitesse fulgurante. Notre capacité à sensibiliser, mobiliser et influencer doit suivre ce rythme effréné pour façonner un avenir souhaitable. Votre rôle dans cette accélération est direct.</p>

				<h4>3. La Science du Changement</h4>
				<p>Des experts comme Damon Centola (<em>Change: How to Make Big Things Happen</em>) montrent que les changements de comportement "complexes" (comme s'engager activement) se propagent par la <strong>confiance</strong> et la <strong>validation sociale</strong> au sein de réseaux personnels. Un message entendu dans un podcast (contagion simple) informe. Mais ce sont VOS conversations avec VOS proches (contagion complexe) qui transforment la prise de conscience en action.</p>
				
				<p class="reference"><em>(Comprendre la dynamique : <a href="{base}/guide-recrutement#la-science-du-changement-pourquoi-votre-reseau-personnel-est-notre-meilleur-allie">Guide de Recrutement Pause IA</a> – La science du changement, <a href="https://www.youtube.com/watch?v=Y-1qLR2w60M" target="_blank" rel="noopener noreferrer">Vidéo</a>)</em></p>
			</section>

			<section>
				<h3>Les 4 principes pour connecter et convaincre :</h3>
				<ul class="principles-list">
					<li><strong>1. La Relation Avant Tout :</strong> La confiance est la base de tout.</li>
					<li><strong>2. Écouter > Parler :</strong> Comprendre avant de vouloir convaincre.</li>
					<li><strong>3. Partir de LEUR Réalité :</strong> Ancrer l'IA dans leurs préoccupations concrètes.</li>
					<li><strong>4. Petites Demandes → Grandes Demandes :</strong> Progresser par étapes logiques.</li>
				</ul>
				<p class="reference"><em>(Découvrez chaque pilier en détail : <a href="{base}/guide-recrutement#4-principes-pour-connecter-et-convaincre">Guide de Recrutement Pause IA</a> – 4 principes pour connecter et convaincre)</em></p>
			</section>

			<section>
				<h3>Passez à l'Action : Votre Plan en 3 Étapes Simples</h3>

				<h4>ÉTAPE 1 : CARTOGRAPHIEZ VOTRE RÉSEAU (Identifiez vos "Étincelles")</h4>
				<ul>
					<li><strong>Pourquoi ?</strong> Cet exercice simple vous aide à identifier les personnes de votre entourage les plus susceptibles d'être réceptives ou influentes, pour commencer par les conversations les plus "faciles" et porteuses.</li>
					<li><strong>Comment (en simplifié) ?</strong>
						<ol>
							<li><strong>Listez sans filtre</strong> (10-20 min) : Amis, famille, collègues, anciens contacts, membres d'autres assos...</li>
							<li><strong>Évaluez rapidement</strong> (5 min) : Pour chacun, notez (1 à 3) la force de votre lien, son influence potentielle, et sa sensibilité supposée à nos sujets. Multipliez ces trois chiffres pour obtenir un score.</li>
							<li><strong>Priorisez</strong> (2 min) : Ciblez les 3-5 personnes avec le "score" le plus prometteur ou avec qui vous êtes le plus à l'aise pour une première discussion.</li>
						</ol>
					</li>
					<li><strong>Ne partagez pas cette liste avec Pause IA.</strong> Elle est pour vous seul(e).</li>
					<li><strong><em>Votre guide complet pour une cartographie efficace :</em></strong> <a href="{base}/guide-recrutement#cartographie-de-reseau-101-transformez-vos-contacts-en-plan-daction-concret">Guide de Recrutement Pause IA</a> – Cartographie de réseau 101</li>
				</ul>

				<h4>ÉTAPE 2 : ENGAGEZ LA CONVERSATION (L'Art d'Écouter pour Connecter)</h4>
				<ul>
					<li><strong>La Clé : L'ÉCOUTE AUTHENTIQUE.</strong> Votre objectif est de comprendre, pas de prêcher. Visez 80% d'écoute, 20% de parole.</li>
					<li><strong>Soyez transparent(e) sur votre démarche</strong> dès le début (voir exemples dans le guide complet).</li>
					<li><strong>Utilisez le cadre L.O.R. (Lancer, Observer, Relier) :</strong>
						<ul class="sub-list">
							<li><strong>Lancer :</strong> Introduisez le sujet de l'IA et de vos préoccupations.</li>
							<li><strong>Observer :</strong> Écoutez activement ce que votre interlocuteur exprime (ses craintes, espoirs, valeurs). Reformulez pour assurer votre compréhension.</li>
							<li><strong>Relier :</strong> Faites le lien entre <em>ses</em> préoccupations et les enjeux de l'IA, en utilisant notre cadre de la "Perte de Contrôle".</li>
						</ul>
					</li>
					<li><strong><em>Maîtrisez l'écoute et le dialogue :</em></strong> <a href="{base}/guide-recrutement#dialogue-authentique-ecouter-pour-connecter">Guide de Recrutement Pause IA</a> – Dialogue authentique</li>
					<li><strong><em>Pour créer des ponts pertinents :</em></strong> <a href="{base}/guide-recrutement#creer-des-ponts-connecter-les-preoccupations-a-laction">Guide de Recrutement Pause IA</a> – Créer des ponts</li>
				</ul>

				<h4>ÉTAPE 3 : FAITES UNE DEMANDE CLAIRE (Le "Petit Pas Suivant")</h4>
				<ul>
					<li>Proposez une action <strong>simple, claire et immédiate</strong></li>
					<li><strong>Exemple de "Demande du Mois" :</strong> Inviter à notre prochaine session Q&A en ligne.</li>
					<li>Adaptez la demande à l'intérêt de votre contact (lire un article, rejoindre Discord, participer à un événement...).</li>
					<li><strong><em>Toutes les techniques et exemples de demandes :</em></strong> <a href="{base}/guide-recrutement#lart-de-la-demande-transformer-linteret-en-action-avec-uci">Guide de Recrutement Pause IA</a> – L'art de la demande</li>
				</ul>
			</section>

			<section>
				<h3>Et si on vous dit "Non" ou si on Hésite ?</h3>
				<p>C'est parfaitement normal ! L'important est de maintenir le dialogue ouvert et de respecter le choix de l'autre. Le guide complet vous offre des pistes pour répondre aux objections les plus courantes avec bienveillance. <strong>Apprenez à gérer les objections :</strong> <a href="{base}/guide-recrutement#anticiper-les-objections-transformer-les-doutes-en-dialogue">Guide de Recrutement Pause IA</a> – Anticiper les objections</p>
			</section>
		</div>
	</section>

	<!-- Conclusion Section -->
	<section class="conclusion-section">
		<div class="conclusion-content">
			<h2>Envie d'aller plus loin ?</h2>
			<p>Ceci était le guide express pour vous donner les bases du recrutement relationnel. Pour une formation complète avec exemples détaillés, techniques avancées, réponses aux objections courantes, et ressources supplémentaires...</p>
			<a href="{base}/guide-recrutement" class="conclusion-cta">
				📚 Découvrez le Guide de Recrutement Complet
			</a>
		</div>
	</section>
</article>

<style>
	.recruitment-landing {
		max-width: 60rem;
		margin: 0 auto;
		padding: 2rem 1rem;
		line-height: 1.6;
	}

	/* Hero Section */
	.hero-section {
		text-align: center;
		margin-bottom: 4rem;
		padding: 2rem 0;
	}

	.hero-section h1 {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--brand);
		margin-bottom: 1.5rem;
		line-height: 1.2;
	}

	.hero-description {
		font-size: 1.1rem;
		color: var(--text);
		margin-bottom: 1.5rem;
		max-width: 50rem;
		margin-left: auto;
		margin-right: auto;
	}

	.hero-cta {
		font-size: 1rem;
		font-weight: 600;
		color: var(--brand);
		margin-bottom: 0;
	}

	/* Resources Section */
	.resources-section {
		margin-bottom: 5rem;
	}

	.resources-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		max-width: 56rem;
		margin: 0 auto;
	}

	.resource-card {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 2rem;
		text-align: center;
		transition: all 0.2s ease;
	}

	.resource-card:hover {
		border-color: var(--brand);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.resource-card.highlight {
		border-color: var(--brand);
		background: var(--bg-subtle);
	}

	.card-icon {
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	.resource-card h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: 0.75rem;
	}

	.resource-card p {
		color: #6b7280;
		margin-bottom: 1.5rem;
		font-size: 0.95rem;
	}

	.card-button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 600;
		text-decoration: none;
		border: none;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.card-button.primary {
		background-color: var(--brand);
		color: white;
	}

	.card-button.primary:hover {
		background-color: #e88207;
	}

	.card-button.secondary {
		background-color: white;
		color: var(--brand);
		border: 2px solid var(--brand);
	}

	.card-button.secondary:hover {
		background-color: var(--brand);
		color: white;
	}

	.card-button:disabled {
		background-color: #f3f4f6;
		color: #9ca3af;
		border-color: #e5e7eb;
		cursor: not-allowed;
	}

	/* Guide Section */
	.guide-section {
		margin-bottom: 4rem;
	}

	.guide-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.guide-header h2 {
		font-size: 1.8rem;
		color: var(--brand);
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--brand);
		padding-bottom: 0.5rem;
		display: inline-block;
	}

	.guide-subtitle {
		line-height: 1.2;
	}

	.guide-title-main {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: var(--brand);
		margin-bottom: 0.5rem;
	}

	.guide-title-sub {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text);
	}

	.guide-content {
		max-width: 50rem;
		margin: 0 auto;
	}

	.infographic-container {
		text-align: center;
		margin: 2rem 0;
	}

	.infographic {
		max-width: 100%;
		height: auto;
		border-radius: 0.3125rem;
	}

	.reference {
		font-size: 0.95rem;
		color: #666;
		font-style: italic;
	}

	.principles-list {
		margin: 1.5rem 0;
	}

	.principles-list li {
		margin: 0.8rem 0;
		padding-left: 0.5rem;
	}

	.chain-list li {
		font-weight: 500;
		color: var(--text);
	}

	.sub-list {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.sub-list li {
		margin: 0.3rem 0;
		font-size: 0.95rem;
	}

	.guide-content section {
		margin: 3rem 0;
	}

	.guide-content h3 {
		color: var(--brand);
		font-size: 1.4rem;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--brand);
		padding-bottom: 0.5rem;
	}

	.guide-content h4 {
		color: var(--text);
		font-size: 1.1rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	/* Conclusion Section */
	.conclusion-section {
		background: var(--bg-subtle);
		border-radius: 0.5rem;
		padding: 3rem 2rem;
		text-align: center;
		margin-top: 4rem;
	}

	.conclusion-content h2 {
		color: var(--brand);
		font-size: 1.8rem;
		margin-bottom: 1rem;
	}

	.conclusion-content p {
		font-size: 1.1rem;
		color: var(--text);
		margin-bottom: 2rem;
		max-width: 40rem;
		margin-left: auto;
		margin-right: auto;
	}

	.conclusion-cta {
		display: inline-block;
		background-color: var(--brand);
		color: white;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		transition: background-color 0.2s ease;
	}

	.conclusion-cta:hover {
		background-color: #e88207;
	}

	/* Responsive adjustments */
	@media (min-width: 640px) {
		.recruitment-landing {
			padding: 3rem 2rem;
		}

		.hero-section h1 {
			font-size: 3rem;
		}

		.guide-title-main {
			font-size: 2.5rem;
		}

		.guide-title-sub {
			font-size: 1.8rem;
		}

		.resources-grid {
			gap: 2rem;
		}

		.resource-card {
			padding: 2.5rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-section h1 {
			font-size: 3.5rem;
		}

		.guide-title-main {
			font-size: 3rem;
		}

		.guide-title-sub {
			font-size: 2.2rem;
		}
	}

	/* Override global list styles for better visual hierarchy */
	:global(.recruitment-landing ol) {
		counter-reset: item;
		padding-left: 0;
	}

	:global(.recruitment-landing ol > li) {
		display: block;
		margin: 0.5rem 0;
		padding-left: 2rem;
		position: relative;
	}

	:global(.recruitment-landing ol > li::before) {
		content: counter(item) ".";
		counter-increment: item;
		font-weight: bold;
		color: var(--brand);
		position: absolute;
		left: 0;
	}

	:global(.recruitment-landing code) {
		background-color: var(--bg-subtle);
		padding: 0.2rem 0.4rem;
		border-radius: 0.2rem;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
	}
</style> 