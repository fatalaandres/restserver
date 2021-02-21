const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../db/config')
const fileUpload = require('express-fileupload')

class Server{

    constructor(){
        // EXPRESS
        this.app = express()

        // PORT
        this.port = process.env.PORT

        // CONNECT TO DB
        this.conDB()

        // MIDDLEWARES
        this.middlewares()

        // ROUTES
        this.routes()
    }

    // CONNECT TO ONE OR MORE DB
    async conDB(){
        await dbConnection()
    }

    middlewares(){
        // PUBLIC FOLDER
        this.app.use(express.static('public'))

        // CORS
        this.app.use(cors())

        // BODY PARSER
        this.app.use(express.json())

        // FILE UPLOAD
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes(){
        this.app.use('', require('../routes/index.routes'))
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en ${ this.port }`);
        })
    }

}

module.exports = Server