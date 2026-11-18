import express from 'express'
import { LoginUser, RegisterUser } from '../controller/auth.controller.js'

const Auth = express.Router()


Auth.post("/register" , RegisterUser)
Auth.post("/login" , LoginUser)

export default Auth