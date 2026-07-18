const express = require('express') ;
const Products = require('../models/Product') ; 
const Router = express.Router() ; // mini instance

const productController = require('../controllers/productControllers') ;
const authMiddleWare = require('../middleware/authMiddleWare') ;

Router.get('/products', productController.getAllProducts)

// to show the form of new product
Router.get('/product/new', authMiddleWare.authSeller ,(req ,res)=> {
    res.render('products/new') ;
})

// to actually add the product
Router.post("/products", authMiddleWare.authSeller, async (req, res) => {
    let { name, img, price, desc } = req.body;
    await Products.create({ name, img, price, desc });
    res.redirect("/products");
});

// to show specific product details
Router.get('/products/:id', async (req ,res)=> {
    let {id} = req.params ;
    // let prod = await Products.findById(id) ;
    let prod = await Products.findById(id).populate('reviews') ;  // reviews ke saath dikhana h to populate use krte hein ab product ke saath reviews bhi hein
    res.render('products/show', {prod}) ;
})

// to show the edit form
Router.get('/products/:id/edit',authMiddleWare.authSeller, async(req ,res)=> {
    let {id} = req.params ; 
    let prod = await Products.findById(id) ; 
    res.render('products/edit', {prod}) ;
})

// to edit the product
Router.patch("/products/:id", authMiddleWare.authSeller, async (req, res) => {
    let { id } = req.params;
    let { name, img, price, desc } = req.body;
    await Products.findByIdAndUpdate(id, { name, img, price, desc });
    res.redirect(`/products/${id}`);
});

Router.delete("/products/:id", authMiddleWare.authSeller, async (req, res) => {
    let { id } = req.params;
    await Products.findByIdAndDelete(id);
    res.redirect("/products");
});

module.exports = Router ;   