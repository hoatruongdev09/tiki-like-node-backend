import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Product from './product'

const Brand = sequelize.define('Brand', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    parentId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})
Brand.hasMany(Brand, { foreignKey: 'parentId' })
Brand.hasMany(Product, { foreignKey: 'brandId' })

export default Brand
