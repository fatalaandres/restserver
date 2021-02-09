const express = require('express')
let {verificaToken, verificaRol} = require('../middlewares/auth')
const _ = require('underscore')

let app = express()

let Categoria = require('../models/categoria')

// GET CATEGORIAS

app.get('/categorias', (req,res)=>{

    let camposMostrar = [
        'nombre',
        'email'
    ]

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', camposMostrar)
        .exec((err, categorias) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err
                })
            }

            Categoria.countDocuments({},(err,counter)=>{
                if(counter === 0){
                    return res.status(404).json({
                        ok: false,
                        message: 'No existen categorías creadas',
                        total: counter
                    })    
                }
                res.json({
                    ok: true,
                    categorias,
                    total: counter
                })
            })
        })
})

// GET CATEGORIA

app.get('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id

    Categoria.findById(id, (err,categoriaDB)=>{

        if(err){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            })
        }

        if(!categoriaDB){
            return res.status(404).json({
                ok: false,
                message: 'La categoría no existe'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

// POST CATEGORIA

app.post('/categoria', verificaToken, (req,res)=>{
    
    body = req.body
    id = req.usuario._id

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: id
    })

    categoria.save((err,categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        if(!categoriaDB){
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

// PUT CATEGORIA

// context: 'query' es necesario para las disparar las validaciones de mongoose-unique-validator

app.put('/categoria/:id', verificaToken, (req,res)=>{
    
    let id = req.params.id

    let camposValidos = [
        'nombre',
        'descripcion'
    ]

    body = _.pick(req.body,camposValidos)

    Categoria.findByIdAndUpdate(id, body, {new:true, runValidators: true, context: 'query'}, (err,categoriaDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: {
                    err,
                    message: 'Categoría no encontrada'
                }
            })
        }

        if(!categoriaDB){
            return res.status(404).json({
                ok: false,
                message: 'La categoría no existe'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

// DELETE CATEGORIA

app.delete  ('/categoria/:id', [verificaToken, verificaRol], (req,res)=>{
    
    let id = req.params.id

    Categoria.findByIdAndRemove(id, (err,categoriaBorrada)=>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoriaBorrada){
            return res.status(404).json({
                ok: false,
                message: 'La categoría no existe'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    })

})

module.exports = app