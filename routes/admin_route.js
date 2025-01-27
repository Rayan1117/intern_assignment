const express = require('express')

const route = express.Router()

const passport = require('passport')

const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')

passport.use(
    new JWTStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken, secretOrKey: process.env.SECRET },
        (payload, cb) => {
            try {
                return payload.role === "admin" ? cb(null, payload.id) : cb(null, false, { authErrorMessage: "No others can access the Administration routes" })
            } catch (err) {
                return cb(err, false)
            }
        }
    )
)

route.use(passport.authenticate('jwt',{session: false}))

route.get('/get_user', )

route.get('/test', (req, res) => {
    return res.status(200).send('admin route working perfectly')
})


module.exports = route