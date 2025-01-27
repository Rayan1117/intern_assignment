require('dotenv').config()
const mongo = require('mongoose')

class Database {

    async connectToDB() {
        try {
            const conn = await mongo.connect(process.env.CONNECTION_URI,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }
            )
            return conn.connection
        } catch (err) {
            throw Error(err)
        }
    }
}

module.exports = Database