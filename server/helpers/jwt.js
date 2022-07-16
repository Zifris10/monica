const jwt = require('jsonwebtoken');

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
        const { superAdminsFindOne } = require('../controllers/superAdminsController');
        const { authorization } = req.headers;
        const { idUser } = jwt.verify(authorization, process.env.JWT_SEED);
        const dataSuperAdmin = {
            where: {
                idUser,
                deleted: false
            },
            attributes: ['id']
        };
        const getSuperAdmin = await superAdminsFindOne(dataSuperAdmin);
        if(getSuperAdmin.code === 200) {
            req.body.idSuperAdmin = idUser;
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