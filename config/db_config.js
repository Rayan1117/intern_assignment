require('dotenv').config()
const mongo = require('mongoose')

class Database {

    async connectToDB() {
        try {
            console.log(process.env.CONNECTION_URI)
            const conn = await mongo.connect(process.env.CONNECTION_URI,
                {dbName: "users"}
            )
            return conn.connection
        } catch (err) {
            throw Error(err)
        }
    }
}

module.exports = Database