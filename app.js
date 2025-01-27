require('dotenv').config()
const express = require('express')
const app = express()
const baseRoute = require('./routes/base_route')

const PORT = process.env.PORT

app.get('/test', (req, res)=>{
    res.status(200).send("entry route working properly")
})

app.use('/r0', baseRoute)

app.listen( PORT, ()=>{
    console.log(`running at port ${PORT}`)
})