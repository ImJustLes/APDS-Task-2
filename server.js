import express from "express"
import fs from "fs"
import app from "./app.js"

const PORT = 443

const server = https.createServer({
    key: fs.readFileSync('keys/bankprivatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}, app)

server.listen(PORT)