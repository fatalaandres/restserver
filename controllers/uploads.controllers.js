const { request, response } = require('express');
const { uploadFile } = require('../helpers/file-uploader')
const User = require('../models/User')
const Product = require('../models/Product')
const path = require('path')
const fs   = require('fs');

const uploadUserFile = async (req, res = response) => {

    const validExt = [
        'png',
        'jpeg',
        'gif',
        'jpg'
    ]

    const type="users"

    const files = req.files

    try {
        file = await uploadFile(files, validExt, type)
        
        res.json({
            message: 'El archivo se subió correctamente',
            file
        })
        
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

const updateImage = async(req, res = response ) => {

    const { id, collection } = req.params;

    let model

    let validExt

    let type

    const files = req.files

    switch ( collection ) {
        case 'users':
            validExt = [
                'png',
                'jpeg',
                'gif',
                'jpg'
            ]
        
            type="users"

            model = await User.findById({_id:id});
            if ( !model ) {
                return res.status(400).json({
                    message: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'products':
            validExt = [
                'png',
                'jpeg',
                'gif',
                'jpg'
            ]
        
            type="products"

            model = await Product.findById({_id:id});
            if ( !model ) {
                return res.status(400).json({
                    message: `No existe un producto con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // CLEAR PREVIUS IMAGES
    if ( model.img ) {
        // DELETE IMAGE FROM SERVER
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            fs.unlinkSync( pathImage );
        }
    }
    
    try {
        file = await uploadFile(files, validExt, type)
    
        model.img = file
    
        await model.save();
            
        res.json({
            message: 'El archivo se actualizó correctamente',
            model
        })
        
    } catch (error) {
        res.status(400).json({
            error
        })
    }


}

const getImage = async(req, res = response ) => {

    const { id, collection } = req.params;

    let model

    let validExt

    let type

    const files = req.files

    switch ( collection ) {
        case 'users':
            validExt = [
                'png',
                'jpeg',
                'gif',
                'jpg'
            ]
        
            type="users"

            model = await User.findById({_id:id});
            if ( !model ) {
                return res.status(400).json({
                    message: `No existe un usuario con el id ${ id }`
                });
            }
        
        break;

        case 'products':
            validExt = [
                'png',
                'jpeg',
                'gif',
                'jpg'
            ]
        
            type="products"

            model = await Product.findById({_id:id});
            if ( !model ) {
                return res.status(400).json({
                    message: `No existe un producto con el id ${ id }`
                });
            }
        
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto'});
    }


    // CLEAR PREVIUS IMAGES
    if ( model.img ) {
        // DELETE IMAGE FROM SERVER
        const pathImage = path.join( __dirname, '../uploads', collection, model.img );
        if ( fs.existsSync( pathImage ) ) {
            return res.sendFile( pathImage )
        }
    }
    
    const pathImage = path.join( __dirname, '../assets/no-image.jpg');
    res.sendFile( pathImage );

}

module.exports = {
    uploadUserFile,
    updateImage,
    getImage
}