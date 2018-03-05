'use strict';
const configLoader = require('./helpers/config-loader');
const log = require('./helpers/log');
const rp = require('request-promise');
const fs = require('fs');
const os = require('os');

// config to be used by this module. setup in or passed into createPostBody()
const configFilePath = `${os.homedir()}/.raslack/slackConfig.json`;
let config;

/**
 * Post to slack. post body is defined here https://api.slack.com/incoming-webhooks  
 * @param postBody a JSON object with *at least* a text property. All others optional 
 * and are defined in the config file.
 * 
 */
function post(postBody, cfg) {
    if (cfg) {
        config = cfg;
    }    // if no custom config was passed in, read the default config file
    if (!config) {
        config = configLoader.load(configFilePath, channel);
    }

    let fullPostbody = setPostBodyDefaults(postBody, cfg);
    // prepare options and POST to the slack webhook from the config file
    let slackPostOptions = {
        method: 'POST',
        url: config.webhook,
        body: fullPostbody,
        requestFullResponse: true,
        json: true
    };

    rp
        .post(slackPostOptions)
        .then(response => {
            log.info(`Slack post response: ${response}`);
        })
        .catch(error => {
            log.error(`Slack error: ${error}`);
            log.debug(`${error}`);
        });
}

/**
 * Fill in the post body based on cmd line params and config
 * @param opts object of options for posting:
 * {text: 'some message' [, username: 'balderdash'] [, icon_emoji: ':robot_face']}
 * OR
 * {json: [manually constructed json object. See slack docs for format}]}
 */
function setPostBodyDefaults(opts, cfg) {
    if (cfg) {
        config = cfg;
    }
    // if the caller specified an account and channel (e.g. '-channel accountname.channelname')
    // else we try the defaults from the config file
    let channel;
    if (opts.c || opts.channel) {
        try {
            channel = opts.channel ? opts.channel : opts.c;
        } catch (e) {
            log.error(`Failed getting account and channel for posting. Did you pass them?\n ${e}`);
            process.exit(-1);
        }
    }
    // if no custom config was passed in, read the default config file
    if (!config) {
        config = configLoader.load(configFilePath, channel);
    }
    //
    // set either the JSON payload, or the text of the JSON payload
    //
    let slackPostBody = {};
    if (opts.json) {
        try {
            slackPostBody = JSON.parse(opts.json);
        } catch (e) {
            log.error(`Caught an error trying to parse the passed JSON parameter \n ${e.message}`);
            process.exit(-1);
        }
        // section for the case where JSON was not sent
    } else {
        if (opts.text || opts.t) {
            try {
                slackPostBody = {
                    text: opts.text ? opts.text : opts.t
                };
            } catch (e) {
                log.error(`Caught an error setting the text message\n ${e.message}`);
                process.exit(-1);
            }
        }
        // if a username was passed in via the option
        if (opts.username) {
            slackPostBody.username = opts.username
        }
        // if an icon was passed in via the options
        if (opts.icon_emoji) {
            slackPostBody.icon_emoji = opts.icon_emoji
        }
    }

    // If we fell through, past the above 'if' conditions, then we failed to set a payload for the slack POST
    if (slackPostBody === undefined) {
        log.error('You must pass, at least, text\n e.g. `raslack --text "some message"`');
        process.exit(-1);
    }
    // if we have a username in the config, and didn't get a username from an optional JSON param
    if (config.username && !slackPostBody.username) {
        slackPostBody.username = config.username;
    }
    // if we have an icon in the config, and NOT from a optional JSON param
    if (config.icon_emoji && !slackPostBody.icon_emoji) {
        slackPostBody.icon_emoji = config.icon_emoji;
    }
    // set some defaults if needed
    if (!slackPostBody.username) slackPostBody.username = 'raslack';
    if (!slackPostBody.icon_emoji) slackPostBody.icon_emoji = ':gear:';

    return (slackPostBody);
}

exports.post = post;
exports.setPostBodyDefaults = setPostBodyDefaults;