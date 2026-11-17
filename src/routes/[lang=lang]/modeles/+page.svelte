<script lang="ts">
	/**
	 * Vitrine des modèles de page, à l'usage de l'équipe.
	 *
	 * Avant d'écrire une page, on vient voir ici lequel des trois modèles
	 * lui correspond, et à quoi il ressemble en vrai. Chaque modèle renvoie
	 * vers des pages réelles du site plutôt que vers des maquettes : une
	 * maquette se périme, une page en production non.
	 *
	 * Page interne : hors menu, hors sitemap, non indexée, comme le plan du
	 * site.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import { Page, SectionTitle, LinkGrid, LinkCard, Card } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData
	$: prefix = data.lang === 'en' ? '/en' : '/fr'

	$: modeles = [
		{
			nom: 'Gabarit de page, variante « standard »',
			quand: 'Un hub, un outil, une page éditoriale : du contenu structuré, pas un texte suivi.',
			code: '<Page title eyebrow lede width="content" />, ou « modele: standard » dans le frontmatter d’une page markdown',
			exemples: [
				{ href: `${prefix}/ressources`, titre: 'Ressources' },
				{ href: `${prefix}/presse`, titre: 'Espace presse' },
				{ href: `${prefix}/groupes-locaux`, titre: 'Groupes locaux' }
			]
		},
		{
			nom: 'Gabarit de page, variante « note »',
			quand:
				'Un texte long qui se lit d’un bout à l’autre, et qui doit pouvoir s’imprimer : colonne de lecture étroite, filets orange au-dessus des intertitres.',
			code: '<Page title eyebrow lede width="text" variant="note" as="article" />, ou rien à déclarer dans une page markdown : c’est le modèle par défaut',
			exemples: [
				{ href: `${prefix}/guide-sensibilisation`, titre: 'Guide de sensibilisation' },
				{ href: `${prefix}/articles/pas-de-pilote`, titre: 'Pas de pilote dans l’avion France' },
				{ href: `${prefix}/charte-des-valeurs`, titre: 'Charte des valeurs' }
			]
		},
		{
			nom: 'Module campagne',
			quand:
				'Une campagne : un enjeu, une échéance, des actions à faire. En-tête à étiquette et filet, sections au rythme propre.',
			code: '<CampaignPage><CampaignHero /><CampaignSection /></CampaignPage>',
			exemples: [
				{ href: `${prefix}/municipales-2026`, titre: 'Élections municipales 2026' },
				{ href: `${prefix}/geneve-2026`, titre: 'Genève 2026' },
				{ href: `${prefix}/campagne-modele`, titre: 'Gabarit de campagne, vide' }
			]
		}
	]

	const briques = [
		{
			nom: 'PageHero',
			role: 'En-tête : étiquette de rubrique, titre, chapô, ligne de méta, filet.'
		},
		{ nom: 'SectionTitle', role: 'Titre de section, avec pastille de compte facultative.' },
		{
			nom: 'LinkCard / LinkGrid',
			role: 'Carte-lien cliquable et sa grille. Toute carte qui mène ailleurs.'
		},
		{ nom: 'Card', role: 'Panneau. Variante « accent » pour un appel à l’action.' },
		{ nom: 'Button', role: 'Bouton plein, ou « alt » pour la variante légère.' },
		{ nom: 'Badge', role: 'Étiquette d’objet. Rectangle pour une rubrique, ovale pour un état.' },
		{ nom: 'Callout', role: 'Encadré de mise en garde ou de rappel dans un texte long.' },
		{ nom: 'FilterChips', role: 'Filtres en pastilles au-dessus d’une liste.' },
		{
			nom: 'RetourAgir',
			role: 'Renvoi vers « Toutes les façons d’agir », en pied des pages du menu Agir.'
		}
	]
</script>

<PostMeta
	title="Modèles de page · interne"
	description="Les trois modèles de page du site, et où les voir en vrai."
/>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Page
	title="Modèles de page"
	eyebrow="Document de travail interne"
	lede="Toute page du site suit l’un de ces trois modèles. Avant d’en écrire une nouvelle, regardez lequel lui correspond — on n’en crée pas un quatrième."
	width="wide"
>
	<svelte:fragment slot="meta">
		3 modèles · 9 briques partagées · cette page n’est ni dans le menu, ni dans le sitemap
	</svelte:fragment>

	{#each modeles as m}
		<section>
			<SectionTitle>{m.nom}</SectionTitle>
			<p>{m.quand}</p>
			<p><code>{m.code}</code></p>
			<LinkGrid min="16rem">
				{#each m.exemples as e}
					<LinkCard href={e.href} title={e.titre}>Voir la page</LinkCard>
				{/each}
			</LinkGrid>
		</section>
	{/each}

	<section>
		<SectionTitle>Les briques partagées</SectionTitle>
		<p>
			Elles s’utilisent à l’intérieur de n’importe lequel des trois modèles. Si vous êtes sur le
			point d’écrire du CSS pour une carte, un bouton ou un titre de section, c’est qu’il en existe
			déjà un.
		</p>
		<div class="briques">
			{#each briques as b}
				<Card padding="compact">
					<strong>{b.nom}</strong>
					<p>{b.role}</p>
				</Card>
			{/each}
		</div>
	</section>
</Page>

<style>
	code {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		border-radius: var(--radius-sm);
		background: var(--bg-subtle);
		font-size: 0.85rem;
	}

	.briques {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(17rem, 100%), 1fr));
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.briques p {
		margin: 0.35rem 0 0;
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.55;
	}
</style>
