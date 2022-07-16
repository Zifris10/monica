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
    avidosLogo: 'https://kuneapp.s3.us-west-1.amazonaws.com/emails/logoAvidos.png',
    kuneLogo: 'https://kuneapp.s3.us-west-1.amazonaws.com/emails/logoKune.png',
    android: 'https://kuneapp.s3.us-west-1.amazonaws.com/emails/android.png',
    ios: 'https://kuneapp.s3.us-west-1.amazonaws.com/emails/ios.png'
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
    emailForgotPassword
};