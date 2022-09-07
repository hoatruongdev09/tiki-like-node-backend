import fs from 'fs'
import fsPromises from 'fs/promises'
import { parse, stringify } from 'csv'
import Category from './src/models/category'
import Manufacturer from './src/models/manufacturer'
import Seller from './src/models/seller'
import Store from './src/models/store'
import Product from './src/models/product'
import { col } from 'sequelize/types'

const prepareCategory = async () => {
    const data = await fsPromises.readFile('./datasample/Category.csv')
    const rows = data.toString().split('\r\n')
    for (let i = 1; i < rows.length; i++) {
        const col = rows[i].split(',')
        const category = Category.build({ name: col[1] })
        if (col[2] !== 'null') {
            category.setDataValue('parentId', col[2])
        }
        await category.save()
    }
}
const prepareManufacturer = async () => {

    const data = await fsPromises.readFile('./datasample/Manufacturer.csv')
    const rows = data.toString().split('\r\n')
    for (let i = 1; i < rows.length; i++) {
        const col = rows[i].split(',')
        const data = Manufacturer.build({ name: col[1] })
        await data.save()
    }
}
const prepareSeller = async () => {

    const data = await fsPromises.readFile('./datasample/Seller.csv')
    const rows = data.toString().split('\r\n')
    for (let i = 1; i < rows.length; i++) {
        const col = rows[i].split(',')
        const data = Seller.build({ name: col[1] })
        await data.save()
    }


}
const prepareStore = async () => {
    const data = await fsPromises.readFile('./datasample/Store.csv')
    const rows = data.toString().split('\r\n')
    for (let i = 1; i < rows.length; i++) {
        const col = rows[i].split(',')
        const data = Store.build({ ownerId: col[1], name: col[2] })
        await data.save()
    }
}

const prepareProduct = async () => {
    const data = await fsPromises.readFile('./datasample/Product.csv')
    const rows = data.toString().split('\r\n')
    for (let i = 1; i < rows.length; i++) {
        const col = rows[i].split(',')
        const data = Product.build({
            name: col[1],
            shortDescription: col[2],
            longDescription: col[3],
            price: col[4],
            stockCount: col[5],
            categoryId: col[6],
            storeId: col[7],
            manufacturerId: col[8]
        })
        await data.save()
    }
}

const prepareData = async () => {

    await prepareCategory()
    await prepareManufacturer()
    await prepareSeller()
    await prepareStore()
    await prepareProduct()

}

export default prepareData