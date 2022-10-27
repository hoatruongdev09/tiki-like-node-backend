import { Router } from 'express'
import ProductController from '../controller/product'
const routes = Router()
const productController = new ProductController()

routes.get('/', productController.getAllProduct)
routes.post('/filter', productController.filterProducts)
routes.get('/detail/:id', productController.getProductDetail)
routes.get('/details', productController.getProductsDetail)

export default routes