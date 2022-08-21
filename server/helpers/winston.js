const { createLogger, transports, format } = require('winston');
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' })
    ]
});

module.exports = logger;