const Students = require('./models/Student') ;

let  data = [
    {
        img : 'https://th.bing.com/th/id/OIP.hnTE6Uql0Pn6gbSDGjlQsgHaJh?w=143&h=184&c=7&r=0&o=7&pid=1.7&rm=3' , 
        name : 'Shruti' , 
        roll : 2415000400 , 
        section : 'FA'
    }, 
    {
        img : 'https://th.bing.com/th/id/OIP.mD9ClNVmYTrwju9Q6i77bAHaJl?w=142&h=184&c=7&r=0&o=7&pid=1.7&rm=3' , 
        name : 'Anirudh' ,
        roll : 2415000589 ,
        section : 'FC'
    }
]

async function seedDB() {
    await Students.insertMany(data) ; 
    console.log('DATA Seeded') ;
}

module.exports = seedDB ; 