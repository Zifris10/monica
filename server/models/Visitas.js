const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../config/sequelize');

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

module.exports = Visitas;