const Artistas = require('../models/Artistas');
const { validateEmpty, validateImage, validateFileWeight, validateArray } = require('../helpers/validations');
const { firstLetterUpperCase } = require('../helpers/upperLowerCase');
const { convertPugFile } = require('../helpers/pug');
const { getExtensionFile, uploadFileS3 } = require('../helpers/s3');
const { databaseTransaction } = require('../helpers/postgresql');

const artistsSuperAdminRender = async (req, res) => {
    try {
        const dataArtists = {
            attributes: ['id', 'name', 'image', 'visible'],
            where: {
                deleted: false
            },
            order: [
                ['order', 'ASC']
            ]
        };
        const getArtists = await artistsFindAll(dataArtists);
        if(getArtists.code === 200) {
            const pug = convertPugFile('superAdmin/artists/index.pug', getArtists);
            res.status(pug.code).send(pug);
        } else {
            res.status(getArtists.code).send(getArtists);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const artistsSuperAdminAdd = async (req, res) => {
    try {
        const { name, idSuperAdmin } = req.body;
        const { image } = req.files;
        if(validateEmpty(name) === false) return res.status(400).send({ code: 400, error: 'Debes seleccionar por lo menos un subcondominio.' });
        if(validateEmpty(image.name) === false) return res.status(400).send({ code: 400, error: 'La imagen no puede estar vacía.' });
        const fileExtension = getExtensionFile(image.name);
        if(validateImage(fileExtension) === false) return res.status(400).send({ code: 400, error: 'Solo se permite subir archivos de tipo imagen.' });
        if(validateFileWeight(image.size, 1000000) === false) return res.status(400).send({ code: 400, error: 'La imagen excede el límite de peso permitido.' });
        const filePath = `monica/${Date.now()}.${fileExtension}`;
        const fileUpload = await uploadFileS3(filePath, image);
        if(fileUpload.code === 200) {
            const getTotal = await artistsCount();
            if(getTotal.code === 200) {
                const nameArtists = firstLetterUpperCase(name);
                const data = {
                    name: nameArtists,
                    order: getTotal.total + 1,
                    image: fileUpload.url,
                    createdBy: idSuperAdmin
                };
                const create = await artistsCreate(data);
                res.status(create.code).send(create);
            } else {
                res.status(getTotal.code).send(getTotal);
            }
        } else {
            res.status(fileUpload.code).send(fileUpload);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const artistsSuperAdminUpdate = async (req, res) => {
    try {
        const { idArtists, value, field } = req.body;
        if(validateEmpty(idArtists) === false) return res.status(400).send({ code: 400, error: 'El id del artísta no puede estar vacío.' });
        if(validateEmpty(field) === false) return res.status(400).send({ code: 400, error: 'El nombre del campo no puede estar vacío.' });
        if(field === 'name') {
            if(validateEmpty(value) === false) return res.status(400).send({ code: 400, error: 'El nombre del artísta no puede estar vacío.' });
        }
        const data = {
            [field]: value
        };
        const where = {
            where: {
                id: idArtists,
                deleted: false
            }
        };
        const update = await artistsUpdate(data, where);
        res.status(update.code).send(update);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor de Kune.' });
    }
};

const artistsSuperAdminDelete = async (req, res) => {
    try {
        const { idArtists, idSuperAdmin } = req.body;
        if(validateEmpty(idArtists) === false) return res.status(400).send({ code: 400, error: 'El id del artísta no puede estar vacío.' });
        const data = {
            deleted: true,
            deletedBy: idSuperAdmin
        };
        const where = {
            where: {
                id: idArtists
            }
        };
        const update = await artistsUpdate(data, where);
        res.status(update.code).send(update);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor de Kune.' });
    }
};

const artistsSuperAdminUpdateImage = async (req, res) => {
    try {
        const { idArtists } = req.body;
        const { image } = req.files;
        if(validateEmpty(idArtists) === false) return res.status(400).send({ code: 400, error: 'El id de la categoría no puede estar vacío.' });
        if(validateEmpty(image.name) === false) return res.status(400).send({ code: 400, error: 'La imagen no puede estar vacía.' });
        const fileExtension = getExtensionFile(image.name);
        if(validateImage(fileExtension) === false) return res.status(400).send({ code: 400, error: 'Solo se permite subir archivos de tipo imagen.' });
        if(validateFileWeight(image.size, 1000000) === false) return res.status(400).send({ code: 400, error: 'La imagen excede el límite de peso permitido.' });
        const filePath = `monica/${Date.now()}.${fileExtension}`;
        const fileUpload = await uploadFileS3(filePath, image);
        if(fileUpload.code === 200) {
            const data = {
                image: fileUpload.url
            };
            const where = {
                where: {
                    id: idArtists,
                    deleted: false
                }
            };
            const update = await artistsUpdate(data, where);
            if(update.code === 200) {
                res.status(update.code).send({ code: update.code, url: fileUpload.url });
            } else {
                res.status(update.code).send(update);
            }
        } else {
            res.status(fileUpload.code).send(fileUpload);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor de Kune.' });
    }
};

const artistsSuperAdminUpdateOrder = async (req, res) => {
    try {
        const { array } = req.body;
        if(validateArray(array) === false) return res.status(400).send({ code: 400, error: 'El arreglo de artístas no puede estar vacío.' });
        let queryTransaction = [];
        let valuesTransaction = [];
        array.forEach(artist => {
            queryTransaction.push('UPDATE monica."Artistas" SET "order" = $1 WHERE "id" = $2');
            valuesTransaction.push([artist.order, artist.idArtists]);
        });
        const transaction = await databaseTransaction(queryTransaction, valuesTransaction);
        res.status(transaction.code).send(transaction);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor de Kune.' });
    }
};

const artistsFindAll = async (data) => {
    try {
        const artists = await Artistas.findAll(data);
        if(artists) return { code: 200, artists };
        return { code: 404, error: 'Ocurrió un error al intentar obtener los artístas.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const artistsCreate = async (data) => {
    try {
        const artist = await Artistas.create(data);
        if(artist.id) return { code: 200, artist };
        return { code: 400, error: 'Ocurrió un error al intentar agregar el artísta.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const artistsCount = async () => {
    try {
        const total = await Artistas.count();
        return { code: 200, total };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const artistsUpdate = async (data, where) => {
    try {
        const update = await Artistas.update(data, where);
        if(update && update.length && update[0] > 0) return { code: 200 };
        return { code: 400, error: 'Ocurrió un error al intentar actualizar la información del artísta.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    artistsSuperAdminRender,
    artistsSuperAdminAdd,
    artistsSuperAdminUpdate,
    artistsSuperAdminDelete,
    artistsSuperAdminUpdateImage,
    artistsSuperAdminUpdateOrder
};