const { default: mongoose } = require('mongoose')
const DB = require('../config/db_config')

const db = new DB()

exports.getAllEvents = async () => {
    let conn
    try {
        conn = await db.connectToDB()

        const collection = conn.db.collection('events')

        const result = await collection.find().toArray()

        return result
    } catch (err) {
        console.log(err)
    }
    finally {
        if (conn) {
            await conn.close()
        }
    }
}

exports.getEvent = async (eventId) => {
    let conn
    try {
        conn = await db.connectToDB()

        const collection = conn.collection('events')

        const result = await collection.findOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) })

        if (!result) {
            const error = new Error('no event exist with this ID')
            error.code = 404
            throw error
        }

        return result

    } catch (err) {
        throw err
    }
    finally {
        if (conn) {
            conn.close()
        }
    }
}