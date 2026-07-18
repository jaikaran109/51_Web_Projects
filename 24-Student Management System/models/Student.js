const mongoose = require('mongoose') ; 

let studentSchema = new mongoose.Schema({
    img : {
        type : String ,
        required : true 
    },
    name : {
        type : String , 
        required : true ,
        trim : true 
    } , 
    roll : {
        type : Number , 
        required : true 
    } ,
    section : {
        type : String,
        required : true 
    } , 
    marks : [{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Marks'
    }]
})

const Students = mongoose.model('Students', studentSchema) ; 
module.exports = Students ; 