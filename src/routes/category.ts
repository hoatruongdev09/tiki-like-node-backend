import { Router } from 'express'
import CategoryController from '../controller/category'
const routes = Router()

const categoryController = new CategoryController()

routes.post('/create', categoryController.createCategory)
routes.get('/get-all-categories', categoryController.getAllCategories)
routes.get('/get-parent-categories', categoryController.getAllParentCategories)
routes.get('/get-child-categories/:parent', categoryController.getChildCategories)
routes.get('/tree/:id', categoryController.getCategoryTree)

export default routes