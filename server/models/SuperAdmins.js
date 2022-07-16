const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../../config/database');

const SuperAdmins = dbSequelize.define('SuperAdmins', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    idUser: {
        type: DataTypes.UUID,
        allowNull: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    deletedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    schema: 'monica'
});

module.exports = SuperAdmins;