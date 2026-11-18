import express from 'express'
import { GetProducts,CreateProducts , GetProduct , UpdateProduct , DeleteProduct } from '../controller/product.controller.js';
import { CheckvalidId } from '../utils/utils.js';

const ProductRouter = express.Router()

ProductRouter.get("/" , GetProducts)
ProductRouter.post("/" , CreateProducts)
ProductRouter.get("/:id" , CheckvalidId ,  GetProduct)
ProductRouter.put("/:id" , CheckvalidId,  UpdateProduct)
ProductRouter.delete("/:id" ,CheckvalidId ,  DeleteProduct)


export default ProductRouter;