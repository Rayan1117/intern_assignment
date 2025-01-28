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
