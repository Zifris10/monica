const { convertPugFile } = require('../helpers/pug');

const loginViewSuperAdmin = (req, res) => {
    try {
        const pug = convertPugFile('index.pug');
        res.status(200).send(pug.html);
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al intentar renderizar el archivo.' });
    }
};

module.exports = {
    loginViewSuperAdmin
};