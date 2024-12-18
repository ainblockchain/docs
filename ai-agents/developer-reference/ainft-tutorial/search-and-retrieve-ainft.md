# Search and Retrieve AINFT

This tutorial describe how to retrieve AINFTs by id, name, symbol and userAddress.

### Retrieve AINFTs

You can retrieve AINFTs using `geAinftsByAccount` or `getAinftsByAinftObject` .

```jsx
ainftJs.nft.getAinftsByAccount(userAddress)
	.then((res) => {
		console.log(JSON.stringify(res, null, 2));
	})
	.catch((error) => {
		console.log(error);
	})
```

```jsx
ainftJs.nft.getAinftsByAinftObject(ainftObjectId)
	.then((res) => {
		console.log(JSON.stringify(res, null, 2));
	})
	.catch((error) => {
		console.log(error);
	})
```

### Search Ainft object and AINFTs

Also, you can search ainft objects or AINFTs. Search options are below.

* ainftObjectId - The ID of Ainft object
* name - The name of Ainft object
* symbol - The symbol of Ainft object
* tokenId - Token ID of AINFT
* userAddress - Address of AINFT owner

```jsx
ainftJs.nft.searchAinftObjects({ ainftObjectId })
	.then((res) => {
		console.log(JSON.stringify(res, null, 2));
	})
	.catch((error) => {
		console.log(error);
	});
```

```jsx
ainftJs.nft.searchNfts({ ainftObjectId })
	.then((res) => {
		console.log(JSON.stringify(res, null, 2));
	})
	.catch((error) => {
		console.log(error);
	});
```

#### Response

```jsx
// Return Type
{
	nfts: Array<{
		owner: string,
		tokenId: string,
		tokenURI: string,
		ainftObject: {
			id: string,
			name: string,
			symbol: string,
			owner: string,
		}
		metadata: object,
	}>,
	isFinal: boolean,
	cursor: string,
}

{
	ainftObjects: Array<{
		id: string,
		name: string,
		symbol: string,
		owner: string,
	}>,
	isFinal: boolean,
	cursor: string,
}
```

### Limit

Search function retrieves 20 items by default. If you want to set number of result items, you can use limit option. Maximum limit value is 100.

```jsx
const ainftObjects = await ainftJs.nft.searchAinftObjects({ limit: 5 })
```

then, you can retrieve more with using cursor.

```jsx
const nextAinftObjects = await ainftJs.nft.searchAinftObjects({ limit: 5, cursor: '0x460e3BC2E6D98Bc2b434DE4854Bf4a08E63eb3A2' });
```

The cursor value is included in result of search. If you search nfts, usage is the same.
