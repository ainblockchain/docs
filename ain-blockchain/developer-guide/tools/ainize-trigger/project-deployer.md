# Project deployer

Let's find out how to handle the requests made by writing values on a specific path set by the project user.

#### (1) Install ain-py

First of all, let’s install ain-py. [ain-py](https://pypi.org/project/ain-py/) is a Python SDK used to interact with AI Network blockchain. It can be installed through PyPI.(We used version 0.1.4 in this tutorial.)

```bash
# if your server is node js server, use ain-js
# npm install @ain-blockchain/ain-js
pip install ain-py==0.1.4
```

#### (2) Import package

Then, import the packages that we will use in the tutorial.

```python
import os
import json
import logging
import asyncio
import torch
from ain.ain import Ain
from flask import Flask, request
from ain.types import ValueOnlyTransactionInput
from transformers import GPT2LMHeadModel, GPT2Tokenizer
```

`ain` : Package used to interact with AI network.

`asyncio` : Package for asynchronous programming. Used with `ain`.

`flask` : Package for web framework. Used to create API servers.

`transformers` : Package for dealing with natural language processing.

#### (3) Connect to a blockchain node

In this step, let’s connect with the blockchain node. `PROVIDER_URL` can contain the URL of AI Network's Test Net ([https://testnet-api.ainetwork.ai/](https://testnet-api.ainetwork.ai/)), Main Net ([https://mainnet-api.ainetwork.ai/](https://mainnet-api.ainetwork.ai/))).

To use ain-py on Main Net, `chainId` must be set to 1 (Test Net: 0, Main Net: 1)

```python
PROVIDER_URL = os.environ['PROVIDER_URL']
# if use testnet, set chainId to 0
ain = Ain(PROVIDER_URL, chainId=1)
```

#### (4) Set an account

If you are connected to the blockchain node, use the account's private key to set up your account. When deploying the project to Ainize, the environmental variable `AINIZE_INTERNAL_PRIVATE_KEY` will be automatically set. `addAndSetDefaultAccount` is a function that adds an account from a private key that enters the parameter and sets the account as the default account.

```python
AINIZE_INTERNAL_PRIVATE_KEY = os.environ['AINIZE_INTERNAL_PRIVATE_KEY']
ain.wallet.addAndSetDefaultAccount(AINIZE_INTERNAL_PRIVATE_KEY)
```

#### (5) Set values

At this point, everything should be ready! When a request comes in to the server, it will get the result value and write the result value on the AI Network Blockchain.

When a value is written in the specific path set by the project user, the trigger function will be triggered and a request will be sent to the registered endpoint.

```python
res = json.loads(request.data.decode('utf-8'))
print(res)
# {
#     "function": {
#         "function_id": "gpt2-pride-and-prejudice",
#         "function_type": "REST",
#         "function_url": "<https://main-ainize-trigger-tutorial-scy6500.endpoint.ainize.ai/trigger>"
#     },
#     "transaction": {
#         "address": "Oxbb5ecD24E8Bf0937d8c22D4440Fa95D50a1d108E",
#         "extra": {
#             "created_at": 1640223741870,
#             "executed_at": 1640223741870
#         },
#         "hash": "Oxeeb009260026a0fb030aa4218104ec2acecbed8c8cf4dba31650c1509cc2b0a1",
#         "signature": "Oxeeb009260026a0fb030aa4218104ec2acecbed8c8cf4dba31650c1509cc2b0a1a1dfa59513aac069f4a389e925cc885ae7b3ae7f8e1e2483603c555eb34288152c7b2b4ab774553cfe5f2761d16507fe500ea862ad0b34e52b436f5a91afa5cbib",
#         "tx_body": {
#             "nonce": -1,
#             "operation": {
#                 "is_global": false,
#                 "ref": "/apps/ainize_tutorial/Oxbb5ecD24E8Bf0937d8c22D4440Fa95D50a1d108E/1640223741870/user",
#                 "type": "SET_VALUE",
#                 "value": "{
#                     "baseText": "I love him. He's not proud. I was wrong. I was entirely wrong about him.",
#                     "len": 50
#                 }"
#             },
#             "timestamp": 1640223741430
#         }
#     }
# }
```

First, let's check if the incoming request is valid. We need to check if `transaction` , `tx_body`, `operation` are among the parameters of the request.

```python
if (not res.get('transaction') or
        not res['transaction'].get('tx_body') or
        not res['transaction']['tx_body'].get('operation')):
    return f'Invalid transaction : {res}', 400
transaction = res['transaction']['tx_body']['operation']
tx_type = transaction['type']
if tx_type != 'SET_VALUE':
    return f'Not supported transaction type : {tx_type}', 400
```

If the incoming request is valid, put the requested `value` into the model to get the result value and write the result value to the blockchain. To write a value to the blockchain, you need to use setValue of ain-py (but async was used to process it asynchronously). `path` contains the path to write the value, and `value` contains the value to write in the path.

```python
# path = /apps/appName/path/to/your/want
async def set_value(path, value):
    result = await ain.db.ref(path).setValue(
        ValueOnlyTransactionInput(
            value=value,
            nonce=-1
        )
    )
```

```python
value = eval(transaction['value'])
# Get the result by putting baseText and len as input to the model
result = make_story(value['baseText'], value['len'])
try:
    # Delete the 'user' of the ref to make the result_ref 
    # like /apps/appName/.../result
    result_ref = transaction['ref'].split('/')[:-1]
    result_ref.append('result')
    result_ref = '/'.join(result_ref)
    print(result_ref)
    # /apps/ainize_tutorial/Oxbb5ecD24E8Bf0937d8c22D4440Fa95D50a1d108E/1640223741870/result
    asyncio.run(set_value(result_ref, result))
except Exception as e:
    logging.error(f'setValue failure : {e}')
    return f'setValue failure : {e}', 500
return '', 204
```

You can see that the results are written correctly on the AI Network Blockchain.

![](<../../../../.gitbook/assets/image (19).png>)
