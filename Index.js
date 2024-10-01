import express from "express"
import { db } from "./db/dbCon.js"

const app = express()
const router = express.Router();

app.use(express.json())

app.post("/login", async (req, res) => {

 // Updated regex pattern: at least 4 characters, at least one special character
 const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
 const collection = db.collection('BankUsers');

 try {
     const user = {
         email: req.body.email,
         password: req.body.password
     }

     // Check if the password meets the regex requirements
     if (passwordRegex.test(user.password)) {
         // Attempt to find the user in the database
         const existingUser = await collection.findOne({ email: user.email })

         if (existingUser) {
             // User exists, now check if the password matches
             if (existingUser.password === user.password) {
                 // Password matches
                 res.status(200).json({ message: 'Login successful' })
             } else {
                 // Password doesn't match
                 res.status(401).json({ message: 'Incorrect email or password' })
             }
         } else {
             // User doesn't exist
             res.status(404).json({ message: 'User not found' })
         }
     } else {
         // Password doesn't meet regex requirements
         res.status(400).json({ message: 'Invalid password format' })
     }
 } catch (e) {
     console.error('Error occurred during login: ', e);
     res.status(500).json({ message: 'Internal server error' })
 }
})

export default app