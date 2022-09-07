import { Router } from 'express'
import { customerAuth } from '../middlewares/auth'
import CustomerController from '../controller/customer'

const routes = Router()
const customerController = new CustomerController()

routes.post('/create', customerController.createNewCustomer)
routes.get('/info', customerAuth, customerController.getCustomerInfo)
routes.post('/update', customerAuth, customerController.updateCustomerInfo)
routes.post('/change-password', customerAuth, customerController.changePassword)
routes.get('/addresses', customerAuth, customerController.getCustomerAddresses)
routes.post('/add-address', customerAuth, customerController.addNewAddress)
routes.post('/delete-address/:id', customerAuth, customerController.deleteAddress)
routes.post('/set-default-address/:id', customerAuth, customerController.setDefaultAddress)
routes.post('/update-address/:id', customerAuth, customerController.updateAddress)
routes.get('/default-address', customerAuth, customerController.getDefaultAddress)

export default routes