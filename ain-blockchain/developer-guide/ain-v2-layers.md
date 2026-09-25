# AIN v2: L1 and default L2

Mainnet and Testnet use a shared application L2 operated by five validators. Ordinary requests to the existing public API execute on L2; applications do not need to open a state channel or configure an L2 endpoint.

| Network | API | Events | Application chain ID |
| --- | --- | --- | --- |
| Mainnet | https://mainnet-api.ainetwork.ai | wss://mainnet-event.ainetwork.ai | 1 |
| Testnet | https://testnet-api.ainetwork.ai | wss://testnet-event.ainetwork.ai | 0 |

JSON-RPC uses POST to `/json-rpc`. An HTTP GET to that route is not a health test. Events default to L2; append `/l1/` for L1 events.

## Execution and settlement

L2 targets a two-second block interval. L1 targets twenty seconds. Actual acknowledgement, finalization, and checkpoint delays depend on network and validator conditions; a successful submission response is not finality.

Four of the five operators attest L2 commitments for recording on L1. This is an operator trust model: checkpoints are attestations, not validity proofs. Do not assume an unimplemented trustless withdrawal or forced-exit mechanism. The same five physical operators participate in both layers.

Existing application state and native assets were migrated into the canonical L2 state. The corresponding L1 state is locked against independent spending. Read application balances and state on L2. L1 reads can show the locked migration state, which is not a second spendable balance.

## SDK installation and default submission

Use Node.js 20 and the published layer-aware SDK artifact:

```sh
npm install https://github.com/ainblockchain/ain-js/releases/download/v1.15.0-ain-v2.0/ainblockchain-ain-js-1.15.0-ain-v2.0.tgz
```

Inside an async function, after creating your app and supplying its signing key:

```js
const Ain = require('@ainblockchain/ain-js').default;
const ain = await Ain.connect('https://testnet-api.ainetwork.ai');
ain.wallet.addAndSetDefaultAccount(process.env.AIN_PRIVATE_KEY);
const result = await ain.db.ref(`/apps/${process.env.AIN_APP}/value`)
  .setValue({ value: 42, nonce: -1, gas_price: 500 });
if (result.result.code !== 0) throw new Error(JSON.stringify(result.result));
console.log(result.tx_hash);
```

Existing secp256k1 SDK clients explicitly using Mainnet 1 or Testnet 0 can continue direct L2 writes. Layer discovery and L1 inbox submission require the layer-aware SDK. Offline signing requires the correct explicit chain ID or an initialized client. P256 transaction signatures are not supported after migration.

## Submit through L1

```js
const viaL1 = await Ain.connect('https://testnet-api.ainetwork.ai', { layer: 'L1' });
viaL1.wallet.addAndSetDefaultAccount(process.env.AIN_PRIVATE_KEY);
const result = await viaL1.db.ref(`/apps/${process.env.AIN_APP}/value`)
  .setValue({ value: 43, nonce: -1, gas_price: 500 });
if (result.result.code !== 0) throw new Error(JSON.stringify(result.result));
console.log({ l1: result.tx_hash, l2: result.l2_tx_hash });
```

The envelope must finalize on L1 and receive operator attestation before execution on L2. Inspect both transaction hashes. Read the resulting app state with a default L2 client; an explicit L1 client reads L1 state.

## Inspect the network

```sh
curl --fail-with-body https://testnet-api.ainetwork.ai/json-rpc \
  -H 'Content-Type: application/json' \
  --data '{"jsonrpc":"2.0","id":1,"method":"ain_getLayerInfo","params":{"protoVer":"1.6.1"}}'
```

`ain_getLayerInfo` reports each layer's identity and health. `ain_listTransactions` and `ain_getIndexedTransaction` accept a `layer` selector (`L1` or `L2`). Use finalized state reads (`is_final: true`) when verifying a write; an optimistic read or an event alone does not prove finality.

[AINscan](https://ainscan.ainetwork.ai) supports both networks, L1/L2 transaction lookup, and L2 application state. Node counts describe verified nodes in the selected layer, not the sum of both layers.

The Knowledge UI and serving APIs have been removed. Imported application data and historical blocks remain preserved; old historical references are not evidence of an active Knowledge service.

## Shared free state capacity

Both L2 networks allocate 100,000,000 bytes to unstaked app state, raised from 25,000,000 on September 25, 2026. This is a shared network allowance, not 100 MB per app. The total state limit remains 5 GB, the app budget remains 2.475 GB, and the service budget is 2.425 GB.

Query `ain_getStateUsage` with `app_name` to inspect current usage, available capacity, and stake. Imported Testnet free-tier state already exceeded the former allowance; the increased allocation restored app and NFT creation without an initial stake. Stake when your app needs capacity beyond the available free tier. A later exhaustion still requires capacity management; this is not unlimited storage.

## Release

The [September 25 chain-ID release](https://github.com/ainblockchain/ain-blockchain/releases/tag/ain-v2-chain-ids-20260925) includes production verification evidence. Its core commit is `d244ae25a76c5c76224b98a621fcb295f80fb826`.
