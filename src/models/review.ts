import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Product from './product'
import Customer from './customer'

const Review = sequelize.define('review', {
    productId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    customerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    rate: {
        type: DataTypes.SMALLINT,
        defaultValue: 0
    },
    title: {
        type: DataTypes.STRING
    },
    review: {
        type: DataTypes.STRING
    }
})

Customer.hasMany(Review, { foreignKey: 'customerId' })
Product.hasMany(Review, { foreignKey: 'productId' })

export default Review