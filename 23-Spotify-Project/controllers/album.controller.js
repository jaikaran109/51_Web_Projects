const Album = require('../models/Album') ; 
const jwt = require('jsonwebtoken') ;

const createAlbum = async (req , res) => {
    
    let {title , musicId} = req.body ; 
    let album = await Album.create({
        title,
        musics: musicId,
        artist: req.artistId
    });

    res.status(201).json({
        Message : 'Album Created',
        album
    })
}

module.exports = {createAlbum} ; 