Like with most Web 3 protocols, transactions on NEAR happen between **accounts**. To create an account, one first need to generate a **keypair** which has a **public key** (or **address**, used to identify and lookup an account) and a **private key** used to sign transactions.

---

# 🏋️ Challenge

{% hint style="tip" %}
In `pages/api/near/keypair.ts`, implement `keypair` and retrieve the string formatted representation of the keypair into the variable `secret`. You must replace any instances of `undefined` with working code to accomplish this.
{% endhint %}

**Take a few minutes to figure this out**

```typescript
  try {
    const keypair = undefined;
    const secret = undefined;
    const address = undefined;
    if (!secret || !address) {
      throw new Error('Please complete the code.');
    }
    return res.status(200).json({address, secret});
  }
```

**Need some help?** Check out these links 👇

- [The `KeyPair` class](https://near.github.io/near-api-js/modules/utils_key_pair.html)
- [Retrieve the `secret`](https://near.github.io/near-api-js/classes/utils_key_pair.keypaired25519.html#tostring)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
  try {
    const keypair = KeyPair.fromRandom('ed25519');
    const secret = keypair.toString();
    const address = keypair.getPublicKey().toString();
    if (!secret || !address) {
      throw new Error('Please complete the code.');
    }
    return res.status(200).json({address, secret});
  }
```

**What happened in the code above?**

- First, we create a random `keypair` using the `ed25519` cryptographic curve.
- Next, we retrieve the string formatted representation of the `secret` key.
- Next, we retrieve the string formatted representation of the `address`.

---

# ✅ Make sure it works

Once the code in `pages/api/near/keypair.ts` is complete, Next.js will rebuild the API route. Now click on **Generate a Keypair** to make your first NEAR keypair.

# 🏁 Conclusion

Now that we have a keypair, we're going to associate it to an account name. Unlike other blockchains, support for human-readable addresses "out of the box" is possible with NEAR. Before we register an account name however, we need to find out if the name we want is available. Let's go!
