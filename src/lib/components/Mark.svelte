<!--
	Mise en valeur du second membre du titre du héros (« agissons maintenant »).

	Le texte est orange, mais PAS l'orange de marque : celui-ci ne fait que
	2,21:1 sur blanc, soit moins que le seuil assoupli des grands titres (3:1).
	--brand-titre donne 3,49:1 et reste franchement orange.

	Le soulignement, lui, garde l'orange de marque plein : c'est une décoration,
	elle n'est soumise à aucun seuil de contraste de texte, et c'est elle qui
	fait entrer la vraie couleur de la marque dans le titre.
-->
<span>
	<slot />
</span>

<style>
	span {
		color: var(--brand-titre);
		text-decoration: underline;
		text-decoration-color: var(--brand);
		text-decoration-thickness: 0.1em;
		text-underline-offset: 0.12em;
	}
</style>
