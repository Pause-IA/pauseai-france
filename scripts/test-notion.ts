import { Client } from '@notionhq/client'
import dotenv from 'dotenv'
dotenv.config()
const notion = new Client({ auth: process.env.NOTION_TOKEN })
console.log('Keys in notion:', Object.keys(notion))
// @ts-ignore
console.log('Keys in databases:', notion.databases ? Object.keys(notion.databases) : 'no databases')
// @ts-ignore
console.log(
	'Keys in dataSources:',
	notion.dataSources ? Object.keys(notion.dataSources) : 'no dataSources'
)
