import { Router } from 'express'
import OrderController from '../controller/order'
import { customerAuth } from '../middlewares/auth'

const routes = Router()
const orderController = new OrderController()

routes.post('/place-order', customerAuth, orderController.placeOrder)
routes.get('/detail/:id', customerAuth, orderController.getOrderDetail)
routes.get('/user-orders', customerAuth, orderController.getCustomerListOrder)

export default routes