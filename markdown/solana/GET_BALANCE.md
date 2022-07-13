Before making a transfer, we need to check our account balance to make sure we have enough **SOL** to perform a transfer. The `getBalance()` function takes a `publicKey` as input and will return the balance associated with that `publicKey`, if there is any.

---

# 🏋️ Challenge

{% hint style="tip" %}
In `pages/api/solana/balance.ts`, implement `publicKey` & `balance`.
{% endhint %}

**Take a few minutes to figure this out**

```typescript
//...
  try {
    const {network, address} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const publicKey = undefined;
    const balance = undefined;
    if (balance === 0 || balance === undefined) {
      throw new Error('Account not funded');
    }
    res.status(200).json(balance);
  }
//...
```

**Need some help?** Check out these links 👇

- [Read about getBalance](https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getBalance)
- [Create a publicKey from a string](https://solana-labs.github.io/solana-web3.js/classes/PublicKey.html#constructor)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//...
  try {
    const {network, address} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    if (balance === 0 || balance === undefined) {
      throw new Error('Account not funded');
    }
    res.status(200).json(balance);
  }
//...
```

**What happened in the code above?**

- We created an instance of the `PublicKey` using the string formatted address
- Call `connection.getBalance` with that `publicKey`
- Be aware that the balance is denominated in `LAMPORTS`. Remember, `console.log` is your friend 😁

---

# ✅ Make sure it works

Once the code in `pages/api/solana/balance.ts` is complete, click on **Check Balance** to query the cluster and display the balance of the given public key.

---

# 🏁 Conclusion

Now that we have an account that has been funded with **SOL** tokens, we are ready to make a transfer to another account!
