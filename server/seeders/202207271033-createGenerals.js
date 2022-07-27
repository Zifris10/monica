'use strict';
const data = require('./data/202207271033-createGenerals.json');
module.exports = {
    async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert({
            schema: 'monica',
            tableName: 'Generales'
        }, data);
    },
    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete({
            schema: 'monica',
            tableName: 'Generales'
        }, data);
    }
};