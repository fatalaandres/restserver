const router = require('express').Router()

router.use('/users', require('./users.routes'))
router.use('/roles', require('./roles.routes'))

module.exports = router