import { Request } from 'express'
import { Model } from 'sequelize/types'
import UserRoles from '../enum/user-roles'


export default interface ExtendedCustomerRequest extends Request {
    authorized?: boolean
    userId?: number
    userRole?: UserRoles
    userData?: Model<any, any>
}
