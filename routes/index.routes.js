const express = require('express')
const app = express()

app.use('/api', require('./api/index-api.routes'))

module.exports = app