const { response, request } = require('express')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const { valUsersPage } = require('../helpers/pagination-validators')

const usersGet = async (req = request, res = response) => {

    // PAGE SIZE
    const PAGE_SIZE = 5

    // PAGE VALUE
    let page = req.query.page || 1
    page = Number(page)

    let totalPages
    
    // PAGINATION CORRECT BETWEEN MIN AND MAX
    let pagination = await valUsersPage(PAGE_SIZE, page)
    page = pagination.page
    totalPages = pagination.totalPages
    
    let skip = (page - 1) * PAGE_SIZE
    skip = Number(skip)

    let limit = PAGE_SIZE
    limit = Number(limit)

    // REGULAR

    // const users = await User.find({state:true})
    //                         .skip(skip)
    //                         .limit(limit)

    // const total = await User.countDocuments({state:true})
    
    // res.json({
    //     total,
    //     users
    // })

    // PROMISE ALL
    
    // const resp = await Promise.all([
    //     User.countDocuments({state:true}),
    //     User.find({state:true}).skip(skip).limit(limit)
    // ])

    // res.json({
    //     resp
    // })

    const [total, users] = await Promise.all([
        User.countDocuments({state:true}),
        User.find({state:true}).skip(skip).limit(limit)
    ])

    res.json({
        total,
        page,
        totalPages,
        users
    })
}

const usersPost = async (req, res = response) => {
    
    const { name, email, password } = req.body

    const user = new User({ name, email, password })

    // PASSWORD ENCRYPT
    user.password = bcrypt.hashSync(password, 10)

    // SAVE USER
    await user.save()

    res.json({
        message: 'Usuario creado con éxito',
        user
    })
}

const usersPut = async (req, res = response) => {

    const id = req.params.id

    const { _id, email, password, google, role, ...data } = req.body

    user = await User.findByIdAndUpdate(id, data, {new:true, runValidators: true})

    res.json({
        message: 'Usuario actualizado con éxito',
        user
    })
}

const usersDelete = async (req, res = response) => {

    const id = req.params.id

    const stateChange = {
        state: false
    }

    user = await User.findByIdAndUpdate(id, stateChange, {new:true, runValidators: true})

    res.json({
        message: 'Usuario eliminado con éxito',
        user
    })
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}