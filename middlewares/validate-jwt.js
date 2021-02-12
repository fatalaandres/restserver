const { response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const validateJWT = async (req, res = response, next)=>{

    const token = req.header('ussToken')
    const SECRETKEY = process.env.SECRETKEY

    if(!token){
        return res.status(401).json({
            err:{
                message: 'Token inválido'
            }
        })
    }

    try {
        
        const { uid } = jwt.verify(token, SECRETKEY)

        const userLogged = await User.findById(uid)

        if(!userLogged){
            return res.status(400).json({
                err:{
                    message: 'Usuario inválido'
                }
            })
        }else{
            req.userLogged = userLogged
        }

        next()

    } catch (error) {
        return res.status(401).json({
            err:{
                message: 'Token inválido'
            }
        })
    }

}

module.exports = {
    validateJWT
}