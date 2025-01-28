const express = require('express')

const route = express.Router()

const authAccess = require('../controllers/auth_controller')

route.post('/r0', async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "all fields must not be empty" })
        }

        req.user = await authAccess.compareUser(email, password)

        if (!req.user) {
            return res.status(404).json({ error: "no user found" })
        }
        console.log(req.user)
        return next()
    }
    catch (err) {
        return res.status(err.code || 500).json({ error: err.message });
    }
}, (req, res) => {
    try {
        authAccess.jwtSign({ id: req.user.id, role: req.user.role }, req, res)
        if (req.token) {
            return res.status(200).json({ message: "logged in successfully", token: req.token })
        }
        throw new Error("something went wrong", { cause: "error occured while generating json tokens" })
    } catch (err) {
        return res.status(err.code || 500).json({ error: err.message, cause: err.cause || undefined })
    }
},
)

module.exports = route