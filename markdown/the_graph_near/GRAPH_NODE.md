## 🎥 Video Walkthrough of The Graph's Hosted Service

{% embed url="https://www.youtube.com/watch?v=muL4vzqc9nQ" caption="The Graph's Hosted Service" %}

## 📈 A word about The Graph Hosted Service

Using The Graph to index data from the NEAR blockchain currently means you need to use the Hosted Service. It is possible to run a local Graph node but the process for setting it up is currently not documented. The Graph provides the Hosted Service as an alternative to running your own Graph node. The Hosted Service will eventually shut down as The Graph reaches feature parity with its decentralized network of graph nodes.

## 🤔 What's a Graph node?

You're probably familiar with the idea of running a local web server in the early stages of a project, or while developing on it. It allows you to rapidly design, write and test your code. Then when you're ready you can deploy it and in production users will interact with that deployed version of your server.

A Graph node comes with the following components:

- An IPFS swarm for storing our subgraphs
- A Postgres database for storing the data output of those processed events
- A GraphQL API to allow clients to query this data

Normally, for development, we'd want to run a local Graph node to listen for NEAR receipts and blocks while also listening to clients' requests to respond with data. However, setting up a local Graph node for NEAR is currently complex and there is very little/no documentation available, so we're going to rely on The Graph's hosted service. Unfortunately, that means The Graph is acting like a single indexer/single point of failure and you lose the decentralization that comes with The Graph network for now.

## 👨‍💻 Using the Hosted Service

Getting started with [the Hosted Service](https://thegraph.com/hosted-service/) is simply a matter of signing up using your Github login credentials. Once inside, navigate to your dashboard. This is where all the subgraphs you deploy will reside. Inside you will see an access token that is used to authorize you during deployment and the button to **Add a Subgraph**.

![hosted](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/hosted-01.png?raw=true)

The site is simple and intuitive to use and although it's a centralized service, it will speed up your development because you won't need to install or run anything locally.

## ✅ Make sure you have an access token

Let's quickly check to ensure you know where your access token is. Go to your dashboard on the Hosted Service page, locate your access token and carefully count the number of characters it has.

When you find it enter the count in **Your Answer** to ensure you know where it is!

## 👣 Next Steps

Now that we have access to the Hosted Service and know where our access token is, we need to set up our subgraph before deploying it. Let's get to that part now...
