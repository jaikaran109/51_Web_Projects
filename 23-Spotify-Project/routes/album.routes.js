const express = require("express");
const Router = express.Router();
const albumController = require('../controllers/album.controller') ;
const authMiddleWare = require('../middlewares/auth.Middleware') ;

Router.post('/create-album',authMiddleWare.authArtist , albumController.createAlbum)

module.exports = Router ;