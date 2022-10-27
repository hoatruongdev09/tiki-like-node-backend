import express from 'express'
import cors from 'cors'
import sequelize from '../src/utils/database'
import credential from './middlewares/credential'

import user from './routes/customer'
import auth from './routes/auth'
import category from './routes/category'
import product from './routes/product'
import order from './routes/order'
import store from './routes/store'
import brand from './routes/brand'

import prepareData from '../prepare-data'

const app = express()

const allowedOrigins = ['http://localhost:3000']

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(credential)

app.use("/auth", auth)
app.use("/user", user)
app.use("/category", category)
app.use("/product", product)
app.use("/order", order)
app.use("/store", store)
app.use("/brand", brand)

const force = false

sequelize.sync({ force: force }).then((result) => {
    // if (force) {
    //     prepareData()
    // }
}).catch((error) => {
    console.error(error)
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`app listen on port ${port}`)
})