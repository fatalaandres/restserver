const express = require('express')
const { verificaToken, verificaRol } = require('../middlewares/auth')
const Categoria = require('../models/categoria')
const _ = require('underscore')
const Producto = require('../models/producto')

const app = express()

// GET PRODUCTOS

app.get('/productos', (req, res) => {

    let page = req.query.page || 1
    page = Number(page)

    const PAGE_SIZE = 5

    let skip = (page - 1) * PAGE_SIZE
    skip = Number(skip)

    let limit = PAGE_SIZE
    limit = Number(limit)

    Producto.find({disponible: true})
        .skip(skip)
        .limit(limit)
        .sort('nombre')
        .populate('usuario')
        .populate('categoria')
        .exec((err,productos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            Producto.countDocuments({disponible: true},(err,counter)=>{
                if(counter === 0){
                    return res.status(404).json({
                        ok: false,
                        message: 'No existen productos creados',
                        total: counter
                    })    
                }
                res.json({
                    ok: true,
                    productos,
                    total: counter
                })
            })

        })

})

// GET PRODUCTO

app.get('/producto/:id', (req,res)=>{

    id = req.params.id

    Producto.findById(id)
        .populate('usuario')
        .populate('categoria')
        .exec((err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No existe el producto'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

// POST PRODUCTOS

app.post('/producto', verificaToken, (req,res)=>{

    body = req.body

    user_id = req.usuario._id

    id_cat = body.id_cat

    console.log(body);

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: id_cat,
        usuario: user_id
    })

    Categoria.findById(id_cat, (err, categoriaDB) =>{
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
    })

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

// PUT PRODUCTO

app.put('/producto/:id', verificaToken, (req,res)=>{

    id = req.params.id

    let camposValidos = [
        'nombre',
        'precioUni',
        'descripcion',
        'disponible',
        'categoria',
        'usuario'
    ]

    body = _.pick(req.body,camposValidos)

    body.usuario = req.usuario._id

    Producto.findByIdAndUpdate(id, body, {new:true, runValidators: true, context: 'query'}, (err,productoDB)=>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe'
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    } )

})

// BORRAR PRODUCTO

app.delete('/producto/:id', [verificaToken, verificaRol], (req,res)=>{

    let id = req.params.id

    console.log(id);

    let disponibilidad = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, disponibilidad, {new:true, runValidators: true, context: 'query'}, (err, productoBorrado)=>{

        console.log(productoBorrado);

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoBorrado){
            return res.status(404).json({
                ok: false,
                message: 'El producto no existe'
            })
        }

        res.json({
            ok: true,
            producto: productoBorrado
        })

    })

})

// BUSCAR PRODUCTO

app.get('/productos/buscar/:q', verificaToken,(req,res)=>{

    let q = req.params.q

    let regex = new RegExp(q, 'i');

    Producto.find({nombre: regex})
        .populate('usuario')
        .populate('categoria')
        .exec((err,productosDB)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if(!productosDB){
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron productos con su búsqueda'
                    }
                })
            }
    
            res.json({
                ok: true,
                productos: productosDB
            })
        })

})

module.exports = app