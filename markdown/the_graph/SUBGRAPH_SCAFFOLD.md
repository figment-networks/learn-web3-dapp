## 🌐 What's a subgraph?

A subgraph defines which data The Graph will index from Ethereum, and how it will store it. It's made up of 3 main pieces: a manifest, a schema of entities and mappings.

![Anatomy](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/subgraph-01.png)

In this Pathway we will go over each of them one by one, understand what they do and how they work.

## 🤝 Picking a smart contract

In practice, a subgraph indexes events emitted by a smart contract. So the first thing we need to do is pick the smart contract our subgraph will be listening to.

For the purpose of this tutorial we have decided to pick a fun and popular smart contract: the Crypto Punk ETH-20 contract.

![punk-variety-2x](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/subgraph-02.png)

You can view it on Etherscan [here](https://etherscan.io/address/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB) and if you click on the "Contract" tab you can also have a look at [its Solidity code](https://etherscan.io/address/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB). The contract's address is `0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB`.

> Looking at the code, can you find its Events? What functions are they calling? What arguments are they passing? Browse around the codebase, we will come back to those events very soon.

## 💻 Install the Graph CLI

In a code editor, a subgraph will be a folder with a few different folders and files. We could create it manually but The Graph provides a CLI tool so we don't have to do it from scratch. Install the CLI by running:

```text
yarn global add @graphprotocol/graph-cli
```

{% hint style="tip" %}
If you're using Gitpod, Yarn won't automatically add the CLI binary to your PATH - use `npm install -g @graphprotocol/graph-cli` instead!
{% endhint %}

Verify the installation was successful by running `graph` in your Terminal. You should see:

```text
Welcome to graph CLI version 0.22.2!
Type graph --help to view common commands.
```

Let's then cd into the `subgraphs` folder:

```text
cd subgraphs
```

We will be using the `init` command of the Graph CLI (see the [docs](https://github.com/graphprotocol/graph-cli) if you need more info). Type in `graph init --help` in your Terminal to view some helpful documentation. The `init` command will create a subgraph scaffold: it will have the right shape but will be incomplete.

## 🧑🏼‍💻 Your turn! Generate a subgraph scaffold

Using the `graph init` command, generate a subgraph scaffold with the following properties:

- Use a subgraph name without a prefix
- Set the contract address to the CryptoPunk contract and fetch its ABI
- Set the Ethereum network to `mainnet`
- Tell the subgraph to index contract events as entities
- Set the Graph node to the local one (hint: it's running on `http://localhost:8020/`)
- Set the subgraph name to `punks`

When you're done, run the command in your terminal to generate a subgraph scaffold. And if you need to start over, simply delete the content of the `subgraphs` folder and run the `graph init ...` command again!

## 😅 The solution

```text
// solution
graph init \
  --allow-simple-name \
  --from-contract 0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB \
  --network mainnet \
  --index-events \
  --node http://localhost:8020/ \
  punks
```

That's a mouthful! Let's look at it line by line.

- `graph init` is the CLI command that will initialize an empty subgraph. Everything else are flags and options.
- `--allow-simple-name` simplifies the naming convention of our local graph (no need for a prefix)
- `--from-contract` gets the ABI from an already deployed contract at the specified address (we'll get back to this later!)
- `--network mainnet` tells the Graph CLI to look on Mainnet Ethereum to find the contract ABI
- `--index-events` creates entities from events
- `--node http://localhost:8020/` will prepare our script to deploy to our local graph node
- `punks` is the name of the folder under which the files are created

> **NOTE**: Linux and macOS use the backslash character \ for multi-line input. Windows uses the ^ character. If you paste this command into a Windows terminal (PowerShell, cmd.exe or Windows Terminal), replace the \ with ^

Once you type Enter, you will be prompted to confirm the information: you can just accept the five suggested inputs. The output should look like:

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/subgraph-03.gif)

You don't need to run the next steps for now!

## ✅ Make sure it works

Now it's time for you to verify that you have followed the instructions carefully.

Click on the **Check for a subgraph scaffold** button on the right to see if your scaffold exists, and is in the right place.
