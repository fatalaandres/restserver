const router = require('express').Router()
const { getCats, createCat, updateCat, deleteCat } = require('../../controllers/categories.controllers')

router.get('/', getCats)

router.post('/', createCat)

router.put('/:id', updateCat)

router.delete('/:id', deleteCat)

module.exports = router