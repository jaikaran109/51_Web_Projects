const mongoose = require('mongoose') ;

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=> {
        console.log(`DB Connected Successfully...`)
    })
    .catch((err) => {
        console.log(`DB NOT Connected...`) ;
    })
}

module.exports = connectDB ; 