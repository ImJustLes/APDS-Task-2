import express from "express"
import { db } from "./db/dbCon.js"
import { ObjectId } from "mongodb"
const app = express()

const router = express.Router();

router.post("/login", async (req, res) => {

    try {
        
        const db = client.db('users')
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        const collection = db.collection('users')
        const result = await collection.insertOne(user)
        res.status(201).send(result)

    } 
    catch (e) 
    {
            console.error('Error occurred while pushing: ', e)
            res.status(500).send('Internal server error')
    }
})

export default app