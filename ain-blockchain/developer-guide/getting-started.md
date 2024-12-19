---
description: >-
  An example of how to interact with AIN Blockchain using ain-js. Read on and
  get 100 AIN!
---

# Quick Start

Before following this guide, you should have a Node.js project set up.

## Step 1. Install ain-js

[ain-js](https://github.com/ainblockchain/ain-js) is a JavaScript SDK that can be used to send requests to and get responses from the AIN blockchain through its JSON RPC API. It's published on the npm registry and can be easily installed with the following command.

```
# In your project directory
npm init
npm install @ainblockchain/ain-js
```

## Step 2. Connect to a test node

The AI Network Dev Team is currently exposing a public Testnet node at [https://testnet-api.ainetwork.ai](https://testnet-api.ainetwork.ai). In the future, there will be more nodes to connect to.

Chain ID must be set to 1 to use [ain-js](https://github.com/ainblockchain/ain-js) on the Mainnet. (0: Testnet, 1: Mainnet)

{% code title="transfer.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// To use the Mainnet, you need to initialize as follows:
// const ain = new Ain('https://mainnet-api.ainetwork.ai', 'wss://mainnet-event.ainetwork.ai', 1);
```

{% endcode %}

## Step 3. Create an account

ain-js can create accounts for you. Just specify the number of accounts you want to create.

{% code title="transfer.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Create 1 new account
const accounts = ain.wallet.create(1);
const myAddress = accounts[0];

// Set the new account (myAddress) as the default account
ain.wallet.setDefaultAccount(myAddress);

// Print defaultAccount (Need to backup your private key)
console.log(ain.wallet.defaultAccount);
// Example:
// {
//   address: '0x09A0d53FDf1c36A131938eb379b98910e55EEfe1',
//   private_key: '...',
//   public_key: '...'
// }
```

{% endcode %}

## Step 4. Get AIN (for free!)

We have a faucet site that gives you 10 AIN per day (valid only on the Testnet). Follow this link [https://faucet.ainetwork.ai/](http://faucet.ainetwork.ai/) and enter `myAddress` that you created from Step 3 at the input field. Click "Request for testing" and voilà! Now you have 10 AIN in your wallet, just like that.&#x20;

![The AI Network Faucet site.](<../../.gitbook/assets/Screen Shot 2019-12-16 at 10.13.46 PM.png>)

You can check out the details of the transaction that transferred the fund from our reserve to your address by copying the transaction hash (the purple string that starts with 0x...) at the bottom of the page and searching it on AI Network's block explorer site [https://insight.ainetwork.ai/](https://insight.ainetwork.ai/).

![](<../../.gitbook/assets/Screen Shot 2019-12-16 at 10.15.42 PM.png>)

## Step 5. Transfer AIN

You can transfer the AIN you received from Step 4 with a `transfer()` function. You need to specify the to (the address you're transferring the AIN to) and the value (how much AIN you're transferring). 'from' is optional if you've set the default account. If you have not, you should set 'from' as the address you're transferring AIN from.

{% code title="transfer.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Copy and paste private_key from Step 3
const private_key = 'COPY-AND-PASTE-PRIVATE-KEY';
const myAddress = ain.wallet.addAndSetDefaultAccount(private_key);

// Print defaultAccount (Need to backup your private key)
console.log(ain.wallet.defaultAccount);
// Example:
// {
//   address: '0x09A0d53FDf1c36A131938eb379b98910e55EEfe1',
//   private_key: '...',
//   public_key: '...'
// }

// Transfer 1 AIN to ADDRESS_TO_SEND_AIN_TO
ain.wallet
  .transfer({
    from: myAddress, // Optional (defaultAccount will be used if omitted)
    to: '0x99bBa0051DDdf7b69972602512661915fdD8eE89', // or your address
    value: 1,
  })
  .then((res) => {
    // The returned value will be either
    // { result, tx_hash } or { code, message, tx_hash },
    // depending on the result of the transaction.
    console.log(JSON.stringify(res));
  });
```

{% endcode %}

## Step 6. (Optional) Setting the nonce of your transaction

Optionally, you can set the nonce of your transaction. In Step 4, we didn't set the nonce value, which means that ain-js automatically set the transaction's nonce as -1. A transaction with a nonce of -1 is regarded to be "unordered".

Call `getNonce()` method to get the current nonce of your address and make the same transfer call as in Step 4, but with a nonce that's incremented by 1 from the value you just got from `getNonce()`.

{% code title="transfer.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Create 1 new account
const accounts = ain.wallet.create(1);
const myAddress = accounts[0];

// Set the new account (myAddress) as the default account
ain.wallet.setDefaultAccount(myAddress);

// Print defaultAccount (Need to backup your private key)
console.log(ain.wallet.defaultAccount);
// Example:
// {
//   address: '0x09A0d53FDf1c36A131938eb379b98910e55EEfe1',
//   private_key: '...',
//   public_key: '...'
// }

// Transfer 1 AIN to ADDRESS_TO_SEND_AIN_TO
ain.wallet
  .transfer({
    from: myAddress, // Optional (defaultAccount will be used if omitted)
    to: ADDRESS_TO_SEND_AIN_TO, // e.g. 0x08Aed7AF9354435c38d52143EE50ac839D20696b
    value: 1,
  })
  .then((res) => {
    // The returned value will be either
    // { result, tx_hash } or { code, message, tx_hash },
    // depending on the result of the transaction.
    console.log(JSON.stringify(res));
  });

// (Optional exercise) Send another transfer transaction with a nonce specified
ain.wallet.getNonce({ address: myAddress }).then(async (nonce) => {
  const res = await ain.wallet.transfer({
    from: myAddress,
    to: ADDRESS_TO_SEND_AIN_TO,
    value: 1,
    nonce: nonce + 1,
  });
  console.log(JSON.stringify(res));
});
```

{% endcode %}

## Step 7. Create your own app

You can create your own app by setting a value to `/manage_app/${appName}/create/${key}` path. The value must contain an `admin` config, which is an object of `{ [address]: true }`. The addresses in the admin config will get the owner and write permissions to the `/apps/${appName}` path.

Setting a value at the path `/manage_app/${appName}/create/${key}` will call the native function `_createApp` and the permissions ( `owner` and `rule` ) are automatically set.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}. With the admin config below,
// only 'myAddress' will have owner & write permissions at /apps/${appName}.
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [myAddress]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7 days in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });
```

{% endcode %}

You can check the owner setting of the app's path to see if the app was created successfully. Use the `getOwner` function to check.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}. With the admin config below,
// only 'myAddress' will have owner & write permissions at /apps/${appName}.
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [myAddress]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7 days in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });

// Check the owner permissions have been set properly.
ain.db
  .ref(appPath)
  .getOwner()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    /*
    {
      ".owner": {
        "owners": {
          [myAddress]: {
            "branch_owner": true,
            "write_function": true,
            "write_owner": true,
            "write_rule": true
          }
        }
      }
    }
    */
  });
```

{% endcode %}

## Step 8. Stake AIN to your app

Staking is important for securing the capacity needed to write data to the blockchain. The amount of data you can record is proportional to the amount of AIN you have staked. Below is a simple code example on how to set up staking.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name

ain.db
  .ref(`/staking/${appName}/${myAddress}/0/stake/${Date.now()}/value`)
  .setValue({
    value: 10,
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });
```

{% endcode %}

## Step 9. Make your app public

If you want to use the app by yourself, you can skip this step. However, if you'd like to allow someone else (i.e. echo bot) to write at your app's paths, you need to modify the rules.

Initially, the write rule is set as `auth.addr === '${myAddress}'` so only you can use the app.

```javascript
{
  ".rule": {
    "write": "auth.addr === '${myAddress}'"
  }
}
```

To make the app public (anyone can come and write data to it), you need to change the write rule as `true` . You can change the write rule by setting a rule with the `setRule` function.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}. With the admin config below,
// only 'myAddress' will have owner & write permissions at /apps/${appName}.
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [myAddress]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7 days in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });

// Check the owner permissions have been set properly.
ain.db
  .ref(appPath)
  .getOwner()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    /*
    {
      ".owner": {
        "owners": {
          [myAddress]: {
            "branch_owner": true,
            "write_function": true,
            "write_owner": true,
            "write_rule": true
          }
        }
      }
    }
    */
  });

// Set write rules.
ain.db
  .ref(appPath)
  .setRule({
    value: {
      '.rule': {
        write: true, // Anyone can write values at the appPath.
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```

{% endcode %}

Now, anyone can use your app! You can check the rule with `getRule` function.&#x20;

#### Advanced settings ✨

If you are concerned about security, as you should, you can specify more specific paths and rules. For instance, if you set a rule like this,

```javascript
ain.db.ref('/apps/my_app/restricted/area/for/$address').setRule({
  value: {
    '.rule': {
      write: `auth.addr === '$address'`,
    },
  },
  nonce: -1,
});
```

you can restrict the person who can write at /apps/my_app/restricted/area/for/0xabcd...1234 to only someone with the private key of 0xabcd...1234. Notice how I used wild cards!

## Step 10. Uses blockchain event push service

You can register an event listener by setting a function config to a specific path.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}. With the admin config below,
// only 'myAddress' will have owner & write permissions at /apps/${appName}.
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [myAddress]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7 days in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });

// Check the owner permissions have been set properly.
ain.db
  .ref(appPath)
  .getOwner()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    /*
    {
      ".owner": {
        "owners": {
          [myAddress]: {
            "branch_owner": true,
            "write_function": true,
            "write_owner": true,
            "write_rule": true
          }
        }
      }
    }
    */
  });

// Set write rules.
ain.db
  .ref(appPath)
  .setRule({
    value: {
      '.rule': {
        write: true, // Anyone can write values at the appPath.
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });

// Set a function to be triggered when writing values at the functionPath.
const functionPath = `${appPath}/messages/$user_addr/$timestamp/user`; // Wild cards!
ain.db
  .ref(functionPath)
  .setFunction({
    value: {
      '.function': {
        'my-bot-trigger': {
          // Use your own function id
          function_type: 'REST',
          function_url: 'http://echo-bot.ainetwork.ai/trigger', // An endpoint to your event listener server
          function_id: 'my-bot-trigger', // Use your own function id
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```

{% endcode %}

Once registered, a POST request will be sent to the `function_url` , whenever any value is written to `/apps/my_bot/messages/$user_addr/$timestamp/user` path. Since `my-bot-trigger` is a temporary name, please customize it and set it as your own trigger name.

You can check that the function is successfully set with the `getFunction` function.

Below is an example of a triggering value (at .../user) and another value (at .../echo-bot) that was written as a response to the triggering value by Echo bot 👾. Echo bot ([http://echo-bot.ainetwork.ai/trigger](http://echo-bot.ainetwork.ai/trigger)), if set properly, will respond to your message by setting a value itself.

```javascript
// '/apps/<app-name>/messages/<user-addr>/<timestamp>'
{
  "user": "Hello!",
  "echo-bot": "Did you mean \"Hello!\"?"
}
```

## Step 11. Set values

Everything is set! Now, you can write values with the `setValue` function.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}. With the admin config below,
// only 'myAddress' will have owner & write permissions at /apps/${appName}.
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [myAddress]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7 days in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });

// Check the owner permissions have been set properly.
ain.db
  .ref(appPath)
  .getOwner()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    /*
    {
      ".owner": {
        "owners": {
          [myAddress]: {
            "branch_owner": true,
            "write_function": true,
            "write_owner": true,
            "write_rule": true
          }
        }
      }
    }
    */
  });

// Set write rules.
ain.db
  .ref(appPath)
  .setRule({
    value: {
      '.rule': {
        write: true, // Anyone can write values at the appPath.
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });

// Set a function to be triggered when writing values at the functionPath.
const functionPath = `${appPath}/messages/$user_addr/$timestamp/user`; // Wild cards!
ain.db
  .ref(functionPath)
  .setFunction({
    value: {
      '.function': {
        'my-bot-trigger': {
          // Use your own function id
          function_type: 'REST',
          function_url: 'http://echo-bot.ainetwork.ai/trigger', // An endpoint to your event listener server
          function_id: 'my-bot-trigger', // Use your own function id
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });

// Set a value at a path and trigger the previously set function.
const userMessagePath = `${appPath}/messages/${myAddress}`;
ain.db
  .ref(`${userMessagePath}/${Date.now()}/user`)
  .setValue({
    value: 'Hello!',
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```

{% endcode %}

Check the written value with the `getValue` function.

{% code title="createApp.js" %}

```javascript
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 'wss://testnet-event.ainetwork.ai', 0);

// Import the account you've created in Step 3.
ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
const myAddress = ain.wallet.defaultAccount.address;

const appName = 'my_bot'; // Use your own app name
const appPath = `/apps/${appName}`;

// Create an app at /apps/${appName}. With the admin config below,
// only 'myAddress' will have owner & write permissions at /apps/${appName}.
ain.db
  .ref(`/manage_app/${appName}/create/${Date.now()}`)
  .setValue({
    value: {
      admin: {
        [myAddress]: true,
      },
      service: {
        staking: {
          lockup_duration: 604800000, // 7 days in ms
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  });

// Check the owner permissions have been set properly.
ain.db
  .ref(appPath)
  .getOwner()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    /*
    {
      ".owner": {
        "owners": {
          [myAddress]: {
            "branch_owner": true,
            "write_function": true,
            "write_owner": true,
            "write_rule": true
          }
        }
      }
    }
    */
  });

// Set write rules.
ain.db
  .ref(appPath)
  .setRule({
    value: {
      '.rule': {
        write: true, // Anyone can write values at the appPath.
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });

// Set a function to be triggered when writing values at the functionPath.
const functionPath = `${appPath}/messages/$user_addr/$timestamp/user`; // Wild cards!
ain.db
  .ref(functionPath)
  .setFunction({
    value: {
      '.function': {
        'my-bot-trigger': {
          // Use your own function id
          function_type: 'REST',
          function_url: 'http://echo-bot.ainetwork.ai/trigger', // An endpoint to your event listener server
          function_id: 'my-bot-trigger', // Use your own function id
        },
      },
    },
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });

// Set a value at a path and trigger the previously set function.
const userMessagePath = `${appPath}/messages/${myAddress}`;
ain.db
  .ref(`${userMessagePath}/${Date.now()}/user`)
  .setValue({
    value: 'Hello!',
    nonce: -1,
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });

// Check that the value is set correctly. If the echo bot is alive,
// it should have written a response to your message.
ain.db
  .ref(userMessagePath)
  .getValue()
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
    /*
    {
      "1631691438245": {
        "user": "Hello!",
        "echo-bot": "Did you mean \"Hello!\"?" // Written by the echo bot.
      }
    }
    */
  });
```

{% endcode %}
