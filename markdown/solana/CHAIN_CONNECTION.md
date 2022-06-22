In the following tutorials, we're going to interact with the Solana blockchain (and in particular its Devnet network) using the `@solana/web3.js` library. It's a convenient way to interface with the RPC API when building a Javascript application. Under the hood it implements Solana's RPC methods and exposes them as Javascript objects. We will explore it together as we add features to our app.

You can choose which Cluster to connect to using the dropdown located in the top right of the UI, as shown below. For the Pathway, we can connect to Datahub or Devnet. If you are using a Test Validator, select the Localnet option.

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/solana/solana-chain-connection.png)

---

# 🏋️ Challenge

{% hint style="tip" %}
In `pages/api/solana/connect.ts`, implement `connect` by creating a `Connection` instance and getting the API version. You must replace the instances of `undefined` with working code to accomplish this.
{% endhint %}

**Take a few minutes to figure this out**

```typescript
//...
  try {
    const {network} = req.body;
    const url = getNodeURL(network);
    const connection = undefined;
    const version = undefined;
    res.status(200).json(version["solana-core"]);
  }
 //...
```

**Need some help?** Check out these links 👇

- [Creating a `Connection` instance](https://solana-labs.github.io/solana-web3.js/classes/Connection.html#constructor)
- [Getting the API `version`](https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getVersion)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//...
  try {
    const {network} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const version = await connection.getVersion();
    res.status(200).json(version['solana-core']);
  }
//...
```

**What happened in the code above?**

- We created a `connection` instance of the `Connection` class using the `new` constructor.
- We then call `getVersion` on that `connection` instance. The docs state that `connection.getVersion` returns a Promise, so remember to use the `await` syntax.

---

# ✅ Make sure it works

Once you've made the necessary changes to `pages/api/solana/connect.ts` and saved the file, click on the blue 'power icon' button on the right side of the screen to connect & display the current version of the Solana node!

---

# 🏁 Conclusion

We're going to use this `connection` instance every time we need to connect to Solana. Now we're going to want to move some tokens around, but first we need an account to hold tokens! That's what we'll do in the next tutorial, create a keypair on Solana so that we have an account.
