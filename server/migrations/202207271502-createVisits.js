'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Visitas', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true
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
            tableName: 'Visitas'
        });
    }
};