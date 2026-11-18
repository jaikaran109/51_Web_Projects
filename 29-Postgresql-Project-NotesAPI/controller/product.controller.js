import { sql } from "../config/db.js";


export const GetProducts = async (req,res)=>{
    try{
        const r = await sql`select * from products`;
        return res.status(200).json({"ok":true , "data":r})
    }
    catch(e){
        
       return res.status(500).json({"ok":false , 'msg':"Server Error"})
    }
   
}

export const CreateProducts = async (req,res)=>{
    try {
        const {name , image_url , price}  = req.body;
        if(!name || !image_url || !price){
            return res.status(400).json({"ok":false , 'msg':"Some feilds are Missing"})
        }
        await sql`
          INSERT INTO products (name , image , price) VALUES (${name} , ${image_url} , ${price})
        `
        return res.status(201).json({"ok":true , 'data':"Product Created"})

    } catch (error) {
       
       return res.status(500).json({"ok":false , 'msg':"Server Error"})

    }
}

export const GetProduct = async (req, res)=>{
    try {
        const pid = req.params.id;
        const product = await sql`SELECT * FROM products where id=${pid}`
        return res.status(200).json({"ok":true , "data":product})
    } catch (error) {
       return res.status(500).json({"ok":false , 'msg':"Server Error"})
        
    }
}

export const UpdateProduct = async (req, res)=>{
    try {
        const pid = req.params.id;
        
        const {name , image_url , price}  = req.body;
        await sql`UPDATE products SET name=${name} , image=${image_url} , price=${price} where id=${pid}`
        return res.status(200).json({"ok":true , 'data':"Updated Successfully"})
        
    } catch (error) {
       
       return res.status(500).json({"ok":false , 'msg':"Server Error"})
        
    }
}

export const DeleteProduct =  async (req, res)=>{
    try {
        const pid = req.params.id;
        await sql`DELETE FROM products where id=${pid}`
        return res.status(200).json({"ok":true , 'data':"Deleted Successfully"})
    } catch (error) {
       return res.status(500).json({"ok":false , 'msg':"Server Error"})
        
    }
}