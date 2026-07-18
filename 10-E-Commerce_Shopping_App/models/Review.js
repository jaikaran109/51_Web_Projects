const mongoose = require('mongoose') ; 

const reveiwSchema = new mongoose.Schema({
    rating : {
        type : Number ,
        min : 0 , 
        max : 5 
    }, 
    comment :[ 
        {
            type : String , 
            trim : true 
        }
    ]    
} , {timestamps : true}) ; 

let Reviews = mongoose.model('Reviews' , reveiwSchema) ;
module.exports = Reviews ; 