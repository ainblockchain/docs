# Set metadata of AINFT

This tutorial describes how to update AINFT’s metadata with ainft-js. If you don’t have AINFT, See AINFT tutorial - Create & Mint.

### Set metadata

Only AINFT object owner can update metadata of each token. Metadata is configured as JSON format.

```jsx
const AinftJs = require('@ainft-team/ainft-js').default;

const privateKey = 'AINFT_OBJECT_OWNER_PRIVATE_KEY';
const config = {
  ainftServerEndpoint: '<https://ainft-api-dev.ainetwork.ai>',
  ainBlockchainEndpoint: '<https://testnet-api.ainetwork.ai>',
}
const ainftJs = new AinftJs(privateKey, config);

const ainftObjectId = '0x6c4605D7a3abAd19f9BbA986746aDF9fFCBE6f9A';
const tokenId = '1';
const metadata = {
	name: 'my first token',
	image: '<https://miro.medium.com/v2/resize:fit:2400/1*GWMy0ibykACFKS_rRxFlcw.png>'
}

const main = async () => {
	try {
		const ainftObject = await ainftJs.nft.get(ainftObjectId);
	  const ainft = await ainftObject.getToken(tokenId);
	  const result = await ainft.setMetadata(metadata);
	  console.log(result);
	} catch(error) {
		console.log(error);
	}
}

main();

// {
//   tx_hash: '0x9009753dcb212a0b4c898022e38afd8d5a02200ef6429a4e4048ddf9c0e6a5a1',
//     result: {
//     gas_amount_total: { bandwidth: [Object], state: [Object] },
//     gas_cost_total: 0,
//       func_results: {
//       '0x6c4605D7a3abAd19f9BbA986746aDF9fFCBE6f9A_trigger_metadata': [Object]
//     },
//     code: 0,
//       bandwidth_gas_amount: 1,
//         gas_amount_charged: 0
//   }
// }
```

You can check if transaction is completed using `tx_hash` in insight.

> [https://testnet-insight.ainetwork.ai/](https://testnet-insight.ainetwork.ai/)

<figure><img src="../../../.gitbook/assets/set metadata transaction.png" alt=""><figcaption></figcaption></figure>

You can check updated metadata through the insight database.

<figure><img src="../../../.gitbook/assets/set meatdata database.png" alt=""><figcaption></figcaption></figure>
