# 🦊 Make sure you have Metamask

Metamask is a crypto wallet which is available as a browser extension. In order to go through this tutorial you will need to have Metamask installed. You can find out how to do this on [MetaMask - A crypto wallet & gateway to blockchain apps](https://metamask.io/). We will be using Ethereum as a provider for Metamask.

# 🔗 Connect is the new Login

If you’ve played around with Web 3 dApps you're probably familiar with those “Connect” buttons which allow you to connect your wallet like MetaMask to dApp that you currently are view. They're always at the top right of a web page, in the same place where Web 2.0 websites usually put Login/Signup buttons. We're going to get started by allowing users to connect their Ethereum account to the webpage, through Metamask.

Imagine this scenario: You're a fresh Web3 developer who just landed a sweet role at a promising new startup, eager to show off your skills. You've been asked to show users of our dApp which network they are connected to (to avoid any confusion) and store the address of the account currently selected in Metamask (so that we can reference it later).

# 🧑🏼‍💻 Challenge

In `components/protocols/ceramic/context/idx.tsx`, implement the `checkConnection` function.

```typescript
// components/protocols/ceramic/context/idx.tsx

const connect = async (): Promise<string> => {
  const provider = await detectEthereumProvider();
  if (provider) {
    // Connect to Polygon using Web3Provider and Metamask.
    // Find more information at: https://docs.metamask.io/guide/rpc-api.html.
    // NOTE: Be careful not to use a deprecated method!
    // Define address and network
    const addresses = undefined;
    const address = undefined;
    if (setIsConnected) {
      setIsConnected(true);
    }
    if (setCurrentUserAddress) {
      setCurrentUserAddress(address);
    }
    if (identityStore) {
      await identityStore.setAddress(address);
    }
    return address;
  } else {
    throw new Error('Please install Metamask at https://metamask.io');
  }
};
```

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 👉 Solution

```typescript
// solution
// components/protocols/ceramic/context/idx.tsx
const connect = async (): Promise<string> => {
  const provider = await detectEthereumProvider();
  if (provider) {
    // Connect to Polygon using Web3Provider and Metamask.
    // Find more information at: https://docs.metamask.io/guide/rpc-api.html.
    // NOTE: Be careful not to use deprecated method!
    // Define address and network
    const addresses = await provider.request({method: 'eth_requestAccounts'});
    const address = addresses[0];
    if (setIsConnected) {
      setIsConnected(true);
    }
    if (setCurrentUserAddress) {
      setCurrentUserAddress(address);
    }
    if (identityStore) {
      await identityStore.setAddress(address);
    }
    return address;
  } else {
    throw new Error('Please install Metamask at https://metamask.io');
  }
};
//...
```

# 🤔 What happened in the code above?

- By using `window.ethereum.enable()`, Metamask is opened and you can connect your Ethereum account with a dApp. This way dApp can use your account to perform transactions and query the network.

---

# 👣 Next Steps

Now that we performed basic "authentication" of your wallet, we can move on and implement decentralized authentication with Ceramic/IDX.
