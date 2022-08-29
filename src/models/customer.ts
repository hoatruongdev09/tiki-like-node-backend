import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import UserRoles from '../enum/user-roles'

import CustomerAddress from './customer-address'
import Address from './address'

const Customer = sequelize.define('customer', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(11),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    avatar: {
        type: DataTypes.STRING,
    },
    zipcode: {
        type: DataTypes.STRING(6)
    },

    role: {
        type: DataTypes.INTEGER,
        defaultValue: UserRoles.User
    },
    default_address: {
        type: DataTypes.INTEGER,
        defaultValue: null
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

Customer.belongsToMany(Address, { through: CustomerAddress })
Address.belongsToMany(Customer, { through: CustomerAddress })


export default Customer