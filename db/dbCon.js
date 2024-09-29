import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()
const conString = process.env.ATLAS_URI || ""
const client = new MongoClient(conString)

async function connect() {

    try
    {
        await client.connect()
        console.log('Connected to the database.')
    
    } catch (e)
    {
        console.error(e)
    }
}

let db = client.db("users")

export { connect, client, db }