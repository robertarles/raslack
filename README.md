
A module to simplify my use of slack as an automated notification tool and from the command line.

Requirements:
* That you have a slack webhook. Don't have one? Register a 'slack app' and a web hook here https://api.slack.com/apps
* Put the webhook in a file here: ~/.slack/slackconfig.json
* The file must be valid json that looks like this:

```json
{
  "webHookUrl": "https://hooks.slack.com/services/[changeThis]/[andChangeThis]"
}
```

install
`npm install -g raslack`

then run
`raslack 'some silly-ass message'`