const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../config/sequelize');

const Multimedia = dbSequelize.define('Multimedia', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    imageVideo: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deletedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    schema: 'monica'
});

module.exports = Multimedia;