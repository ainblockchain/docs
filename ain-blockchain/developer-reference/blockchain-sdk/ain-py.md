# ain-py

[ain-py](https://github.com/ainblockchain/ain-py) is the Python SDK. Public APIs execute on L2 by default. Specify chain ID 0 for Testnet and 1 for Mainnet; the Python constructor defaults to 0, including when given a Mainnet URL.

## Install

Verified with Python 3.10 in an isolated virtual environment:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install ain-py==1.3.0 simplejson==3.19.2
```

Version 1.3.0 omits `simplejson` from its package runtime dependencies, so it must be installed explicitly until the packaging fix is released.

## Read and write

After completing [Quick Start](../../developer-guide/getting-started.md), set `AIN_PRIVATE_KEY` securely and `AIN_APP` to your funded, staked app. Run this as a Python file:

```python
import asyncio
import os
import time
from ain.ain import Ain
from ain.types import ValueOnlyTransactionInput

async def main():
    ain = Ain('https://testnet-api.ainetwork.ai', 0)
    ain.wallet.addAndSetDefaultAccount(os.environ['AIN_PRIVATE_KEY'])
    ref = ain.db.ref('/apps/' + os.environ['AIN_APP'] + '/python')
    result = await ref.setValue(ValueOnlyTransactionInput(
        value='ain-py verified', nonce=-1, gas_price=500))
    print(result['tx_hash'])
    deadline = time.time() + 120
    while time.time() < deadline:
        tx = await ain.getTransactionByHash(result['tx_hash'])
        if tx and tx.get('is_finalized'):
            if tx.get('receipt', {}).get('code') != 0:
                raise RuntimeError('Transaction reverted')
            print(await ref.getValue())
            return
        await asyncio.sleep(1)
    raise RuntimeError('Still pending; inspect the hash before retrying')

asyncio.run(main())
```

This verifies direct L2 submission. The Python SDK does not automatically construct the AIN v2 L1 inbox envelope; use the [layer-aware JavaScript SDK](../../developer-guide/ain-v2-layers.md) for that flow.
