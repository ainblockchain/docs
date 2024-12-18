---
description: >-
  This document describes how to access AIN Wallet in a JavaScript based web
  app. Before following this article, make sure you have installed the AIN
  Wallet.
---

# AIN Wallet API

## What does AIN Wallet API do?

AIN Wallet injects a JavaScript API into websites using the `window.ainetwork` object. This API allows websites to request users' AI Network accounts, and assists users in signing messages or sending transactions.

## APIs

#### window.ainetwork.getAddress()

```typescript
window.ainetwork.getAddress(): Promise<string>
```

Returns the address of the currently active account.

#### window.ainetwork.getAccount()

<pre class="language-typescript"><code class="lang-typescript"><strong>interface Account {
</strong><strong>  name: string
</strong><strong>  address: string
</strong><strong>}
</strong><strong>
</strong><strong>window.ainetwork.getAccount(): Promise&#x3C;Account>
</strong></code></pre>

Returns the address of the currently active account.

#### window.ainetwork.getNetwork()

<pre class="language-typescript"><code class="lang-typescript"><strong>interface Network {
</strong><strong>  chainId: number
</strong><strong>  name: string
</strong><strong>}
</strong><strong>
</strong><strong>window.ainetwork.getAccount(): Promise&#x3C;Network>
</strong></code></pre>

Returns the address of the currently active account.

#### window.ainetwork.getBalance()

```typescript
window.ainetwork.getBalance(): Promise<number>
```

Returns the AIN token balance of the currently active account.

#### window.ainetwork.signMessage()

```typescript
window.ainetwork.signMessage(message: string): Promise<string>
```

Returns the signature for `message` signed with the private key of the currently active account.

#### window.ainetwork.sendTransaction()

```typescript
interface SetOperation {
  type: "SET_VALUE" | "INC_VALUE" | "DEC_VALUE" | "SET_RULE" | "SET_OWNER" | "SET_FUNCTION";
  ref: string;
  value: any | undefined | null;
  is_global?: boolean;
}

interface SetMultiOperation {
  type: "SET";
  op_list: SetOperation[];
}

interface TransactionInput {
  parent_tx_hash?: string;
  operation: SetOperation | SetMultiOperation;
  nonce?: number;
  address?: string;
  timestamp?: number;
  gas_price?: number;
  billing?: string;
}

window.ainetwork.sendTransaction(txInput: TransactionInput): Promise<string>
```

Sends transaction to the AI Network, and returns the transaction hash.
