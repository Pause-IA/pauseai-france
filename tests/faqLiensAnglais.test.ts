import { describe, expect, it } from 'vitest'
import { parseFaq } from '../src/lib/faq'

const FAQ = `## Catégorie

### Une question ?

Voir la [déclaration](https://www.safe.ai/work/statement-on-ai-risk) et [Le Monde](https://www.lemonde.fr/x).
`

describe('FAQ : mention « (en anglais) »', () => {
	it('signale un lien vers un site anglophone sur le site français', () => {
		const html = parseFaq(FAQ)[0].items[0].answerHtml
		expect(html).toContain('déclaration<span class="en-anglais">&nbsp;(en anglais)</span></a>')
		expect(html).toContain('hreflang="en"')
		expect(html).not.toContain('Le Monde<span')
	})

	it('ne signale rien sur le site anglais', () => {
		const html = parseFaq(FAQ, 'en')[0].items[0].answerHtml
		expect(html).not.toContain('en-anglais')
	})

	it('laisse le texte de recherche sans mention', () => {
		expect(parseFaq(FAQ)[0].items[0].answerText).not.toContain('anglais')
	})
})
