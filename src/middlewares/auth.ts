import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'
import { AuthTokenData } from '../interfaces/AuthTokenData'
import jwtGenerate from '../utils/jwt-generate'
import Customer from '../models/customer'

export const customerAuth = async (req: ExtendedCustomerRequest, res: Response, next: NextFunction) => {
    const token: string = req.headers.authorization as string
    if (token === undefined || !token.startsWith("Bearer")) {
        return res.status(403).json("not authorize")
    }

    const jwtToken = token.substring("Bearer ".length, token.length)
    if (!jwtToken) {
        return res.status(403).json("not authorize")
    }
    const tokenData = jwtGenerate.decodeToken(jwtToken)
    const payload = tokenData?.payload as AuthTokenData


    try {
        const user = await Customer.findByPk(payload.id)

        if (user == null || user.getDataValue('deleted')) {
            return res.status(403).json("not authorize")
        } else {
            req.userId = payload.id
            req.authorized = true
            req.userRole = user.getDataValue('role')
            req.userData = user
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }

}

