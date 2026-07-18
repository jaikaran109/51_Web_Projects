const jwt = require('jsonwebtoken') ; 
const User = require('../models/User') ;
const bcrypt = require('bcrypt') ;

const registerUser = async (req ,res) => {
    let {username , email , password, role="user"} = req.body ;
    let alreadyExist = await User.findOne({
        $or : [
            {username},
            {email}
        ]
    })

    if(alreadyExist)
    {
        return res.status(401).render('/error/notAuthenticated') ;
    }

    let salt = await bcrypt.genSalt(Number(process.env.SALT)) ; 
    const hash = await bcrypt.hash(password, salt) ;

    let user = await User.create({
        username ,
        email , 
        password : hash, 
        role
    })

    const token = jwt.sign({
        id : user._id ,
        role : user.role
    }, process.env.JWT_SECRET)

    res.cookie("token" , token) ;

    res.status(200).redirect('/products') ;
}

const loginUser = async(req ,res)=> {
    let {username , password} = req.body ;

    let user = await User.findOne({
        username
    })
    if(!user)
    {
        return res.status(201).render('auth/register') ;
    }

    let isValidPassword = await bcrypt.compare(password, user.password) ;
    if(!isValidPassword)
    {
        return res.status(401).render('/error/invalid') ;
    }

    const token = jwt.sign({
        id : user._id , 
        role : user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token) ; 

    res.status(200).redirect('/products') ;
}

const logout = async(req ,res) => {
    res.clearCookie("token") ; 
    res.status(200).redirect('/products') ;
} 

module.exports = {registerUser, loginUser , logout} ;