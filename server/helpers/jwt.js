const jwt = require('jsonwebtoken');
const { superAdminFindOne } = require('../controllers/superAdminsController');

const tokensGenerateNew = (data, expiresIn) => {
    const token = jwt.sign(data, process.env.JWT_SEED, {
        expiresIn
    });
    return token;
};

const tokensVerifyExpireForgotPassword = (token) => {
    try {
        const { idUser } = jwt.verify(token, process.env.JWT_SEED);
        return { code: 200, idUser };
    } catch (error) {
        return { code: 401 };
    }
};

const tokensVerifyExpireSuperAdmin = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const { idUser } = jwt.verify(authorization, process.env.JWT_SEED);
        const { usersFindOne } = require('../controllers/usersController');
        const dataSuperAdmin = {
            where: {
                idUser,
                deleted: false
            },
            attributes: ['id']
        };
        const dataUser = {
            where: {
                id: idUser,
                deleted: false
            },
            attributes: ['name', 'email']
        };
        const [ getSuperAdmin, getUser ] = await Promise.all([
            superAdminFindOne(dataSuperAdmin),
            usersFindOne(dataUser)
        ]);
        if(getSuperAdmin.code === 200 && getUser.code === 200) {
            const { user } = getUser;
            req.body.idSuperAdmin = idUser;
            req.body.emailSuperAdmin = user.email;
            req.body.nameSuperAdmin = user.name;
            next();
        } else {
            res.send({ code: 401 });
        }
    } catch (error) {
        res.send({ code: 401 });
    }
};

module.exports = {
    tokensGenerateNew,
    tokensVerifyExpireForgotPassword,
    tokensVerifyExpireSuperAdmin
};