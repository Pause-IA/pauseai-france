<script lang="ts">
	import Communique from '$components/presse/Communique.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Communique {data} base="local" />
