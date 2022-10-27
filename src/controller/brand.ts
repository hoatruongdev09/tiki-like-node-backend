import Brand from '../models/brand'
import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'
const { Op } = require("sequelize");

export default class BrandController {
    async getAllBrands(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await Brand.findAll()
            return res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}