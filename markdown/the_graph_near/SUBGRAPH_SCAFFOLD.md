## 🌐 What's a subgraph?

A subgraph defines which data The Graph will index from NEAR, and how it will store it. It's made up of 3 main pieces: a manifest, a schema of entities and mappings.

![Anatomy](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/subgraph-01.png)

In this Pathway we will go over each of them one by one, understand what they do and how they work.

## 🤝 Picking a contract account

On Ethereum, a subgraph indexes events emitted by a smart contract, but on NEAR, we don't have events (at least not yet). The Graph for NEAR indexes blocks and receipts. The receipts may contain logs if a developer codes them in (ideally in a standard JSON format). So the first thing we need to do is pick the NEAR contract account our subgraph will be listening to.

> Note: at this time we can only connect to contract accounts on `near-mainnet`. Testnet support is in the works.

For the purpose of this tutorial we created and deployed a contract account that we know is emmitting logs in JSON format so we have something to work with. It's a registry contract that enables people to register and associate their NEAR account with a decentralized identifier (DID) created on the Ceramic Network.

The use case we'll explore in the rest of this tutorial is how to make our app query this subgraph to get all the existing registrations (DIDs). Knowing the DID's, we can then bring in corresponding data from Ceramic for each DID to create interesting and useful directories (like a NEAR Guilds directory or a member's directory for a specific app).

## Ethereum vs NEAR "events"

For Ethereum contracts, you can go to Etherscan and lookup the contract address to look at its code and figure out what events are being emitted. For example, you can view the popular Crypto Punk ETH-20 contract [here](https://etherscan.io/address/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB) and if you click on the "Contract" tab you can also have a look at [its Solidity code](https://etherscan.io/address/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB). The contract's address is `0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`.

Ethereum contracts have an ABIs (Application Binary Interface). It defines the methods and structures that can be used to interact with that binary contract and what shape of data you'll get back.

NEAR contracts compile to webAssembly (WASM) and don't have ABIs so it's not as easy to find the data NEAR contracts are emitting. Etherscan support is coming some day, but until then you either know what's being emitted in the logs because you are the developer or you need to go through the code in a Github repo to figure it out.

Recently, NEAR enhancement proposal 171 ([NEP-171](https://github.com/near/NEPs/blob/master/specs/Standards/NonFungibleToken/Event.md)) defined an event format primarily aimed at NFTs. However, it's also a useful standard for developers to use in other contracts. So if looking through code, you may come across something like this from a contract coded with AssemblyScript:

```text
logging.log(`{"EVENT_JSON":{
      "standard":"nep171",
      "version":"1.0.0",
      "event":"removeEditor",
      "data":{
        "editor":"${accountId}",
        "time":${Context.blockTimestamp},
        "removedBy":"${Context.predecessor}"
      }}}`)
```

> Looking at that code, can you find the event and data it provides? What function is being called? What arguments are included in the data? We will come back to these logged events very soon.

## 💻 Install the Graph CLI

In a code editor, a subgraph will be a folder with a few different folders and files. Usually we'd use the CLI to initiate a Graph project that sets up those files/folders for us, but the abiltiy to run `graph init` is currently not available for NEAR. So we'll need to scaffold out our project differently.

We will need The Graph Cli installed to generate, build, and deploy the subgraphs to the Hosted Service. Install the CLI by running:

```text
yarn global add @graphprotocol/graph-cli
```

Verify the installation was successful by running `graph` in your Terminal. You should see:

```text
Welcome to graph CLI version 0.23.2!
Type graph --help to view common commands.
```

## 🧑🏼‍💻 Your turn! Generate a NEAR subgraph scaffold

We've made it easier to scaffold out a NEAR subgraph project by creating a [NEAR-Subgraph-Template](https://github.com/VitalPointAI/near-subgraph-template) you can clone from Github.

```text
git clone https://github.com/VitalPointAI/near-subgraph-template.git your-project-directory
```

Once cloned into your directory, cd into it and open it up in your editor.

Let's install the dependencies using following in your terminal:

> Note: You need to be using node >= 14.17

```text
yarn
```

## ✅ Make sure it works

Now it's time for you to verify that you have followed the instructions carefully.

Answer the questions on the right to confirm your scaffold exists.
