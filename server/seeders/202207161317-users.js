'use strict';
const data = require('./data/202207161317-users.json');
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert({
            schema: 'monica',
            tableName: 'Usuarios'
        }, data);
    },
    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete({
            schema: 'monica',
            tableName: 'Usuarios'
        }, data);
    }
};