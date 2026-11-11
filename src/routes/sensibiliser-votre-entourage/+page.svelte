<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Callout from '$components/Callout.svelte'
	import Button from '$components/Button.svelte'
	import { Card, PageHero, SectionTitle } from '$components/ui'
	import { base } from '$app/paths'
</script>

<PostMeta
	title="Sensibiliser votre entourage"
	description="Comment parler de Pause IA aux gens que vous connaissez déjà : un guide court à lire sur cette page, et un guide complet pour aller plus loin."
/>

<article class="recruitment-landing">
	<!-- Hero Section -->
	<PageHero eyebrow="Agir">
		Sensibiliser votre entourage
		<svelte:fragment slot="lede">
			Les gens écoutent plus volontiers quelqu'un qu'ils connaissent qu'une affiche ou une
			publication. En parler à vos proches, vos collègues, vos amis est donc l'une des choses les
			plus utiles que vous puissiez faire. Voici comment s'y prendre sans braquer personne.
		</svelte:fragment>
	</PageHero>

	<!-- Resources Section -->
	<section class="ressources" aria-labelledby="ressources-titre">
		<SectionTitle id="ressources-titre">Deux guides, selon le temps que vous avez</SectionTitle>

		<div class="grille">
			<Card class="ressource principale">
				<h3>Guide court</h3>
				<p class="duree">5 à 10 minutes</p>
				<p>L'essentiel, à lire directement sur cette page.</p>
				<p class="action"><Button href="#guide-express">Lire le guide court</Button></p>
				<p class="pdf">
					<a href="/pdfs/guide_recrutement_express.pdf">Version PDF, à imprimer</a>
				</p>
			</Card>

			<Card class="ressource">
				<h3>Guide complet</h3>
				<p class="duree">30 minutes et plus</p>
				<p>Les situations concrètes, les objections fréquentes et comment y répondre.</p>
				<p class="action">
					<Button alt href="{base}/guide-recrutement">Lire le guide complet</Button>
				</p>
			</Card>
		</div>
	</section>

	<!-- Guide Express Content -->
	<section id="guide-express" class="guide-section">
		<header class="guide-header">
			<h2>Guide court</h2>
			<div class="guide-subtitle">
				<span class="guide-title-sub">En parler autour de vous, concrètement</span>
			</div>
		</header>

		<Callout>
			<em>Pourquoi vous, plutôt qu'une campagne de publicité</em>

			<p>
				Sur un sujet aussi inquiétant que l'IA, la plupart des gens ne changent pas d'avis en lisant
				un tract. Ils en parlent d'abord avec quelqu'un en qui ils ont confiance. C'est pour cela
				qu'une conversation avec vous vaut mieux que n'importe quelle affiche : vous êtes cette
				personne-là pour votre entourage.
			</p>

			<p>
				L'objectif n'est pas de convaincre tout le monde, ni de faire du chiffre.
				<strong>
					C'est que les gens qui sont déjà inquiets sachent qu'ils ne sont pas seuls, et qu'il
					existe quelque chose à faire.
				</strong>
			</p>
		</Callout>

		<div class="guide-content">
			<section>
				<h3>Pourquoi en parler autour de vous compte</h3>

				<h4>1. Les gens écoutent ceux qu'ils connaissent</h4>
				<p>
					Les enquêtes sur l'opinion le montrent régulièrement : sur un sujet technique et
					anxiogène, c'est l'entourage proche qui pèse le plus, bien avant les médias et les
					campagnes. Vous avez accès à des personnes qu'aucune communication de l'association
					n'atteindra jamais.
				</p>
				<p>
					L'idée n'est donc pas de parler au plus grand nombre, mais de parler bien à quelques
					personnes : celles qui, chez vous, sont déjà mal à l'aise avec ce qu'elles voient arriver.
				</p>

				<h4>2. Le temps joue contre nous</h4>
				<p>
					Les capacités des modèles d'IA progressent vite, et les décisions qui comptent se prennent
					maintenant. Plus l'inquiétude est partagée tôt, plus elle pèse au moment où ces décisions
					se jouent.
				</p>

				<h4>3. Ce que montrent les travaux sur l'engagement</h4>
				<p>
					Des experts comme Damon Centola (<em>Change: How to Make Big Things Happen</em>) montrent
					que les changements de comportement "complexes" (comme s'engager activement) se propagent
					par la <strong>confiance</strong> et la <strong>validation sociale</strong> au sein de réseaux
					personnels. Un message entendu dans un podcast (contagion simple) informe. Ce sont les conversations
					avec des proches qui transforment la prise de conscience en action.
				</p>

				<p class="reference">
					<em
						>(Comprendre la dynamique : <a
							href="{base}/guide-recrutement#la-science-du-changement-pourquoi-votre-reseau-personnel-est-notre-meilleur-allie"
							>Guide de Recrutement Pause IA</a
						>
						– La science du changement,
						<a
							href="https://www.youtube.com/watch?v=Y-1qLR2w60M"
							target="_blank"
							rel="noopener noreferrer">Vidéo</a
						>)</em
					>
				</p>
			</section>

			<section>
				<h3>Les 4 principes pour connecter et convaincre :</h3>
				<ul class="principles-list">
					<li><strong>1. La Relation Avant Tout :</strong> La confiance est la base de tout.</li>
					<li><strong>2. Écouter > Parler :</strong> Comprendre avant de vouloir convaincre.</li>
					<li>
						<strong>3. Partir de LEUR Réalité :</strong> Ancrer l'IA dans leurs préoccupations concrètes.
					</li>
					<li>
						<strong>4. Petites Demandes → Grandes Demandes :</strong> Progresser par étapes logiques.
					</li>
				</ul>
				<p class="reference">
					<em
						>(Découvrez chaque pilier en détail : <a
							href="{base}/guide-recrutement#4-principes-pour-connecter-et-convaincre"
							>Guide de Recrutement Pause IA</a
						> – 4 principes pour connecter et convaincre)</em
					>
				</p>
			</section>

			<section>
				<h3>Comment s'y prendre, en trois temps</h3>

				<h4>1. Repérer à qui en parler</h4>
				<ul>
					<li>
						<strong>Pourquoi ?</strong> Cet exercice simple vous aide à identifier les personnes de votre
						entourage avec qui la discussion a le plus de chances d'être utile, plutôt que de parler au
						hasard.
					</li>
					<li>
						<strong>En pratique</strong>
						<ol>
							<li>
								Faites la liste des gens à qui vous pourriez en parler sans que ce soit forcé :
								famille, amis, collègues, anciens camarades, membres d'autres associations.
							</li>
							<li>
								Repérez ceux qui ont déjà montré de l'inquiétude sur le sujet, même en passant. Ce
								sont les conversations les plus naturelles à ouvrir.
							</li>
							<li>
								Commencez par deux ou trois personnes, celles avec qui vous êtes le plus à l'aise.
								Mieux vaut une vraie discussion que dix messages envoyés à la chaîne.
							</li>
						</ol>
					</li>
					<li>
						<strong>Ne partagez pas cette liste avec Pause IA.</strong> Elle est pour vous seul(e).
					</li>
					<li>
						<strong><em>Votre guide complet pour une cartographie efficace :</em></strong>
						<a
							href="{base}/guide-recrutement#cartographie-de-reseau-101-transformez-vos-contacts-en-plan-daction-concret"
							>Guide de Recrutement Pause IA</a
						> – Cartographie de réseau 101
					</li>
				</ul>

				<h4>2. Engager la conversation, en écoutant</h4>
				<ul>
					<li>
						<strong>L'essentiel est d'écouter.</strong> L'objectif est de comprendre ce qui préoccupe
						la personne, pas de dérouler un argumentaire. En pratique : beaucoup plus d'écoute que de
						parole.
					</li>
					<li>
						<strong>Soyez transparent(e) sur votre démarche</strong> dès le début (voir exemples dans
						le guide complet).
					</li>
					<li>
						<strong>Utilisez le cadre L.O.R. (Lancer, Observer, Relier) :</strong>
						<ul class="sub-list">
							<li>
								<strong>Lancer :</strong> Introduisez le sujet de l'IA et de vos préoccupations.
							</li>
							<li>
								<strong>Observer :</strong> Écoutez activement ce que votre interlocuteur exprime (ses
								craintes, espoirs, valeurs). Reformulez pour assurer votre compréhension.
							</li>
							<li>
								<strong>Relier :</strong> Faites le lien entre <em>ses</em> préoccupations et les enjeux
								de l'IA.
							</li>
						</ul>
					</li>
					<li>
						<strong><em>Maîtrisez l'écoute et le dialogue :</em></strong>
						<a href="{base}/guide-recrutement#dialogue-authentique-ecouter-pour-connecter"
							>Guide de Recrutement Pause IA</a
						> – Dialogue authentique
					</li>
					<li>
						<strong><em>Pour créer des ponts pertinents :</em></strong>
						<a
							href="{base}/guide-recrutement#creer-des-ponts-connecter-les-preoccupations-a-laction"
							>Guide de Recrutement Pause IA</a
						> – Créer des ponts
					</li>
				</ul>

				<h4>3. Proposer quelque chose de précis</h4>
				<ul>
					<li>Proposez une action <strong>simple, claire et immédiate</strong></li>
					<li>
						<strong>Quelques options, de la plus légère à la plus engageante :</strong>
						<ul class="sub-list">
							<li>Partager une vidéo courte ou un article.</li>
							<li>
								Faire la dernière action proposée par Pause IA (dans le groupe WhatsApp "Pause
								Action").
							</li>
							<li>
								Inviter à rejoindre notre <a
									href="https://pauseia.substack.com/"
									target="_blank"
									rel="noopener noreferrer">newsletter</a
								>
								ou notre
								<a
									href="https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU"
									target="_blank"
									rel="noopener noreferrer">groupe WhatsApp "Pause Action".</a
								>
							</li>
							<li>
								Suggérer de participer à notre webinaire mensuel (en construction) ou de rejoindre
								notre <a
									href="https://discord.gg/vyXGd7AeGc"
									target="_blank"
									rel="noopener noreferrer">Discord</a
								>.
							</li>
							<li>
								<a
									href="https://pauseia.fr/nous-rejoindre"
									target="_blank"
									rel="noopener noreferrer">Devenir membre</a
								>
								de Pause IA ou
								<a href="https://pauseia.fr/dons" target="_blank" rel="noopener noreferrer"
									>faire un don</a
								> à l'association.
							</li>
						</ul>
					</li>
					<li>
						<strong><em>Toutes les techniques et exemples de demandes :</em></strong>
						<a
							href="{base}/guide-recrutement#lart-de-la-demande-transformer-linteret-en-action-avec-uci"
							>Guide de Recrutement Pause IA</a
						> – L'art de la demande
					</li>
				</ul>
			</section>

			<section>
				<h3>Et si on vous dit "Non" ou si on hésite ?</h3>
				<p>
					C'est parfaitement normal ! L'important est de maintenir le dialogue ouvert et de
					respecter le choix de l'autre. Le guide complet vous offre des pistes pour répondre aux
					objections les plus courantes avec bienveillance. <strong
						>Apprenez à gérer les objections :</strong
					>
					<a
						href="{base}/guide-recrutement#anticiper-les-objections-transformer-les-doutes-en-dialogue"
						>Guide de Recrutement Pause IA</a
					> – Anticiper les objections
				</p>
			</section>

			<section>
				<h3>Besoin d'aide ou d'échanger ?</h3>
				<p>
					Rejoignez notre réunion hebdomadaire pour échanger, partager son progrès, et bénéficier du
					soutien de l'équipe. Vous la trouverez dans la section événements de notre <a
						href="https://discord.gg/vyXGd7AeGc"
						target="_blank"
						rel="noopener noreferrer">Discord</a
					>.
				</p>
			</section>
		</div>

		<Callout>
			<p>
				<strong
					>Rappelez-vous : chaque conversation compte. Chaque personne sensibilisée est une
					victoire. Vous avez le pouvoir de faire grandir notre mouvement de manière significative.
					Merci pour votre engagement !</strong
				>
			</p>
		</Callout>
	</section>

	<!-- Conclusion Section -->
	<section class="conclusion-section">
		<div class="conclusion-content">
			<h2>Envie d'aller plus loin ?</h2>
			<p>
				Ce guide court donne les bases. Le guide complet reprend les mêmes idées avec des exemples
				de conversations, les objections qui reviennent le plus souvent et comment y répondre
				honnêtement.
			</p>
			<p class="action">
				<Button href="{base}/guide-recrutement">Lire le guide complet</Button>
			</p>
		</div>
	</section>
</article>

<style>
	/* Page refaite sur la charte : plus aucune couleur, aucun rayon ni aucune
	   ombre en dur, tout passe par les tokens d'app.css, ce qui fait aussi
	   fonctionner le mode sombre. Les briques partagées (PageHero, Card,
	   SectionTitle, Button) remplacent les cartes et boutons maison. */
	.recruitment-landing {
		/* <main> est un conteneur flex : sans ces deux déclarations, l'article
		   refuse de descendre sous la largeur intrinsèque de son contenu et la
		   page défile horizontalement sur mobile. Même piège que CampaignPage. */
		min-inline-size: 0;
		inline-size: 100%;
		max-inline-size: var(--width-content);
		margin-inline: auto;
		padding: 2.5rem 1.5rem 5rem;
	}

	section {
		margin-block-end: 3.5rem;
	}

	/* --- Cartes de ressources --------------------------------------------- */
	/* Quatre ressources : deux par deux. En `auto-fit`, elles tombaient en 3 + 1,
	   et la dernière restait seule sur sa ligne. */
	.grille {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.25rem;
		align-items: start;
	}

	@media (max-width: 640px) {
		.grille {
			grid-template-columns: 1fr;
		}
	}

	.grille :global(.ressource) {
		display: flex;
		flex-direction: column;
	}

	/* Le guide express est l'entrée recommandée : bordure de marque, pas d'aplat
	   (le texte sur un aplat orange descend à 2,2:1 s'il est blanc). */
	.grille :global(.principale) {
		border-color: var(--brand);
	}

	.grille :global(.ressource h3) {
		margin: 0 0 0.25rem;
		font-size: 1.15rem;
		color: var(--text);
	}

	.grille :global(.ressource p) {
		margin: 0;
		color: var(--text-2);
		line-height: 1.6;
	}

	.grille :global(.pdf) {
		margin: 0.75rem 0 0;
		font-size: 0.9rem;
	}

	.grille :global(.duree) {
		margin-block-end: 0.75rem !important;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--brand-subtle) !important;
	}

	/* Les boutons tombent sur la même ligne quelle que soit la longueur du texte. */
	.grille :global(.action) {
		margin-block-start: auto !important;
		padding-block-start: 1.25rem;
	}

	/* --- Corps du guide ---------------------------------------------------- */
	.guide-section h2 {
		margin: 0 0 1.5rem;
		font-size: clamp(1.4rem, 3vw, 1.75rem);
	}

	.guide-subtitle {
		margin-block-end: 2rem;
	}

	.guide-title-sub {
		display: block;
		color: var(--text-2);
	}

	.guide-content :global(h3) {
		margin: 2.5rem 0 1rem;
		font-size: 1.4rem;
		color: var(--text);
	}

	.guide-content :global(h4) {
		margin: 1.75rem 0 0.6rem;
		font-size: 1.1rem;
		color: var(--text);
	}

	.guide-content :global(p),
	.guide-content :global(li) {
		line-height: 1.7;
	}

	.guide-content :global(ul) {
		padding-inline-start: 1.25rem;
	}

	.guide-content :global(li) {
		margin-block-end: 0.5rem;
	}

	.reference {
		font-size: 0.9rem;
		color: var(--text-2);
	}

	/* --- Conclusion -------------------------------------------------------- */
	.conclusion-section {
		padding: 2rem;
		background: var(--bg-subtle);
		border: 1px solid var(--brand);
		border-radius: var(--radius-lg);
	}

	.conclusion-section h2 {
		margin: 0 0 0.75rem;
		font-size: clamp(1.3rem, 2.5vw, 1.6rem);
	}

	.conclusion-section p {
		margin: 0;
		max-inline-size: var(--width-text);
		color: var(--text-2);
		line-height: 1.7;
	}

	.conclusion-section .action {
		margin: 1.5rem 0 0;
	}

	@media (max-width: 600px) {
		.recruitment-landing {
			padding: 2rem 1.1rem 3.5rem;
		}

		section {
			margin-block-end: 2.5rem;
		}

		.conclusion-section {
			padding: 1.25rem;
		}
	}
</style>
