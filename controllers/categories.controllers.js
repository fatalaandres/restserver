const { response, request } = require('express')
const Category = require('../models/Category')
const { valUsersPage } = require('../helpers/pagination-validators')

const getCats = async (req, res=response)=>{

    try {
        // PAGE SIZE
        const PAGE_SIZE = process.env.PAGE_SIZE

        // PAGE VALUE
        let page = req.query.page || 1
        page = Number(page)

        // TOTAL DOCS
        let total = await Category.countDocuments({})
        
        // PAGINATION CORRECT BETWEEN MIN AND MAX
        let pagination = await valUsersPage(PAGE_SIZE, total, page)
        page = pagination.page
        let totalPages = pagination.totalPages
        
        let skip = (page - 1) * PAGE_SIZE
        skip = Number(skip)

        let limit = PAGE_SIZE
        limit = Number(limit)

        // REGULAR

        const cats = await Category.find({})
                                .populate('user','name')
                                .skip(skip)
                                .limit(limit)

        res.json({
            total,
            page,
            totalPages,
            cats
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }

}

const createCat = async (req, res=response)=>{
    
    const body = req.body

    try {
        const cat = new Category(body)
    
        // SAVE CATEGORY
        await cat.save()
    
        res.json({
            message: 'Categoría creada con éxito',
            cat
        })
        
        
    } catch (error) {
        throw new Error(error)
    }
}

const updateCat = async (req, res=response)=>{

    const id = req.params.id

    const body = req.body

    const cat = Category.findByIdAndUpdate({_id:id},body,{new:true, runValidators: true}, (err, catDB)=>{

        if(err || !catDB){
            return res.status(404).json({
                err,
                message: 'La categoría no existe'
            })
        }

        res.json({
            message: 'Categoría actualizada con éxito',
            cat: catDB
        })

    })

}

const deleteCat = async (req, res=response)=>{

    const id = req.params.id

    try {
        
        const cat = await Category.findByIdAndRemove({_id:id})

        res.json({
            message: 'Categoría eliminada con éxito'
        })

    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

module.exports = {
    getCats,
    createCat,
    updateCat,
    deleteCat
}