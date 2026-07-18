const express = require('express') ;
const connectDB = require('./config/db');
const postRoutes = require('./routes/feedRoutes') ;
const cors = require('cors') ;
const app = express() ; 

connectDB() ;

app.use(express.json()) ;
app.use(cors()) ;

app.use(postRoutes); 

const PORT = 5050 ; 
app.listen(PORT, () => {
    console.log(`Server Listening at port : ${PORT}`) ; 
})