const express = require('express') ;
const Router = express.Router() ;  
const musicController = require('../controllers/music.controller') ; 
const authMiddleWare = require('../middlewares/auth.Middleware') ;

Router.get('/',authMiddleWare.authUser, musicController.getMusic) ; 

Router.post('/upload',authMiddleWare.authArtist, musicController.createMusic) 

module.exports = Router ;