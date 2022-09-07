import { Router } from 'express'
import ProductController from '../controller/product'
const routes = Router()
const productController = new ProductController()

routes.get('/', productController.getAllProduct)
routes.get('/detail/:id', productController.getProductDetail)

export default routes