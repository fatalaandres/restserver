const path = require('path')
const { v4: uuidv4 } = require('uuid')

const uploadFile = (files, validExt, type = '') =>{

    return new Promise((resolve, reject)=>{

        if (!files || Object.keys(files).length === 0) {
            return reject('No se seleccionaron archivos.')
        }

        if (!files.uploadFile) {
            return reject('No se seleccionaron archivos.')
        }

        // console.log('files >>>', files);

        // sampleFile = files.uploadFile;
        const { uploadFile } = files;

        const splitName = uploadFile.name.split('.')
        const ext = splitName[splitName.length -1]

        if(!validExt.includes(ext)){
            return reject(`La extensión ${ext} no es permitida. Las permitidas son ${validExt}`)
        }

        const uuid = uuidv4()
        const tempName = `${uuid}.${ext}`

        // uploadPath = path.join(__dirname , '../uploads/' , uploadFile.name);
        let uploadPath = path.join(__dirname , '../uploads/' , type, tempName);

        uploadFile.mv(uploadPath, (err)=> {
            if (err) {
                return reject(err)
            }

            resolve(tempName)
        });

    })
}

module.exports = {
    uploadFile
}