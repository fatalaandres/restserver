const { response, request } = require('express')
const { valUsersPage } = require('../helpers/pagination-validators')
const User = require('../models/User')
const { ObjectId } = require('mongoose').Types;

const search = (req, res=response) => {

    const allowCollections = [
        'users',
        'categories',
        'products',
        'roles'
    ]

    const { collection , term } = req.params

    if(!allowCollections.includes(collection)){
        return res.status(400).json({
            message: `Las colecciones permitidas son ${allowCollections}`
        })
    }

    switch (collection) {
        case 'users':
            userSearch(term, res)
            break;
    
        default:
            res.status(500).json({
                msg: 'Debe programarse la búsqueda'
            })
            break;
    }

}

const userSearch = async( term = '', res = response ) => {

    const isMongoID = ObjectId.isValid( term ); // TRUE 

    if ( isMongoID ) {
        const user = await User.findById(term);
        return res.json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp( term, 'i' );
    const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: users
    });

}

module.exports = {
    search
}