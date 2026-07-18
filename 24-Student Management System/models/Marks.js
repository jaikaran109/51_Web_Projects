let mongoose = require('mongoose') ; 

let markSchema = new mongoose.Schema({
    subject : {
        type : String , 
        required : true , 
        trim : true 
    }, 
    grade : {
        type : Number ,
        required : true 
    }
})

let Marks = mongoose.model('Marks' , markSchema) ; 

module.exports = Marks ;