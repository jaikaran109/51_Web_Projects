const Reviews = require('../models/Review') ; 
const Products = require('../models/Product') ; 
const express = require('express') ; 
const Router = express.Router() ; 

Router.post('/products/:id/review' , async (req ,res)=> {
    console.log(req.body) ;
    let {id} = req.params ;
    let {rating , comment} = req.body ;
    let prod = await Products.findById(id) ;
    let review = new Reviews({rating , comment}) ;

    prod.reviews.push(review) ; 
    await review.save() ; 
    await prod.save() ; 
    res.redirect(`/products/${id}`) ;
})

module.exports = Router ;