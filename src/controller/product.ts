import { Request, Response, NextFunction } from 'express'
import { QueryTypes } from 'sequelize'
import ExtendedCustomerRequest from '../utils/extended-request'
import Product from '../models/product'
import ProductImage from '../models/product-image'
import sequelize from '../utils/database'
import CountModel from '../interfaces/CountModel'
import ProductIdsData from '../interfaces/ProductIDsData'

export default class ProductController {

    async filterProducts(req: Request, res: Response, next: NextFunction) {
        const { searchValue = '', minPrice = -1, maxPrice = -1, page = 1, pageSize = 8 } = req.query
        const { categories = null, stores = null, manufacturers = null, sellers = null, brands = null, stars = null } = req.body

        try {
            const productsCount = await sequelize.query(`
            SELECT COUNT(products.id) as count
            FROM 
            products JOIN categories ON products.categoryId = categories.id
                        JOIN stores ON products.storeId = stores.id
                        JOIN manufacturers ON products.manufacturerId = manufacturers.id
                        JOIN sellers ON sellers.id = stores.ownerId
                        JOIN brands ON brands.id = products.brandId
                        JOIN (
                            SELECT products.id as id, COUNT(reviews.customerId) / SUM(rate) as averageRate 
                            FROM products LEFT OUTER JOIN reviews ON products.id = reviews.productId 
                            GROUP BY products.id
                            )q ON q.id = products.id
                        WHERE products.deleted = :deleted
                                AND (products.name LIKE :productName OR :productName = '')
                                AND (FLOOR(q.averageRate) IN (:stars) OR :isEmptyStars)
                                AND (products.price >= :minPrice OR :minPrice = -1)
                                AND (products.price <= :maxPrice OR :maxPrice = -1)
                                AND (stores.id IN (:storeId) OR :isEmptyStoreId)
                                AND (categories.id IN (:categoryId) OR :isEmptyCategoryId)
                                AND (manufacturers.id IN (:manufacturerId) OR :isEmptyManufacturerId)
                                AND (sellers.id IN (:sellerId) OR :isEmptySellerId)
                                AND (brands.id IN (:brandId) OR :isEmptyBrandId)
            `, {
                replacements: {
                    deleted: false,
                    productName: searchValue !== '' ? `%${searchValue}%` : '',
                    stars: stars == null || stars.length == 0 ? 'NULL' : stars,
                    isEmptyStars: stars == null || stars.length == 0,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    storeId: stores == null || stores.length == 0 ? 'NULL' : stores,
                    isEmptyStoreId: stores == null || stores.length == 0,
                    storeName: searchValue !== '' ? `%${searchValue}%` : '',
                    categoryId: categories == null || categories.length == 0 ? 'NULL' : categories,
                    isEmptyCategoryId: categories == null || categories.length == 0,
                    categoryName: searchValue !== '' ? `%${searchValue}%` : '',
                    manufacturerId: manufacturers == null || manufacturers.length == 0 ? 'NULL' : manufacturers,
                    isEmptyManufacturerId: manufacturers == null || manufacturers.length == 0,
                    manufacturerName: searchValue !== '' ? `%${searchValue}%` : '',
                    sellerId: sellers == null || sellers.length == 0 ? 'NULL' : sellers,
                    isEmptySellerId: sellers == null || sellers.length == 0,
                    sellerName: searchValue !== '' ? `%${searchValue}%` : '',
                    brandId: brands == null || brands.length == 0 ? 'NULL' : brands,
                    isEmptyBrandId: brands == null || brands.length == 0,
                    brandName: searchValue !== '' ? `%${searchValue}%` : '',
                },
                type: QueryTypes.SELECT,
                raw: true,
                plain: true
            }) as CountModel

            console.log(productsCount)

            const products = await sequelize.query(`
                SELECT products.*, q.averageRate as rate
                FROM 
                products JOIN categories ON products.categoryId = categories.id
                            JOIN stores ON products.storeId = stores.id
                            JOIN manufacturers ON products.manufacturerId = manufacturers.id
                            JOIN sellers ON sellers.id = stores.ownerId
                            JOIN brands ON brands.id = products.brandId 
                            JOIN (
								SELECT products.id as id, COUNT(reviews.customerId) / SUM(rate) as averageRate 
                                FROM products LEFT OUTER JOIN reviews ON products.id = reviews.productId 
                                GROUP BY products.id
                                )q ON q.id = products.id
                            WHERE products.deleted = :deleted
                                AND (products.name LIKE :productName OR :productName = '')
                                AND (FLOOR(q.averageRate) IN (:stars) OR :isEmptyStars)
                                AND (products.price >= :minPrice OR :minPrice = -1)
                                AND (products.price <= :maxPrice OR :maxPrice = -1)
                                AND (stores.id IN (:storeId) OR :isEmptyStoreId)
                                AND (categories.id IN (:categoryId) OR :isEmptyCategoryId)
                                AND (manufacturers.id IN (:manufacturerId) OR :isEmptyManufacturerId)
                                AND (sellers.id IN (:sellerId) OR :isEmptySellerId)
                                AND (brands.id IN (:brandId) OR :isEmptyBrandId)
                            LIMIT :pageSize OFFSET :offset
            `, {
                replacements: {
                    deleted: false,
                    productName: searchValue !== '' ? `%${searchValue}%` : '',
                    stars: stars == null || stars.length == 0 ? 'NULL' : stars,
                    isEmptyStars: stars == null || stars.length == 0,
                    minPrice: minPrice,
                    maxPrice: maxPrice,
                    storeId: stores == null || stores.length == 0 ? 'NULL' : stores,
                    isEmptyStoreId: stores == null || stores.length == 0,
                    storeName: searchValue !== '' ? `%${searchValue}%` : '',
                    categoryId: categories == null || categories.length == 0 ? 'NULL' : categories,
                    isEmptyCategoryId: categories == null || categories.length == 0,
                    categoryName: searchValue !== '' ? `%${searchValue}%` : '',
                    manufacturerId: manufacturers == null || manufacturers.length == 0 ? 'NULL' : manufacturers,
                    isEmptyManufacturerId: manufacturers == null || manufacturers.length == 0,
                    manufacturerName: searchValue !== '' ? `%${searchValue}%` : '',
                    sellerId: sellers == null || sellers.length == 0 ? 'NULL' : sellers,
                    isEmptySellerId: sellers == null || sellers.length == 0,
                    sellerName: searchValue !== '' ? `%${searchValue}%` : '',
                    brandId: brands == null || brands.length == 0 ? 'NULL' : brands,
                    isEmptyBrandId: brands == null || brands.length == 0,
                    brandName: searchValue !== '' ? `%${searchValue}%` : '',
                    pageSize: pageSize,
                    offset: (page as number - 1) * (pageSize as number)
                },
                type: QueryTypes.SELECT

            })
            const result = {
                products: products,
                page: page as number,
                lastPage: Math.floor(productsCount.count / (pageSize as number)) + (productsCount.count % (pageSize as number) > 0 ? 1 : 0)
            }
            res.status(200).json(result)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    async getAllProduct(req: Request, res: Response, next: NextFunction) {
        const { product = '', category = '', store = '', manufacturer = '', seller = '', page = 1, pageSize = 8 } = req.query
        try {
            const productsCount = await sequelize.query(`
            SELECT COUNT(products.id) as count
                 FROM 
                 products JOIN categories ON products.categoryId = categories.id
                 JOIN stores ON products.storeId = stores.id
                 JOIN manufacturers ON products.manufacturerId = manufacturers.id
                 JOIN sellers ON sellers.id = stores.ownerId
                 WHERE products.deleted = :deleted 
                    AND (products.name LIKE :productName OR :productName = '')
                    AND (stores.id = :storeId OR stores.name = :storeName OR :store = '') 
                    AND (categories.id = :categoryId OR categories.name LIKE :categoryName OR :category = '')
                    AND (manufacturers.id = :manufacturerId OR manufacturers.name LIKE :manufacturerName OR :manufacturer = '')
                    AND (sellers.id = :sellerId OR sellers.name LIKE :sellerName OR :seller = '')
                    `, {
                replacements: {
                    deleted: false,
                    productName: `%${product}%`,
                    storeId: store,
                    storeName: `%${store}%`,
                    store: store,
                    categoryId: category,
                    categoryName: `%${category}%`,
                    category: category,
                    manufacturerId: manufacturer,
                    manufacturerName: `%${manufacturer}%`,
                    manufacturer: manufacturer,
                    sellerId: seller,
                    sellerName: `%${seller}%`,
                    seller: seller,
                },
                type: QueryTypes.SELECT,
                raw: true,
                plain: true
            }) as CountModel
            const products = await sequelize.query(`
                SELECT  products.*, categories.name as categoryName
                 FROM 
                 products JOIN categories ON products.categoryId = categories.id
                 JOIN stores ON products.storeId = stores.id
                 JOIN manufacturers ON products.manufacturerId = manufacturers.id
                 JOIN sellers ON sellers.id = stores.ownerId
                 WHERE products.deleted = :deleted 
                    AND (products.name LIKE :productName OR :productName = '')
                    AND (stores.id = :storeId OR stores.name = :storeName OR :store = '') 
                    AND (categories.id = :category OR categories.name = :category OR :category = '')
                    AND (manufacturers.id = :manufacturerId OR manufacturers.name LIKE :manufacturerName OR :manufacturer = '')
                    AND (sellers.id = :sellerId OR sellers.name LIKE :sellerName OR :seller = '')
                 LIMIT :pageSize OFFSET :offset
            `, {
                replacements: {
                    deleted: false,
                    productName: `%${product}%`,
                    storeId: store,
                    storeName: `%${store}%`,
                    store: store,
                    categoryId: category,
                    categoryName: `%${category}%`,
                    category: category,
                    manufacturerId: manufacturer,
                    manufacturerName: `%${manufacturer}%`,
                    manufacturer: manufacturer,
                    sellerId: seller,
                    sellerName: `%${seller}%`,
                    seller: seller,
                    pageSize: pageSize,
                    offset: (page as number - 1) * (pageSize as number)
                },
                type: QueryTypes.SELECT
            })
            const result = {
                products: products,
                page: page as number,
                lastPage: Math.floor(productsCount.count / (pageSize as number)) + (productsCount.count % (pageSize as number) > 0 ? 1 : 0)
            }

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getProductDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const product = await sequelize.query(`
                SELECT products.*, categories.name as categoryName, categories.parentId as categoryParentId,
                    manufacturers.name as manufacturerName,
                    stores.name as storeName
                FROM products JOIN categories ON products.categoryId = categories.id
                    JOIN stores ON products.storeId = stores.id
                    JOIN manufacturers ON products.manufacturerId = manufacturers.id
                WHERE 
                    products.id = :productId 
                    AND products.deleted = false
            `, {
                replacements: { productId: id },
                type: QueryTypes.SELECT,
            })
            const images = await ProductImage.findAll({ where: { productId: id } })
            if (product.length != 0) {
                res.status(200).json({ product: product[0], images })
            } else {
                res.status(404).json({ message: 'product is not found' })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async getProductsDetail(req: Request, res: Response, next: NextFunction) {
        if (req.query.ids) {
            const queryIds = req.query.ids as string
            const ids = queryIds.split(',')
            try {

                const products = await sequelize.query(`
                    SELECT products.id, products.name, products.price, products.discount, products.displayImageUrl, products.stockCount, products.deleted, categories.name as categoryName, categories.parentId as categoryParentId,
                        manufacturers.name as manufacturerName,
                        stores.name as storeName
                    FROM products JOIN categories ON products.categoryId = categories.id
                        JOIN stores ON products.storeId = stores.id
                        JOIN manufacturers ON products.manufacturerId = manufacturers.id
                    WHERE 
                        products.id IN (:productIds)
                `, {
                    replacements: { productIds: ids },
                    type: QueryTypes.SELECT,
                })

                res.status(200).json(products)
            } catch (error) {
                res.status(500).json(error)
            }
        } else {
            res.status(400).json({ message: "product ids not valid" })
        }

    }
}