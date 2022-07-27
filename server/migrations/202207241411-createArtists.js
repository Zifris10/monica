'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Artistas', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            image: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            visible: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            createdBy: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Usuarios',
                        schema: 'monica'
                    },
                    key: 'id'
                }
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            deletedBy: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: {
                        tableName: 'Usuarios',
                        schema: 'monica'
                    },
                    key: 'id'
                }
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
            tableName: 'Artistas'
        });
    }
};