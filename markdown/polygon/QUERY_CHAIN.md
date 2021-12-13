# 🧩 Ethers API Queries

In order to gather information from the blockchain, we will use ethers again. For basic interaction with Polygon, the [provider](https://docs.ethers.io/v5/api/providers/provider/) methods are often most useful.

---

# 🏋️ Challenge

{% hint style="tip" %}
**Imagine this scenario:** As the lead developer of a cool new dApp, you need to create a way to query information from the blockchain and then display it on the UI. In **`components/protocols/polygon/challenges/query.ts`**, assign values to the following variables : `chainId` , `blockHeight` , `gasPriceAsGwei` , `blockInfo`.
{% endhint %}

**Take a few minutes to figure this out.**

```typescript
//...
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const networkName = await provider.getNetwork().then(res => { return res.name })

    // TODO: Define the variables below
    const chainId = undefined;
    const blockHeight = undefined;
    const gasPriceAsGwei = undefined;
    const blockInfo = undefined;

    if (!chainId || !blockHeight || !gasPriceAsGwei || !blockInfo) {
      throw new Error('Please complete the code');
    }

    return {
      data: {
        networkName,
        chainId,
        blockHeight,
        gasPriceAsGwei,
        blockInfo,
      },
    };
  }
//...
```

**Need some help?** Check out these links 👇

- [Getting the network's chainId](https://ethereum.stackexchange.com/questions/82365/how-get-network-id-with-ethers-js)
- How to get a [block number (or block height) from ethers](https://docs.ethers.io/v5/api/providers/provider/#Provider-getBlockNumber)
- What is [gas price and gwei](https://gwei.io/)? And how to [get it from ethers](https://docs.ethers.io/v5/api/providers/provider/#Provider-getGasPrice)
- [Formatting units](https://docs.ethers.io/v5/api/utils/display-logic/#utils-formatUnits) from BigNumber to gwei

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//...
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const networkName = await provider.getNetwork().then((res) => {
      return res.name;
    });

    const chainId = provider.network.chainId;
    const blockHeight = await provider.getBlockNumber();
    const gasPriceAsGwei = await provider.getGasPrice().then((res) => {
      return ethers.utils.formatUnits(res, 'gwei');
    });
    const blockInfo = await provider.getBlockWithTransactions(blockHeight);

    if (!chainId || !blockHeight || !gasPriceAsGwei || !blockInfo) {
      throw new Error('Please complete the code');
    }

    return {
      data: {
        networkName,
        chainId,
        blockHeight,
        gasPriceAsGwei,
        blockInfo,
      },
    };
  }
//...
```

**What happened in the code above?**

- The `networkName` awaits `provider.getNetwork` because it returns a Promise, and then we will return the name property of the response object.
- We can get the `chainId` as a property of `provider.network`.
- `blockHeight` can be taken directly from the returned value of `getBlockNumber`
- `gasPriceAsGwei` gets the current gas price and then formats the value into a human-friendly number with the ethers utility function `formatUnits`.
- `blockInfo` must be a BlockWithTransactions type, which is what the function `getBlockWithTransactions` returns.

---

# ✅ Make sure it works

Once the code in `components/protocols/polygon/challenges/query.ts` is complete, click on **Query Polygon** to send a request to the network and display some important information contained in a recent block on the page.

---

# 🏁 Conclusion

Now that we have queried Polygon and retrieved information from the blockchain, we will want to get **MATIC** tokens into our wallet so we can pay the fees to deploy a smart contract. In the next tutorial, we will cover how to fund an account with **MATIC** through the official faucet.
