<script lang="ts">
	import Button from '$components/Button.svelte'
	// Après une signature de la déclaration PauseAI : l'action qui pèse le plus,
	// écrire à ses élus et à la presse, passe en premier ; partager vient ensuite.
	export let lang: 'fr' | 'en'
	$: isEn = lang === 'en'
	$: prefix = `/${lang}`
	let copied = false

	async function share() {
		const url = `https://pauseia.fr${prefix}/declaration`
		const text = isEn
			? 'I signed the PauseAI statement for an international treaty on AI. Sign it too:'
			: 'J’ai signé la déclaration PauseAI pour un traité international sur l’IA. Signez-la vous aussi :'
		try {
			if (typeof navigator.share === 'function') {
				await navigator.share({ text, url })
				return
			}
			await navigator.clipboard.writeText(`${text} ${url}`)
			copied = true
		} catch {
			/* partage annulé ou presse-papiers indisponible */
		}
	}
</script>

<div class="next">
	<p class="lead">
		{#if isEn}
			<strong>Next step, the one that matters most:</strong> write directly to your representatives and
			to journalists. It takes two minutes, and a personal message carries far more weight than a signature.
		{:else}
			<strong>L’étape suivante, celle qui pèse le plus :</strong> écrire directement à vos élus et aux
			journalistes. Cela prend deux minutes, et un message personnel compte bien plus qu’une signature.
		{/if}
	</p>
	<div class="actions">
		<Button href="{prefix}/ecrire-a-mes-elus">
			{isEn ? 'Write to my representatives' : 'Écrire à mes élus'}
		</Button>
		<Button alt on:click={share}>
			{isEn ? 'Share the statement' : 'Partager la déclaration'}
		</Button>
		{#if copied}
			<span class="copied" role="status">{isEn ? 'Link copied!' : 'Lien copié !'}</span>
		{/if}
	</div>
	<p class="more">
		{#if isEn}
			Want to do even more? <a href="{prefix}/rejoindre">Join us</a>.
		{:else}
			Envie d’en faire plus ? <a href="{prefix}/rejoindre">Rejoignez-nous</a>.
		{/if}
	</p>
</div>

<style>
	.next {
		margin-top: 1.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
	}

	.lead {
		margin: 0 0 1rem;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.copied {
		color: var(--text-2);
	}

	.more {
		margin: 1rem 0 0;
		color: var(--text-2);
		font-size: 0.95rem;
	}
</style>
