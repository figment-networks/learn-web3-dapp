In this tutorial, we will learn how to query an account balance on Polkadot. Account balances are important to keep track of so that users know if they can afford to send a transaction, or to afford the **existential deposit**.

---

# 😅 Challenge

{% hint style="tip" %}
In `pages/api/polkadot/balance.ts`, implement the function and try to query the balance of your account. You must replace the instances of `undefined` with working code to accomplish this.
{% endhint %}

**Take a few minutes to figure this out**

```typescript
//...
  try {
    const {address, network} = req.body;
    const url = getNodeUrl(network);
    provider = new WsProvider(url);
    const api = await ApiPromise.create({ provider: provider });
    const { data: { free } }  = undefined;
    const amount = undefined;
    await provider.disconnect();
    res.status(200).json(amount);
  }
//...
```

**Need some help?** Check out this link 👇

- [**Basic queries**](https://polkadot.js.org/docs/api/start/api.query#basic-queries)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//...
  try {
    const {address, network} = req.body;
    const url = getNodeUrl(network);
    provider = new WsProvider(url);
    const api = await ApiPromise.create({ provider: provider });
    const { data: { free } } = await api.query.system.account(address);
    const amount = free.toNumber();
    res.status(200).json(amount);
  }
//...
```

**What happened in the code above?**

- First, we need instantiate our connection to the Polkadot API.
- Next, we destructure the data returned by the `query.system.account` method as `balance`.
- Then we can access the available balance of our account via the `free` property, converting it into a number with `toNumber`.
- Finally, we send the `amount` back to the client-side as JSON.

---

# ✅ Make sure it works

Once the code in `pages/api/polkadot/balance.ts` is complete, Next.js will rebuild the API route. Click on **Check Balance** and you should see the balance displayed on the page.

---

# 🏁 Conclusion

Querying the balance information is fun, but being able to submit transactions and change the state of a blockchain is even better! Soon, we will dive deeper and submit our first transactions on Polkadot. But first, we need to understand the **existential deposit** feature of Polkadot accounts.
