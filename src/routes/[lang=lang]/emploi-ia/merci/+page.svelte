<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { Page } from '$components/ui'
	import Button from '$lib/components/Button.svelte'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'
	import { page } from '$app/stores'

	$: lang = $page.params.lang as Lang
	$: t = getT(lang)
</script>

<PostMeta title={`${t.emploi_merci.title} | Pause IA`} description={t.emploi_merci.p1} />

<Page
	title={t.emploi_merci.title}
	eyebrow={lang === 'en' ? 'Campaigns' : 'Campagnes'}
	lede={t.emploi_merci.p1}
	width="text"
	variant="note"
	as="article"
>
	<p>{t.emploi_merci.p2}</p>

	<ul>
		<li>{t.emploi_merci.li1}</li>
		<li>{t.emploi_merci.li2}</li>
		<li>{t.emploi_merci.li3}</li>
		<li>{t.emploi_merci.li4}</li>
	</ul>

	<p>
		<Button href="https://pauseia.fr" target="_blank">{t.emploi_merci.visit_site}</Button>
		<Button href="https://discord.com/invite/YkKvW9APP9" target="_blank" alt>
			{t.emploi_merci.join_discord}
		</Button>
	</p>

	<p><a href="/{lang}/emploi-ia">{t.emploi_merci.back_link}</a></p>
</Page>
