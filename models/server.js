const express = require('express')
var cors = require('cors')

class Server{

    constructor(){
        // EXPRESS
        this.app = express()

        // PORT
        this.port = process.env.PORT

        // MIDDLEWARES
        this.middlewares()

        // ROUTES
        this.usersRoutePath = '/api/users'
        this.routes()
    }

    middlewares(){
        // PUBLIC FOLDER
        this.app.use(express.static('public'))

        // CORS
        this.app.use(cors())

        // BODY PARSER
        this.app.use(express.json())

    }

    routes(){
        this.app.use(this.usersRoutePath, require('../routes/users.routes'))
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log(`Servidor corriendo en ${ this.port }`);
        })
    }

}

module.exports = Server