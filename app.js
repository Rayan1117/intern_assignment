require('dotenv').config()
const express = require('express')
const app = express()
const baseRoute = require('./routes/base_route')

const PORT = process.env.PORT

app.use(express.json())

app.get('/', (req, res)=>{
    res.status(200).send("entry route working properly")
})

app.use('/r0', baseRoute)

module.exports = app