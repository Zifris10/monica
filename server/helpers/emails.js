const { convertPugFile } = require('./pug');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
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

const emailErrorQuery = (query, values, error) => {
    const mailOptions = {
        to: 'eduardom362@gmail.com',
        subject: 'Error en Representaciones Artísticas.',
        html: `<p style="font-size: 18px; font-weight: bold;">
        Consulta SQL: ${query}
        <br>
        <br>
        Valores SQL: ${values}
        <br>
        <br>
        Error SQL: ${error}
        </p>`
    };
    sendMail(mailOptions);
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
        const send = await sendMail(mailOptions);
        return send;
    } catch (error) {
        return { code: 500, error: 'Lo sentimos, pero ocurrió un error al intentar enviar el email.' };
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
        const send = await sendMail(mailOptions);
        return send;
    } catch (error) {
        return { code: 500, error: 'Lo sentimos, pero ocurrió un error al intentar enviar el email.' };
    }
};

const sendMail = async (mailOptions) => {
    try {
        mailOptions.from = '"Representaciones Artísticas no-reply@kuneapp.com"';
        await transporter.sendMail(mailOptions);
        return { code: 200 };
    } catch (error) {
        return { code: 500, error: 'Lo sentimos, pero ocurrió un error al intentar enviar el email.' };
    }
};

module.exports = {
    emailErrorQuery,
    emailForgotPassword,
    emailUpdatePassword,
    emailTotalVisitsEachMonth
};