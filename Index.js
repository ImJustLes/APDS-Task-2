import express from "express"
import { db } from "./db/dbCon.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import expressBrute from "express-brute"
import { ObjectId } from "mongodb"

const app = express()

var store = new expressBrute.MemoryStore()
var bruteForce = new expressBrute(store)

app.use(express.json())

let user = {
    name: '',
    accountnumber: '',
    password: ''
}  

app.post("/login", bruteForce.prevent, async (req, res) => {

 // Updated regex pattern: at least 4 characters, at least one special character
 const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
 const collection = await db.collection('BankCustomers');

 try {
     user = {
         name: req.body.name,
         accountnumber: req.body.accountnumber,
         password: req.body.password
     }        

     if (user.name && user.accountnumber && user.password) {
     // Check if the password meets the regex requirements
     if (passwordRegex.test(user.password)) {
         // Attempt to find the user in the database
         const existingUser = await collection.findOne({ name: user.name })

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
    } else {
        res.status(400).json({ message: 'Please input all required fields.' })
    }
 } catch (e) {
     console.error('Error occurred during login: ', e);
     res.status(500).json({ message: 'Internal server error' })
 }
})


//Login for the employees of the website
app.post("/elogin", bruteForce.prevent, async (req, res) => {

    // Updated regex pattern: at least 4 characters, at least one special character
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
    const collection = await db.collection('BankEmployees');
   
    try {
        const user = {
            name: req.body.name,
            password: req.body.password
        }        
   
        // Check if the password meets the regex requirements
        if (passwordRegex.test(user.password)) {
            // Attempt to find the user in the database
            const existingUser = await collection.findOne({ name: user.name })
   
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

app.get('/GetPayements', async (_, res) => {

    try {

        const collection = db.collection('PendingPayements')
        const result = await collection.find({}).toArray()
        res.status(200).send(result)
    } 
    catch (e) 
    {
        console.error('Error retreiving items: ', e)
        res.status(404).send('Not found')
    }
})

app.delete('/VerifyPayement/:id', async (req, res) => {

    try {

        const query = {_id: new ObjectId(req.params.id)}
        const PendingPayementsCollection = db.collection('PendingPayements')
        const ConfirmedPayementsCollection = db.collection('ConfirmedPayements')
        const confirmedTransaction = await PendingPayementsCollection.findOne(query)

        let result = await PendingPayementsCollection.deleteOne(query)
        await ConfirmedPayementsCollection.insertOne(confirmedTransaction)
        
        res.status(200).send(result)
    } 
    catch (e) 
    {
        console.error('Error confirming transaction: ', e)
        res.status(404).send('Not found')
    }
})

app.post('/signup', async (req, res) => {

    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
    const emailRegex = /^.*?@(?:gmail\.com|live\.co\.za|vcconnect\.edu\.za|varsitycollege\.co\.za|outlook\.com)$/;
    const collection = await db.collection('BankCustomers')   

    try {
             
        // Creating the user model with the hashed password
        const userModel = {
            id: req.body.id,
            accountnumber: req.body.accountnumber,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        }

    const existingUser = await collection.findOne({ email: userModel.email })

    if(userModel.id && userModel.accountnumber && userModel.name && userModel.surname && userModel.email && userModel.password){
    
        if(!existingUser) {

            if(passwordRegex.test(userModel.password) && emailRegex.test(userModel.email)) {
                    
                const hashedPassword = await bcrypt.hash(req.body.password, 10)  // Hash the password with salt
                userModel.password = hashedPassword

                const result = await collection.insertOne(userModel)   
                res.status(201).send(result)
                console.log(`Password for user ${req.body.email} hashed successfully`)
                
            } else {
                res.status(401).json({ message: 'Please input an appropriate email and/or password' })
            }  
        } else {
            res.status(404).json({ message: 'This user already exists' })
        } 
    } else {
        
    }    res.status(404).json({ message: 'Please fill in all the required fields' })

    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error during signup' })
    }
})

app.post('/esignup', async (req, res) => {

    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{4,}$/;
    const emailRegex = /^.*?@(?:gmail\.com|live\.co\.za|vcconnect\.edu\.za|varsitycollege\.co\.za|outlook\.com)$/;
    const collection = await db.collection('BankEmployees')   

    try {
             
        // Creating the user model with the hashed password
        const userModel = {
            id: req.body.id,
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        }

    const existingUser = await collection.findOne({ email: userModel.email })

    if(existingUser) {

        if(passwordRegex.test(userModel.password) && emailRegex.test(userModel.email)) {
                
            const hashedPassword = await bcrypt.hash(req.body.password, 10)  // Hash the password with salt
            userModel.password = hashedPassword

            const result = await collection.insertOne(userModel)   
            res.status(201).send(result)
            console.log(`Password for user ${req.body.email} hashed successfully`)
            
        } else {
            res.status(401).json({ message: 'Please input an appropriate email and/or password' })
        }  
    } else {
        res.status(404).json({ message: 'This user already exists' })
    }     

    } catch (err) {
        console.error(err)
        res.status(500).send({ message: 'Error during signup' })
    }
})

app.post('/payement', /* checkAuth */ async (req, res) => {

    try {

        const payement = {
            amount: req.body.amount,
            currency: req.body.currency,
            provider: req.body.provider,
            name: req.body.name,
            accountnumber: req.body.accountnumber,
            code: req.body.code
        }

        const collection = await db.collection('BankCustomers') 
        const existingUser = await collection.findOne({ accountnumber: payement.accountnumber })      
        
        if(payement.amount && payement.currency && payement.provider && payement.name && payement.accountnumber && payement.code) 
        {
            if (existingUser) 
            {
                if (user.accountnumber != payement.accountnumber && existingUser.name == payement.name){

                    const collection = db.collection('PendingPayements')
                    const result = await collection.insertOne(payement)
                    console.log('Payement successful!')
                    res.status(201).send(result)
                }    
                else
                {
                    res.status(404).json({ message: 'Account number and/or name is invalid.' })
                }            
            }
            else 
            {
                res.status(404).json({ message: 'User you are trying to send a payement to does not exist.' })
            }
        }  
        else
        {
            res.status(500).send({ message: 'Please fill in all fields.' })
        } 
    } 
    catch (e) 
    {
        console.error('Error occurred while pushing: ', e)
        res.status(500).send('Internal server error.')
    }
})

export default app