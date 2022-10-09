import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'

const OrderProduct = sequelize.define('order_product', {
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, { timestamps: false })

export default OrderProduct