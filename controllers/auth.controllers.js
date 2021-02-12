const { response, request } = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generateJWT } = require('../helpers/generate-jwt')

const loginUser = async (req, res = response) => {

    const { email, password } = req.body

    try {

        // EMAIL EXIST
        const userDB = await User.findOne({email})
        if(!userDB){
            return res.status(400).json({
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        // USER ACTIVE
        if(!userDB.state){
            return res.status(403).json({
                err:{
                    message: 'Usuario deshabilitado'
                }
            })
        }

        // VALID PASSWORD
        const validPass = await bcrypt.compareSync(password, userDB.password)
        if(!validPass){
            return res.status(400).json({
                err:{
                    message: 'Usuario o contraseña incorrectos'
                }
            })
        }

        // GENERATE JWT
        const token = await generateJWT(userDB._id)

        res.json({
            user: userDB,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            error
        })
    }

}

module.exports = {
    loginUser
}