<script lang="ts">
	import Button from '$components/Button.svelte'
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { fly } from 'svelte/transition'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	/* Sur téléphone, ces cinq paragraphes font 1 389 px : une page et demie de
	   prose avant la première action. Les trois du milieu sont repliés par
	   défaut sous 640 px. Ils restent dans le HTML (référencement, et rien à
	   charger au dépliage) : seul l'affichage change. Au-dessus de 640 px le
	   bouton disparaît et le texte est intégralement visible. */
	let deplie = false

	$: prefix = lang === 'en' ? '/en' : '/fr'
	const label_id = 'lead-title'
</script>

<section class="lead" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>
			{#if lang === 'en'}
				The AI industry should not be allowed to gamble with our lives
			{:else}
				L'industrie de l'IA ne devrait pas avoir le droit de jouer avec nos vies
			{/if}
		</UnderlinedTitle>
	</Fly>
	<Fly>
		<div class="lead" aria-labelledby={label_id}>
			{#if lang === 'en'}
				<p>
					This is only the beginning. AI has started to take over our lives, and we are already
					losing our grip on it. The risks are immense: our democracies, our jobs, our mental
					health, the computer systems everything else runs on (the internet, banking, public
					services)… Major AI-driven disasters can no longer be ruled out.
				</p>
				<div class="repliable" class:deplie>
					<p>
						Worse still, the capabilities of frontier general-purpose AI models grow by the day, and
						that is precisely where the handful of companies building them pour their enormous
						financial resources. They are succeeding, and that is what should worry us.
					</p>
					<p>
						And safety? No regulation worthy of the name. Not even any certainty that these systems
						can be controlled at all, by technology or by law. The frontrunners themselves, OpenAI
						and Anthropic, keep publishing statements about the danger and about how hard the safety
						problem is.
					</p>
					<p>
						Pause AI is calling for an international public authority to oversee frontier AI. The AI
						industry should not be allowed to gamble with our lives. And yet it is.
					</p>
				</div>
				<button type="button" class="plus" on:click={() => (deplie = true)} hidden={deplie}
					>Read the rest</button
				>
				<p>If you think this has to stop, join us and sign our statement.</p>
				<div class="buttons" in:fly={{ y: 20, duration: 300, delay: 700 }}>
					<Button href="{prefix}/declaration">Sign the statement</Button>
					<Button href="{prefix}/rejoindre" alt>Join us</Button>
				</div>
			{:else}
				<p>
					Ce n'est que le début. L'IA a commencé à envahir nos vies, et déjà nous ne contrôlons
					rien. Les risques sont immenses, pour nos démocraties, nos emplois, notre santé mentale,
					le fonctionnement de notre informatique vitale (internet, système bancaire, services
					publics)… Des catastrophes majeures dues à l'IA ne peuvent plus être exclues.
				</p>
				<div class="repliable" class:deplie>
					<p>
						Facteur aggravant, les capacités des modèles d'IA généralistes de pointe augmentent
						chaque jour. C'est à cela que les quelques entreprises qui les développent consacrent
						leurs énormes moyens financiers. Leurs succès dans ce domaine sont très inquiétants.
					</p>
					<p>
						Et la sécurité{'\u202F'}? Pas de régulation à la hauteur. Pas même de certitude que ces
						systèmes soient réellement contrôlables, ni par la technologie, ni par la loi. Les
						champions eux-mêmes, OpenAI et Anthropic, multiplient les déclarations sur le danger et
						la complexité des enjeux de sécurité.
					</p>
					<p>
						Pause IA réclame la création d'une autorité publique internationale pour contrôler les
						IA de pointe. L'industrie de l'IA ne devrait pas avoir le droit de jouer avec nos vies.
						Et pourtant, elle l'a.
					</p>
				</div>
				<button type="button" class="plus" on:click={() => (deplie = true)} hidden={deplie}
					>Lire la suite</button
				>
				<p>Si vous pensez que cela doit cesser, rejoignez-nous, signez notre déclaration.</p>
				<div class="buttons" in:fly={{ y: 20, duration: 300, delay: 700 }}>
					<Button href="{prefix}/declaration">Signer la déclaration</Button>
					<Button href="{prefix}/rejoindre" alt>Rejoignez-nous</Button>
				</div>
			{/if}
		</div>
	</Fly>
</section>

<style>
	.lead {
		align-self: center;
		max-width: var(--width-wide);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	/* `display: contents` : hors téléphone le conteneur n'existe pas pour la
	   mise en page, les paragraphes coulent exactement comme avant. */
	.repliable {
		display: contents;
	}

	.plus {
		display: none;
		/* De l'air des deux côtés : collé, le lien se lisait comme la suite du
		   paragraphe précédent et comme l'amorce du suivant. */
		margin-block: 0.5rem 1.5rem;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: underline;
		cursor: pointer;
	}

	@media (max-width: 639px) {
		.repliable:not(.deplie) {
			display: none;
		}

		.plus {
			display: inline-block;
			align-self: flex-start;
		}
	}

	.buttons {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		margin-top: 2rem;
		justify-content: center;
	}
</style>
