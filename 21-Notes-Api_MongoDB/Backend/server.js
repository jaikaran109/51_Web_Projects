const express = require('express') ; 
const connectDb = require('./config/db');
const noteRoutes = require('./routes/noteRoutes') ;
const app = express() ; 
const CORS = require('cors') ; 

connectDb() ;

// Middlewares
app.use(express.json()) ;
app.use(
    CORS({
        origin: "http://localhost:5173"
    }),
);

// Routes 
app.use(noteRoutes) ; 
 
const PORT = 5050 ;
app.listen(PORT , () => {
    console.log(`Server is Running at ${PORT}`) ;
})