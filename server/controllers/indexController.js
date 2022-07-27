const { convertPugFile } = require('../helpers/pug');
const { validateEmpty, validateEmail } = require('../helpers/validations');
const { tokensGenerateNew, tokensVerifyExpireForgotPassword } = require('../helpers/jwt');
const { comparePasswordBcrypt } = require('../helpers/bcrypt');
const { usersFindOne } = require('./usersController');
const { superAdminFindOne } = require('./superAdminsController');
const { generalsFindOne } = require('./generalsController');
const { artistsFindAll } = require('./artistsController');
const { multimediaFindAll } = require('./multimediaController');

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
                const dataSuperAdmin = {
                    where: {
                        idUser: getUser.user.id,
                        deleted: false
                    },
                    attributes: ['id']
                };
                const getSuperAdmin = await superAdminFindOne(dataSuperAdmin);
                if(getSuperAdmin.code === 200) {
                    const dataToken = {
                        idUser: getUser.user.id
                    };
                    const token = tokensGenerateNew(dataToken, '24h');
                    res.status(200).send({ code: 200, token });
                } else {
                    res.status(getSuperAdmin.code).send(getSuperAdmin);
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

const viewPrincipal = async (req, res) => {
    try {
        const dataGenerals = {
            attributes: ['urlFacebook', 'nameFacebook', 'urlInstagram', 'nameInstagram', 'urlTwitter', 'nameTwitter', 'urlYoutube', 'nameYoutube', 'urlTiktok', 'nameTiktok', 'whatsappContact', 'nameContact', 'emailContact', 'welcome'],
            where: {
                id: 'b85a5ae0-a16a-403b-9ad7-8704bea8080e'
            }
        };
        const dataArtists = {
            attributes: ['name', 'image'],
            where: {
                deleted: false,
                visible: true
            },
            order: [
                ['order', 'ASC']
            ]
        };
        const dataMultimedia = {
            attributes: ['image'],
            where: {
                deleted: false
            },
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 50
        };
        const [ getGenerals, getArtists, getMultimedia ] = await Promise.all([
            generalsFindOne(dataGenerals),
            artistsFindAll(dataArtists),
            multimediaFindAll(dataMultimedia)
        ]);
        const dataPug = {
            generals: getGenerals.generals,
            artists: getArtists.artists,
            multimedia: getMultimedia.multimedia
        };
        const pug = convertPugFile('principal.pug', dataPug);
        res.status(200).send(pug.html);
    } catch (error) {
        res.status(500).send({ code: 500, error: 'Ocurrió un error interno en el servidor.' });
    }
};

module.exports = {
    superAdminLogin,
    verifyTokenForgotPassword,
    viewPrincipal
};