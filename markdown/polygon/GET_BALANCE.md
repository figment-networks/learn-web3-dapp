In this tutorial, we will acquire some free **MATIC** on the testnet so that we can deploy a smart contract and interact with it. Before dealing with actual value on the Polygon mainnet, it is wise to practice using the Polygon testnet (called Mumbai).

Click on the icon in the upper-right corner of the page to copy the hexadecimal address of the Metamask account to the clipboard:

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/polygon/click_to_copy.png)

Visit [https://faucet.polygon.technology/](https://faucet.polygon.technology/) and paste the address from your selected account in Metamask into the textinput. It is OK to leave the default options for **MATIC** tokens and the Mumbai network selected. Click the Submit button, then click again on the popup to confirm the transaction.

Once this transaction is confirmed, you will have 1 **MATIC** on the Mumbai testnet!

---

# 🏋️ Challenge

{% hint style="tip" %}
**Imagine this scenario:** You know you have a big balance. You need to show that balance so you can brag about it to all your awesome Web 3 developer friends! In `components/protocols/polygon/challenges/balance.ts`, implement the `getBalance` function :
{% endhint %}

**Take a few minutes to figure this out.**

```typescript
const getBalance = async (address: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const balance = undefined;
    if (!balance) {
      throw new Error('Please complete the code');
    }
    return {
      balance: balance.toString(),
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};
```

**Need some help?** Check out these links 👇
Get an [**account balance**](https://docs.ethers.io/v5/api/providers/provider/#Provider-getBalance) using ethers  
Format the balance using [**ethers.utils.formatEther**](https://docs.ethers.io/v5/api/utils/display-logic/#unit-conversion)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
const getBalance = async (address: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const balance = await provider.getBalance(address);
    if (!balance) {
      throw new Error('Please complete the code');
    }
    return {
      balance: balance.toString(),
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};
```

**What happened in the code above?**

- We await `provider.getBalance` because it returns a Promise. That Promise returns a BigNumber, which is a specific data type for handling numbers which fall [outside the range of safe values](https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber--notes-safenumbers) in JavaScript.
- Last but not least, to easy manipulate the returned type we convert it to string using `toString()` method.

---

# ✅ Make sure it works

When you have completed the code in `components/protocols/polygon/challenges/balance.ts`, the **Check Balance** button will function. Click it to view the balance of the connected Polygon account.

---

# 🏁 Conclusion

Now that we have an account that has been funded with **MATIC** tokens, we are ready to make a transfer to another account!
