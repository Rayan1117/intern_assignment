const express = require('express')

const route = express.Router()


route.get('/test', (req, res) => {
    return res.status(200).send('admin route working perfectly')
})


module.exports = route