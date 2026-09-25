'use strict';
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', null, 0);
const appName = process.env.AIN_APP;
if (!process.env.AIN_PRIVATE_KEY || !/^[a-z][a-z0-9_]+$/.test(appName || '')) {
  throw new Error('Set AIN_PRIVATE_KEY and a unique lowercase AIN_APP before running.');
}
const address = ain.wallet.addAndSetDefaultAccount(process.env.AIN_PRIVATE_KEY);
const root = `/apps/${appName}`;
async function finalized(hash) {
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    const tx = await ain.getTransactionByHash(hash);
    if (tx?.is_finalized) {
      if (tx.receipt?.code !== 0) throw new Error(`Transaction reverted: ${hash}`);
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Still pending: ${hash}. Query this hash before retrying.`);
}
async function write(operation) {
  const body = { operation, nonce: -1, gas_price: 500, timestamp: Date.now() };
  const dryrun = await ain.sendTransaction(body, true);
  if (dryrun.result.code !== 0) throw new Error(JSON.stringify(dryrun.result));
  const result = await ain.sendTransaction(body);
  console.log({ hash: result.tx_hash, code: result.result.code });
  // An initial execution failure can remain in the transaction pool. Do not
  // blindly submit a new transaction when the response includes a hash.
  await finalized(result.tx_hash);
}
async function main() {
  const existing = await ain.db.ref(`/manage_app/${appName}/config`).getValue();
  if (existing) throw new Error('Use a new app name; this example stakes test tokens once.');
  await write({ type: 'SET_VALUE', ref: `/manage_app/${appName}/create/1`,
    value: { admin: { [address]: true }, service: { staking: { lockup_duration: 60000 } } } });
  await write({ type: 'SET_VALUE', ref: `/staking/${appName}/${address}/0/stake/1/value`, value: 50 });
  await write({ type: 'SET_VALUE', ref: `${root}/counter`, value: 10 });
  await write({ type: 'INC_VALUE', ref: `${root}/counter`, value: 3 });
  await write({ type: 'DEC_VALUE', ref: `${root}/counter`, value: 2 });
  const counter = await ain.db.ref(`${root}/counter`).getValue(undefined, { is_final: true });
  if (counter !== 11) throw new Error(`Unexpected counter: ${counter}`);
  console.log({ address, appName, counter, owner: await ain.db.ref(root).getOwner() });
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
