import { Router } from 'express'
const routes = Router()
import Brand from '../controller/brand'
const brand = new Brand()

routes.get('/all', brand.getAllBrands)

export default routes