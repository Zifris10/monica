const { convertPugFile } = require('../helpers/pug');
const { validateEmpty, validateEmail } = require('../helpers/validations');
const { tokensGenerateNew, tokensVerifyExpireForgotPassword } = require('../helpers/jwt');
const { comparePasswordBcrypt } = require('../helpers/bcrypt');
const { usersFindOne } = require('./usersController');

const loginViewSuperAdmin = (req, res) => {
    try {
        const pug = convertPugFile('index.pug');
        res.status(200).send(pug.html);
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al intentar renderizar el archivo.' });
    }
};

const verifyTokenForgotPassword = (req, res) => {
    try {
        const { token } = req.query;
        const verifyToken = tokensVerifyExpireForgotPassword(token);
        const pug = convertPugFile('forgotPassword.pug', verifyToken);
        res.status(200).send(pug.html);
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al intentar renderizar el archivo.' });
    }
};

const superAdminLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        if(validateEmpty(email) === false) return res.status(400).send({ code: 400, error: 'El correo del usuario no puede estar vacío.' });
        if(validateEmail(email) === false) return res.status(400).send({ code: 400, error: 'El correo del usuario no tiene un formato válido de tipo correo.' });
        if(validateEmpty(password) === false) return res.status(400).send({ code: 400, error: 'La contraseña del usuario no puede estar vacía.' });
        const dataUser = {
            where: {
                email,
                deleted: false
            },
            attributes: ['id', 'password']
        };
        const getUser = await usersFindOne(dataUser);
        if(getUser.code === 200) {
            const comparePasswords = comparePasswordBcrypt(password, getUser.user.password);
            if(comparePasswords.code === 200) {
                const getCondominiums = await administratorsGetCondominiums(getUser.user.id);
                if(getCondominiums.code === 200 && getCondominiums.data.length) {
                    const dataToken = {
                        idUser: getUser.user.id
                    };
                    const token = tokensGenerateNew(dataToken, '24h');
                    res.status(token.code).send(token);
                } else {
                    res.status(401).send({ code: 401, error: 'No tienes permisos para ingresar a este sistema.' });
                }
            } else {
                res.status(comparePasswords.code).send(comparePasswords);
            }
        } else {
            res.status(getUser.code).send(getUser);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

module.exports = {
    loginViewSuperAdmin,
    superAdminLogin,
    verifyTokenForgotPassword
};