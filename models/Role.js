const { Schema, model } = require('mongoose')

const roleSchema = Schema({
    title: {
        type: String,
        required: [true, 'El rol es obligatorio']
    },
    admin: {
        type: Boolean,
        default: false
    }
})

roleSchema.methods.toJSON = function(){
    const {__v, ...role} = this.toObject()
    return role
}

module.exports = model('Role', roleSchema)