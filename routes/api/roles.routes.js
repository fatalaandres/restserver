const router = require('express').Router()

const { rolePost } = require('../../controllers/roles.controllers')

router.post('/', rolePost)

module.exports = router