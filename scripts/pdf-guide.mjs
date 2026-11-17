/**
 * Fabrique le PDF cliquable du guide de contribution.
 *
 *   node scripts/pdf-guide.mjs
 *
 * La source est scripts/pdf/guide-contribution.html, une page A4 autonome.
 * Chromium conserve les liens comme annotations du PDF : on peut donc
 * cliquer dessus dans un lecteur, et la feuille reste imprimable telle
 * quelle. Le PDF est versionné dans static/pdfs/ : la page web le sert
 * directement, sans dépendre d'une étape de build.
 */
import pw from '/opt/node-tools/node_modules/playwright/index.js'
import { fileURLToPath } from 'node:url'

const { chromium } = pw
const SOURCE = fileURLToPath(new URL('./pdf/guide-contribution.html', import.meta.url))
const SORTIE = fileURLToPath(new URL('../static/pdfs/guide-contribution.pdf', import.meta.url))

const navigateur = await chromium.launch()
const page = await navigateur.newPage()
await page.goto('file://' + SOURCE, { waitUntil: 'networkidle' })
// Les polices Google peuvent ne pas répondre : on n'attend pas indéfiniment.
await page.waitForTimeout(1500)
await page.pdf({ path: SORTIE, format: 'A4', printBackground: true })
await navigateur.close()
console.log('PDF écrit : static/pdfs/guide-contribution.pdf')
