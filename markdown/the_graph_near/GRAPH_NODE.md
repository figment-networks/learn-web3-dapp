## 🤔 A word about The Graph Hosted Service

Using The Graph for NEAR currently means you need to use the Hosted Service. There is currently no documented way to run a local Graph node for NEAR. The Graph provides the hosted service as an alternative to running a Graph node of your own, but eventually it will close down as The Graph reaches feature parity with its decentralized network of graph nodes.

## 🤔 What's a Graph node?

You're probably familiar with the idea of running a local web server in the early stages of a project, or while developing on it. It allows you to rapidly design, write and test your code. Then when you're ready you can deploy it and in production users will interact with that deployed version of your server.

A Graph node comes with the following components:

- An IPFS swarm for storing our subgraphs
- A Postgres database for storing the data output of those processed events
- A GraphQL API to allow clients to query this data

Normally, for development, we'd want to run a local Graph node to listen for NEAR receipts and blocks while also listening to clients' requests to respond with data. Currently, there is very little/no documentation for running a local Graph node with NEAR support so we're going to rely on The Graph's hosted service. Unfortunately that means The Graph is acting like a single indexer/single point of failure and you lose the decentralization that comes with The Graph network for now.

## 👨‍💻 Setting up the Graph hosted service

Getting started with [the hosted service](https://thegraph.com/hosted-service/) is simply a matter of signing up using your Github login credentials. Once inside, navigate to your dashboard. This is where all the subgraphs you deploy will reside. Inside you will see an access token that is used to authorize you during deployment and the button to Add a Subgraph.

It's pretty simple and intuitive to use and although it's a centralized service, it speeds up development as you're not needing to figure out how to install and run anything locally.

## ✅ Make sure you have an access token

Let's quickly check to ensure you know where your access token is. Go to your dashboard, find your access token and carefully count the number of characters it has.

When you find it enter the count in **Your Answer** to ensure you know where it is!

## 👣 Next Steps

Now that we have access to the Hosted Service and know where our access otken is, we need to give it some code to run. Let's get to that part now...
