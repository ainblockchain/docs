---
description: >-
  AI Network operates a token bridge between AIN native coins and AIN ERC20
  tokens on Ethereum. Disclaimer: Check-in and check-out requests may take a few
  days to be processed.
---

# Token Bridge

Note: This guide assumes that you have an Ethereum wallet with some AIN ERC20 tokens in it. You can buy AIN ERC20 tokens on Uniswap, Balancer, or GOPAX.

#### AIN ERC20 Token Addresses

* Mainnet: [0x3A810ff7211b40c4fA76205a14efe161615d0385](https://etherscan.io/address/0x3a810ff7211b40c4fa76205a14efe161615d0385)
* Testnet (ropsten): [0xB16c0C80a81f73204d454426fC413CAe455525A7](https://ropsten.etherscan.io/address/0xB16c0C80a81f73204d454426fC413CAe455525A7)

#### AIN Native Token Pool Addresses

* Mainnet
  * Ethereum: [0x00CC50B6DC70cC854B1231272FDe0b0CFE561d72](https://etherscan.io/address/0x00CC50B6DC70cC854B1231272FDe0b0CFE561d72)
  * AI Network: [0x00CC0491CdA2dA91385C9c424852Ae096B7AbD89](https://insight.ainetwork.ai/accounts/0x00CC0491CdA2dA91385C9c424852Ae096B7AbD89)
* Testnet
  * Ethereum: [0x00AA9daA2aC950fF445B435Af7F6c39C5c65D677](https://ropsten.etherscan.io/address/0x00aa9daa2ac950ff445b435af7f6c39c5c65d677)
  * AI Network: [0x00AA7d797FB091AF6dD57ec71Abac8D2066BE298](https://testnet-insight.ainetwork.ai/accounts/0x00AA9daA2aC950fF445B435Af7F6c39C5c65D677)&#x20;

## Check-in

Here, a check-in refers to a transfer of your AIN ERC20 tokens on Ethereum to AI Network as AIN native coins.

### 1. Send your AIN ERC20 tokens to the AI Network ERC20 Token Pool address.

#### 1-1. Using a MetaMask, Add AIN ERC20 Token to your list of tokens.

![1. Click import tokens](<../../.gitbook/assets/Screen Shot 2022-01-09 at 4.54.44 PM.png>) ![2. Enter the AIN ERC20 address](<../../.gitbook/assets/Screen Shot 2022-01-09 at 4.57.17 PM.png>) ![3. Click Import Tokens](<../../.gitbook/assets/Screen Shot 2022-01-09 at 4.57.34 PM.png>)

#### 1-2. Send AIN ERC20 to AI Network ERC20 Token Pool.

AI Network ERC20 Token Pool address

* Mainnet: [0x00CC50B6DC70cC854B1231272FDe0b0CFE561d72](https://etherscan.io/address/0x00CC50B6DC70cC854B1231272FDe0b0CFE561d72)
* Testnet: [0x00AA9daA2aC950fF445B435Af7F6c39C5c65D677](https://ropsten.etherscan.io/address/0x00aa9daa2ac950ff445b435af7f6c39c5c65d677)

:warning:Make sure you are on the right network (Ethereum Mainnet vs Ropsten Test Network) before sending your assets.

There is no minimum/maximum amount you need to check-in.

![1.Click send](<../../.gitbook/assets/Screen Shot 2022-01-09 at 5.03.44 PM.png>) ![2. Enter the AI Network ERC20 Token Pool address](<../../.gitbook/assets/Screen Shot 2022-01-11 at 9.29.33 PM.png>) ![3. Confirm](<../../.gitbook/assets/Screen Shot 2022-01-11 at 9.30.09 PM.png>)

#### 1-3. Make sure the transaction is successfully executed.

You can view your transaction on Etherscan by clicking the transaction on MetaMask and then "View on block explorer".

![Click View on block explorer to see your transaction on Etherscan.](<../../.gitbook/assets/Screen Shot 2022-01-11 at 9.31.03 PM.png>)

### 2. Send a check-in request transaction to the AI Network blockchain.

{% code title="check-in-mainnet.js" %}
```javascript
/* This code snippet is for Mainnet! */
const stringify = require('fast-json-stable-stringify');
const Accounts = require('web3-eth-accounts');
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://mainnet-api.ainetwork.ai', 1); // chainId = 1 (mainnet)
const ethAccounts = new Accounts();
const ainErc20TokenAddress = '0x3A810ff7211b40c4fA76205a14efe161615d0385';
​
// Create 1 new account
const accounts = ain.wallet.create(1);
// WARNING: Make sure to record this private key somewhere safe! We cannot retrieve it for you!
console.log(JSON.stringify(ain.wallet.accounts, null, 2));
const myAddress = accounts[0];
ain.wallet.setDefaultAccount(myAddress);
// Or, import an account you already have
// const myAddress = ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);

// Create a sender proof with your Ethereum key (sender)
const timestamp = Date.now();
const ref = `/checkin/requests/ETH/1/${ainErc20TokenAddress}/${myAddress}/${timestamp}`;
// Should be exactly the same as the AIN ERC20 token you sent in Step 1-2.
const amount = 20000;
// Sender is the Ethereum address that you used to send AIN ERC20 token in Step 1-2.
const sender = 'YOUR-ETHEREUM-ADDRESS';
const senderPrivateKey = 'YOUR-ETHEREUM-PRIVATE-KEY';
const senderProofBody = {
  ref,
  amount,
  sender,
  timestamp,
  nonce: -1,
};
const senderProof = ethAccounts.sign(ethAccounts.hashMessage(stringify(senderProofBody)), senderPrivateKey).signature;

// Send a check-in request
ain.db.ref(ref)
  .setValue({
    value: {
      amount,
      sender: myAddress,
      sender_proof: senderProof,
    },
    nonce: -1,
    gas_price: 500,
    timestamp: timestamp // Should be the same as the checkinId in ref
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```
{% endcode %}

{% code title="check-in-testnet.js" %}
```javascript
/* This code snippet is for Testnet! */
const stringify = require('fast-json-stable-stringify');
const Accounts = require('web3-eth-accounts');
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 0); // chainId = 0 (testnet)
const ethAccounts = new Accounts();
const ainErc20TokenAddress = '0xB16c0C80a81f73204d454426fC413CAe455525A7';
​
// Create 1 new account
const accounts = ain.wallet.create(1);
// WARNING: Make sure to record this private key somewhere safe! We cannot retrieve it for you!
console.log(JSON.stringify(ain.wallet.accounts, null, 2));
const myAddress = accounts[0];
ain.wallet.setDefaultAccount(myAddress);
// Or, import an account you already have
// const myAddress = ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);

// Create a sender proof with your Ethereum key (sender)
const timestamp = Date.now();
const ref = `/checkin/requests/ETH/3/${ainErc20TokenAddress}/${myAddress}/${timestamp}`;
// Should be exactly the same as the AIN ERC20 token you sent in Step 1-2.
const amount = 20000;
// Sender is the Ethereum address that you used to send AIN ERC20 token in Step 1-2.
const sender = 'YOUR-ETHEREUM-ADDRESS';
const senderPrivateKey = 'YOUR-ETHEREUM-PRIVATE-KEY';
const senderProofBody = {
  ref,
  amount,
  sender,
  timestamp,
  nonce: -1,
};
const senderProof = ethAccounts.sign(ethAccounts.hashMessage(stringify(senderProofBody)), senderPrivateKey).signature;

// Send a check-in request
ain.db.ref(ref)
  .setValue({
    value: {
      amount,
      sender,
      sender_proof: senderProof,
    },
    nonce: -1,
    gas_price: 500,
    timestamp: timestamp // Should be the same as the checkinId in ref
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```
{% endcode %}

### 3. Check that your AI Network account's balance has increased on Insight.

You can check your AI Network account's balance at the AI Network blockchain explorer.

* Mainnet: https://insight.ainetwork.ai/accounts/${YOUR-AIN-ADDRESS}
* Testnet:  https://testnet-insight.ainetwork.ai/accounts/${YOUR-AIN-ADDRESS}

## Check-out

Similarly, a check-out refers to a transfer of your AIN native coins on AI Network to Ethereum as AIN ERC20 tokens.

### 1. Send a check-out request transaction to the AI Network blockchain.

For check-out's, there is a minimum and a maximum allowed per request as well as a maximum per day for the entire network. Currently the limits are:

* Minimum check-out amount per request: 10,000 AIN
* Maximum check-out amount per request: 100,000 AIN
* Maximum check-out amount per day for the network: 1,000,000 AIN

```javascript
/* This code snippet is for Mainnet! */
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 1); // chainId = 1 (mainnet)
const ainErc20TokenAddress = '0x3A810ff7211b40c4fA76205a14efe161615d0385';
​
// Import an account you created in the check-in process
const myAddress = ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);

// Send a check-in request
const timestamp = Date.now();
const ref = `/checkout/requests/ETH/1/${ainErc20TokenAddress}/${myAddress}/${timestamp}`;
const amount = 10000;
// This is the Ethereum address that will receive the AIN ERC20 tokens
const recipient = 'YOUR-ETHEREUM-ADDRESS';
ain.db.ref(ref)
  .setValue({
    value: {
      amount,
      recipient,
      fee_rate: 0.001
    },
    nonce: -1,
    gas_price: 500,
    timestamp: timestamp // Should be the same as the checkoutId in ref
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```

```javascript
/* This code snippet is for Testnet! */
const Ain = require('@ainblockchain/ain-js').default;
const ain = new Ain('https://testnet-api.ainetwork.ai', 0); // chainId = 0 (testnet)
const ainErc20TokenAddress = '0xB16c0C80a81f73204d454426fC413CAe455525A7';
​
// Import an account you created in the check-in process
const myAddress = ain.wallet.addAndSetDefaultAccount(YOUR_PRIVATE_KEY);
​
// Send a check-in request
const timestamp = Date.now();
const ref = `/checkout/requests/ETH/3/${ainErc20TokenAddress}/${myAddress}/${timestamp}`;
const amount = 10000;
// This is the Ethereum address that will receive the AIN ERC20 tokens
const recipient = 'YOUR-ETHEREUM-ADDRESS';
ain.db.ref(ref)
  .setValue({
    value: {
      amount,
      recipient,
      fee_rate: 0.001
    },
    nonce: -1,
    gas_price: 500,
    timestamp: timestamp, // Should be the same as the checkoutId in ref
  })
  .then((res) => {
    console.log(JSON.stringify(res, null, 2));
  });
```

### 2. Check that your transaction was successfully added to the blockchain on Insight.

You can view your transaction at:

* Mainnet: https://insight.ainetwork.ai/transactions/${txHash}
* Testnet: https://testnet-insight.ainetwork.ai/transactions/${txHash}

### 3. Check that your Ethereum wallet has received AIN ERC20 tokens.

You can confirm your increased AIN ERC20 token balance on either MetaMask or Etherscan.

* Mainnet: https://etherscan.io/address/${ethereumAddress}
* Testnet: https://ropsten.etherscan.io/address/${ethereumAddress}

