if (process.env.NODE_ENV !== 'prod') {
    require('dotenv').config();
}

const Server = require('./models/Server')

const server = new Server()

server.listen()