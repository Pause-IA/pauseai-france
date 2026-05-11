import { Client } from '@notionhq/client'
import dotenv from 'dotenv'
dotenv.config()
const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function main() {
	const dbId = process.env.TESTIMONIALS_ID as string
	// Use retrieve to get schema
	// @ts-ignore
	const db = await notion.dataSources.retrieve({ data_source_id: dbId })
	console.log(JSON.stringify(db.properties, null, 2))
}
main().catch(console.error)
