const express = require('express')

const route = express.Router()

const resourseAccess = require('../controllers/resource_controller')

route.get('/test', (req, res)=>{
    return res.status(200).send('user route working perfectly')
})

route.get('/get_all_events', async(req , res)=>{
    try{
        const result = await resourseAccess.getAllEvents()
        
        return res.status(200).json({message : result})
    }
    catch(err){
        return res.status(404).json({error : "No events found"})
    }
})

module.exports = route