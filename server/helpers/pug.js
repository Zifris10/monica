const { renderFile } = require('pug');
const path = require('path');

const convertPugFile = (filePath, data = {}) => {
    try {
        const html = renderFile(path.resolve(__dirname, `../../views/${filePath}`), data);
        return { code: 200, html };
    } catch (error) {
        return { code: 500, error: 'Oops, lo sentimos pero no hemos logrado renderizar la vista.' };
    }
};

module.exports = {
    convertPugFile
};