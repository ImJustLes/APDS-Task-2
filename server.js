import express from "express"
import fs from "fs"
import https from "https"
import app from "./Index.js"
import { connect } from './db/dbCon.js'

const PORT = 443

const server = https.createServer({
    key: fs.readFileSync('keys/bankprivatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}, app)

connect().then(() => {

server.listen(PORT, () => {
    console.log('Server started on port number ', PORT)
})
}).catch(err => {
    console.error("Failed to connect to the database", err)
    process.exit(1)
})