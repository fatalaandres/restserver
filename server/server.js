require('./config/config')

const express = require('express')
const app = express()
const path = require('path')

// Using Node.js `require()`
const mongoose = require('mongoose');

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// app.get('/', function (req, res) {
//     res.json('Hello World')
// })

app.use(express.static(path.resolve(__dirname, '../public')))

// ROUTES
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {
    if(err){
        throw err
    }else{
        console.log("Base de datos online");
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
})