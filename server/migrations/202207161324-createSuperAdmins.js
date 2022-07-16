'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('SuperAdmins', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true
            },
            idUser: {
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
            tableName: 'SuperAdmins'
        });
    }
};