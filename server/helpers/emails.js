const { convertPugFile } = require('./pug');
const { createTransport } = require('nodemailer');
const logger = require('./winston');
const transporter = createTransport({
    host: process.env.AWS_SES_HOST,
    port: parseInt(process.env.AWS_SES_PORT),
    secure: false,
    auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASSWORD
    }
});
const urlsImages = {
    logo: 'https://firebasestorage.googleapis.com/v0/b/titanapp-1515b.appspot.com/o/logo.png?alt=media&token=2efe9e5a-99d0-40a0-b2c9-cf00f9ac0cc1'
};

const emailForgotPassword = async (data) => {
    try {
        data.imagesEmail = urlsImages;
        const pug = convertPugFile('emails/emailForgotPassword.pug', data);
        const mailOptions = {
            to: data.email,
            subject: 'Recuperar contraseña',
            html: pug.html
        };
        const send = await sendMail(mailOptions);
        return send;
    } catch (error) {
        logger.log({ level: 'error', message: error.message, functionName: 'emailForgotPassword', data });
        return { code: 500, error: 'Lo sentimos, pero ocurrió un error al intentar enviar el email.' };
    }
};

const emailUpdatePassword = async (data) => {
    try {
        data.imagesEmail = urlsImages;
        const pug = convertPugFile('emails/emailUpdatePassword.pug', data);
        const mailOptions = {
            to: data.user.email,
            subject: 'Contraseña actualizada',
            html: pug.html
        };
        sendMail(mailOptions);
    } catch (error) {
        logger.log({ level: 'error', message: error.message, functionName: 'emailUpdatePassword', data });
    }
};

const emailTotalVisitsEachMonth = async (data) => {
    try {
        data.imagesEmail = urlsImages;
        const pug = convertPugFile('emails/emailTotalVisitsEachMonth.pug', data);
        const superAdmins = data.superAdmins.map(item => item.email);
        const mailOptions = {
            to: superAdmins,
            subject: 'Total de visitas',
            html: pug.html
        };
        sendMail(mailOptions);
    } catch (error) {
        logger.log({ level: 'error', message: error.message, functionName: 'emailTotalVisitsEachMonth', data });
    }
};

const sendMail = async (mailOptions) => {
    try {
        mailOptions.from = '"Representaciones Artísticas no-reply@kuneapp.com"';
        await transporter.sendMail(mailOptions);
        return { code: 200 };
    } catch (error) {
        logger.log({ level: 'error', message: error.message, functionName: 'sendMail', mailOptions });
        return { code: 500, error: 'Lo sentimos, pero ocurrió un error al intentar enviar el email.' };
    }
};

module.exports = {
    emailForgotPassword,
    emailUpdatePassword,
    emailTotalVisitsEachMonth
};