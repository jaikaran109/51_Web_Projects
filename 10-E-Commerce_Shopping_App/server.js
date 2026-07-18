const path = require('path') ;
const ejsmate = require('ejs-mate') ;
const methodoverride = require('method-override') ;
require('dotenv').config() ; 
const cookieParser = require('cookie-parser')

const express = require('express') ; 
const app = express() ;

const connectDB = require('./config/db') ;
const seedDB = require('./seed'); 
const productRoutes = require('./routes/product') ; 
const reviewRoutes = require('./routes/review') ;
const authRoutes = require('./routes/auth') ;

connectDB() ; // connect DB
// seedDB() ; // Seeding db

app.engine('ejs', ejsmate) ; // ejs mate is used for creating inlcude partials and boiler plates for easy readablility
app.set('view engine', 'ejs') ;  // set view engine to ejs
app.set('views', path.join(__dirname, 'views')) ;  // views folder
app.use(express.static(path.join(__dirname , 'public'))) // public folder
app.use(express.urlencoded({extended: true})) ;
app.use(methodoverride('_method')) ; // ab mein method override ko _method se access kr pauga
app.use(cookieParser()) ;
app.use(express.json()) ;

app.use(productRoutes) ;
app.use(reviewRoutes) ;
app.use(authRoutes) ;

const PORT = 5050 ; 
app.listen((PORT), ()=> {
    console.log(`Server Listening at Port : ${PORT}...`) ;
})