# Nonce

AIN supports three transaction ordering modes. All modes still require a valid signature, the active chain ID, an allowed timestamp, sufficient resources, and permission under the state rules.

| Mode | `nonce` | Ordering |
| --- | --- | --- |
| Numbered | Integer >= 0 | Must match the account's next nonce; a new account starts at 0. |
| Unordered | -1 | No account nonce ordering; duplicate transactions are rejected. |
| Timestamp ordered | -2 | Timestamp must be strictly greater than the account's preceding ordered timestamp. |

Query the account's nonce through the SDK/API instead of calculating it from a count of historical transactions. Concurrent clients must coordinate numbered nonces. A stale numbered nonce is invalid; do not assume an arbitrary future nonce will remain queued until accepted.

Use a fresh millisecond timestamp for a new transaction. After an execution-chain-ID transition, a pre-transition timestamp or an obsolete chain-domain signature is rejected even with nonce -1. To retry an uncertain submission, query its transaction hash before creating another transaction.
