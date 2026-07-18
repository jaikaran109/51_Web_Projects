const express = require('express') ;
const Router = express.Router() ; // mini-instance
let notes = require('../models/Note.js') ; 

Router.get('/notes', async (req ,res) => {
    const data = await notes.find({}) ;
    res.status(200).json({
        message : "Data Fetched", 
        data : data
    }) 
})

Router.post('/create-notes', async (req ,res) => {
    console.log(req.body) ; 
    let {title, desc} = req.body ; 
    await notes.insertOne({title, desc}) ; 
    res.status(201).json({
        message : "Data Added"
    })
})

Router.get('/notes/:id', async (req , res)=> {
    let {id} = req.params ; 
    let data = await notes.findById(id) ;
    res.status(200).json({
        message : "Data fetched", 
        data : data
    }) 
})

// Router.get('/notes', async (req , res)=> {
//     let {id} = req.query ; 
//     let data = await notes.findById(id) ;
//     res.status(200).json({
//         message : "Data fetched", 
//         data : data
//     }) 
// })

Router.delete('/notes/:id', async (req, res) => {
    let {id} = req.params ;
    await notes.findByIdAndDelete(id) ;
    res.status(200).json({
        message : "Deleted"
    })
})

Router.put('/notes/:id', async (req ,res) => {
    let {id} = req.params ; 
    let {title, desc} = req.body ; 
    await notes.findByIdAndUpdate(id ,{title, desc}) ; 
    res.status(200).json({
        message : "Updated"
    })
})

Router.patch('/notes/:id', async (req ,res) => {
    let {id} = req.params ; 
    let {title, desc} = req.body ; 
    await notes.findByIdAndUpdate(id ,{title, desc}) ; 
    res.status(200).json({
        message : "Updated"
    })
})

module.exports = Router ; 