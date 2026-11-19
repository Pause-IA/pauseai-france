<script lang="ts">
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import RetourAgir from '$components/RetourAgir.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<EcrireOutil lang={data.lang} />

<RetourAgir lang={data.lang} />
