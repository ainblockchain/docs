# Staking

## What is staking?

Staking is a way to lock your tokens to help the blockchain network or applications run smoothly. In return, you may earn rewards or contribute to the stability of the system.
Think of it like putting your money in a savings account: you're helping the system grow, and sometimes you earn interest.

## How does staking work?

In our system, staking works a bit differently depending on where you stake your tokens:

1. **Staking in the consensus app**

- **What it does:** Your tokens are used to create new blocks on the blockchain.
- **What you get:** You earn rewards based on the blocks created.
- **Why it's important:** It secures the blockchain and keeps it running smoothly.

2. **Staking in other apps**

- **What it does:** Your tokens provide the resources needed to write data to the blockchain.
- **What you get:** Rewards depend on the app developer's decision. Some apps may offer rewards, while others may not.
- **Why it's important:** It keeps the apps functional and contributes to the ecosystem.

## How is this different from other blockchain?

- In other blockchain, you lock your tokens to help the network and earn rewards like new tokens or fees.

- In our blockchain, you can do more:
  1. **Earn rewards:** By staking in the consensus app, you earn rewards for block production.
  2. **Support apps:** By staking in other apps, you support their operations with rewards depending on the app developer's choice.

This gives you the choice to either focus on earning rewards or supporting the ecosystem.

## How to stake?

In our system, there are two main methods to stake your tokens: using [ain-js](https://github.com/ainblockchain/ain-js) or [blockchain tools](https://github.com/ainblockchain/ain-blockchain/blob/master/tools/staking/sendStakeTx.js). Both methods are straightforward and easy to use.

### Method 1: Using ain-js

1. Install ain-js
   Make sure you have Node.js and ain-js installed.

```sh
$ npm install @ainblockchain/ain-js
```

2. Stake your tokens

Use the following example code to connect to the blockchain and stake tokens:

{% code title="stake_app.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0); // testnet

const address = ain.wallet.addAndSetDefaultAccount('YOUR_PRIVATE_KEY');

const appName = 'YOUR_APP_NAME'; // or 'consensus
const appPath = `/apps/${appName}`;
const amount = 10; // amount of tokens to stake

ain.db
  .ref(`/staking/${appName}/${address}/0/stake/${Date.now()}/value`)
  .setValue({
    value: amount,
    nonce: -1,
  })
  .then((res) => {
    console.log('tx_hash:', res.tx_hash);
    console.log('code:', res.result.code); // 0: success
  });
```

- Replace `YOUR_PRIVATE_KEY` and `YOUR_APP_NAME` with your own private key and app name.
- Adjust the `amount` variable to the amount of tokens you want to stake.

{% endcode %}

3. Confirm the transaction

### Method 2: Using blockchain tools

If you prefer a simpler, non-programming method, you can use the **pre-built script** available in our repository.

1. Download the repository

```sh
$ git clone https://github.com/ainblockchain/ain-blockchain.git
$ cd ain-blockchain/tools/staking
```

2. Set up the environment
   Make sure you have Node.js installed. Install any dependencies by running:

```
$ npm install
```

3. Run the staking script
   Use the provided [sendStakeTx.js](https://github.com/ainblockchain/ain-blockchain/blob/master/tools/staking/sendStakeTx.js) script to stake your tokens:

```sh
$ node sendStakeTx.js <BLOCKCHAIN_API_ENDPOINT> <CHAIN_ID> <APP_NAME> <STAKING_AMOUNT> <ACCOUNT_TYPE> [<KEYSTORE_FILE_PATH>]
$ node sendStakeTx.js https://testnet-api.ainetwork.ai 0 test_app 100 private_key
$ node sendStakeTx.js https://testnet-api.ainetwork.ai 0 test_app 100 mnemonic
```

- Replace the placeholders with your own values:
- `<BLOCKCHAIN_API_ENDPOINT>`: The endpoint of the blockchain API. (e.g. testnet: 'https://testnet-api.ainetwork.ai', mainnet: 'https://mainnet-api.ainetwork.ai')
- `<CHAIN_ID>`: The ID of the chain. (0: testnet, 1: mainnet)
- `<APP_NAME>`: The name of the app.
- `<STAKING_AMOUNT>`: The amount of tokens to stake.
- `<ACCOUNT_TYPE>`: The type of the account: private_key, mnemonic, keystore
- `<KEYSTORE_FILE_PATH>`: The path to the keystore file.

4. Confirm the transaction

## How to decide the staking amount?

To determine the right staking amount for your app, consider the following key points:

1. Understand resource needs

- Your app requires two budgets:
  - **Bandwidth Budget:** Calculated as the number of transactions per second (TPS)
  - **State Budget:** Based on the memory used in the blockchain's state tree (limit: 5GB shared across all apps).
- The more resources your app uses, the higher the staking amount required.

2. Dynamic allocation

- The amount of state budget your app receives depends on the percentage of total staking your app contributes to the systam.
- This allocation is dynamic and adjusts as the total staking changes across all apps.

3. Use [JSON RPC API](https://github.com/ainblockchain/ain-blockchain/blob/master/JSON_RPC_API.md#ain_getstateusage): Get State Usage

- Run the `getSateUsage` method to check:
  - Your app's current state usage.
  - Available resources based on your app's staking amount. (in the free tier, you can only use 5% of the total state budget)
- Example command:
  Request:

```sh
curl https://testnet-api.ainetwork.ai/json-rpc -X POST -H "Content-Type: application/json" -d '{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ain_getStateUsage",
  "params": {
    "protoVer": "1.1.3",
    "app_name": "YOUR_APP_NAME"
  }
}'
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "result": {
      "usage": {
        "tree_height": 6,
        "tree_size": 11,
        "tree_bytes": 2114,
        "tree_max_siblings": 5
      },
      "available": {
        "tree_height": 30,
        "tree_bytes": 12291542508.778091,
        "tree_size": 76822140.67986308
      },
      "staking": {
        "app": 50500000,
        "total": 10168575.540000014,
        "unstakeable": 50500000
      }
    },
    "protoVer": "1.1.3"
  }
}
```

Interpret the response:

- State Usage (usage)
  - tree_bytes: Your app is currently using `2114` bytes of state budget.
- Available State (available)
  - tree_bytes: You can use up to `12291542508.778091` bytes of state budget.
- Staking Details (staking)
  - app: Your app has staked `50500000` tokens.
  - total: The total staking amount in the system is `10168575.540000014` tokens.

4. How to decide staking

- If `usage.tree_byte` is close to `available.tree_bytes`, your app is nearing its limit.
- Increase your staking amount of `app` to get more state budget.
- Keep monitoring the state usage to ensure your app has enough resources.
