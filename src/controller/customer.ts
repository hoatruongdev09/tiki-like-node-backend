import Customer from '../models/customer'
import Address from '../models/address'
import CustomerAddress from '../models/customer-address'
import { Request, Response, NextFunction } from 'express'
import ExtendedCustomerRequest from '../utils/extended-request'


export default class CustomerController {

    async createNewCustomer(req: Request, res: Response, next: NextFunction) {
        const { email, password, name } = req.body
        try {
            const newUser = Customer.build({
                email: email,
                password: password, // TODO encrypt before save onto db
                name: name
            })
            var result = await Customer.findAndCountAll({ where: { email: email } })
            if (result.count != 0) {
                return res.status(400).json("email is existed")
            }
            await newUser.save()
            res.json("ok")
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getCustomerInfo(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const data = {
            id: req.userId,
            firstName: req.userData?.getDataValue('firstName'),
            lastName: req.userData?.getDataValue('lastName'),
            email: req.userData?.getDataValue('email'),
            phone: req.userData?.getDataValue('phone'),
            avatar: req.userData?.getDataValue('avatar'),
            zipcode: req.userData?.getDataValue('zipcode'),
            gender: req.userData?.getDataValue('gender')
        }
        res.status(200).json(data)
    }

    async updateCustomerInfo(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, phone, avatar, zipcode, gender } = req.body
        const id = req.userId

        try {
            const affectedRow = await Customer.update({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                avatar: avatar,
                zipcode: zipcode,
                gender: gender
            },
                { where: { id: id } }
            )
            res.status(200).json({ message: 'ok', affectedRow })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async changePassword(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const id = req.userId
        const password = req.userData?.getDataValue('password')

        const { currentPassword, newPassword } = req.body
        //TODO: compare crypt
        if (password !== currentPassword) {
            return res.status(400).json({ message: 'Wrong current password' })
        }
        if (password === newPassword) {
            return res.status(400).json({ message: 'new password is same with recent password' })
        }
        //TODO: implement encrypt password before update
        try {
            await Customer.update({ password: newPassword }, { where: { id: id } })
            res.status(200).json({ message: 'done' })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getCustomerAddresses(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const id = req.userId
        const defaultAddress = req.userData?.getDataValue('default_address')
        try {
            const addresses = await Address.findAll({
                include: [
                    {
                        model: Customer,
                        attributes: ['id', 'deleted'],
                        where: {
                            '$customers.id$': id,
                            '$customers.deleted$': false,
                        }
                    }
                ],
                where: {
                    deleted: false
                }
            })
            const modifiedAddress = addresses.map(address => ({
                id: address.getDataValue('id'),
                firstName: address.getDataValue('firstName'),
                lastName: address.getDataValue('lastName'),
                phone: address.getDataValue('phone'),
                country: address.getDataValue('country'),
                city: address.getDataValue('city'),
                ward: address.getDataValue('ward'),
                address: address.getDataValue('address'),
                address_type: address.getDataValue('address_type'),
                defaultAddress: defaultAddress == address.getDataValue('id')
            }))
            res.status(200).json(modifiedAddress)
        } catch (error) {
            console.error(error)
            res.status(500).json(error)
        }
    }
    async addNewAddress(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const id = req.userId
        const userData = req.userData

        const {
            firstName, lastName, country, city, ward, address, phone, address_type,
            use_default
        } = req.body

        try {
            const newAddress = Address.build({
                firstName: firstName,
                lastName: lastName,
                country: country,
                city: city,
                ward: ward,
                address: address,
                phone: phone,
                address_type: address_type,
            })
            await newAddress.save()
            await CustomerAddress.create({
                customerId: id,
                addressId: newAddress.getDataValue('id')
            })
            if (use_default) {
                userData?.setDataValue('default_address', newAddress.getDataValue('id'))
            }
            await userData?.save()
            res.status(200).json({ message: 'oke' })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async deleteAddress(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const rowAffected = await Address.update({ 'deleted': true }, { where: { id: id } })
            if (id == req.userData?.getDataValue('default_address')) {
                req.userData.setDataValue('default_address', null)
                await req.userData.save()
            }
            res.status(200).json({ message: 'oke', rowAffected })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async setDefaultAddress(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const numberOfAddress = await Address.count({
                where: { id: id, deleted: false },
                distinct: true,
                attributes: ['id']
            })
            if (numberOfAddress == 0) {
                return res.status(400).json({ message: 'user do not have this address' })
            }
            req.userData?.setDataValue('default_address', id)
            await req.userData?.save()
            return res.status(200).json({ message: 'oke' })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async getDefaultAddress(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const defaultAddress = req.userData?.getDataValue('default_address')
        if (defaultAddress === null) {
            return res.status(404).json({ message: 'user has no default address' })
        }
        try {

            const address = await Address.findByPk(defaultAddress)
            return res.status(200).json(address)
        } catch (error) {
            res.status(500).json(error)
        }
    }
    async updateAddress(req: ExtendedCustomerRequest, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const numberOfAddress = await Address.count({
                where: { id: id, deleted: false },
                distinct: true,
                attributes: ['id']
            })
            if (numberOfAddress == 0) {
                return res.status(400).json({ message: 'user do not have this address' })
            }
            const { firstName, lastName, phone, country, city, ward, address, address_type, defaultAddress } = req.body
            const affectedRow = await Address.update({
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                country: country,
                city: city,
                ward: ward,
                address: address,
                address_type: address_type,
                defaultAddress: defaultAddress
            }, {
                where: {
                    id: id,
                    deleted: false
                }
            })
            if (defaultAddress) {
                req.userData?.setDataValue('default_address', id)
            } else {
                if (req.userData?.getDataValue('default_address') === id) {
                    req.userData?.setDataValue('default_address', null)
                }
            }
            await req.userData?.save()
            res.status(200).json({ message: 'oke', affectedRow })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

