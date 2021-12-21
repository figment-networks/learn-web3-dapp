In order to transfer some value to another account, we need to sign a transaction to the **network**. **NEAR** provides an abstract class to help us with this: **KeyStore**.

In this tutorial you are going to learn how to set your keystore in order to sign your transfer of tokens.

---

# 🏋️ Challenge

{% hint style="tip" %}
In`pages/api/near/transfer.ts`, implement the function. You must replace any instances of `undefined` with working code to accomplish this. There is a lot to fill here, so be careful!
{% endhint %}

**Take a few minutes to figure this out.**

```tsx
  try {
    const config = configFromNetwork(network);

    // recreate the keypair from secret
    const keypair = undefined;

    // Set the keystore with the expected method and args
    config.keyStore?.undefined;

    // Here we convert the NEAR into yoctoNEAR using utilities from NEAR lib
    const yoctoAmount = parseNearAmount(txAmount) as string;
    const amount = new BN(yoctoAmount);

    // Fill the Gap: connect, create an Account Object and send some money
    const near = undefined;
    const account = undefined;
    const transaction = undefined;

    return res.status(200).json(transaction.transaction.hash);
  }
//...
```

**Need some help?** Check out these links 👇

- [Manage a `KeyStore` in memory](https://near.github.io/near-api-js/classes/key_stores_in_memory_key_store.inmemorykeystore.html)
- [Check out the `sendMoney()` method](https://near.github.io/near-api-js/classes/account.account-1.html#sendmoney)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```tsx
// solution
//...
  try {
    const config = configFromNetwork(network)
    const keypair = KeyPair.fromString(secret)
    config.keyStore?.setKey("testnet", txSender, keypair)

    const yoctoAmount = parseNearAmount(txAmount) as string
    const amount = new BN(yoctoAmount)

    const near = await connect(config)
    const account = await near.account(txSender)
    const transaction = await account.sendMoney(txReceiver, amount)
    return res.status(200).json(transaction.transaction.hash)
  }
//...
```

**What happened in the code above?**

- First, we need to _rehydrate_ our `KeyPair` using our secret.
- Next, we convert the **NEAR** into **yoctoNEAR**, the smallest unit of money on the **NEAR** blockchain.
- Next, create our transaction using the `sendMoney` method, with a receiver and an amount as arguments. This submits the signed transaction to the network, and returns the transaction hash, which is accessible as the `transaction.hash` property of the `transaction` variable.

---

# ✅ Make sure it works

Once you have the code above saved:

- Fill in the amount of **NEAR** you want to send to `pizza.testnet`.
- Click on **Submit Transfer**.

---

# 🏁 Conclusion

Now that we have funded our account and made a transfer, let's move on to deploying some code (known as a "smart contract") to the NEAR blockchain! Ready to take the plunge? Let's go...
