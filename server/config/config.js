// PUERTO //

process.env.PORT = process.env.PORT || 3000

// ENTORNO //

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// CADUCIDAD TOKEN //

process.env.CADUCIDAD_TOKEN = '48h'

// SEED TOKEN //

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// BASE DE DATOS //

let urlDB

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

// GOOGLE CLIENT ID

process.env.CLIENT_ID = process.env.CLIENT_ID || '668168938316-o20fel6jd4liicdshkoifg5kn23kqf7b.apps.googleusercontent.com'