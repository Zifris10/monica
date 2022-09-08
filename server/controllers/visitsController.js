const { visitCreate } = require('../models/Visitas');

const visitsUserAdd = async (req, res) => {
    try {
        const { code } = await visitCreate();
        res.status(code).send({ code });
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};



module.exports = {
    visitsUserAdd
};