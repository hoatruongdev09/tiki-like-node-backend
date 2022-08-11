import express from 'express'
import sequelize from '../src/utils/database'

import company from './routes/company'
import hiringPost from './routes/hiring-post'
import user from './routes/user'
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/company", company)
app.use("/hiring-post", hiringPost)
app.use("/user", user)

sequelize.sync({ force: false }).then((result) => {
    console.log(result)
}).catch((error) => {
    console.error(error)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`app listen on port ${port}`)
})