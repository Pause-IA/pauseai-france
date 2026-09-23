<script lang="ts">
	// Liste filtrable des signataires de la déclaration : recherche (nom, titre,
	// message, pays), pays les plus représentés en pastilles, filtre « avec un
	// message », pagination. Les pays moins représentés se trouvent par la
	// recherche, qui porte aussi sur leur nom en français et en anglais.
	import Button from '$components/Button.svelte'
	import { FilterChips } from '$components/ui'
	import { countryLabel } from '$lib/countries'
	import { norm, type Entry } from '$lib/declaration'
	import SignatoryCard from './SignatoryCard.svelte'

	export let entries: Entry[]
	export let lang: 'fr' | 'en'
	/** Pays sélectionné au départ ('' : tous). */
	export let initialCountry = 'FR'

	$: isEn = lang === 'en'
	const fmt = (n: number) => n.toLocaleString(isEn ? 'en-GB' : 'fr-FR')

	const ALL = ''
	const TOP_COUNTRIES = 8
	let country = initialCountry
	let query = ''
	let withMessage = false

	// Pas de signataire dans le pays de départ : on montre directement tous les pays.
	$: if (country !== ALL && entries.length && !entries.some((e) => e.country === country))
		country = ALL

	$: countries = (() => {
		const counts = new Map<string, number>()
		for (const e of entries) if (e.country) counts.set(e.country, (counts.get(e.country) ?? 0) + 1)
		const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
		const top = sorted.filter(([c]) => c !== 'FR').slice(0, TOP_COUNTRIES)
		const fr = sorted.find(([c]) => c === 'FR')
		// Le pays sélectionné reste visible même hors du haut du classement.
		const selected = sorted.find(
			([c]) => c === country && c !== 'FR' && !top.some(([t]) => t === c)
		)
		return [...(fr ? [fr] : []), ...top, ...(selected ? [selected] : [])]
	})()

	$: q = norm(query.trim())
	$: filtered = entries.filter(
		(e) =>
			(country === ALL || e.country === country) &&
			(!withMessage || Boolean(e.comment)) &&
			(!q || e.haystack.includes(q))
	)
	const PAGE = 30
	let limit = PAGE
	$: country, query, withMessage, (limit = PAGE)
	$: shown = filtered.slice(0, limit)
</script>

<div class="filters">
	<input
		type="search"
		bind:value={query}
		aria-label={isEn ? 'Search signatories' : 'Rechercher parmi les signataires'}
		placeholder={isEn ? 'Search a name, a country, a word…' : 'Rechercher un nom, un pays, un mot…'}
	/>
	<FilterChips
		bind:selected={country}
		options={[
			{ value: ALL, label: isEn ? 'All countries' : 'Tous les pays', count: entries.length },
			...countries.map(([c, n]) => ({ value: c, label: countryLabel(c, lang), count: n }))
		]}
	/>
	<label class="toggle">
		<input type="checkbox" bind:checked={withMessage} />
		{isEn
			? 'Only signatories who left a message'
			: 'Seulement les signataires qui ont laissé un message'}
	</label>
</div>

<p class="result-count" aria-live="polite">
	{#if isEn}
		{fmt(filtered.length)}
		{filtered.length > 1 ? 'signatories' : 'signatory'}
	{:else}
		{fmt(filtered.length)}
		{filtered.length > 1 ? 'signataires' : 'signataire'}
	{/if}
	{#if country !== ALL && q}
		· <button type="button" class="link" on:click={() => (country = ALL)}>
			{isEn ? 'search all countries' : 'chercher dans tous les pays'}
		</button>
	{/if}
</p>

{#if shown.length}
	<ul class="grid">
		{#each shown as s (s)}
			<SignatoryCard signatory={s} {lang} hideCountry={country !== ALL} />
		{/each}
	</ul>
{:else}
	<p class="empty">
		{isEn
			? 'No signatory matches this search.'
			: 'Aucun signataire ne correspond à cette recherche.'}
	</p>
{/if}

{#if filtered.length > limit}
	<div class="more">
		<Button alt on:click={() => (limit += PAGE * 2)}>
			{isEn ? 'Show more' : 'Voir plus'} ({fmt(filtered.length - limit)})
		</Button>
	</div>
{/if}

<style>
	.filters {
		display: grid;
		gap: 0.8rem;
		margin-bottom: 0.5rem;
	}

	input[type='search'] {
		font: inherit;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg);
		color: var(--text);
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
		cursor: pointer;
	}

	.toggle input {
		accent-color: var(--brand);
	}

	.result-count,
	.empty {
		color: var(--text-2);
		font-size: 0.9rem;
		margin: 0.5rem 0 1rem;
	}

	.link {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--brand-subtle);
		text-decoration: underline;
		cursor: pointer;
	}

	/* Colonnes « maçonnerie » : les cartes avec un long message ne laissent pas de trous. */
	.grid {
		columns: 17rem;
		column-gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.more {
		margin-top: 1rem;
	}
</style>
