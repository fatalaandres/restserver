const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const _ = require('underscore')
const Usuario = require('../models/usuario')

app.get('/usuarios', function (req, res) {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    let camposParaMostrar = 'nombre email img role estado'

    Usuario.find({estado:true}, camposParaMostrar)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if(err){
                return res.status(404).json({
                    ok: false,
                    err: err
                })
            }

            Usuario.countDocuments({estado:true},(err,counter)=>{
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    cantidad: counter
                })
            })
        })
})
  
app.post('/usuario', function (req, res) {
      
    body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err,usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err: err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
      
})
  
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id

    let camposValidos = [
        'nombre',
        'email',
        'img',
        'role',
        'estado'
    ]

    body = _.pick(req.body,camposValidos)

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true}, (err,usuarioDB)=>{
        if(err){
            return res.json({
                ok: false,
                err: err
            })
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})
  
app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id

    // Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
    //     if(err){
    //         return res.status(404).json({
    //             ok: false,
    //             err: err
    //         })
    //     }

    //     if(!usuarioBorrado){
    //         return res.status(404).json({
    //             ok: false,
    //             err: 'El usuario no existe'
    //         })
    //     }

    //     res.status(200).json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // })


    cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true, runValidators: true}, (err,usuarioBorrado)=>{
        
        if(err){
            return res.status(404).json({
                ok: false,
                err: err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok:false,
                err: 'El usuario no existe'
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })

    })

})

module.exports = app