At this point, we have deployed a smart contract on the Polygon testnet & set the value of its storage. We have a client-side application that's ready to fetch some data from it. We just need to wire up that last part.

---

# 🏋️ Challenge

{% hint style="tip" %}
In the file `components/protocols/polygon/challenges/getter.ts`, implement the `getValue` function.  
{% endhint %}

**Take a few minutes to figure this out.**

```typescript
const getValue = async (contractAddress: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // try to figure out the expected parameters
    const contract = new ethers.Contract(undefined);
    // try to figure out the expected method
    const value = undefined;
    return {value};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};
```

**Need some help?** Check out these links 👇

- [**Create a Contract using ethers**](https://docs.ethers.io/v5/api/contract/contract/#Contract--creating)
- [**How to call a contract's methods on a ethers Contract object**](https://docs.ethers.io/v5/api/contract/contract/#Contract-functionsCall)
- To read from the blockchain you don't need to spend any tokens so you can just use a provider to create a Contract instance. But to write you will need to create and sign a transaction through Metamask. Use a `signer` to create the Contract object!

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
const getValue = async (contractAddress: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      SimpleStorageJson.abi,
      signer,
    );
    const value = await contract.get();
    return {value};
  } catch (error) {
    return {
      error: error.message,
    };
  }
};
```

**What happened in the code above?**

- We create `Contract` objects using
  - The contract address
  - The contract JSON's ABI
  - A web3 provider
- We then call the functions `get()` on this Contract object to operate our decentralized code. The names of the functions must match the ones we defined in our Solidity smart contract, otherwise how would we know which code to execute?

---

# ✅ Make sure it works

Once the code in `components/protocols/polygon/challenges/getter.ts` is complete, click on the **Get Value** button to fetch the data from the smart contract.

---

# 🏁 Conclusion

Now that we know how to interact with a smart contract we are going to learn how to restore an account from its mnemonic.
