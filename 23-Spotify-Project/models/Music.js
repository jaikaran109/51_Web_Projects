const mongoose = require('mongoose') ;

const musicSchema = new mongoose.Schema({
    title : {
        type : String,
        required :  true 
    }, 
    artist : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
        required : true
    }
})

const Music = mongoose.model('Music', musicSchema) ; 
module.exports = Music ; 