import { Router, Request, Response, NextFunction } from 'express'
import HiringPost from '../models/hiring-post'
const routes = Router()

routes.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const { id_company, id_user, title } = req.body
    try {
        const post = HiringPost.build({
            id_company: id_company, //TODO verify if we have this company
            id_user: id_user, //TODO verify if we have this user
            title: title
        })
        await post.save()
        console.log(post.getDataValue('deleted'))
        res.json("ok")
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

export default routes
