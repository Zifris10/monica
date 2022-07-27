const cron = require('node-cron');
const { Op } = require('sequelize');
const { visitCount } = require('../controllers/visitsController');
const { superAdminGetAll } = require('../controllers/superAdminsController');
const { emailErrorQuery, emailTotalVisitsEachMonth } = require('../helpers/emails');

cron.schedule('0 10 1 * *', async () => {
    try {
        const actualDate = new Date();
        const month = actualDate.getMonth() || 12;
        let year = actualDate.getFullYear();
        if(month === 12) year--;
        const dateStart = `${year}-${String(month).padStart(2, '0')}-01`;
        const getDateEnd = new Date(year, month, 0);
        const dateEnd = `${year}-${String(month).padStart(2, '0')}-${getDateEnd.getDate()}`;
        const dataVisits = {
            where: {
                createdAt: {
                    [Op.between]: [dateStart, dateEnd]
                }
            }
        };
        const getVisits = await visitCount(dataVisits);
        if(getVisits.code === 200) {
            const getSuperAdmins = await superAdminGetAll();
            if(getSuperAdmins.code === 200) {
                const dataEmail = {
                    superAdmins: getSuperAdmins.data,
                    total: getVisits.total,
                    month,
                    year
                };
                emailTotalVisitsEachMonth(dataEmail);
            }
        }
    } catch (error) {
        emailErrorQuery('Cron job', 'values', error.message);
    }
});