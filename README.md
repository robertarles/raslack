A module to simplify use of slack as an automated notification tool and for easy sending of slack messages from the command line.

Requirements:

* A slack webhook. Don't have one? Register a 'slack app' and a web hook here https://api.slack.com/apps
* Put the webhook url in the config file here: ~/.raslack/slackconfig.json
* The config file must be valid json that looks like this:

```json
{
  "webHookUrl": "https://[yourwebhookurl]"
}
```

install

`npm install -g raslack`

then run

`raslack 'some silly-ass message'`

or a json payload (message format docs her https://api.slack.com/incoming-webhooks and here https://api.slack.com/incoming-webhooks)

`./raslack '{"text":"I am Pard *the monkey*, _please bend your knee_","username":"pard", "icon_emoji": ":monkey_face:", "channel": "general", "mrkdwn": true}'`
