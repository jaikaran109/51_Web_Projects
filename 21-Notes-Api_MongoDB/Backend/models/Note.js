const mongoose = require('mongoose') ; 

const noteSchema = new mongoose.Schema({
    title : {
        required : true , 
        type : String ,
        trim : true 
    } ,
    desc : {
        required : true , 
        type : String ,
        trim : true 
    }
})

const notes = mongoose.model("notes", noteSchema) ;
module.exports = notes ;