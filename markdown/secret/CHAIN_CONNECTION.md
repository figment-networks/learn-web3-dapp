The ability to establish a connection is the first step for anyone wanting to discover and travel through Web 3 space. Fasten your seatbelt, it's time to take off 🚀!

Connecting to a node works pretty much the same as for a standard web server. There are two actors: Client & server, with a protocol managing how data is transferred from one to the other.

---

# 🏋️ Challenge

{% hint style="tip" %}
In `pages/api/secret/connect.ts`, implement the function and try to establish your first connection to the Secret network. To verify your connection has been correctly established, try to return the current protocol version. You must replace the instances of `undefined` with working code to accomplish this.
{% endhint %}

**Take a few minutes to figure this out**

```typescript
//...
try {
    const url = getNodeUrl();
    const client = undefined;
    const nodeInfo = undefined;
    const version = undefined;
    res.status(200).json(version);
  }
//...
```

**Need some help?** Check out these links 👇

- [**Connection example**](https://github.com/enigmampc/SecretJS-Templates/tree/master/1_connecting_to_node)
- [**Read the code for `SecretJS` & `cosmwasm`**](https://github.com/enigmampc/SecretNetwork/tree/master/cosmwasm-js/packages/sdk)

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
try {
    const url = getNodeUrl();
    const client = new CosmWasmClient(url);
    const nodeInfo = await client.restClient.nodeInfo();
    const version = nodeInfo.application_version.version;
    res.status(200).json(version);
  }
```

**What happened in the code above?**

- First, we instantiate a new `CosmWasmClient` passing the url of the `supernova-2` network.
- Next, using the `nodeInfo` method of the rest client returns a `NodeInfoResponse`.
- Inspecting the methods of our object will lead us naturally to reference the `application_version.version` property.
- Finally, we send the `version` back to the client-side as JSON.

---

# ✅ Make sure it works

Once the code in `pages/api/secret/connect.ts` is complete, click on the blue button to connect to Secret & display the current version.

---

# 🏁 Conclusion

Well done! Your fluency in the Secret dialect of Web 3 is growing. As a newcomer, creating an account is the next logical step in your exploration. Ready to take the next step forward?
