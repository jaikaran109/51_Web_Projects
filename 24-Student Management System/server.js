const express = require('express') ;
const path = require('path') ;
const ejsmate = require('ejs-mate') ;
const  methodoverride = require('method-override') ;
const app = express() ; 

const connectDB = require('./config/db') ;
const Students = require('./models/Student') ;
const studentRoutes = require('./routes/Student') ;
const seedDB = require('../Student Management System/seed') ;

connectDB() ; 
// seedDB() ; 

app.set('view engine', 'ejs') ; 
app.engine('ejs' , ejsmate) ; 
app.set('views' , path.join(__dirname , 'views')) ;
app.use(express.urlencoded({extended : true })) ; 
app.use(methodoverride('_method')) ;  // ab mein method override ko _method se access kr pauga


app.use(studentRoutes) ; 

const PORT = 5050 ; 
app.listen((PORT) , ()=> {
    console.log(`Listening at port : ${PORT}`) ;
})