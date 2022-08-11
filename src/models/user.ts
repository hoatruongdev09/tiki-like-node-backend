import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    name: {
        type: DataTypes.STRING
    }
})

export default User