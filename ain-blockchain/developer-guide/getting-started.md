# Quick Start

This guide creates an app on the public **Testnet L2**, stakes test AIN for state capacity, writes data, and waits for finalized transactions. Mainnet application signing uses chain ID 1; Testnet uses 0. See [AIN v2 layers](ain-v2-layers.md) for L1 submission.

## 1. Install

Use Node.js 20. In an empty project directory:

```sh
npm init -y
npm install https://github.com/ainblockchain/ain-js/releases/download/v1.15.0-ain-v2.0/ainblockchain-ain-js-1.15.0-ain-v2.0.tgz
```

## 2. Prepare a test account

Use a new Testnet account from your wallet. Back up its key securely. Supply the private key to your local process as `AIN_PRIVATE_KEY` using your secret manager or a protected environment file; do not commit or print it. The same key determines the same address on both networks, but their balances are separate.

To print only its address:

```js
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', null, 0);
const address = ain.wallet.addAndSetDefaultAccount(process.env.AIN_PRIVATE_KEY);
console.log(address);
```

Do not log `wallet.defaultAccount`: it contains the private key.

## 3. Obtain test AIN

Open the [HTTPS Faucet](https://faucet.ainetwork.ai), enter the address, and request testing tokens. The service provides 100 Testnet AIN subject to its daily limit and available funds. Save the returned transaction hash and wait for finalization before spending.

Use [AINscan](https://ainscan.ainetwork.ai), select **Testnet** and **L2**, and look up the transaction or account. Test AIN has no Mainnet balance effect. Mainnet funding through external services requires separate verification; do not send ERC-20 funds based solely on this tutorial.

## 4. Run the app example

Copy [examples/quickstart.cjs](../../examples/quickstart.cjs) from this documentation repository into the project directory. Set `AIN_APP` to a unique name containing lowercase letters, digits, and underscores, starting with a letter. With `AIN_PRIVATE_KEY` already supplied securely:

```sh
AIN_APP=my_unique_test_app node quickstart.cjs
```

The program:

1. Creates an app with your address as administrator.
2. Sets a 60-second test staking lockup and stakes 50 Testnet AIN.
3. Sets a counter to 10, increments it by 3, and decrements it by 2.
4. Verifies the finalized result is 11 and reads the app owner configuration.

This spends transaction fees and locks the stake until it is explicitly unstaked after the lockup. Use a new app name for each run. The example is deliberately fixed to Testnet.

The app creation path is `/manage_app/<name>/create/<unique-key>`. App data lives under `/apps/<name>`. Creation grants the specified administrator ownership and write permissions; it does not grant everyone permission to write.

## 5. Understand capacity and finality

Both deployed L2 networks have a shared 100 MB free-state allowance as of September 25, 2026. Small unstaked apps can write while this allowance has capacity. This example deliberately demonstrates staking; it is optional for apps that fit in the available free tier. Inspect execution results. The 50 AIN example succeeded during the September 25, 2026 verification, but available capacity changes with total network stake and app state size. Increase stake only after inspecting the actual error and your balance.

A dry run detects many errors without publishing a transaction. It does not reserve state or guarantee later execution. A submitted transaction can initially fail execution and remain in the pool; query the returned hash before retrying after changing stake. The example waits for each transaction's finalized receipt before the next dependent write.

## 6. Integrate application services

Public validators currently disable outbound REST function calls. The old echo-bot REST callback tutorial does not run on this deployment merely by setting a function configuration. Build a service that subscribes to `wss://testnet-event.ainetwork.ai`, checks finalized transactions, and processes events idempotently. Recover missed events by scanning finalized blocks after reconnecting.

Do not expose a handler that evaluates arbitrary transaction text as code. See [troubleshooting](trouble-shooting.md) and [function configuration](../ai-network-design/blockchain-database/triggers/README.md).
