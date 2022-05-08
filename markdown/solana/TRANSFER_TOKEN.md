In order to transfer some value to another account, we need to create and send a signed transaction to the **cluster**. Once you understand how to do this, you will have a solid foundation on which to interact with other portions of the Solana API.

When a transaction is submitted to the **cluster**, the Solana runtime will execute a program to process each of the instructions contained in the transaction, in order, and atomically. This means that if any of the instructions fail for any reason, the entire transaction will revert.

when you are transferring lamports make sure it begins with **0.**. so for example **0.2** otherwise transaction will give you an error

---

# 🏋️ Challenge

{% hint style="tip" %}
In `pages/api/solana/transfer.ts` finish implementing the `transfer()` function.
{% endhint %}

**Take a few minutes to figure this out.**

```typescript
//.. let's skip the beginning as it should be familiar for you by now!
// Find the parameter to pass
const instructions = SystemProgram.transfer;

// How could you construct a signer array?
const signers = undefined;

// Maybe adding someting to a Transaction could be interesting?
const transaction = new Transaction();

// We can send and confirm a transaction in one line of code.
const hash = undefined;
//..
```

**Need some help?** Here are a few hints

- [Read about `sendAndConfirmTransaction`](https://solana-labs.github.io/solana-web3.js/modules.html#sendAndConfirmTransaction)
- [Read about adding instructions to `Transaction`](https://solana-labs.github.io/solana-web3.js/classes/Transaction.html#add)
- [Anatomy of a `Transaction`](https://docs.solana.com/developing/programming-model/transactions)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//... let's skip the beginning as it should be familiar for you by now!
const instructions = SystemProgram.transfer({
  fromPubkey,
  toPubkey,
  lamports,
});

const signers = [
  {
    publicKey: fromPubkey,
    secretKey,
  },
];

const transaction = new Transaction().add(instructions);

const hash = await sendAndConfirmTransaction(connection, transaction, signers);

res.status(200).json(hash);
//..
```

**What happened in the code above:**

- We create `instructions` for the transfer, supplying a **sender** a **receiver** and an **amount**.
- We also need a `signers` array with only one signer: the account sending the transaction. It contains both the signers `publicKey` & `secretKey`.
  - The `secretKey` is used to sign the transaction.
- Create a new `Transaction` object and add the `instructions` to it.
- Send and await the confirmation of the signed transaction using `sendAndConfirmTransaction`.
- Finally, we return the transaction hash to the client-side as JSON.

---

# ✅ Make sure it works

Once the code in `pages/api/solana/transfer.ts` is complete, you can enter an amount to transfer in the form field, click to generate a random address to send the transfer to and then click **Submit Transfer**. Remember that 1 SOL is equal to 1,000,000,000 lamports.

---

# 🧐 Anatomy of an Explorer page

When viewing Account details on the Solana Explorer:

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/solana/solana-transfer.png)

1. The Account Overview panel displays information about the account, including its address, balance, and if there is a Program deployed at that address.

2. The History tab displays the Transaction history for the selected account, which is a list of previous transactions that account has been involved in.

3. The Tokens tab displays information regarding any tokens held by the account.

---

# 🏁 Conclusion

Now that you are comfortable with accounts and tokens, we will look at how to deploy a program written in the Rust language to the Solana cluster. Don't worry, this process is not as scary as it sounds 😇
