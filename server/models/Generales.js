const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../config/sequelize');

const Generales = dbSequelize.define('Generales', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    urlFacebook: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    nameFacebook: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    urlInstagram: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    nameInstagram: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    urlTwitter: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    nameTwitter: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    urlYoutube: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    nameYoutube: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    urlTiktok: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
            isUrl: true,
            notEmpty: true
        }
    },
    nameTiktok: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    whatsappContact: {
        type: DataTypes.STRING(11),
        allowNull: false,
        validate: {
            notEmpty: true,
            isNumeric: true
        }
    },
    nameContact: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    emailContact: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    welcome: {
        type: DataTypes.STRING(4000),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    schema: 'monica'
});

module.exports = Generales;