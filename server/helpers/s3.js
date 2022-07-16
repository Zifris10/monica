const { S3 } = require('aws-sdk');
const s3Config = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
});

const getExtensionFile = (fileName) => {
    const splitName = fileName.split('.');
    const extension = splitName[splitName.length - 1];
    return extension.toLowerCase();
};

const uploadFileS3 = (filePath, content) => {
    return new Promise((resolve, reject) => {
        const parameters = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
            Body: content.data,
            ACL: process.env.AWS_S3_ACL
        };
        s3Config.upload(parameters, (error, response) => {
            if (error) {
                reject({ code: 500, error: 'Ocurrió un error al intentar guardar el archivo en el repositorio S3 de Amazon.' });
            } else {
                resolve({ code: 200, url: response.Location });
            }
        });
    });
};

module.exports = {
    getExtensionFile,
    uploadFileS3
};