# matrix-message-e2e

## What does this action do?

:bulb: This action can send a an e2e encrypted message to a [Matrix](https://matrix.org/) chat room.

## Setup

**Matrix account** If you do not have a Matrix account yet or want to register a new one just for this GitHub action check out https://publiclist.anchel.nl/ for a list of public homeservers.

**Matrix Access Token and Device Id**
Run the following shell script with your login credentials.
```
curl -XPOST -d '{"type":"m.login.password", "user":"$1", "password":"$2"}' https://$3/_matrix/client/r0/login
```
Replace `$1` with your username, `$2` with your password `$3` with your homeserver (e.g. `matrix.org`)

**Internal Room ID**
In your matrix client open `Room settings`>`Advanced`, the room id lookes like this: `!<random characters>:matrix.org`

## Usage

**Configure GitHub Secrets** Open your GitHub repository in your browser. Navigate to `Settings`>`Secrets`. Create a new secret by clicking the `New secret` button:
	* Name: `MATRIX_TOKEN`
	* Value: Insert the token you copied before. Make sure that there is no newline at the end.

**Setup Workflow** Define a workflow in `.github/workflows/matrix-pull-request.yml` (or add a job if you already have defined workflows).

:bulb: Read more about [Configuring a workflow](https://help.github.com/en/articles/configuring-a-workflow).

### Example Workflow File
```yaml
name: Pull-Request-Matrix-Message
on:
	pull_request:
		types: [opened, reopened]

jobs:
	send-message:
		runs-on: ubuntu-latest
		name: Send message via Matrix
		steps:
		- name: Send message to test room
			id: matrix-chat-message
			uses: select/matrix-message-e2e@v1.0.4
			with:
				server: ${{ secrets.MATRIX_SERVER }}
				token: ${{ secrets.MATRIX_TOKEN }}
				deviceId: ${{ secrets.MATRIX_DEVICEID }}
				room: ${{ secrets.MATRIX_ROOM }}
				message: "${{ github.event.sender.login }} created a pull request for ${{ github.event.repository.name }}: ${{ github.event.pull_request.title }}"
```

## Acknowledgements

This work is here thanks to 
- https://github.com/s3krit/Matrix-Message
- https://github.com/fadenb/Matrix-Chat-Message
- https://github.com/matrix-org/matrix-js-sdk/issues/731
