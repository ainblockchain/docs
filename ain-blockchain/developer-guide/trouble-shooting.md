# Troubleshooting

## State budget exceeded

Error 10907 indicates that an app exceeds its available state budget. An initially failed execution may remain in the transaction pool and later execute. Query the returned transaction hash before retrying. Stake AIN to the app and wait for finalization before submitting dependent writes. Capacity depends on network parameters and other stake; no fixed AIN amount guarantees an arbitrary data size. See [Quick Start](getting-started.md).

State garbage collection can bound the number of children under a history path. It removes old state, so apply it only where pruning is intended. It does not erase historical blockchain transactions.

The following is a transaction body to send with `ain.sendTransaction(txBody)` inside the initialized Quick Start program:

```js
const txBody = {
  operation: {
    type: 'SET_RULE',
    ref: `/apps/${appName}/history`,
    value: {
      '.rule': {
        state: { gc_max_siblings: 50, gc_num_siblings_deleted: 10 }
      }
    }
  },
  gas_price: 500,
  timestamp: Date.now(),
  nonce: -1
};
```

## Wrong chain ID or old timestamp

Sign new application transactions with Mainnet 1 or Testnet 0. A gateway cannot change the domain of a signed payload. Regenerate an obsolete unsigned request with the current timestamp and sign it again after checking that the original transaction did not execute. See [chain IDs](../ai-network-design/network-id-and-chain-id.md).

## Successful submission but missing state

Check the execution result code, then wait for a finalized receipt or finalized read. L1 inbox submission also requires subsequent L2 execution. Read L2 app state with the default client; explicit L1 reads show L1 state.

## REST callback did not run

Public AIN v2 validators have REST function calls disabled. Registering a REST function does not enable outbound callbacks. Use an event subscriber with retry and deduplication, or arrange an explicitly configured operator service. Never expose a callback that executes arbitrary code from transaction values.
