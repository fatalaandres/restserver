const mongoose = require('mongoose')

const dbConnection = async () => {

    try {
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });

        if(process.env.NODE_ENV !=='prod')
        {
            console.log('Base de datos local online');
        }else{
            console.log('Base de datos Mongo Atlas online');
        }

    } catch (error) {
        console.log(error);
        throw new Error('Error al conectarse a la base de datos')
    }
    
}

module.exports = {
    dbConnection
}