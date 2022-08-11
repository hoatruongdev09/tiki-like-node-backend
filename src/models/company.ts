import { Sequelize, DataTypes } from 'sequelize'
import sequelize from '../utils/database'

const Company = sequelize.define('company', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
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

export default Company

