const express = require('express')

const route = express.Router()

const { registerUser } = require('../controllers/auth_controller')

route.post("/r0", async (req, res, next) => {

    try {

        const { email, password, name, age, role } = req.body

        await registerUser({ email: email, password: password, name: name, age: age, role: role, next: next })

    } catch (err) {
        if(err.code === 501){
            return res.status(500).json({error: err.message})
        }
        return res.status(400).json({error: err.message})
    }
},
(req, res) => {
    try{
        return res.status(201).json({message: "registered successfully"})
    }
    catch(err){
        return res.status(500).json({error: err.message})
    }
})

module.exports = route