<script lang="ts">
	/**
	 * Page « Contact » (prototype, modèle « Outil »).
	 *
	 * Cahier des charges de l'équipe onboarding (Notion, 20/11/2026) : un menu
	 * déroulant de motifs. Certains motifs mènent à un formulaire, d'autres
	 * seulement à des ressources. Textes dans `$lib/contact.ts`, repris tels
	 * quels du cahier des charges.
	 *
	 * Un lien peut présélectionner un motif : /fr/contact?sujet=technique.
	 */
	import { onMount, tick } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Page } from '$components/ui'
	import { CATEGORIES, LIMITES, categorie } from '$lib/contact'

	let cle = ''
	let email = ''
	let telephone = ''
	let discord = ''
	let message = ''
	let website = ''
	let envoi = false
	let envoye = false
	let erreur = ''

	$: choisie = categorie(cle)

	// Changer de motif efface l'état d'un envoi précédent.
	$: if (cle) {
		envoye = false
		erreur = ''
	}

	onMount(() => {
		const sujet = new URLSearchParams(window.location.search).get('sujet') ?? ''
		if (categorie(sujet)) cle = sujet
	})

	async function envoyer() {
		erreur = ''
		envoi = true
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ categorie: cle, email, telephone, discord, message, website })
			})
			const r = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string }
			if (res.ok && r.success) {
				envoye = true
				message = ''
				await tick()
				document.querySelector<HTMLElement>('.envoye')?.focus()
			} else {
				erreur = r.error || 'L’envoi a échoué. Réessayez, ou écrivez-nous à contact@pauseia.fr.'
			}
		} catch {
			erreur = 'L’envoi a échoué. Réessayez, ou écrivez-nous à contact@pauseia.fr.'
		} finally {
			envoi = false
		}
	}
</script>

<PostMeta title="Contact | Pause IA" description="Contacter Pause IA." />

<!-- Prototype : hors sitemap (src/lib/routes.ts) et non indexé. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<Page title="Contact" width="content" as="article">
	<p class="prototype">
		Prototype pour discussion (cahier des charges de l’équipe onboarding) : textes et adresses à
		valider.
	</p>

	<label class="motif">
		<span>Vous nous contactez pour :</span>
		<select bind:value={cle}>
			<option value="" disabled>Choisissez un motif</option>
			{#each CATEGORIES as c}
				<option value={c.cle}>{c.libelle}</option>
			{/each}
		</select>
	</label>

	{#if choisie}
		<section class="reponse" aria-live="polite">
			{#each choisie.texte as paragraphe}
				<p>
					{#each paragraphe as s}{#if s.href}<a
								href={s.href}
								target={s.href.startsWith('http') ? '_blank' : undefined}
								rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{s.t}</a
							>{:else}{s.t}{/if}{/each}
				</p>
			{/each}

			{#if choisie.formulaire}
				{#if choisie.avantFormulaire}<p>{choisie.avantFormulaire}</p>{/if}
				{#if envoye}
					<p class="envoye" role="status" tabindex="-1">
						Message envoyé. Nous vous répondrons à {email}.
					</p>
				{:else}
					<form on:submit|preventDefault={envoyer}>
						<label>
							<span>Votre message *</span>
							<textarea bind:value={message} rows="6" maxlength={LIMITES.message} required
							></textarea>
						</label>
						<label>
							<span>E-mail *</span>
							<input
								type="email"
								bind:value={email}
								autocomplete="email"
								maxlength={LIMITES.email}
								required
							/>
						</label>
						<div class="ligne">
							<label>
								<span>Téléphone (facultatif)</span>
								<input
									type="tel"
									bind:value={telephone}
									autocomplete="tel"
									maxlength={LIMITES.telephone}
								/>
							</label>
							<label>
								<span>Identifiant Discord (facultatif)</span>
								<input bind:value={discord} maxlength={LIMITES.discord} />
							</label>
						</div>
						<!-- Champ piège : invisible pour les humains, rempli par les robots. -->
						<label class="hp" aria-hidden="true">
							Website <input bind:value={website} tabindex="-1" autocomplete="off" />
						</label>
						{#if erreur}<p class="erreur" role="alert">{erreur}</p>{/if}
						<p>
							<Button disabled={envoi}>{envoi ? 'Envoi…' : 'Envoyer'}</Button>
						</p>
					</form>
				{/if}
			{/if}
		</section>
	{/if}
</Page>

<style>
	.prototype {
		padding: 0.6rem 0.9rem;
		border: 1px dashed var(--brand);
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
		color: var(--text-2);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.95rem;
	}

	.motif {
		margin-block: 1.5rem;
		font-weight: 600;
	}

	.motif span {
		font-size: 1.15rem;
	}

	select,
	input,
	textarea {
		font: inherit;
		font-weight: 400;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
		background: var(--bg);
		color: var(--text);
		max-inline-size: 100%;
	}

	textarea {
		resize: vertical;
	}

	.reponse {
		padding-inline-start: 1.25rem;
		border-inline-start: 3px solid var(--brand);
	}

	form {
		display: grid;
		gap: 1rem;
		margin-block-start: 1rem;
	}

	.ligne {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	@media (max-width: 600px) {
		.ligne {
			grid-template-columns: 1fr;
		}
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.erreur {
		color: var(--error);
		margin: 0;
	}

	.envoye {
		font-weight: 600;
		color: var(--success);
	}

	.envoye:focus {
		outline: none;
	}
</style>
