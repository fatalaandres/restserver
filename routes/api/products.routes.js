const router = require('express').Router()
const { getProds, createProd, updateProd, deleteProd } = require('../../controllers/products.controllers')

router.get('/', getProds)

router.post('/', createProd)

router.put('/:id', updateProd)

router.delete('/:id', deleteProd)

module.exports = router