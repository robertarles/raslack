'use strict';
const rp = require('request-promise');
const log = require('./helpers/log');

/**
 * Post to slack
 * @param slackPostBody built by setPostBody(opts) call
 * @param config loaded from cfg.load(cfgfile, channel) call
 */
function post(slackPostBody, config) {
    // prepare options and POST to the slack webhook from the config file
    let slackPostOptions = {
        method: 'POST',
        url: config.webhook,
        body: slackPostBody,
        json: true
    };

    rp
        .post(slackPostOptions)
        .then(response => {
            log.info(`Slack response from post to ${config.slackChannel}: ${response}`);
        })
        .catch(error => {
            log.error(`Slack post to ${config.slackChannel}: ${error}`);
        });
}

/**
 * 
 * @param opts object of options for posting:
 * {text: 'some message', username: 'balderdash', icon_emoji: ':robot_face'}
 * OR
 * {json: [manually constructed json object. See slack docs for format}]}
 */
function createPostBody(opts, config) {
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
    } else if (opts.text || opts.t) {
        try {
            slackPostBody = {
                text: opts.text ? opts.text : opts.t
            };
        } catch (e) {
            log.error(`Caught an error processing text message\n ${e.message}`);
            process.exit(-1);
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
    // if we have an icon in the confi, and NOT from a optional JSON param
    if (config.icon_emoji && !slackPostBody.icon_emoji) {
        slackPostBody.icon_emoji = config.icon_emoji;
    }
    // set some defaults if needed
    if (!slackPostBody.username) slackPostBody.username = 'raslack';
    if (!slackPostBody.icon_emoji) slackPostBody.icon_emoji = ':gear:';

    return (slackPostBody);
}

exports.post = post;
exports.createPostBody = createPostBody;