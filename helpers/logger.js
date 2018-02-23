'use strict';
const winston = require('winston');

const defaultFormat = winston.format.printf(info => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label(),
        winston.format.timestamp(),
        winston.format.colorize({
            level: true
        }),
        defaultFormat),
    level: 'info',
    exitOnError: false,
    transports: [
        new winston.transports.Console()
    ]
});

exports.log = logger;