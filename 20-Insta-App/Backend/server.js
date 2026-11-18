const express = require('express') ;
const connectDB = require('./config/db');
const postRoutes = require('./routes/feedRoutes') ;
const cors = require('cors') ;
const helmet = require('helmet') ;
const rateLimit = require('express-rate-limit') ;
const app = express() ; 

connectDB() ;

app.use(helmet()) ;
app.use(express.json()) ;

// Comma separated list in CORS_ORIGINS, the Vite dev server by default.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ;

app.use(cors({
    origin(origin, callback) {
        // No Origin header means a same-origin or non-browser request.
        callback(null, !origin || allowedOrigins.includes(origin)) ;
    },
})) ;

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests, try again later' },
})) ;

app.use(postRoutes); 

const PORT = 5050 ; 
app.listen(PORT, () => {
    console.log(`Server Listening at port : ${PORT}`) ; 
})