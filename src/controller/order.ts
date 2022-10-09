import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'
import Customer from '../models/customer'
import Address from '../models/address'
import CustomerAddress from '../models/customer-address'
import Order from '../models/order'
import OrderProduct from '../models/order-product'

import { OrderProductData } from '../interfaces/OrderProductData'
import Product from '../models/product'
import sequelize from '../utils/database'
import { QueryTypes } from 'sequelize'



export default class OrderController {

    async getCustomerListOrder(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { userId } = req
        try {
            const orders = await Order.findAll({
                where: { userId: userId },
                order: ['createdAt']
            })
            res.status(200).json(orders)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }

    async getOrderDetail(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const order = (await Order.findByPk(id))?.toJSON()
            const total = await sequelize.query(`
                SELECT SUM(order_products.price * order_products.count * (1-order_products.discount/100)) AS total
                FROM order_products WHERE orderId = :orderId`,
                {
                    replacements: { orderId: order.id },
                    type: QueryTypes.SELECT
                }
            )
            interface totalData {
                total: number
            }
            const items = await sequelize.query(`
            SELECT products.id, products.name, products.displayImageUrl, order_products.price, order_products.discount, order_products.count
            FROM order_products JOIN products ON order_products.productId = products.id 
            WHERE orderId = :orderId`,
                {
                    replacements: { orderId: order.id },
                    type: QueryTypes.SELECT
                }
            )
            const data = {
                ...order,
                total: (total[0] as totalData).total
                , items
            }

            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async placeOrder(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { userId, userData } = req
        console.log(`user id: ${userId}`)
        let { useStandardDelivery, useOtherAddress, addressData, paymentMethod, addressID, items } = req.body
        if (items == null || items.length == 0) {
            res.status(400).json({ message: "cannot order without items" })
        }
        try {
            if (!useOtherAddress) {
                const data = (await Address.findOne({ where: { id: addressID, deleted: 'false' } }))?.toJSON()
                addressData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    email: userData?.getDataValue('email'),
                    country: data.country,
                    city: data.city,
                    ward: data.ward,
                    address: data.address,
                    address_type: data.address_type,
                }
                console.log('data: ', addressData)
            }
            const products = await Product.findAll({
                where: {
                    id: items.map((it: OrderProductData) => it.id)
                }
            })
            let orderValue = 0
            products.forEach(product => {
                const productJson = product.toJSON()
                orderValue += productJson.price * (1 - productJson.discount / 100)
            })
            const newOrder = Order.build({
                ...addressData,
                userId: userId,
                paymentMethod: paymentMethod,
                useStandardDelivery: useStandardDelivery,
                value: orderValue
            })
            await newOrder.save()
            const orderId = newOrder.getDataValue("id")
            products.forEach(async (prod) => {
                const product = prod.toJSON()
                await OrderProduct.create({
                    productId: product.id,
                    orderId: orderId,
                    price: product.price,
                    discount: product.discount,
                    count: (items as OrderProductData[]).find(it => it.id)?.count
                })
            })
            res.status(200).json({ orderId })
        } catch (error) {
            console.error('error:', error)
            res.status(500).json(error)
        }
    }

}