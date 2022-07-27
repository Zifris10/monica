const Visitas = require('../models/Visitas');

const visitsUserAdd = async (req, res) => {
    try {
        const { code } = await visitCreate();
        res.status(code).send({ code });
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const visitCount = async (data) => {
    try {
        const total = await Visitas.count(data);
        return { code: 200, total };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const visitCreate = async () => {
    try {
        const visit = await Visitas.create();
        if(visit.id) return { code: 200, visit };
        return { code: 400, error: 'Ocurrió un error al intentar agregar la visita.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    visitsUserAdd,
    visitCount
};