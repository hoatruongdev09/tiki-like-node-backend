import Category from '../models/category'

import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'
const { Op } = require("sequelize");

export default class CategoryController {

    async createCategory(req: Request, res: Response, next: NextFunction) {
        const { name, parentId } = req.body
        try {
            const existCategoryCount = await Category.count({
                where: {
                    name: name,
                    deleted: false
                }
            })
            if (existCategoryCount != 0) {
                return res.status(400).json({ message: 'category existed' })
            }
            if (parentId) {
                const existParentCategoryCount = await Category.count({
                    where: {
                        id: parentId,
                        deleted: false
                    }
                })
                if (existParentCategoryCount == 0) {
                    return res.status(400).json({ message: 'parent category is not found' })
                }
            }
            const category = Category.build({ name: name, parentId: parentId })
            await category.save()
            res.status(200).json(category)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await Category.findAll({ where: { deleted: false } })
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getAllParentCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await Category.findAll({
                where: {
                    parentId: null,
                    deleted: false
                }
            })
            res.status(200).json(categories)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getChildCategories(req: Request, res: Response, next: NextFunction) {
        const { parent } = req.params
        try {
            const category = await Category.findOne({
                attributes: ['id'], where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { id: parent },
                                { name: parent }
                            ]
                        },
                        { deleted: false }
                    ]
                }
            })
            if (category) {
                const childCategory = await Category.findAll({
                    where: {
                        parentId: category.getDataValue('id'),
                        deleted: false
                    }
                })
                res.status(200).json(childCategory)
            } else {
                res.status(200).json([])
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getCategoryTree(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const tree = []
        try {
            let category = await Category.findOne({
                where: {
                    id: id,
                    deleted: false
                }
            })
            if (category) {
                tree.push(category)
                let parentId = category.getDataValue('parentId')
                while (parentId) {
                    category = await Category.findOne({
                        where: {
                            id: parentId,
                            deleted: false
                        }
                    })
                    if (category) {
                        tree.push(category)
                        parentId = category.getDataValue('parentId')
                    } else {
                        parentId = null
                    }
                }
                res.status(200).json(tree.reverse())
            } else {
                res.status(404).json({ message: 'category not found' })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}