import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'

const CustomerAddress = sequelize.define('customer_address', {

}, { timestamps: false })

export default CustomerAddress