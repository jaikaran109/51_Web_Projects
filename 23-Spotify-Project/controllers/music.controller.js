const Music = require('../models/Music') ;
const jwt = require('jsonwebtoken') ;

const createMusic = async (req ,res) => {

    let {title} = req.body ; 
    let music = await Music.create({
        title , 
        artist : req.artistId
    })

    res.status(201).json({
        Message : "Song Uploaded",
        music
    })
}

const getMusic = async(req , res) => {
    let musics = await Music.find().populate("artist", "username email role") ;
    res.status(200).json({
        Message : "Music Fetched", 
        musics
    })
}

module.exports = {createMusic , getMusic} ; 

