import jwt from 'jsonwebtoken'

const privateKey = "private-key-test"

const createNewToken = (payload: any) => {
    return jwt.sign(payload, privateKey)
}

const verifyToken = (token: string) => {
    return jwt.verify(token, privateKey)
}

const decodeToken = (token: string) => {
    return jwt.decode(token, { complete: true })
}

export default { createNewToken, verifyToken, decodeToken }