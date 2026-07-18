const express = require('express') ; 
const Router = express.Router() ; 
const authController = require('../controllers/auth.controller') ; 

Router.post('/register', authController.registerUser) ;
Router.post('/login', authController.loginUser) ;
Router.post('/logout', authController.logoutUser) ;

module.exports = Router ;