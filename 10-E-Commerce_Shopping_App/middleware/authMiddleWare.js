const jwt = require('jsonwebtoken') ; 

const authUser = async(req, res ,next) => {
    let token = req.cookies.token ;
    if(!token)
    {
        return res.status(401).render('auth/notAuthenticated') ;
    }
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET) ;
        next() ; 
    }
    catch(err) {
        return res.status(401).send('Unauthorized') ;
    }
}

const authSeller = async(req, res ,next) => {
    let token = req.cookies.token ;
    if(!token)
    {
        return res.status(401).render('error/notAuthenticated') ;
    }
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET) ;
        if(decoded.role != "seller"){
            return res.status(401).send('Unauthorized') ;
        }
        next() ;
    } 
    catch(err) {
        return res.status(401).send('Unauthorized') ;
    }
}
module.exports = {authUser , authSeller} ;