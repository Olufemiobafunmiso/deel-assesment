

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, errors, printf, json } = format;


const logger = createLogger({

    transports: [
        new transports.File({
            filename: 'logs/log.log',
            format: combine(
                errors({
                    stack: true
                }),
                timestamp(),
                json(),
            )
        }),
    ]
})

module.exports = {logger}