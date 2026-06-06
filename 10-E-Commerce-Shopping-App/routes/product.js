const express = require('express') ;
const Products = require('../models/Product') ; 
const Router = express.Router() ; // mini instance

Router.get('/products', async (req ,res)=> {
    let data = await Products.find({}) ; 
    res.render('products/index' , {data});   
})

// to show the form of new product
Router.get('/product/new', (req ,res)=> {
    res.render('products/new') ;
})

// to actually add the product
Router.post('/products', async(req ,res)=> {
    let {name, img , price , desc } = req.body ;
    await Products.create( {name, img , price , desc }) ;  
    res.redirect('/products') ; 
})

// to show specific product details
Router.get('/products/:id', async (req ,res)=> {
    let {id} = req.params ;
    let prod = await Products.findById(id) ;
    res.render('products/show', {prod}) ;
})

module.exports = Router ;   