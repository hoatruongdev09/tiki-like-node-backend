import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'

const credential = (req: ExtendedCustomerRequest, res: Response, next: NextFunction) => {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
}

export default credential