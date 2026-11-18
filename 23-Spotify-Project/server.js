const express = require("express");
const app = express();
require('dotenv').config() ; 
const cookieParser = require('cookie-parser') ; 
const helmet = require('helmet') ;
const rateLimit = require('express-rate-limit') ;

const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes') ; 
const musicRoutes = require('./routes/music.routes') ;
const albumRoutes = require('./routes/album.routes') ;

app.use(helmet()) ;
app.use(express.json()) ; 
app.use(cookieParser()) ;

connectDB();

// Slow down password guessing on the auth routes.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many attempts, try again later' },
}) ;

app.use('/api/auth/register', authLimiter) ;
app.use('/api/auth/login', authLimiter) ;

app.use('/api/auth', authRoutes) ; 
app.use('/api/auth', musicRoutes) ;
app.use('/api/auth', albumRoutes) ;

const PORT = 5050;
app.listen(PORT, () => {
    console.log(`Server Listening at port : ${PORT}`);
});
