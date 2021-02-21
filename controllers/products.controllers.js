const { response, request } = require('express')
const Product = require('../models/Product')
const { valUsersPage } = require('../helpers/pagination-validators')

const getProds = async (req, res=response)=>{

    try {
        // PAGE SIZE
        const PAGE_SIZE = process.env.PAGE_SIZE

        // PAGE VALUE
        let page = req.query.page || 1
        page = Number(page)

        // TOTAL DOCS
        let total = await Product.countDocuments({})
        
        // PAGINATION CORRECT BETWEEN MIN AND MAX
        let pagination = await valUsersPage(PAGE_SIZE, total, page)
        page = pagination.page
        let totalPages = pagination.totalPages
        
        let skip = (page - 1) * PAGE_SIZE
        skip = Number(skip)

        let limit = PAGE_SIZE
        limit = Number(limit)

        // REGULAR

        const prods = await Product.find({})
                                .populate('user','name')
                                .populate('category','name')
                                .skip(skip)
                                .limit(limit)

        res.json({
            total,
            page,
            totalPages,
            prods
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }

}

const createProd = async (req, res=response)=>{
    
    const body = req.body

    try {
        const prod = new Product(body)
    
        // SAVE PRODUCT
        await prod.save()
    
        res.json({
            message: 'Producto creado con éxito',
            prod
        })
        
        
    } catch (error) {
        throw new Error(error)
    }
}

const updateProd = async (req, res=response)=>{

    const id = req.params.id

    const body = req.body

    const prod = Product.findByIdAndUpdate({_id:id},body,{new:true, runValidators: true}, (err, prodDB)=>{

        if(err || !prodDB){
            return res.status(404).json({
                err,
                message: 'El producto no existe'
            })
        }

        res.json({
            message: 'Producto actualizado con éxito',
            cat: prodDB
        })

    })

}

const deleteProd = async (req, res=response)=>{

    const id = req.params.id

    try {
        
        const prod = await Product.findByIdAndRemove({_id:id})

        res.json({
            message: 'Producto eliminado con éxito'
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

module.exports = {
    getProds,
    createProd,
    updateProd,
    deleteProd
}