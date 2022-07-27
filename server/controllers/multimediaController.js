const Multimedia = require('../models/Multimedia');
const { validateEmpty, validateFileWeight, validateImage } = require('../helpers/validations');
const { convertPugFile } = require('../helpers/pug');
const { getExtensionFile, uploadFileS3 } = require('../helpers/s3');

const multimediaSuperAdminRender = async (req, res) => {
    try {
        const dataMultimedia = {
            attributes: ['id', 'imageVideo'],
            where: {
                deleted: false
            },
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
        const getMultimedia = await multimediaFindAll(dataMultimedia);
        if(getMultimedia.code === 200) {
            const pug = convertPugFile('superAdmin/multimedia/index.pug', getMultimedia);
            res.status(pug.code).send(pug);
        } else {
            res.status(getMultimedia.code).send(getMultimedia);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const multimediaSuperAdminAdd = async (req, res) => {
    try {
        const { idSuperAdmin } = req.body;
        const { image } = req.files;
        if(validateEmpty(image.name) === false) return res.status(400).send({ code: 400, error: 'La imagen no puede estar vacía.' });
        const fileExtension = getExtensionFile(image.name);
        if(validateImage(fileExtension) === false) return res.status(400).send({ code: 400, error: 'Solo se permite subir archivos de tipo imagen.' });
        if(validateFileWeight(image.size, 1000000) === false) return res.status(400).send({ code: 400, error: 'La imagen excede el límite de peso permitido.' });
        const filePath = `monica/${Date.now()}.${fileExtension}`;
        const fileUpload = await uploadFileS3(filePath, image);
        if(fileUpload.code === 200) {
            const data = {
                imageVideo: fileUpload.url,
                createdBy: idSuperAdmin
            };
            const create = await multimediaCreate(data);
            res.status(create.code).send(create);
        } else {
            res.status(fileUpload.code).send(fileUpload);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const multimediaSuperAdminDelete = async (req, res) => {
    try {
        const { idMultimedia, idSuperAdmin } = req.body;
        if(validateEmpty(idMultimedia) === false) return res.status(400).send({ code: 400, error: 'El id de la imagen o video no puede estar vacío.' });
        const data = {
            deleted: true,
            deletedBy: idSuperAdmin
        };
        const where = {
            where: {
                id: idMultimedia
            }
        };
        const update = await multimediaUpdate(data, where);
        res.status(update.code).send(update);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const multimediaFindAll = async (data) => {
    try {
        const multimedia = await Multimedia.findAll(data);
        if(multimedia) return { code: 200, multimedia };
        return { code: 404, error: 'Ocurrió un error al intentar obtener las imagenes.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const multimediaCreate = async (data) => {
    try {
        const multimedia = await Multimedia.create(data);
        if(multimedia.id) return { code: 200, multimedia };
        return { code: 400, error: 'Ocurrió un error al intentar agregar la imagen.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const multimediaUpdate = async (data, where) => {
    try {
        const update = await Multimedia.update(data, where);
        if(update && update.length && update[0] > 0) return { code: 200 };
        return { code: 400, error: 'Ocurrió un error al intentar actualizar la información de la imagen.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    multimediaSuperAdminRender,
    multimediaSuperAdminAdd,
    multimediaSuperAdminDelete
};