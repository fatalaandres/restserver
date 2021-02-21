const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/categories', require('./categories.routes'))
router.use('/products', require('./products.routes'))
router.use('/roles', require('./roles.routes'))
router.use('/search', require('./search.routes'))
router.use('/uploads', require('./uploads.routes'))
router.use('/users', require('./users.routes'))

module.exports = router