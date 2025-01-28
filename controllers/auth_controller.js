const DB = require('../config/db_config')

const bcrypt = require('bcrypt')

const db = new DB()

require('dotenv').config()

const jwt = require('jsonwebtoken')

exports.compareUser = async (email, password) => {
    try {

        const conn = await db.connectToDB()

        const collection = conn.collection('users')

        const result = await collection.findOne({ email: email })

        if (!result) {
            throw "user not exist"
        }
        const isPasswordMatched = await bcrypt.compare(password, result.hashedPassword)
        if (!isPasswordMatched) {
            throw "password incorrect"
        }

        return result

    } catch (err) {

        throw new Error(err)

    }
}

exports.registerUser = async ({ email, password, name, age, role, next }) => {
    try {
        if (!email || !password || !name || !age || !role) {
            throw "all fields must not be empty"
        }

        if (!/^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            throw "invalid email"
        }

        if (age < 18) {
            throw "you must be 18 or above to register"
        }

        if (password.length < 10) {
            throw "try a lengthy password (hint : upto 10)"
        }

        if (!password.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/)) {
            throw 'Password must include letters, numbers, and special characters';
        }

        const conn = await db.connectToDB().catch(err => {
            const error = new Error(err)
            error.code = 500
            throw error
        })

        const collection = conn.collection('users')

        const id = require('uuid').v4()
        try {
            const hashedPassword =await bcrypt.hash(password, 10)
            await collection.insertOne({ id, name, role, age, email, hashedPassword })
            next()
        } catch (err) {

            if (err.code === 11000) {
                throw 'email already exists. Please use a different email';
            }
            throw err
        } finally {
            await conn.close()
        }

    } catch (err) {
        throw new Error(err)
    }
}

exports.jwtSign = (payload, req, res) => {
    try {
        req.token = jwt.sign(payload, process.env.SIGN_SECRET, { expiresIn: '24h', algorithm: 'HS256' })

        return
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
}

exports.jwtVerify = (token, req, res, next) => {
    try {
        const header = req.header['authentication']
        let token
        if (!header) {
            throw new Error('no authentication header found').code = 400
        }

        if (!header.startsWith('Bearer')) {
            throw new Error("it's not a bearer token").code = 400
        }

        token = header.split(' ')[1]

        if (!token) {
            throw Error('token not found').code = 400
        }

        jwt.verify(token, process.env.SIGN_SECRET, { algorithms: "HS256", complete: true }, (err, payload) => {
            if (err) {
                throw err
            }

            if (payload.payload.exp < Math.floor(Date.now()) / 1000) {
                return res.status(403).json({ error: "token expired, not valid anymore" })
            }

            req.user = {
                id: payload.id,
                role: payload.role
            }
            next()
        })
    } catch (err) {
        if (err.code !== 400) {
            return res.status(500).json({ error: err.message })
        }
        return res.status(400).json({ error: err.message })
    }
}