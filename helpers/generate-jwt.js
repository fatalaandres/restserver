const { response } = require('express')
const jwt = require('jsonwebtoken')

const generateJWT = (uid = '')=>{

    return new Promise ( (resolve, reject)=>{

        const payload = { uid }
        const secretKey = process.env.SECRETKEY
        
        jwt.sign(payload,secretKey,{expiresIn: '6h'}, (err, token)=>{
            if(err){
                console.log(err);
                reject("El token no pudo generarse")
            }else{
                resolve(token)
            }
        })
    } )

}

module.exports = {
    generateJWT
}