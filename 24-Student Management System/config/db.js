const mongoose = require('mongoose') ;

async function connectDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017/stumgmt')
    .then(()=> {
        console.log('DB CONNECTED...') ;
    })
    .catch((err) => {
        console.log('DB NOT CONNECTED') ;
    })
}

module.exports = connectDB ; 