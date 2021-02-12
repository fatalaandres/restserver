const Role = require("../models/Role");
const User = require("../models/User");

// VALIDATE ROLE
const isRoleValid = async(role) => {
    if(!role){
        const commonRole = await Role.findOne({admin: false})
        role = commonRole.title
        console.log(role);
    }
    const exist = await Role.findOne({title: role})
    if(!exist){
        throw new Error('El rol no existe')
    }
}

// VALIDATE UNIQUE EMAIL
const emailExist = async (email) => {
    try {
        const exist = await User.findOne({email})
        if(exist){
            throw new Error(`El email ${email} se encuentra registrado`)
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

// VALIDATE ID
const idExist = async (id) => {
    const exist = await User.findById(id)
    if(!exist){
        throw new Error(`El id ${id} no existe`)
    }
}

module.exports = {
    isRoleValid,
    emailExist,
    idExist
}