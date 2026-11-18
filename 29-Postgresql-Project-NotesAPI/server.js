
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import ProductRouter from './routes/product.route.js'
import { ConnectDB } from './config/db.js'
import helmet from 'helmet'
import {rateLimit} from "express-rate-limit"
import Auth from './routes/auth.route.js'

const app = express()
app.use(morgan("dev"))
app.use(helmet())
app.use(cors())
app.use(express.json())

const Limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many requests. Try again later."
    }
})

app.use(Limiter)

app.use("/api/product" , ProductRouter)
app.use("/api/auth" , Auth)

app.listen(process.env.PORT || 5000 , ()=>{
    ConnectDB().then((res)=>{
     
        if(res){
            console.log(`Server Running on the Port: ${process.env.PORT || 5000}`)
        }
    }).catch(err=>{
        console.log("Error on Running the Server" , err)
    })
    
})
