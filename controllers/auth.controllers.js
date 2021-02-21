const { response, request } = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { generateJWT } = require('../helpers/generate-jwt')
const { googleVerify } = require('../helpers/google-verify')

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

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body
    
    try {
        
        const { name, email, img, google } = await googleVerify(id_token)

        let user = await User.findOne({email})

        if(!user){
            const data = {
                name,
                email,
                password: "googlepass",
                img,
                google
            }

            user = new User(data)
            await user.save()

        }else{
            if(user && !user.google){
                return res.status(400).json({
                    err:{
                       message: "Debe loguearse normalmente" 
                    }
                })
            }
        }
        
        // GENERATE JWT
        const token = await generateJWT(user._id)

        res.json({
            user,
            token
        })
        

    } catch (error) {
        if(error){
            res.status(400).json({
                error
            })
        }
    }

}

module.exports = {
    loginUser,
    googleSignIn
}