const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../config/sequelize');

const Artistas = dbSequelize.define('Artistas', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    order: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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

module.exports = Artistas;