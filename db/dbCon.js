import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const conString = process.env.ATLAS_URI || ""

const client = new MongoClient(conString)
let dbConn
try{
    dbConn = await client.connect()
    console.log('Successfully connected to database')
}
catch (err)
{
    console.error(err)
}

let db = client.db("users")

export default db