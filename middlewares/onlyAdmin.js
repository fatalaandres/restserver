const { response } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Role = require('../models/Role')

const validateAdmin = async (req, res = response, next)=>{

    const userLogged = req.userLogged

    if(!userLogged){
        return res.status(500).json({
            err:{
                message: 'Se debe validar primero el JWT'
            }
        })
    }

    try {

        const validRole = await Role.findOne({title: userLogged.role, admin: true})

        if(!userLogged.state || !validRole){
            return res.status(403).json({
                err:{
                    message: 'Pemiso denegado'
                }
            })
        }

        next()
        
    } catch (error) {
        return res.status(403).json({
            err:{
                error,
                message: 'Pemiso denegado'
            }
        })
    }


}

module.exports = {
    validateAdmin
}