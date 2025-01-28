const express = require('express')

const route = express.Router()

const resourseAccess = require('../controllers/resource_controller')

route.get("/get_users", async (req, res) => {
    try {

        const result = await resourseAccess.getAllUsers()

        return res.status(200).json({ messge: result })

    } catch (err) {

        return res.status(err.code || 500).json({ error: err.message })
    }
})

route.post("/add_event", async (req, res) => {
    try {
        const { event_name, description, event_date, location, organizer, speakers, status } = req.body

        if (!(event_name && description && event_date && location && organizer && speakers && status)) {
            return res.status(400).json({ error: "all fields must not be empty" })
        }

        const result = await resourseAccess.addEvent(
            {
                eventName: event_name,
                eventDate: event_date,
                location: location,
                description: description,
                organizer: organizer,
                speakers: speakers,
                stat: status
            }
        )

        return result.acknowledged ? res.status(200).json({ message: "event informations added successfully" }) : null

    } catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

route.put("/update_event", async (req, res) => {
    try {
        const eventId = req.query.event_id
        if (!eventId) {
            const error = new Error("must mention the event_id in the url query")
            error.code = 400
            throw error
        }
        const { event_name, description, event_date, location, organizer, speakers, status } = req.body

        if (!(event_name || description || event_date || location || organizer || speakers || status)) {
            const error = new Error("you should update any one of the field")
            error.code = 400
            throw error
        }

        const result = await resourseAccess.updateEvent(eventId,
            { event_name, description, event_date, location, organizer, speakers, status }
        )

        return result.modifiedCount ?
            res.status(200).json({ message: `${result.modifiedCount} fields updated successfully` }) :
            res.status(200).json({ message: "nothing modified" })

    } catch (err) {

        return res.status(err.code || 500).json({ error: err.message })
    }
})

route.delete("/delete_event", async (req, res) => {
    try {
        const eventId = req.query.event_id
        if (!eventId) {
            const error = new Error("must mention the event_id in the url query")
            error.code = 400
            throw error
        }
        const result = await resourseAccess.deleteEvent(eventId)
        console.log(result.deletedCount)
        return result.deletedCount ?
            res.status(200).json({ message: "event successfully deleted" }) :
            res.status(404).json({ error: "no event with this id found" })

    } catch (err) {
        return res.status(err.code || 500).json({ error: err.message })
    }


})

route.get('/test', (req, res) => {
    return res.status(200).send('admin route working perfectly')
})


module.exports = route