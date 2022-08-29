import Customer from '../models/customer'
import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'
import jwtUtil from '../utils/jwt-generate'
import { AuthTokenData } from '../interfaces/AuthTokenData'
import CustomerController from './customer'

const customerController = new CustomerController()

export default class AuthController {

    async authCustomer(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        customerController.getCustomerInfo(req, res, next)
    }

    async loginCustomer(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { email, password, remember } = req.body
        console.log(remember)
        try {
            const user = await Customer.findAll({ where: { email: email } })
            if (user.length == 0) {
                return res.status(404).json('user not found')
            }
            if (user[0].getDataValue('password') != password) {
                return res.status(400).json('wrong password')
            }
            const authData: AuthTokenData = {
                id: user[0].getDataValue('id')
            }
            const token = jwtUtil.createNewToken(authData)
            res.json(token)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
    async registerCustomer(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { email, password, firstName, lastName, gender } = req.body
        try {
            const newUser = Customer.build({
                email: email,
                password: password, // TODO encrypt before save onto db
                firstName: firstName,
                lastName: lastName,
                gender: gender
            })
            var result = await Customer.findAndCountAll({ where: { email: email } })
            if (result.count != 0) {
                return res.status(403).json("email is existed")
            }
            await newUser.save()
            const authData: AuthTokenData = {
                id: newUser.getDataValue('id')
            }
            const token = jwtUtil.createNewToken(authData)
            res.json(token)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }
}