import { Request, Response, NextFunction, Router } from 'express'
import User from '../models/user'

const routes = Router()

routes.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, name } = req.body
    try {
        const newUser = User.build({
            email: email,
            password: password, // TODO encrypt before save onto db
            name: name
        })
        var result = await User.findAndCountAll({ where: { email: email } })
        if (result.count != 0) {
            return res.status(403).json("email is existed")
        }
        await newUser.save()
        res.json("ok")
    } catch (error) {
        res.status(500).json(error)
    }
})

export default routes