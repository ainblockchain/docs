---
description: >-
  This document provides troubleshooting guidance when using the AIN Blockchain.
---

# Trouble Shooting

### Exeeded Free tier budget.
Error message
```
Exceeded state budget limit for free tier (42479668 > 25000000)
```

You need to stake AIN token to your app if you want to write more data. [How to stake](https://docs.ainetwork.ai/ain-blockchain/developer-guide/getting-started#step-8.-stake-ain-to-your-app)

You can manage your app data capacity to using garbage collection rule.

```javascript
const txBody = {
  operation: {
    typeL 'SET_RULE',
    ref: `/apps/${appName}/PATH_TO_SET_GC_RULE`
    value: {
      ".rule": {
        state: {
          gc_max_siblings: 50,
          gc_num_siblings_deleted: 10, // You should set this over 10.
        },
      }
    },
    gas_price: 500,
    timestamp: Date.now(),
    nonce: -1,
  }
}
```
