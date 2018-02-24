'use strict';
const fs = require('fs');
const log = require('./log');
// this will be the channel and webhook pulled from the config based on the channel chosen
let slackAccount = undefined;
let slackChannel = undefined;
/**
 * read config from file and command line args
 */
function load(raslackConfigFilePath, channel) {
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
        if (channel) {
            [config.slackAccount, config.slackChannel] = channel.split('.')
        } else {
            [config.slackAccount, config.slackChannel] = config.default_channel.split('.');
        }
    } catch (e) {
        log.error(`Caught an error trying to set a Slack channel for posting.`);
        log.error(e);
        process.exit(-1);
    }
    // get the webhook for the chosen channel
    try {
        // if there is an account specified, but not a channel, try for a default channel from the config
        if (!config.SlackChannel) {
            config.slackChannel = config.accounts[config.slackAccount].default_channel;
        }
        config.webhook = config.accounts[config.slackAccount].channels[config.slackChannel];
    } catch (e) {
        log.error(`Caught an exception trying to get the webhook for channel ${config.slackChannel}`);
        log.error(e);
        process.exit(-1);
    }
    // set the 'post as' username. this is NOT a login, just a chat handle
    if (config.accounts[config.slackAccount].username) {
        config.username = config.accounts[config.slackAccount].username;
    }
    // set the icon/avatar to use for posting
    if (config.accounts[config.slackAccount].icon_emoji) {
        config.icon_emoji = config.accounts[config.slackAccount].icon_emoji;
    }
    return config;
}

exports.load = load;