---
description: >-
  This guide will introduce you to the core concepts for building on the AIN blockchain.
  By the end of this guide, you'll learn how to build a blockchain app that chats with a bot and earn 100 AIN!
---

# Quick Start

## Step 1. Install SDK

To interact with the blockchain in server-side JavaScript environments like Node.js, you can use the official [blockchain SDK for JavaScript or TypeScript](https://github.com/ainblockchain/ain-js). Get started by installing the SDK using npm or your preferred package manager:

```
npm install @ainblockchain/ain-js@latest
```

## Step 2. Connect to blockchain

### Public RPC endpoints

The AI Network provides public RPC endpoints for blockchain interaction on both testnet and mainnet.  
Use testnet to debug and test performance before deploying to mainnet. To use the [SDK](https://github.com/ainblockchain/ain-js) on mainnet, set the [chain ID](https://docs.ainetwork.ai/ain-blockchain/ai-network-design/network-id-and-chain-id) to 1.

| Network | RPC Endpoint                     | Event handler Endpoint           | Chain ID |
| ------- | -------------------------------- | -------------------------------- | -------- |
| Testnet | https://testnet-api.ainetwork.ai | wss://testnet-event.ainetwork.ai | 0        |
| Mainnet | https://mainnet-api.ainetwork.ai | wss://mainnet-event.ainetwork.ai | 1        |

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// To use mainnet:
// const ain = new Ain('https://mainnet-api.ainetwork.ai', 'wss://mainnet-event.ainetwork.ai', 1);
```

## Step 3. Create your wallet

You can create multiple accounts and set a default account. However, it’s crucial to **back up your private key** and store it securely. Losing your private key may result in losing access to your account permanently. Take extra precautions to prevent unauthorized access!

{% code title="create_account.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai');

// Create new account
const accounts = ain.wallet.create(1);
const address = accounts[0];

// Set the new account as the default account
ain.wallet.setDefaultAccount(address);

// Print the default account
console.log(ain.wallet.defaultAccount);

// Example output:
// {
//   address: '0x09A0d53FDf1c36A131938eb379b98910e55EEfe1',
//   private_key: '...',
//   public_key: '...'
// }
```

{% endcode %}

## Step 4. Get AIN (for free!)

### Testnet: Free AIN via Faucet

You can receive 100 AIN daily for free on the Testnet through our faucet.

1. Go to the [faucet site](http://faucet.ainetwork.ai).
2. Enter the address created in **Step 3**.
3. Click "Request for testing" to get your AIN.

![The AI Network Faucet site.](<../../.gitbook/assets/Screen Shot 2019-12-16 at 10.13.46 PM.png>)

You can view transaction details by copying the transaction hash (starting with 0x…) and searching it on the [AI Network Testnet block explorer](https://testnet-insight.ainetwork.ai/).

![The AI Network Faucet site.](<../../.gitbook/assets/Screen Shot 2019-12-16 at 10.15.42 PM.png>)

### Mainnet: Native AIN via AIN DAO Bot

👉 [Join the AIN DAO Discord](https://discord.com/invite/aindao)

To convert **ERC-20 AIN** from Ethereum to **Native AIN** on the AI Network, follow these steps:

#### Step 1: Import $AIN Tokens into MetaMask

1. Open MetaMask and go to “Assets”.
2. Click “Import Token” → “Custom Token”.
3. Use this contract address: `0x3a810ff7211b40c4fa76205a14efe161615d0385`
4. Click “Add Custom Token” to view your $AIN balance.

#### Step 2: Deposit $AIN to AIN DAO Discord

1. In Discord, type `/ain deposit` to receive your unique deposit address (start with `0x...`).
2. Copy the deposit address.
3. Open your ETH wallet and locate the $AIN token.
4. Click “Send,” paste the deposit address, and input the amount to deposit (Minimum: 500 AIN).
5. Confirm the transaction.
6. In Discord, type `/ain balance` to confirm your balance.

#### Step 3: Withdraw AIN Credits to Native AIN

1. Use the `/ain withdraw` command in Discord.
2. Enter your AI Network wallet address.
3. Specify the withdrawal amount (Minimum: 500 AIN).
4. Confirm the transaction.

## Step 5. Create your app

You can create your own app by setting a value to `/manage_app/${appName}/create/${key}` path. The value must contain an [admin config](https://docs.ainetwork.ai/ain-blockchain/ai-network-design/apps#admin-config), which is an object of `{ [address]: true }`. The addresses in the admin config will get the owner and write permissions to the `/apps/${appName}` path.

Setting a value at the path `/manage_app/${appName}/create/${key}` triggers the native function `_createApp`, automatically setting the `owner` and `rule` permissions.

{% code title="create_app.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai');

// Import the account using private key from Step 3
const address = ain.wallet.addAndSetDefaultAccount('YOUR_PRIVATE_KEY');

const appName = 'YOUR_APP_NAME'; // Use unique app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}
// The admin config below grants 'address' both owner and write permissions for the app
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [address]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7d in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log('tx_hash:', res.tx_hash);
    console.log('code:', res.code);
    // 0: success, if not 0, check the error code:
    // https://github.com/ainblockchain/ain-blockchain/blob/master/common/result-code.js

    // Example output:
    // tx_hash: 0x...
    // code: 0
  });
```

{% endcode %}

You can use the `getOwner` function to check app's owner permissions and confirm the app was created successfully.

{% code title="create_app.js" %}

```javascript
// Check the owner permissions have been set properly
ain.db
  .ref(appPath)
  .getOwner()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));

    // Example output:
    // {
    //   ".owner": {
    //     "owners": {
    //       '0x09A0d53FDf1c36A131938eb379b98910e55EEfe1': {
    //         "branch_owner": true,
    //         "write_function": true,
    //         "write_owner": true,
    //         "write_rule": true
    //       }
    //     }
    //   }
    // }
  });
```

{% endcode %}

## Step 6. Stake AIN to your app

Staking is important for securing the capacity needed to write data to the blockchain.
The amount of data you can record is proportional to the amount of AIN you have staked. Below is a simple code example on how to set up staking.

{% code title="create_app.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai');

// Import the account using private key from Step 3
const address = ain.wallet.addAndSetDefaultAccount('YOUR_PRIVATE_KEY');

const appName = 'YOUR_APP_NAME'; // Use the app name from Step 5
const appPath = `/apps/${appName}`;

ain.db
  .ref(`/staking/${appName}/${address}/0/stake/${Date.now()}/value`)
  .setValue({
    value: 50,
    nonce: -1,
  })
  .then((res) => {
    console.log('tx_hash:', res.tx_hash);
    console.log('code:', res.code);
    // 0: success, if not 0, check the error code:
    // https://github.com/ainblockchain/ain-blockchain/blob/master/common/result-code.js

    // Example output:
    // tx_hash: 0x...
    // code: 0
  });
```

{% endcode %}

## Step 7. Make your app public

If you're the only one using the app, you can skip this step.  
To allow others (e.g., an echo bot) to write to your app’s paths, you need to modify the rules. By default, the write rule is:

```js
{
  ".rule": {
    "write": "auth.addr === '${address}'"
  }
}
```

This means only your account can write data.

To make the app public (allowing anyone to write data), change the write rule to `true`. Use the `setRule` function to update it.

{% code title="set_rule.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai');

// Import the account using private key from Step 3
const address = ain.wallet.addAndSetDefaultAccount('YOUR_PRIVATE_KEY');

const appName = 'YOUR_APP_NAME'; // Use the app name from Step 5
const appPath = `/apps/${appName}`;

// Set write rules to allow anyone to write data
ain.db
  .ref(appPath)
  .setRule({
    value: {
      '.rule': {
        write: true,
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log('tx_hash:', res.tx_hash);
    console.log('code:', res.result.code);
    // 0: success, if not 0, check the error code:
    // https://github.com/ainblockchain/ain-blockchain/blob/master/common/result-code.js

    // Example output:
    // tx_hash: 0x...
    // code: 0
  });
```

{% endcode %}

Now, anyone can use your app! You can check the rule with `getRule` function.

#### Advanced settings ✨

If you’re concerned about security (which you should be), you can define more specific paths and rules.  
For example, you can restrict access to `/apps/my_app/restricted/area/for/0xabcd...1234` so that only the holder of the private key for `0xabcd...1234` can write to it. Notice the use of wildcards for flexibility!

```js
ain.db.ref('/apps/my_app/restricted/area/for/$address').setRule({
  value: {
    '.rule': {
      write: `auth.addr === '$address'`,
    },
  },
  nonce: -1,
});
```

## Step 8. Set up event listener

You can register an event listener by setting a function config to a specific path.

{% code title="set_function.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai');

// Import the account using private key from Step 3
const address = ain.wallet.addAndSetDefaultAccount('YOUR_PRIVATE_KEY');

const appName = 'YOUR_APP_NAME'; // Use the app name from Step 5
const appPath = `/apps/${appName}`;

const functionPath = `${appPath}/messages/$user_addr/$timestamp/user`; // Wild cards!

// Set a function to be triggered when writing values at the function path
ain.db
  .ref(functionPath)
  .setFunction({
    value: {
      '.function': {
        'my-bot-trigger': {
          function_type: 'REST',
          function_url: 'http://echo-bot.ainetwork.ai/trigger', // An endpoint to your event listener server
          function_id: 'my-bot-trigger', // Use your own function id
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log('tx_hash:', res.tx_hash);
    console.log('code:', res.result.code);
    // 0: success, if not 0, check the error code:
    // https://github.com/ainblockchain/ain-blockchain/blob/master/common/result-code.js

    // Example output:
    // tx_hash: 0x...
    // code: 0
  });
```

{% endcode %}

Once registered, a POST request will be sent to the `function_url`, whenever a value is written to `/apps/my_bot/messages/$user_addr/$timestamp/user` path. Since `my-bot-trigger` is just a placeholder, customize it with your own trigger name.

You can check the function was set successfully using the `getFunction` function.

Below is an example of a triggering value (at .../user) and a response value (at .../echo-bot) written by Echo bot 👾.
If configured correctly, the Echo bot [http://echo-bot.ainetwork.ai/trigger](http://echo-bot.ainetwork.ai/trigger) will respond to your message by writing a value automatically.

```js
// '/apps/<app-name>/messages/<user-addr>/<timestamp>'
{
  "user": "Hello!",
  "echo-bot": "Did you mean \"Hello!\"?"
}
```

## Step 9. Write values

Everything is ready! You can now write data with the `setValue` function to trigger the Echo bot function.
Use the `getValue` function to check the response value.

{% code title="set_value.js" %}

```js
const Ain = require('@ainblockchain/ain-js').default;

const ain = new Ain('https://testnet-api.ainetwork.ai');

// Import the account using private key from Step 3
const address = ain.wallet.addAndSetDefaultAccount('YOUR_PRIVATE_KEY');

const appName = 'YOUR_APP_NAME'; // Use the app name from Step 5
const appPath = `/apps/${appName}`;

const userMessagePath = `${appPath}/messages/${address}`;

// Set a value at the path to trigger the function
ain.db
  .ref(`${userMessagePath}/${Date.now()}/user`)
  .setValue({
    value: 'Hello!',
    nonce: -1,
  })
  .then((res) => {
    console.log('tx_hash:', res.tx_hash);
    console.log('code:', res.result.code);
    // 0: success, if not 0, check the error code:
    // https://github.com/ainblockchain/ain-blockchain/blob/master/common/result-code.js

    // Example output:
    // tx_hash: 0x...
    // code: 0
  });

// Check that the value is set correctly
// If the echo bot is alive, it should have responded to your message
ain.db
  .ref(userMessagePath)
  .getValue()
  .then((data) => {
    console.log(JSON.stringify(data, null, 2));
    // Example output:
    // {
    //   "1631691438245": {
    //     "user": "Hello!",
    //     "echo-bot": "Did you mean \"Hello!\"?" // Written by the echo bot.
    //   }
    // }
  });
```

{% endcode %}
