const router = require('express').Router()
const { search } = require('../../controllers/search.controllers')

router.get('/:collection/:term', search)

module.exports = router