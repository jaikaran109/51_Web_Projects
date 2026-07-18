const express = require("express");
const app = express();
require('dotenv').config() ; 
const cookieParser = require('cookie-parser') ; 

const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes') ; 
const musicRoutes = require('./routes/music.routes') ;
const albumRoutes = require('./routes/album.routes') ;

app.use(express.json()) ; 
app.use(cookieParser()) ;

connectDB();

app.use('/api/auth', authRoutes) ; 
app.use('/api/auth', musicRoutes) ;
app.use('/api/auth', albumRoutes) ;

const PORT = 5050;
app.listen(PORT, () => {
    console.log(`Server Listening at port : ${PORT}`);
});
