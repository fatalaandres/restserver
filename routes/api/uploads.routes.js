const router = require('express').Router()
const { check } = require('express-validator')
const { valUserFields } = require('../../middlewares/validate-user-fields')


const { 
    uploadUserFile,
    updateImage,
    updateImageCloudinary, 
    getImage} = require('../../controllers/uploads.controllers')

router.post('/users', uploadUserFile)

router.put('/:collection/:id',
        check('id','El id debe de ser de mongo').isMongoId(),
        valUserFields,
        updateImage)

router.put('/cloudinary/:collection/:id',
        check('id','El id debe de ser de mongo').isMongoId(),
        valUserFields,
        updateImageCloudinary)

router.get('/:collection/:id',
        check('id','El id debe de ser de mongo').isMongoId(),
        valUserFields,
        getImage)

module.exports = router