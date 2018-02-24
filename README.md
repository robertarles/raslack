A module to simplify use of slack as an automated notification tool and for easy sending of slack messages from the command line.

_Warning!_
_This is still really a BETA (sorry about the version number! I was learning how to publish an NPM when I started this)_

_The command line use may not change much from here on, but beware, if you use this programmatically, you might consider this an ALPHA/TEST version at this point._

Requirements:

* A slack webhook. Don't have one? Register a 'slack app' and a web hook here https://api.slack.com/apps
* Put the webhook url in the config file here: ~/.raslack/slackconfig.json
* The config file must be valid json, format below. Two accounts reflected below, you can have just one, or several with several channels.

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

install

`npm install -g raslack`

then run

`raslack --text 'some silly-ass message' [--channel someAccount_general]`

or a json payload (message format docs her https://api.slack.com/incoming-webhooks and here https://api.slack.com/incoming-webhooks)

`raslack --json '{"text":"I am Pard *the monkey*, _please bend your knee_","username":"pard", "icon_emoji": ":monkey_face:", "channel": "general", "mrkdwn": true}'`
