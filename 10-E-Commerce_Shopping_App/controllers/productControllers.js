const Products = require("../models/Product");

const getAllProducts = async(req ,res) => {
    let data = await Products.find({});
    res.render("products/index", { data });   
}

module.exports = {getAllProducts} ; 