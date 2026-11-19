/**
 * Typographie française pour les textes venus de Notion.
 *
 * Les pages Markdown du site passent par `remarkFrenchTypography` ; les textes lus
 * dans Notion (Idées reçues…) n'en profitaient pas : seules les apostrophes étaient
 * converties. On y retrouvait des "guillemets droits" et des deux-points collés
 * (retour du 16/11/2026 sur Idées reçues).
 *
 * Mêmes règles que le reste du site (`typographyPlugin.js`), avec deux différences
 * voulues :
 * - le texte arrive découpé en segments (gras, italique, lien) : un guillemet
 *   ouvert dans un segment peut se fermer dans le suivant, on le suit donc d'un
 *   segment à l'autre ;
 * - les adresses web ne sont jamais touchées (« https: » ou « ?q= » resteraient
 *   sinon coupés d'une espace), ni les unités et les monnaies, trop risquées sur
 *   du texte libre (« 4K », « GPT-4o »).
 */
import {
	applyApostropheRule,
	applyColonRule,
	applyExclamationMarkRule,
	applyFrenchQuotesRule,
	applyPercentSymbolRule,
	applyQuestionMarkRule,
	applySemicolonRule
} from './typographyPlugin.js'

export interface SegmentTexte {
	texte: string
}

const INSECABLE = ' '
const ADRESSE = /(https?:\/\/[^\s<>«»"“”]+)/
const ESPACES_FIN = /[   ]+$/
const ESPACES_DEBUT = /^[   ]+/

/** Règles d'espacement et apostrophes, sur un texte sans adresse web. */
function espacer(t: string): string {
	let r = t
	r = applySemicolonRule(r)
	r = applyQuestionMarkRule(r)
	r = applyExclamationMarkRule(r)
	r = applyPercentSymbolRule(r)
	r = applyColonRule(r)
	r = applyFrenchQuotesRule(r)
	return applyApostropheRule(r)
}

/** Applique `regle` à tout sauf aux adresses web. */
function horsAdresses(t: string, regle: (s: string) => string): string {
	return t
		.split(ADRESSE)
		.map((morceau, i) => (i % 2 ? morceau : regle(morceau)))
		.join('')
}

/**
 * Typographie d'une suite de segments (un paragraphe, un titre, un élément de
 * liste). Les segments gardent leur mise en forme ; seuls leurs textes changent.
 */
export function typographierSegments<S extends SegmentTexte>(segments: S[]): S[] {
	// 1. Guillemets droits ou anglais -> « … », en suivant l'ouverture d'un
	//    segment à l'autre. Un guillemet droit ouvre après un blanc ou en début de
	//    texte, et ferme partout ailleurs.
	let precedent = ''
	let sauterLesBlancs = false
	const guillemets = segments.map((s) => {
		let sortie = ''
		const morceaux = s.texte.split(ADRESSE)
		morceaux.forEach((morceau, i) => {
			if (i % 2) {
				sortie += morceau
				precedent = morceau.at(-1) ?? precedent
				sauterLesBlancs = false
				return
			}
			for (const c of morceau) {
				if (sauterLesBlancs && /\s/.test(c)) continue
				sauterLesBlancs = false
				if (c === '“' || (c === '"' && (precedent === '' || /[\s(\[«]/.test(precedent)))) {
					sortie += '«' + INSECABLE
					sauterLesBlancs = true
					precedent = '«'
				} else if (c === '”' || c === '"') {
					sortie = sortie.replace(ESPACES_FIN, '') + INSECABLE + '»'
					precedent = '»'
				} else {
					sortie += c
					precedent = c
				}
			}
		})
		return { ...s, texte: sortie }
	})

	// 2. Espaces insécables et apostrophes, segment par segment.
	const espaces = guillemets.map((s) => ({ ...s, texte: horsAdresses(s.texte, espacer) }))

	// 3. Raccords : un segment qui commence par une insécable (« : », « ? »…) ne
	//    doit pas suivre une espace ordinaire laissée à la fin du précédent.
	for (let i = 1; i < espaces.length; i++) {
		if (/^[  ]/.test(espaces[i].texte) && /[ ]$/.test(espaces[i - 1].texte)) {
			espaces[i - 1] = { ...espaces[i - 1], texte: espaces[i - 1].texte.replace(/ +$/, '') }
		}
	}
	return espaces
}

/** Typographie d'un texte simple (titre d'objection, catégorie…). */
export function typographierTexte(texte: string): string {
	return typographierSegments([{ texte }])[0].texte
}
