const mongoose = require('mongoose') ; 

let postSchema = new mongoose.Schema({
    img : {
        required : true ,
        type : String, 
        trim : true
    },
    caption : {
        required : true , 
        type : String, 
        trim : true
    }
})

const post = mongoose.model('post', postSchema) ; 

module.exports = post ;