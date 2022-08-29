import { Router } from 'express'
import AuthController from '../controller/auth'
import { customerAuth } from '../middlewares/auth';
const route = Router()

const authController = new AuthController()

route.get('/', customerAuth, authController.authCustomer)
route.post('/login', authController.loginCustomer)
route.post('/register', authController.registerCustomer)

export default route