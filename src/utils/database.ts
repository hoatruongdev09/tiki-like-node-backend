import { Sequelize } from 'sequelize'

const sequelize = new Sequelize('jobfinding',
    'root',
    'abcd1234',
    {
        dialect: 'mysql',
        host: 'localhost'
    })

export default sequelize