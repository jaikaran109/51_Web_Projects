const mongoose = require('mongoose') ; 

const connectDb = async ()=> {
    await mongoose.connect("mongodb://127.0.0.1:27017/notes")
    .then(()=> {
        console.log('DB CONNECTED SUCCESSFULLY')
    })
    .catch((err) => {
        console.log('DB NOT CONNECTED') ;
    })
}

module.exports = connectDb ; 