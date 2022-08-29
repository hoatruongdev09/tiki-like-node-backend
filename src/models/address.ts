import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import AddressType from '../enum/address-type'

const Address = sequelize.define('address', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
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
        allowNull: false
    },
    country: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    ward: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.STRING
    },
    address_type: {
        type: DataTypes.INTEGER,
        defaultValue: AddressType.Home
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

export default Address