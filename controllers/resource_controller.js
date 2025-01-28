const { default: mongoose, mongo } = require('mongoose')
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
        throw err
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

exports.getAllUsers = async () => {
    try {
        var conn = await db.connectToDB()

        const collection = conn.collection('users')

        const result = await collection.find().toArray()

        if (!result) {
            const error = new Error('no users exist')
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

exports.addEvent = async ({ eventName, description, eventDate, location, stat, organizer, speakers }) => {
    try {
        var conn = await db.connectToDB()

        const collection = conn.collection('events')

        const result = await collection.insertOne(
            {
                "event_name": eventName, "description": description,
                "event_date": new Date(eventDate).toISOString(), "location": location,
                "status": stat, "organizer": organizer, "speaker_list": speakers,
                "created_at": new Date().toISOString(), "updated_at": new Date().toISOString()
            })
        return result
    } catch (err) {
        throw err
    }
    finally {
        conn.close()
    }
}

exports.deleteEvent = async (eventId) => {
    try {
        var conn = await db.connectToDB()

        const collection = conn.collection('events')

        const result = await collection.deleteOne({ _id: mongoose.Types.ObjectId.createFromHexString(eventId) })

        return result
    } catch (err) {
        throw err
    } finally {
        conn.close()
    }
}

exports.updateEvent = async (eventId, updateProps) => {
    try {
        for (let key in updateProps) {
            if (updateProps[key] === undefined) {
                delete updateProps[key]
            }
        }

        var conn = await db.connectToDB()

        const collection = conn.collection('events')

        const result = await collection.updateOne(
            { _id: mongoose.Types.ObjectId.createFromHexString(eventId) },
            { $set: { ...updateProps, "updated_at": new Date().toISOString() } }
        )
        return result
    } catch (err) {
        throw err
    }
}