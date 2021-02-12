const router = require('express').Router()
const { check } = require('express-validator')
const { valUserFields } = require('../../middlewares/validate-user-fields')
const { loginUser, googleSignIn } = require('../../controllers/auth.controllers')

router.post('/', (req,res)=>{
    console.log("Holis");
})

router.post('/login', 
        check('email', 'El email es obligatorio').notEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('password', 'El password es obligatorio').notEmpty(),
        valUserFields
        , loginUser)

router.post('/google', 
        check('id_token', 'El token es obligatorio').notEmpty(),
        valUserFields
        , googleSignIn)

module.exports = router