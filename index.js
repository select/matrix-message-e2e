#!/usr/bin/env node
const core = require('@actions/core');
const sdk = require('matrix-js-sdk');
global.Olm = require('olm');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const {
	LocalStorageCryptoStore,
} = require('matrix-js-sdk/lib/crypto/store/localStorage-crypto-store');

const message = core.getInput('message');
const server = core.getInput('server');
const room = core.getInput('room');
const token = core.getInput('token');
const deviceId = core.getInput('deviceId');
const userId = core.getInput('userId');

const client = sdk.createClient({
	baseUrl: server,
	accessToken: token,
	userId,
	deviceId,
	sessionStore: new sdk.WebStorageSessionStore(localStorage),
	cryptoStore: new LocalStorageCryptoStore(localStorage),
});

client.on('sync', async function (state, prevState, res) {
	if (state !== 'PREPARED') return;
	client.setGlobalErrorOnUnknownDevices(false);
	try {
		await client.joinRoom(room);
		await client.sendEvent(
			room,
			'm.room.message',
			{
				msgtype: 'm.text',
				format: 'org.matrix.custom.html',
				body: message,
				formatted_body: message,
			},
			''
		);
	} catch (error) {
		core.setFailed('Job failed: ' + error.message);
	}
	process.exit(0);
});
async function run() {
	await client.initCrypto();
	await client.startClient({ initialSyncLimit: 1 });
}

run().catch((error) => core.setFailed(error.message));
