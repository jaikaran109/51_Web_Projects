const jwt = require('jsonwebtoken') ;

const authArtist = async (req ,res , next) => {
    let token = req.cookies.token ; 
    if(!token)
    {
        return res.status(401).json({
            Message : "User not authenticated"
        })
    }
    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role != "artist") {
            return res.status(401).json({
                Message: "User not authenticated",
            });
        }
        req.artistId = decoded.id ; 
        next();
    } 
    catch (err) {
        return res.status(401).json({
            Message: "Unauthorized",
        });
    }
}


const authUser = async(req , res ,next) => {
    let token = req.cookies.token ; 
    if (!token) {
        return res.status(401).json({
            Message: "User not authenticated",
        });
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET) ; 
        if (decoded.role != "user") {
            return res.status(401).json({
                Message: "User not authenticated",
            });
        }
        next() ; 
    }   
    catch (err) {
        return res.status(401).json({
            Message: "Unauthorized",
        });
    }
}

module.exports = {authArtist , authUser} ;