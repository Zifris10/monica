const { hashSync, compareSync } = require('bcrypt');

const convertPasswordBcrypt = (password) => {
    const newPassword = hashSync(password, 10);
    return newPassword;
};

const comparePasswordBcrypt = (password1, password2) => {
    try {
        let code = 401;
        if(compareSync(password1, password2)) code = 200;
        return { code, error: 'Oops, parece que la contraseña ingresada es incorrecta.' };
    } catch (error) {
        return { code: 500, error: 'Lo sentimos, pero ocurrió un error al intentar verificar tu contraseña.' };
    }
};

module.exports = {
    convertPasswordBcrypt,
    comparePasswordBcrypt
};