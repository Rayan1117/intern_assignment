const express= require('express')
const baseRoute =express.Router()

const adminRoute = require('./admin_route')
const userRoute = require('./user_route')
const loginRoute = require('./login_route')
const registerRoute = require('./register_route')

baseRoute.use('/login', loginRoute)

baseRoute.use('/register', registerRoute)

baseRoute.use('/role/admin', adminRoute)

baseRoute.use('/role/user', userRoute)

module.exports = baseRoute