---
description: >-
  This guide will instruct you on how to set up a validator node on the AI
  Network.
---

# Validators

:warning: Warning: You may earn rewards by running validators, but if you get slashed by your mistake, you can lose your money and reputation.

### Validator Parameters

* Annual reward rate: \~8% + transaction fees (varies)
* Unbonding period: 7 days
* Payout frequency: Every block (\~20 seconds)

## Initial Set-up

### Requirements

#### Minimum stake requirements

None for validators without proposal rights. If you'd like to run a proposer node, contact us at info@ainetwork.ai.

#### Hardware requirements

* 16 CPUs
* 64GB Memory
* 2TB Disk (SSD preferably)
* Example GCP Instance: c2-standard-16

#### Networking requirements

* Reserve a static, publicly routable IPv4 IP address for your node.
* Your firewalls should expose TCP/5000 and TCP/8080

#### OS requirements

* Ubuntu 18.04 or above

## Running a Validator

While AI Network is in beta testing mode, we're only allowing whitelisted nodes to participate as validators. Please contact info@ainetwork.ai if you're interested.

1\. Git clone & install dependencies

```
git clone https://github.com/ainblockchain/ain-blockchain.git
cd ain-blockchain
yarn install
```

2\. Start a node

* Using a keystore file

```
BLOCKCHAIN_CONFIGS_DIR=blockchain-configs/mainnet-prod \
    STAKE=10000 \
    ACCOUNT_INJECTION_OPTION=keystore \
    KEYSTORE_FILE_PATH=/path/to/keystore/file \
    nohup node --max-old-space-size=55000 client/index.js >/dev/null 2>error_logs.txt &
```

* Using a mnemonic phrase

```
BLOCKCHAIN_CONFIGS_DIR=blockchain-configs/mainnet-prod \
    STAKE=10000 \
    ACCOUNT_INJECTION_OPTION=mnemonic \
    nohup node --max-old-space-size=55000 client/index.js >/dev/null 2>error_logs.txt &
```



3\. Inject your account into your node

*   Using a Keystore file

    The following command requires two inputs: the path of your Keystore file and its password.

```
node inject_account_gcp.js <NODE_ENDPOINT_URL> --keystore
```

*   Using a mnemonic phrase

    The following command requires two inputs: a mnemonic phrase and an account index. If you do not enter an account index, it is set to the default value of 0.

```
node inject_account_gcp.js <NODE_ENDPOINT_URL> --mnemonic
```

4\. Check out your node on the blockchain explorer!

https://insight.ainetwork.ai/nodes/${yourNodeAddress}

{% embed url="https://insight.ainetwork.ai/nodes" %}

## Running a Validator with Docker

Instead of starting from a git clone, you can use a pre-built docker image from [Docker Hub](https://hub.docker.com/repository/docker/ainblockchain/ain-blockchain).

1\. Pull Docker image from Docker Hub

```
docker pull ainblockchain/ain-blockchain:latest
```

2\. Run Docker image

* Using a Keystore file

```
docker run -e ACCOUNT_INJECTION_OPTION=keystore \
    -e SYNC_MODE=peer -e STAKE=10000 -e SEASON=mainnet \
    --network="host" -d ainblockchain/ain-blockchain:latest
```

* Using a mnemonic phrase\
  If you executed the second command, you don't need to manually inject your account into your node.

```
docker run -e ACCOUNT_INJECTION_OPTION=mnemonic \
    -e SYNC_MODE=peer -e STAKE=10000 -e SEASON=mainnet \
    --network="host" -d ainblockchain/ain-blockchain:latest
    
docker run -e ACCOUNT_INJECTION_OPTION=mnemonic -e MNEMONIC="your mnemonic" \
    -e SYNC_MODE=peer -e STAKE=10000 -e SEASON=mainnet \
    --network="host" -d ainblockchain/ain-blockchain:latest
```

3\. Inject your account into your node

* Using a Keystore file\
  The following command requires two inputs: the path of your Keystore file and its password.

```
node inject_account_gcp.js <NODE_ENDPOINT_URL> --keystore
```

*   Using a mnemonic phrase

    The following command requires two inputs: a mnemonic phrase and an account index. If you do not enter an account index, it is set to the default value of 0.

```
node inject_account_gcp.js <NODE_ENDPOINT_URL> --mnnemonic
```

4\. Check out your node on the blockchain explorer!

https://insight.ainetwork.ai/nodes/${yourNodeAddress}

{% embed url="https://insight.ainetwork.ai/nodes" %}
