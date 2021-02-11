const { response, request } = require('express')

const usersGet = (req = request, res = response) => {

    const { 
        q,
        nombre,
        page
    } = req.query

    res.json({
        message: 'GET users - Controller',
        q,
        nombre,
        page
    })
}

const usersPost = (req, res = response) => {
    
    // const { edad } = req.body
    const body = req.body

    res.json({
        message: 'POST users - Controller',
        body
        // edad
    })
}

const usersPut = (req, res = response) => {

    const id = req.params.id

    res.json({
        message: 'PUT users - Controller',
        id
    })
}

const usersDelete = (req, res = response) => {
    res.json({
        message: 'DELETE users - Controller'
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}