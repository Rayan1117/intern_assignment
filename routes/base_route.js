const express = require('express')
const baseRoute = express.Router()

const adminRoute = require('./admin_route')
const userRoute = require('./user_route')
const loginRoute = require('./login_route')
const registerRoute = require('./register_route')
const { jwtVerify } = require('../controllers/auth_controller')

baseRoute.use('/login', loginRoute)

baseRoute.use('/register', registerRoute)

baseRoute.use('/role', (req, res, next) => {
    try {
        jwtVerify(req, res, next)
    } catch (err) {
        return res.status(500).json({ error: err })
    }
})

baseRoute.use('/role/admin', (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            throw "no other than admin can access this route"
        }
        next()
    }
    catch (err) {
        return res.status(400).json({ error: err })
    }
}, adminRoute)

baseRoute.use('/role/user', (req, res, next) => {
    try {
        console.log(req.user.role)
        if (req.user.role !== "user" && req.user.role !=="admin") {
            throw "no other than registered users can access this route"
        }
        next()
    }
    catch (err) {
        return res.status(400).json({ error: err })
    }
}, userRoute)

module.exports = baseRoute