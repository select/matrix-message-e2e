#!/usr/bin/env node
const sdk = require('matrix-js-sdk');
global.Olm = require('olm');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const {
  LocalStorageCryptoStore,
} = require('matrix-js-sdk/lib/crypto/store/localStorage-crypto-store');

const channel = '!XXXXXXXXXXXX:matrix.org';
const message = 'hello world e2e encrypted';

const client = sdk.createClient({
  baseUrl: `https://matrix.org`,
  accessToken: 'XXXXXXXXXXXX',
  sessionStore: new sdk.WebStorageSessionStore(localStorage),
  cryptoStore: new LocalStorageCryptoStore(localStorage),
  userId: '@XXXXXXXXXXXX:matrix.org',
  deviceId: 'XXXXXXXXXXXX',
});

client.on('sync', async function (state, prevState, res) {
  if (state !== 'PREPARED') return;
  client.setGlobalErrorOnUnknownDevices(false);
  await client.joinRoom(channel);
  await client.sendEvent(
    channel,
    'm.room.message',
    {
      msgtype: messagetype,
      format: 'org.matrix.custom.html',
      body: message,
      formatted_body: message,
    },
    ''
  );
  process.exit(1);
});
async function run() {
  await client.initCrypto();
  await client.startClient({ initialSyncLimit: 1 });
}

run().catch((error) => console.error(error));
