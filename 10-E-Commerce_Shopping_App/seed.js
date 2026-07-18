const mongoose = require('mongoose'); 
const Product = require('./models/Product') ; 

let data = [
    {
        name : 'I Phone 17 Pro Max', 
        img : 'https://www.mobiledokan.com/media/apple-iphone-17-pro-max-white-official-image_1.webp' , 
        price : 149999 , 
        desc : 'The iPhone 17 is also sai d to come with an improved Apple A19 chip and Apple GPU (5-core graphics). Further, the camera system is quad 48 MP, and the improvement of the selfie camera is 24 MP.1080p with 24/30fps support and it is backed by a 3692 mAh battery using 25W wireless (MagSafe). The Apple iPhone 17 price in Bangladesh is BDT 1,47,499 (Official) with 8GB of RAM and 256GB of phone storage.'
    }, 
    {
        name : 'Asus TUF F-15 RTX 4060', 
        img : 'https://rukminim2.flixcart.com/image/1736/1736/xif0q/computer/u/f/j/-original-imahg5fuq86bnzde.jpeg?q=90' ,
        price : 110000 , 
        desc : 'ASUS TUF Gaming F15, 90WHrs Battery Intel Core i7 13th Gen 13620H - (16 GB/512 GB SSD/Windows 11 Home/8 GB Graphics/NVIDIA 4060'
    }
]

async function seedDB() {
    await Product.insertMany(data) ; 
    console.log(`Data Added...`) ;
}

module.exports = seedDB ;