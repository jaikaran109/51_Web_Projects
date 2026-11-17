import { sql } from "../config/db.js";
import jwt from 'jsonwebtoken'

export const RegisterUser = async (req,res)=>{
    try {
        const {username , email , password , gender} = req.body;
        let r = await sql`SELECT email from users where email = ${email} LIMIT 1;`
        if(r.length!=0){
            return res.status(400).json({"error":true , 'msg':"Email id Already Found!"})
        }
        
        await sql`insert into users (username , email , password , gender) values (${username} , ${email} , ${password} , ${gender})`
        return res.status(201).json({"ok":true , 'msg':"User Created Successfully"})


    } catch (error) {
        return res.status(500).json({"error":true , 'msg':"Server Error"})
    }
}

export const LoginUser = async (req,res)=>{
    try {
        const {email , password} = req.body;
        const r = await sql`select * from users where email=${email} limit 1`;
        if(r.length==0){
            return res.status(400).json({"ok":false , 'msg':"user not found"})
        }
        if (r[0].password != password){
            return res.status(400).json({"ok":false , 'msg':"user not found"})
        }

        const token = jwt.sign({"email":email} , process.env.SECERT_KEY, {expiresIn:"1h"})
        return res.status(200).json({"ok":true , "data":token})
    } catch (error) {
        console.log(error)
        return res.status(500).json({"error":true , 'msg':"Server Error"})
        
    }
}