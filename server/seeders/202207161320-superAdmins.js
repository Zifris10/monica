'use strict';
const data = require('./data/202207161320-superAdmins.json');
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert({
            schema: 'monica',
            tableName: 'SuperAdmins'
        }, data);
    },
    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete({
            schema: 'monica',
            tableName: 'SuperAdmins'
        }, data);
    }
};