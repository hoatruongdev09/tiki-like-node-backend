import { Router, Response, Request, NextFunction } from 'express'
import Company from '../models/company'
const routers = Router()

routers.get('/list', (req: Request, res: Response, next: NextFunction) => {
    res.json("ok ")
})

routers.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body
    console.log(req.body.name)
    try {
        await Company.create({
            name: name
        })
        res.json('ok')
    } catch (error) {
        res.status(500).json(error)
    }
})


export default routers