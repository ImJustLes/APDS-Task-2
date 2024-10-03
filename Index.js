import express from "express"
import { db } from "./db/dbCon.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import expressBrute from "express-brute"

const app = express()

var store = new expressBrute.MemoryStore()
var bruteForce = new expressBrute(store)

app.use(express.json())

app.post("/login", bruteForce.prevent, async (req, res) => {

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

            const passwordMatch = await bcrypt.compare(user.password, existingUser.password)           

             if (passwordMatch) {
                 const generatedToken = jwt.sign({ email: req.body.email }, "SecretThing", { expiresIn: "1h"})
                 res.status(200).json({ message: 'Login successful', token: generatedToken, email: req.body.email })
                 console.log("Token is: ", generatedToken)
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