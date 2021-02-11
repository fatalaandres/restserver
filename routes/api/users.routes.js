const { Router } = require('express')
const { check } = require('express-validator')
const { valUserFields } = require('../../middlewares/validate-user-fields')
const { isRoleValid, emailExist, idExist } = require('../../helpers/db-validators')

const router = Router()

const { 
        usersGet,
        usersPost,
        usersPut,
        usersDelete
        } = require('../../controllers/users.controllers')

router.get('/', usersGet)

router.post('/', 
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('password', 'El password es obligatorio').notEmpty(),
        check('password', 'El password debe tener al menos 6 letras').isLength({min: 6}),
        check('email', 'El email es obligatorio').notEmpty(),
        check('email', 'El email no es válido').isEmail(),
        check('email').custom(emailExist),
        check('role').custom(isRoleValid),
        valUserFields
        , usersPost)

router.put('/:id',
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('id', 'El id no es válido').isMongoId(),
        check('id').custom(idExist),
        valUserFields
        , usersPut)

router.delete('/:id',
        check('id', 'El id no es válido').isMongoId(),
        check('id').custom(idExist),
        valUserFields
        , usersDelete)


module.exports = router