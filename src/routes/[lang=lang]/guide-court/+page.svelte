<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Callout from '$components/Callout.svelte'
	import Button from '$components/Button.svelte'
	import { Page } from '$components/ui'
	import { base } from '$app/paths'
	import type { PageData } from './$types'

	export let data: PageData

	$: prefix = data.lang === 'en' ? '/en' : '/fr'
</script>

<PostMeta
	title="Guide court : en parler autour de vous"
	description="Parler des risques de l’IA à vos proches, vos collègues, vos amis : les quatre principes qui fonctionnent, la conversation en trois temps, et quoi faire devant un refus."
/>

<Page
	title="En parler autour de vous, concrètement"
	eyebrow="Agir"
	lede="Les quatre principes qui fonctionnent, la conversation en trois temps, et quoi faire quand on vous dit non. Dix minutes de lecture."
	width="text"
	variant="note"
	as="article"
>
	<p class="pdf-court">
		<a href="/pdfs/guide_recrutement_express.pdf">Version PDF, à imprimer</a>
	</p>

	<Callout>
		<em>Pourquoi vous, plutôt qu’une campagne de publicité</em>

		<p>
			Sur un sujet aussi inquiétant que l’IA, la plupart des gens ne changent pas d’avis en lisant
			un tract. Ils en parlent d’abord avec quelqu’un en qui ils ont confiance. C’est pour cela
			qu’une conversation avec vous vaut mieux que n’importe quelle affiche : vous êtes cette
			personne-là pour votre entourage.
		</p>

		<p>
			L’objectif n’est pas de convaincre tout le monde, ni de faire du chiffre.
			<strong>
				C’est que les gens qui sont déjà inquiets sachent qu’ils ne sont pas seuls, et qu’il existe
				quelque chose à faire.
			</strong>
		</p>
	</Callout>

	<div class="guide-content">
		<section>
			<h3>Pourquoi en parler autour de vous compte</h3>

			<h4>1. Les gens écoutent ceux qu’ils connaissent</h4>
			<p>
				Les enquêtes sur l’opinion le montrent régulièrement : sur un sujet technique et anxiogène,
				c’est l’entourage proche qui pèse le plus, bien avant les médias et les campagnes. Vous avez
				accès à des personnes qu’aucune communication de l’association n’atteindra jamais.
			</p>
			<p>
				L’idée n’est donc pas de parler au plus grand nombre, mais de parler bien à quelques
				personnes : celles qui, chez vous, sont déjà mal à l’aise avec ce qu’elles voient arriver.
			</p>

			<h4>2. Le temps joue contre nous</h4>
			<p>
				Les capacités des modèles d’IA progressent vite, et les décisions qui comptent se prennent
				maintenant. Plus l’inquiétude est partagée tôt, plus elle pèse au moment où ces décisions se
				jouent.
			</p>

			<h4>3. Ce que montrent les travaux sur l’engagement</h4>
			<p>
				Des experts comme Damon Centola (<em>Change: How to Make Big Things Happen</em>) montrent
				que les changements de comportement "complexes" (comme s’engager activement) se propagent
				par la <strong>confiance</strong> et la <strong>validation sociale</strong> au sein de réseaux
				personnels. Un message entendu dans un podcast (contagion simple) informe. Ce sont les conversations
				avec des proches qui transforment la prise de conscience en action.
			</p>

			<p class="reference">
				<em
					>(Comprendre la dynamique : <a
						href="{base}/fr/guide-sensibilisation#les-principes-de-la-sensibilisation"
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
					<strong>3. Partir de LEUR Réalité :</strong> Ancrer l’IA dans leurs préoccupations concrètes.
				</li>
				<li>
					<strong>4. Petites Demandes → Grandes Demandes :</strong> Progresser par étapes logiques.
				</li>
			</ul>
			<p class="reference">
				<em
					>(Découvrez chaque pilier en détail : <a
						href="{base}/fr/guide-sensibilisation#les-principes-de-la-sensibilisation"
						>Guide de Recrutement Pause IA</a
					> – 4 principes pour connecter et convaincre)</em
				>
			</p>
		</section>

		<section>
			<h3>Comment s’y prendre, en trois temps</h3>

			<h4>1. Repérer à qui en parler</h4>
			<ul>
				<li>
					<strong>Pourquoi ?</strong> Cet exercice simple vous aide à identifier les personnes de votre
					entourage avec qui la discussion a le plus de chances d’être utile, plutôt que de parler au
					hasard.
				</li>
				<li>
					<strong>En pratique</strong>
					<ol>
						<li>
							Faites la liste des gens à qui vous pourriez en parler sans que ce soit forcé :
							famille, amis, collègues, anciens camarades, membres d’autres associations.
						</li>
						<li>
							Repérez ceux qui ont déjà montré de l’inquiétude sur le sujet, même en passant. Ce
							sont les conversations les plus naturelles à ouvrir.
						</li>
						<li>
							Commencez par deux ou trois personnes, celles avec qui vous êtes le plus à l’aise.
							Mieux vaut une vraie discussion que dix messages envoyés à la chaîne.
						</li>
					</ol>
				</li>
				<li>
					<strong>Ne partagez pas cette liste avec Pause IA.</strong> Elle est pour vous seul(e).
				</li>
				<li>
					<strong><em>Votre guide complet pour une cartographie efficace :</em></strong>
					<a href="{base}/fr/guide-sensibilisation#outil-1-la-cartographie-de-votre-réseau"
						>Guide de Recrutement Pause IA</a
					> – Cartographie de réseau 101
				</li>
			</ul>

			<h4>2. Engager la conversation, en écoutant</h4>
			<ul>
				<li>
					<strong>L’essentiel est d’écouter.</strong> L’objectif est de comprendre ce qui préoccupe la
					personne, pas de dérouler un argumentaire. En pratique : beaucoup plus d’écoute que de parole.
				</li>
				<li>
					<strong>Soyez transparent(e) sur votre démarche</strong> dès le début (voir exemples dans le
					guide complet).
				</li>
				<li>
					<strong>Utilisez le cadre L.O.R. (Lancer, Observer, Relier) :</strong>
					<ul class="sub-list">
						<li>
							<strong>Lancer :</strong> Introduisez le sujet de l’IA et de vos préoccupations.
						</li>
						<li>
							<strong>Observer :</strong> Écoutez activement ce que votre interlocuteur exprime (ses craintes,
							espoirs, valeurs). Reformulez pour assurer votre compréhension.
						</li>
						<li>
							<strong>Relier :</strong> Faites le lien entre <em>ses</em> préoccupations et les enjeux
							de l’IA.
						</li>
					</ul>
				</li>
				<li>
					<strong><em>Maîtrisez l’écoute et le dialogue :</em></strong>
					<a href="{base}/fr/guide-sensibilisation#outil-2-le-dialogue-authentique"
						>Guide de Recrutement Pause IA</a
					> – Dialogue authentique
				</li>
				<li>
					<strong><em>Pour créer des ponts pertinents :</em></strong>
					<a href="{base}/fr/guide-sensibilisation#outil-3-créer-des-ponts"
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
							<a href="https://pauseia.fr/nous-rejoindre" target="_blank" rel="noopener noreferrer"
								>Devenir membre</a
							>
							de Pause IA ou
							<a href="https://pauseia.fr/dons" target="_blank" rel="noopener noreferrer"
								>faire un don</a
							> à l’association.
						</li>
					</ul>
				</li>
				<li>
					<strong><em>Toutes les techniques et exemples de demandes :</em></strong>
					<a href="{base}/fr/guide-sensibilisation#outil-5-les-engagements-possibles"
						>Guide de Recrutement Pause IA</a
					> – L’art de la demande
				</li>
			</ul>
		</section>

		<section>
			<h3>Et si on vous dit "Non" ou si on hésite ?</h3>
			<p>
				C’est parfaitement normal ! L’important est de maintenir le dialogue ouvert et de respecter
				le choix de l’autre. Le guide complet vous offre des pistes pour répondre aux objections les
				plus courantes avec bienveillance. <strong>Apprenez à gérer les objections :</strong>
				<a href="{base}/fr/guide-sensibilisation#outil-4-répondre-aux-objections"
					>Guide de Recrutement Pause IA</a
				> – Anticiper les objections
			</p>
		</section>

		<section>
			<h3>Besoin d’aide ou d’échanger ?</h3>
			<p>
				Rejoignez notre réunion hebdomadaire pour échanger, partager son progrès, et bénéficier du
				soutien de l’équipe. Vous la trouverez dans la section événements de notre <a
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
				>Rappelez-vous : chaque conversation compte. Chaque personne sensibilisée est une victoire.
				Vous avez le pouvoir de faire grandir notre mouvement de manière significative. Merci pour
				votre engagement !</strong
			>
		</p>
	</Callout>

	<p>
		<Button href="{prefix}/guide-sensibilisation">Lire le guide complet</Button>
	</p>
</Page>

<style>
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
</style>
