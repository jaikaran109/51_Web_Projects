const mongoose = require('mongoose') ; 

const connectDB = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/Insta-App")
    .then(()=>{
        console.log('DB CONNECTED...') ; 
    })
    .catch((err) => {
        console.log('Error', err) ;
    })
}

module.exports = connectDB ;