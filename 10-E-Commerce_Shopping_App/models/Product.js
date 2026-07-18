const mongoose = require('mongoose') ; 
const Reviews = require('./Review');

const productSchema = new mongoose.Schema({
    name : {
        type: String ,
        trim : true ,
        required : true
    } , 
    img : {
        type : String, 
        trim : true
    }, 
    price : {
        type : Number,
        required : true 
    } ,
    desc : {
        type: String ,
        trim : true
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId  ,
            ref : 'Reviews'
        }
    ]
})

// Middle wasre jo bts mongodb operations krwane pr use hota hai and iske andr pre and post middle ware hote hein 
// which is basically used over the schema and before the model is js class  pre mtlb pehle post mtlb baad mein
// to idhr mujhe product ke delete hone ke pehle uske reviews ko delete krna h so well use pre

productSchema.post('findOneAndDelete' , async (prod)=> {
    if(prod.reviews.length > 0)
    {
        await Reviews.deleteMany({
            _id:{$in:prod.reviews}
        }) ;
    }
})


const Product = mongoose.model('Product', productSchema) ;

module.exports = Product ;