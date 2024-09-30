import express from "express"
import { db } from "./db/dbCon.js"

const app = express()
const router = express.Router();

app.use(express.json())

app.post("/login", async (req, res) => {

    try {
        
        const user = {
            email: req.body.email,
            password: req.body.password
        }

        const collection = db.collection('BankUsers')
        const result = await collection.insertOne(user)
        res.status(201).json(result)

    } 
    catch (e) 
    {
            console.error('Error occurred while pushing: ', e)
            res.status(500).json('Internal server error')
    }
})

export default app