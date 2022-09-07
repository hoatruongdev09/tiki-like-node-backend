import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Store from './store'

const Seller = sequelize.define('seller', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

Seller.hasMany(Store, { foreignKey: 'ownerId' })

export default Seller