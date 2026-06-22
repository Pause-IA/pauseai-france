import { Client } from '@notionhq/client'
import dotenv from 'dotenv'
dotenv.config()
const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function main() {
	const dbId = process.env.TESTIMONIALS_ID as string
	// @ts-ignore
	const db = await notion.dataSources.retrieve({ data_source_id: dbId })
	for (const [name, prop] of Object.entries(db.properties)) {
		// @ts-ignore
		console.log(`${name}: ${prop.type}`)
	}
}
main().catch(console.error)
