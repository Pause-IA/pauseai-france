<script lang="ts">
	import { openActivoiceForm } from '$lib/activoice'
	import Button from '$lib/components/Button.svelte'
	import { CampaignPage, CampaignHero, CampaignSection } from '$components/campaign'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: t = getT(data.lang)

	function openActivoice() {
		void openActivoiceForm(
			'activoice-embed-a0fa93be_f050_4d77_8a0c_9e70e3fe02b6',
			'a0fa93be-f050-4d77-8a0c-9e70e3fe02b6'
		)
	}
</script>

<svelte:head>
	<script src="https://activoice.online/embed/activoice-12.0.0.js"></script>
</svelte:head>

<CampaignPage title={t.sommet.title} description={t.sommet.description}>
	<CampaignHero
		title={t.sommet.title}
		lede={t.sommet.description}
		eyebrow={data.lang === 'en' ? 'Campaign' : 'Campagne'}
	>
		<Button href="https://www.change.org/fr-ia-sommet-inde" target="_blank">
			{t.sommet.sign_petition}
		</Button>
		<Button alt on:click={openActivoice}>{t.sommet.contact_politicians}</Button>
	</CampaignHero>

	<CampaignSection>
		<activoice-embed id="activoice-embed-a0fa93be_f050_4d77_8a0c_9e70e3fe02b6"></activoice-embed>
	</CampaignSection>
</CampaignPage>
