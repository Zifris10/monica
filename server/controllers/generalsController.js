const Generales = require('../models/Generales');
const { validateEmpty } = require('../helpers/validations');
const { convertPugFile } = require('../helpers/pug');

const generalsSuperAdminRender = async (req, res) => {
    try {
        const dataGenerals = {
            attributes: ['urlFacebook', 'nameFacebook', 'urlInstagram', 'nameInstagram', 'urlTwitter', 'nameTwitter', 'urlYoutube', 'nameYoutube', 'urlTiktok', 'nameTiktok', 'whatsappContact', 'nameContact', 'emailContact', 'welcome'],
            where: {
                id: 'b85a5ae0-a16a-403b-9ad7-8704bea8080e'
            }
        };
        const getGenerals = await generalsFindOne(dataGenerals);
        if(getGenerals.code === 200) {
            const pug = convertPugFile('superAdmin/generales/index.pug', getGenerals);
            res.status(pug.code).send(pug);
        } else {
            res.status(getGenerals.code).send(getGenerals);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const generalsSuperAdminUpdate = async (req, res) => {
    try {
        const { value, field } = req.body;
        if(validateEmpty(field) === false) return res.status(400).send({ code: 400, error: 'El nombre del campo no puede estar vacío.' });
        const data = {
            [field]: value || null
        };
        const where = {
            where: {
                id: 'b85a5ae0-a16a-403b-9ad7-8704bea8080e'
            }
        };
        const update = await generalsUpdate(data, where);
        res.status(update.code).send(update);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const generalsUpdate = async (data, where) => {
    try {
        const update = await Generales.update(data, where);
        if(update && update.length && update[0] > 0) return { code: 200 };
        return { code: 400, error: 'Ocurrió un error al intentar actualizar la información general.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const generalsFindOne = async (data) => {
    try {
        const generals = await Generales.findOne(data);
        if(generals) return { code: 200, generals };
        return { code: 404, error: 'Ocurrió un error al intentar obtener los generales.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    generalsSuperAdminRender,
    generalsSuperAdminUpdate
};