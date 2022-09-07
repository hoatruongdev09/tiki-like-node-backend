import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Product from './product'

const Manufacturer = sequelize.define('manufacturer', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

Manufacturer.hasMany(Product, { foreignKey: 'manufacturerId' })


export default Manufacturer