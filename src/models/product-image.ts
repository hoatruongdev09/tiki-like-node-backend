import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'

const Image = sequelize.define('productImage', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,

    }
})

export default Image