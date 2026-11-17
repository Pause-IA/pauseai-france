<script lang="ts">
	/**
	 * Les modèles de page, pour les voir.
	 *
	 * Trois modèles, et pour chacun des pages réelles du site plutôt que des
	 * maquettes : une maquette se périme, une page en production non.
	 *
	 * Page interne : hors menu, hors sitemap, non indexée.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import { Page, SectionTitle, LinkGrid, LinkCard } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData
	$: prefix = data.lang === 'en' ? '/en' : '/fr'

	$: modeles = [
		{
			nom: 'Compilation',
			quand: 'Une collection qu’on parcourt : grille de cartes, liste filtrable, archives.',
			exemples: [
				{ href: `${prefix}/ressources`, titre: 'Ressources' },
				{ href: `${prefix}/presse`, titre: 'Espace presse' },
				{ href: `${prefix}/groupes-locaux`, titre: 'Groupes locaux' }
			]
		},
		{
			nom: 'Hub',
			quand: 'Une page d’orientation : quelques choix, et on repart ailleurs.',
			exemples: [
				{ href: `${prefix}/agir`, titre: 'Toutes les façons d’agir' },
				{ href: `${prefix}/rejoindre`, titre: 'Rejoindre Pause IA' },
				{ href: '/sensibiliser-votre-entourage', titre: 'Sensibiliser votre entourage' }
			]
		},
		{
			nom: 'Outil',
			quand: 'On vient y faire quelque chose : un formulaire, un générateur, une carte.',
			exemples: [
				{ href: `${prefix}/ecrire-a-mes-elus`, titre: 'Écrire à mes élus' },
				{ href: `${prefix}/declaration`, titre: 'Signer l’appel' },
				{ href: `${prefix}/dons`, titre: 'Faire un don' }
			]
		},
		{
			nom: 'Campagne',
			quand: 'Un enjeu, une échéance, des actions à faire.',
			exemples: [
				{ href: `${prefix}/municipales-2026`, titre: 'Élections municipales 2026' },
				{ href: `${prefix}/geneve-2026`, titre: 'Genève 2026' },
				{ href: `${prefix}/emploi-ia`, titre: 'Emploi & IA' }
			]
		},
		{
			nom: 'Article / texte',
			quand: 'Un texte long, qui se lit d’un bout à l’autre et peut s’imprimer.',
			exemples: [
				{ href: `${prefix}/guide-sensibilisation`, titre: 'Guide de sensibilisation' },
				{ href: `${prefix}/charte-des-valeurs`, titre: 'Charte des valeurs' },
				{ href: `${prefix}/articles/pas-de-pilote`, titre: 'Pas de pilote dans l’avion France' }
			]
		}
	]
</script>

<PostMeta title="Modèles de page" description="Les cinq modèles de page du site, vus en vrai." />

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Page
	title="Modèles de page"
	eyebrow="Document de travail interne"
	lede="Toute page du site suit l’un de ces cinq modèles."
	width="wide"
>
	{#each modeles as m}
		<section>
			<SectionTitle>{m.nom}</SectionTitle>
			<p>{m.quand}</p>
			<LinkGrid min="16rem">
				{#each m.exemples as e}
					<LinkCard href={e.href} title={e.titre}>Voir la page</LinkCard>
				{/each}
			</LinkGrid>
		</section>
	{/each}
</Page>
