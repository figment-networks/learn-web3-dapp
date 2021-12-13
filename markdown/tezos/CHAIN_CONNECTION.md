In this tutorial we will learn how to connect to a Tezos node via DataHub, using functions from the Taquito JavaScript library.

---

# 🏋️ Challenge

{% hint style="tip" %}
In `pages/api/tezos/connect.ts`, implement the function and try to establish your first connection to the Tezos network. To verify that the connection has been made, try to return the chainId. You must replace the instances of `undefined` with working code to accomplish this.
{% endhint %}

```typescript
//...
  try {
    const {network} = req.body;
    const url = getNodeUrl(network);
    const toolkit = undefined;
    const chainId = undefined;
    if (validateChain(chainId) != 3) {
      throw Error('invalid chain Id');
    }
    res.status(200).json(chainId);
  }
//...
```

**Need some help?** Check out these links 👇

- [**Class `TezosToolkit`**](https://tezostaquito.io/typedoc/classes/_taquito_taquito.tezostoolkit.html)
- [**Taquito**](https://tezostaquito.io/typedoc/modules.html)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
  try {
    const {network} = req.body;
    const url = getNodeUrl(network);
    const toolkit = new TezosToolkit(url);
    const chainId = await toolkit.rpc.getChainId();
    if (validateChain(chainId) != 3) {
      throw Error('invalid chain Id');
    }
    res.status(200).json(chainId);
  }
```

**What happened in the code above?**

- `getNodeUrl` is a helper function used to generate a valid endpoint URL.
- The `TezosToolkit` instance manages the connection.
- Unlike other blockchains, Tezos does not expose a software version for nodes. We will instead retrieve the Chain ID with `getChainId`.

---

# ✅ Make sure it works

Once the code in `pages/api/tezos/connect.ts` is complete, click on the blue button to connect to Tezos & display the Chain ID.

---

# 🏁 Conclusion

Congratulations! You have connected to the Tezos blockchain and queried the chain ID with a few lines of JavaScript code. In the next tutorial, we will create an account for use on Florence, the Tezos testnet.
