import sequelize from '../utils/database'
import { DataTypes, DOUBLE } from 'sequelize'
import Product from './product'
import AddressType from '../enum/address-type'
import OrderStatus from '../enum/order-status'
import OrderProduct from './order-product'
import Customer from './customer'

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.BIGINT,
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
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
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
    status: {
        type: DataTypes.INTEGER,
        defaultValue: OrderStatus.Preparing
    },
    paymentMethod: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    useStandardDelivery: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    value: {
        type: DOUBLE,
        allowNull: false,
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    couponId: {
        type: DataTypes.BIGINT
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})
Customer.hasMany(Order, { foreignKey: { name: "userId" } })
Order.belongsToMany(Product, { through: OrderProduct })
Product.belongsToMany(Order, { through: OrderProduct })
export default Order