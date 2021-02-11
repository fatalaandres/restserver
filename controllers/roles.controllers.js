const { response, request } = require('express')
const Role = require('../models/Role')

const rolePost = async (req, res = response) => {

    const { title, admin } = req.body

    // CHECK VALUE
    if(!title){
        return res.status(400).json({
            err: {
                message: 'Debe especificar un rol'
            }
        })
    }

    const role = new Role({ title, admin })

    // SAVE ROLE
    await role.save()

    res.json({
        role
    })

}

module.exports = {
    rolePost
}