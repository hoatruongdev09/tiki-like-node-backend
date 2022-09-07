import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Product from './product'

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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

Category.hasMany(Category, { foreignKey: 'parentId' })
Category.hasMany(Product, { foreignKey: 'categoryId' })

export default Category