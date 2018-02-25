A module to simplify use of slack as an automated notification tool and for easy sending of slack messages from the command line and used as a module in a node app.

_Warning!_
_This is still really a BETA (sorry about the version number! This started as an attempt to learn how to publish an NPM)_

_The command line use wont break much from here on, but beware, if you use this programmatically, you might consider this an ALPHA/TEST version at this point._

## Requirements: ##

* A slack webhook. Don't have one? For your chosen channel, register a 'slack app' and a web hook here https://api.slack.com/apps
* Put the webhook url in the config file here: ~/.raslack/slackconfig.json
* The config file must be valid json, format below. Two accounts reflected below, you can have just one, or several with several channels each.

```json
{
    "default_channel": "anAccountName.general",
    "accounts": {
        "anAccountName": {
            "default_channel": "general",
            "icon_emoji": ":some_slack_icon!:",
            "username": "[the name you want to appear in the slack chat, you choose!]",
            "channels": {
                "general": "https://yourwebhooktochannel"
            }
        },
        "myOtherAccountName": {
            "default_channel": "myFunnestChannel",
            "icon_emoji": ":some_slack_icon!:",
            "username": "[the name you want to appear in the slack chat, you choose!]",
            "channels": {
                "myFunChannel": "https://yourwebhooktochannel",
                "myFunnestChannel": "https://yourwebhooktochannel"
            }
        }
    }
}
```

## Command line Install ##
`npm install -g raslack`

### Run from the command line: ###

`raslack --text 'some silly-ass message' [--channel someAccount_general]`

_or a using json payload (message format docs her https://api.slack.com/incoming-webhooks and here https://api.slack.com/incoming-webhooks)_

`raslack --json '{"text":"I am Pard *the monkey*, _please bend your knee_","username":"pard", "icon_emoji": ":monkey_face:", "channel": "general", "mrkdwn": true}'`

## Example of use in a program: ##

### install ###

`npm install raslack`

### example code ###

```javascript
const raslack = require('raslack');
// all but text are optional. the rest can come from the slackconfig.json file
let opts = {
    text: "Hey! I sent a message programmatically!", // your message here
    username: "Herfert",
    channel: "anAccountName.aChannelName", // these must be changed
    icon_emoji: ":rocket:"
}

let body = raslack.createPostBody(opts);
raslack.post(body);
```