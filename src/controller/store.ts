import { Request, Response, NextFunction } from 'express'
import { QueryTypes } from 'sequelize'
import ExtendedCustomerRequest from '../utils/extended-request'
import sequelize from '../utils/database'
import Store from '../models/store'
export default class StoreController {

    getGroupProductInfo(req: Request, res: Response, next: NextFunction) {
        const { items } = req.body

    }
    async getAllStore(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await Store.findAll()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}