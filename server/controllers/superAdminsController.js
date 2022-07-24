const SuperAdmins = require('../models/SuperAdmins');
const { convertPugFile } = require('../helpers/pug');

const superAdminLoginView = (req, res) => {
    try {
        const pug = convertPugFile('index.pug');
        res.status(200).send(pug.html);
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al intentar renderizar el archivo.' });
    }
};

const superAdminDashboard = (req, res) => {
    try {
        const pug = convertPugFile('superAdmin/index.pug');
        res.status(pug.code).send(pug.html);
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al intentar renderizar el archivo.' });
    }
};

const superAdminFindOne = async (data) => {
    try {
        const superAdmin = await SuperAdmins.findOne(data);
        if(superAdmin) return { code: 200, superAdmin };
        return { code: 404, error: 'Lo sentimos pero este usuario no tiene permisos para ingresar a este sistema.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    superAdminLoginView,
    superAdminFindOne,
    superAdminDashboard
};