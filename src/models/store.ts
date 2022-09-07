import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Product from './product'
const Store = sequelize.define('store', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    ownerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

Store.hasMany(Product, { foreignKey: 'storeId' })



export default Store