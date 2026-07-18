const express = require('express') ;
const Router = express.Router() ; 
const Post = require('../models/Post.js') ;

Router.get('/posts', async(req, res) => {
    let data = await Post.find({}) ; 
    res.status(200).json(data) ;
})

Router.post('/create-post', async(req ,res) => {
    let {img, caption } = req.body ; 
    await Post.insertOne({img , caption}) ; 
    res.status(201).json({
        message : "Post Created"
    }); 
})

module.exports = Router ;
