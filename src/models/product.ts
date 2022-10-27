import sequelize from '../utils/database'
import { DataTypes } from 'sequelize'
import Image from './product-image'

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    displayImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ''
    },
    shortDescription: {
        type: DataTypes.STRING,
    },
    longDescription: {
        type: DataTypes.TEXT,
    },
    specifications: {
        type: DataTypes.JSON,
        defaultValue: null
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    discount: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
    ,
    soldCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stockCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    categoryId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    brandId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    storeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    manufacturerId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    averageRate: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

Product.hasMany(Image, { foreignKey: 'productId' })

export default Product