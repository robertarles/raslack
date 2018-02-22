'use strict';
const fs = require('fs');
const {
    log
} = require('./logger');
// this will be the channel and webhook pulled from the config based on the channel chosen
let slackAccount = undefined;
let slackChannel = undefined;
/**
 * read config from file and command line args
 */
function loadConfig(raslackConfigFilePath, channel) {
    // load the config file, or log an error and quit
    let config;
    try {
        config = JSON.parse(fs.readFileSync(raslackConfigFilePath).toString());
    } catch (e) {
        log.error(`Caught an error trying to open and parse your config file at ${raslackConfigFilePath}`);
        log.error(e);
        process.exit(-1);
    }
    // load the account passed via cmd line param, or load the first in the config
    try {
        [config.slackAccount, config.slackChannel] = channel.split('.') || config.default_channel;
    } catch (e) {
        log.error(`Caught an error trying to set a Slack channel for posting.`);
        log.error(e);
        process.exit(-1);
    }
    // get the webhook for the chosen channel
    try {
        config.webhook = config.accounts[config.slackAccount].channels[config.slackChannel];
    } catch (e) {
        log.error(`Caught an exception trying to get the webhook for channel ${config.slackChannel}`);
        log.error(e);
        process.exit(-1);
    }
    return config;
}

exports.loadConfig = loadConfig;