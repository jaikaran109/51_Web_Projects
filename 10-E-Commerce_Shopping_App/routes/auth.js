const express = require("express");
const Router = express.Router() ; // mini instance.
const authController = require('../controllers/authController') ; 

Router.get("/register", (req, res) => {
    res.render("auth/register");
});

Router.post('/register', authController.registerUser) ; 

Router.get('/login', (req ,res) => {
    res.render('auth/login') ;
})

Router.post('/login' , authController.loginUser) ; 

Router.post('/logout' , authController.logout) ; 

module.exports = Router ;