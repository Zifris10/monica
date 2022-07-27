'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Generales', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true
            },
            urlFacebook: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            nameFacebook: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            urlInstagram: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            nameInstagram: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            urlTwitter: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            nameTwitter: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            urlYoutube: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            nameYoutube: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            urlTiktok: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            nameTiktok: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            whatsappContact: {
                type: Sequelize.STRING(11),
                allowNull: false
            },
            nameContact: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            emailContact: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            welcome: {
                type: Sequelize.STRING(4000),
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        }, {
            schema: 'monica'
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable({
            schema: 'monica',
            tableName: 'Generales'
        });
    }
};