const DB = require('../config/db_config')

const bcrypt = require('bcrypt')

const db = new DB()

require('dotenv').config()

const jwt = require('jsonwebtoken')

exports.compareUser = async (email, password) => {
    let conn
    try {

        conn = await db.connectToDB()

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

    }finally {
        if (conn) {
            conn.close()
        }
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
            const hashedPassword = await bcrypt.hash(password, 10)
            await collection.insertOne({ id, name, role, age, email, hashedPassword })
            next()
        } catch (err) {

            if (err.code === 11000) {
                throw 'email already exists. Please use a different email';
            }
            throw err
        } finally {
            conn.close()
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

exports.jwtVerify = (req, res, next) => {
    try {
        const header = req.headers['authorization']
        let token
        if (!header) {
            return res.status(400).json({ error: 'No authentication header found' });
        }

        if (!header.startsWith('Bearer')) {
            return res.status(400).json({ error: "It's not a bearer token" });
        }

        token = header.split(' ')[1]

        if (!token) {
            return res.status(400).json({ error: 'Token not found' });
        }

        jwt.verify(token, process.env.SIGN_SECRET, { algorithms: "HS256", complete: true }, (err, payload) => {
            if (err) {
                return res.status(403).json({ error: err.message });
            }

            if (payload.payload.exp < Math.floor(Date.now()) / 1000) {
                return res.status(403).json({ error: "token expired, not valid anymore" })
            }
            req.user = {
                id: payload.payload.id,
                role: payload.payload.role
            }
            next()
        })
    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
}