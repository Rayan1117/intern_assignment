const express= require('express')
const baseRoute =express.Router()

const adminRoute = require('./admin_route')
const userRoute = require('./user_route')

baseRoute.use('/login')

baseRoute.use('/register')

baseRoute.use('/role/admin', adminRoute)

baseRoute.use('/role/user', userRoute)

module.exports = baseRoute