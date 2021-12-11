## 📜 What's a "manifest"?

Like an orchestra, your subgraph is made up of a bunch of pieces that need to play nicely together for the music to sound good. Think of the manifest as the conductor: it sits in the middle and coordinates everything.

If you open your NEAR-Subgraph-Template repository in a code editor like Visual Studio Code, you should see the manifest file called `subgraph.yaml`.

![SG folder](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/manifest-01.png)

## 🔎 Inspecting the scaffolded file

Open the `subgraph.yaml` file and have a read through the comments. Generally speaking, you'll tweak those fields for your situation.

![Manifest file](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/manifest-02.png)

Under the `source` key we find `account` and `startBlock`. Account needs to point to the contract account you want to work with. StartBlock tells the Hosted Service to start indexing from a certain block. It's required for NEAR considering how many blocks there are on the NEAR chain.

> Remember NEAR finalizes a new block every second or so.

Under the `mapping` key we find `entities` and `receiptHandlers` - the next steps of this tutorial will be dedicated to understanding them a bit more in depth. For now just notice the information that's below them.

## 🧑🏼‍💻 Your turn! Edit the manifest

Edit the manifest file to accomplish the following:

1. **Specify a starting block at `54395933`.** In order to save time when indexing the datasource, we must specify a starting block (or else the node would start indexing from the genesis block, which would take a veeeeery long time).
2. **Remove all the comments**.

## 😅 Solution

Replace the existing contents of `subgraph.yaml` with the following code snippet:

```yaml
// solution
specVersion: 0.0.4
description: DID registry
repository: https://github.com/VitalPointAI/catalyst-subgraph-registry
schema:
  file: ./schema.graphql
dataSources:
  - kind: near
    name: receipts
    network: near-mainnet
    source:
      account: did.near
      startBlock: 54395933
    mapping:
      apiVersion: 0.0.5
      language: wasm/assemblyscript
      file: ./src/mapping.ts
      entities:
        - Account
      receiptHandlers:
        - handler: handleReceipt
```

## 💡 A word about Handlers

NEAR datasources currently support two types of handlers:

- blockHandlers: run on every new NEAR block. This handler will get you data about a block - good for informational things like block explorers.
- receiptHandlers: run on every receipt where the data source's source account is the recipient. In the template, that is did.near. It has to be an exact match - so subaccounts have to be added as additional data sources.

> receiptHandlers that give you the outcome logs seem to be the most effective way to get specific data off the NEAR chain

## ✅ Make sure it works

Now, it's time for you to verify if you have followed the instructions carefully, click on the button **Test Manifest** to check that your manifest is well formed.
