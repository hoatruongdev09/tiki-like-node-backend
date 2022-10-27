import { Router } from 'express'
const routes = Router()

import Store from '../controller/store'
const store = new Store()

routes.post('/stores-info', store.getGroupProductInfo)
routes.get('/all', store.getAllStore)

export default routes