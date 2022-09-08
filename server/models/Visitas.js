const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../config/sequelize');
const logger = require('../helpers/winston');

const Visitas = dbSequelize.define('Visitas', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    }
}, {
    schema: 'monica'
});

const visitCount = async (data) => {
    try {
        const total = await Visitas.count(data);
        return { code: 200, total };
    } catch (error) {
        logger.log({ level: 'error', message: error.message, functionName: 'visitCount', data });
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const visitCreate = async () => {
    try {
        const visit = await Visitas.create();
        if(visit.id) return { code: 200, visit };
        return { code: 400, error: 'Ocurrió un error al intentar agregar la visita.' };
    } catch (error) {
        logger.log({ level: 'error', message: error.message, functionName: 'visitCreate' });
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    visitCount,
    visitCreate
};