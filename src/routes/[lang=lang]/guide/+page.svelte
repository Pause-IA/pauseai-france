<script lang="ts">
	/**
	 * Guide de contribution : la version en ligne de la feuille A4 que l'on
	 * distribue en main propre (static/pdfs/guide-contribution.pdf, fabriqué
	 * par scripts/pdf-guide.mjs depuis scripts/pdf/guide-contribution.html).
	 *
	 * Les deux doivent dire la même chose : quand une étape change ici, elle
	 * change aussi dans le HTML source du PDF, et on relance le script.
	 *
	 * Page non référencée : hors menu, hors sitemap, non indexée. On y arrive
	 * par le QR code de la feuille ou par un lien donné de la main à la main.
	 */
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Page, LinkGrid, LinkCard } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData
	$: prefix = data.lang === 'en' ? '/en' : '/fr'

	$: etapes = [
		{
			icone: '📖',
			titre: 'Inscrivez-vous à nos canaux',
			duree: '10 min',
			texte:
				'Explorez le site pour voir comment participer à notre communication. Si vous le pouvez, suivez-nous sur au moins deux réseaux différents, et inscrivez-vous à la newsletter.',
			href: `${prefix}/`
		},
		{
			icone: '✉️',
			titre: 'Envoyez un mail à vos représentants',
			duree: '10 min',
			texte:
				'L’outil vous propose un modèle à retoucher ou à envoyer tel quel. Si vous obtenez une réponse, dites-le nous.',
			href: `${prefix}/ecrire-a-mes-elus`
		},
		{
			icone: '💬',
			titre: 'Rejoignez Pause Action',
			duree: '5 min',
			texte:
				'Le groupe WhatsApp qui propose une action par semaine, faisable en quelques minutes. Aucune obligation.',
			href: 'https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU'
		},
		{
			icone: '🎫',
			titre: 'Adhérez à l’association',
			duree: '10 min',
			texte:
				'Contribuez selon vos moyens. Aucune obligation de cotiser si vous n’avez pas de revenus stables.',
			href: `${prefix}/rejoindre`
		},
		{
			icone: '👥',
			titre: 'Rejoignez notre communauté',
			duree: '40 min',
			texte:
				'Présentez-vous sur le Discord, ou par mail si vous préférez. Lisez deux articles du blog. Dans le salon #contribuer, choisissez au moins un projet. Et si vous le souhaitez, rejoignez un groupe local.',
			href: `${prefix}/rejoindre`
		},
		{
			icone: '🙏',
			titre: 'Parlez-en à vos proches',
			duree: '1 h',
			texte:
				'Parlez de Pause IA à deux membres de votre famille ou deux amis, et proposez-leur de signer l’appel.',
			href: `${prefix}/declaration`
		},
		{
			icone: '🧩',
			titre: 'Approfondissez les risques de l’IA',
			duree: '3 h',
			texte:
				'Nos analyses sur la chaîne YouTube, la foire aux questions, et si vous êtes disponible, une session de la Fresque des risques de l’IA.',
			href: `${prefix}/fresque`
		},
		{
			icone: '📢',
			titre: 'Formez-vous à la sensibilisation',
			duree: 'durée libre',
			texte:
				'Le guide pour convaincre au moins une personne de votre réseau de rejoindre Pause IA. Donnez-lui ensuite une copie de cette feuille.',
			href: `${prefix}/guide-sensibilisation`
		}
	]
</script>

<PostMeta
	title="Guide de contribution"
	description="Vous voulez contribuer à Pause IA mais vous ne savez pas par où commencer : huit étapes, de dix minutes à quelques heures."
/>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Page
	title="Suivez le guide"
	eyebrow="Agir"
	lede="Vous voulez contribuer à Pause IA, mais vous ne savez pas par où commencer ? Huit étapes, dans l’ordre, de dix minutes à quelques heures. Faites-les à votre rythme."
	width="content"
>
	<svelte:fragment slot="actions">
		<p>
			<Button alt href="/pdfs/guide-contribution.pdf" target="_blank" rel="noopener noreferrer">
				Télécharger la feuille (PDF)
			</Button>
		</p>
	</svelte:fragment>

	<LinkGrid min="21rem">
		{#each etapes as e, i}
			<LinkCard href={e.href} title={`${i + 1}. ${e.titre}`} icon={e.icone}>
				{e.texte}
				<span class="duree">{e.duree}</span>
			</LinkCard>
		{/each}
	</LinkGrid>

	<p>
		Une question ? Écrivez-nous à
		<a href="mailto:contact@pauseia.fr">contact@pauseia.fr</a>.
	</p>
</Page>

<style>
	/* Le coût en temps est ce qui décide si on commence maintenant ou pas :
	   il est donné sur chaque étape, mais discrètement. */
	.duree {
		display: block;
		margin-block-start: 0.4rem;
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--text-2);
	}
</style>
