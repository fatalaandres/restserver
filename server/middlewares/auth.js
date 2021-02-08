const jwt = require('jsonwebtoken')

// VERIFICAR TOKEN

let verificaToken = (req, res, next) => {

    let token = req.get('token')

    if(!token){
        return res.status('400').json({
            ok: false,
            err: 'No se proporcionó el token'
        })
    }

    jwt.verify( token, process.env.SEED, (err, decoded) =>{
        if(err){
            return res.status('401').json({
                ok: false,
                err: {
                    message: 'El token es inválido'
                }
            })
        }

        req.usuario = decoded.usuario
        
        next()
    })


}

let verificaRol = (req, res, next) => {

    let usuario = req.usuario

    if(usuario.role !=='ADMIN_ROLE'){
        return res.status('401').json({
            ok:false,
            err: {
                message: 'El rol no le permite realizar la acción'
            }
        })
    }else{
        next()
    }

    

}

module.exports = {
    verificaToken,
    verificaRol
}