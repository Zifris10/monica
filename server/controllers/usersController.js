const Usuarios = require('../models/Usuarios');
const { validateEmpty, validateEmail, validateNotEmptySpaces } = require('../helpers/validations');
const { tokensGenerateNew, tokensVerifyExpireForgotPassword } = require('../helpers/jwt');
const { emailForgotPassword, emailUpdatePassword } = require('../helpers/emails');
const { convertPasswordBcrypt } = require('../helpers/bcrypt');
const { firstLetterUpperCase, allLowerCaseLetters } = require('../helpers/upperLowerCase');

const usersSuperAdminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if(validateEmpty(email) === false) return res.status(400).send({ code: 400, error: 'El correo del usuario no puede estar vacío.' });
        if(validateEmail(email) === false) return res.status(400).send({ code: 400, error: 'El correo del usuario no tiene un formato válido de tipo correo.' });
        const dataUser = {
            where: {
                email,
                deleted: false
            },
            attributes: ['id', 'name']
        };
        const getUser = await usersFindOne(dataUser);
        if(getUser.code === 200) {
            const dataToken = {
                idUser: getUser.user.id
            };
            const token = tokensGenerateNew(dataToken, '1h');
            const mailData = {
                token,
                email,
                name: getUser.user.name
            };
            const sendMail = await emailForgotPassword(mailData);
            res.status(sendMail.code).send(sendMail);
        } else {
            res.status(getUser.code).send(getUser);
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const usersSuperAdminUpdatePassword = async (req, res) => {
    try {
        const { password, token } = req.body;
        if(validateEmpty(password) === false) return res.status(400).send({ code: 400, error: 'La contraseña no puede estar vacía.' });
        if(validateNotEmptySpaces(password) === false) return res.status(400).send({ code: 400, error: 'La contraseña del usuario no debe tener espacios.' });
        const verifyToken = tokensVerifyExpireForgotPassword(token);
        if(verifyToken.code === 200) {
            const dataUser = {
                where: {
                    id: verifyToken.idUser,
                    deleted: false
                },
                attributes: ['name', 'email']
            };
            const getUser = await usersFindOne(dataUser);
            if(getUser.code === 200) {
                const passwordBcrypt = convertPasswordBcrypt(password);
                const data = {
                    password: passwordBcrypt
                };
                const where = {
                    where: {
                        id: verifyToken.idUser
                    }
                };
                const update = await usersUpdate(data, where);
                if(update.code === 200) {
                    emailUpdatePassword({ user: getUser.user });
                    const dataToken = {
                        idUser: verifyToken.idUser
                    };
                    const token = tokensGenerateNew(dataToken, '24h');
                    res.status(200).send({ code: 200, token });
                } else {
                    res.status(update.code).send(update);
                }
            } else {
                res.status(getUser.code).send(getUser);
            }
        } else {
            res.status(401).send({ code: 401, error: 'Oops, parece que el token para actualizar tu contraseña ha vencido. Por favor vuelve a enviarte un correo nuevo para actualizar tu contraseña.'});
        }
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const usersSuperAdminGet = async (req, res) => {
    try {
        const { emailSuperAdmin, nameSuperAdmin } = req.body;
        res.status(200).send({ code: 200, email: emailSuperAdmin, name: nameSuperAdmin });
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

const usersSuperAdminUpdate = async (req, res) => {
    try {
        const { idSuperAdmin, name, email } = req.body;
        if(validateEmpty(name) === false) return res.status(400).send({ code: 400, error: 'El nombre no puede estar vacío.' });
        if(validateEmpty(email) === false) return res.status(400).send({ code: 400, error: 'El correo no puede estar vacío.' });
        if(validateEmail(email) === false) return res.status(400).send({ code: 400, error: 'El correo no tiene un formato válido de tipo correo.' });
        const nameUser = firstLetterUpperCase(name);
        const emailUser = allLowerCaseLetters(email);
        const data = {
            name: nameUser,
            email: emailUser
        };
        const where = {
            where: {
                id: idSuperAdmin
            }
        };
        const update = await usersUpdate(data, where);
        res.status(update.code).send(update);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor de Kune.' });
    }
};

const usersFindOne = async (data) => {
    try {
        const user = await Usuarios.findOne(data);
        if(user) return { code: 200, user };
        return { code: 404, error: 'Lo sentimos pero no hemos logrado encontrar el usuario.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

const usersUpdate = async (data, where) => {
    try {
        const user = await Usuarios.update(data, where);
        if(user && user.length && user[0] > 0) return { code: 200 };
        return { code: 400, error: 'Ocurrió un error al intentar actualizar la información del usuario.' };
    } catch (error) {
        return { code: 500, error: 'Ocurrió un error interno en el servidor.' };
    }
};

module.exports = {
    usersFindOne,
    usersSuperAdminForgotPassword,
    usersSuperAdminUpdatePassword,
    usersSuperAdminGet,
    usersSuperAdminUpdate
};