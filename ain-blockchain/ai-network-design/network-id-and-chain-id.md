# Network ID and Chain ID

AIN v2 public APIs execute application transactions on L2 by default. The public signing IDs remain **Mainnet 1** and **Testnet 0**. Query `net_getChainId` before offline signing; the chain ID is part of the signature domain.

| Network | Public L2 chain ID | L2 P2P network ID | L1 chain ID | L1 P2P network ID |
| --- | --- | --- | --- | --- |
| Mainnet | 1 | 2026092503 | 101 | 2026092501 |
| Testnet | 0 | 2026092504 | 102 | 2026092502 |

L2 genesis, consensus, and checkpoint identities retain their deployment IDs: Mainnet 103 and Testnet 104. These are **not** the IDs to use for new application transaction signatures. `ain_getLayerInfo` exposes `chain_id` and `checkpoint_chain_id` separately.

The execution-domain transition was activated on September 25, 2026 without replacing genesis or rewriting prior blocks. New submissions must use the current signing ID and a timestamp after activation. Historical transaction verification uses the domain active in the corresponding historical state. Previously signed 103/104 application transactions cannot be resubmitted unchanged.

For L1 submission, use the layer-aware SDK. It signs the inner L2 transaction with 1/0 and its L1 inbox envelope with 101/102. Merely changing a normal application's chain ID to 101/102 does not construct this envelope.

These values describe the deployed Mainnet and Testnet. Local development networks use their own configuration.

See [AIN v2 layers](../developer-guide/ain-v2-layers.md) for endpoints, finality, migration, and submission examples.
