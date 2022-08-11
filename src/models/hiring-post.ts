import { DataTypes } from 'sequelize'
import sequelize from '../utils/database'
import Company from './company'
import User from './user'

const HiringPost = sequelize.define('hiring_post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    id_company: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    short_description: {
        type: DataTypes.STRING(500),
    },
    long_description: {
        type: DataTypes.STRING(1000)
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

HiringPost.hasOne(Company, {
    foreignKey: {
        name: 'id_company'
    }
})
HiringPost.hasOne(User, {
    foreignKey: {
        name: 'id_user'
    }
})

export default HiringPost