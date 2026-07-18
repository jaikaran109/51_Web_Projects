const express = require('express') ; 
const Router = express.Router() ; // mini instance

const Students = require('../models/Student') ;

Router.get('/', (req , res) => {
    res.render('Students/main') ; 
})

Router.get('/students' , async (req , res)=> {
    let data = await Students.find() ;
    res.render('Students/index' , {data})  ;
})

Router.get('/student/new' , async(req , res)=> {
    res.render('Students/new') ;
})

Router.post('/students', async (req, res) => {
    console.log(req.body) ; 
    let {img , name , roll , section} = req.body ;
    await Students.insertOne({img , name , roll, section}) ; 
    res.redirect('/students') ;
})

Router.get('/students/:id', async(req ,res) => {
    let {id} = req.params ; 
    let stu = await Students.findById(id) ; 
    res.render('Students/show', {stu}) ;
})

Router.get('/students/:id/edit', async(req ,res) => {
    let {id} = req.params ; 
    let stu = await Students.findById(id) ; 
    res.render('Students/edit', {stu}) ;
})

Router.patch('/students/:id', async (req ,res) => {
    let {id} = req.params ; 
    let {img , name , roll ,section} = req.body ; 
    await Students.findByIdAndUpdate(id , {img, name , roll, section}) ; 
    res.redirect(`/students/${id}`) ; 
})

Router.delete('/students/:id', async(req ,res) =>  {
    let {id} = req.params ; 
    await Students.findByIdAndDelete(id) ;
    res.redirect('/students') ; 
})

module.exports = Router ;