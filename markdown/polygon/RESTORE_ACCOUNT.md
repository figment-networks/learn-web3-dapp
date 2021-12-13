At the beginning of this journey into Polygon, we generated a mnemonic. Now we're going to learn how to restore a wallet from a mnemonic and how to derive the address and the private key when the wallet has been restored.

---

# 🏋️ Challenge

{% hint style="tip" %}
In the file `components/protocols/polygon/challenges/restore.ts`, implement the `restore` function. Using `ethers`, look for `Wallet`, then when the wallet has been regenerated try to deduce which property we're going to call in order to display the address, finally verify that the generated address matches the existing one.  
{% endhint %}

**Take a few minutes to figure this out.**

```tsx
const restore = (mnemonic: string, address?: string) => {
  try {
    const wallet = undefined;
    if (wallet.address === address) {
      const restoredAddress = wallet.address;
      return {
        restoredAddress,
      };
    } else {
      return {error: 'Unable to restore account'};
    }
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    return {error: errorMessage};
  }
};
```

Need some help? Check out these links 👇

- [**Create Wallet using ethers**](https://docs.ethers.io/v5/api/signer/#Wallet)
- [**Properties of a Wallet**](https://docs.ethers.io/v5/api/signer/#Wallet--properties)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```javascript
// solution
const restore = (mnemonic: string, address?: string) => {
  try {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic.trim());
    if (wallet.address === address) {
      const restoredAddress = wallet.address;
      return {
        restoredAddress,
      };
    } else {
      return {error: 'Unable to restore account'};
    }
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    return {error: errorMessage};
  }
};
```

**What happened in the code above?**

- First, we need to call `fromMnemonic` method of `Wallet` class.
- Next, we compare if the restored address matches the existing one.
- **IMPORTANT**: If you have selected any address in Metamask other than the first address, the if statement will be false.

---

# ✅ Make sure it works

When you have completed the code in `components/protocols/polygon/challenges/restore.ts`: Copy & paste your **mnemonic** then click on **Restore Account**.

---

# 🏁 Conclusion

Congratulations! We have gone from zero to **Polygon**, covering all the most fundamental concepts needed for developers to succeed in using **Polygon**. From connecting to the network to interacting with smart contracts, you have completed coding challenges and created a functional yet basic dApp.
