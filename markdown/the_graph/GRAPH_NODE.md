## 🤔 What's a Graph node?

You're probably familiar with the idea of running a local web server in the early stages of a project, or while developing on it. It allows you to rapidly design, write and test your code. Then when you're ready you can deploy it and in production users will interact with that deployed version of your server.

We're going to follow the same pattern here. Think of our local Graph node as loosely equivalent to a web server: it will run on your machine, listen to Ethereum events and listen to clients' requests and respond with data.

A Graph node comes with the following components:

- An IPFS swarm for storing our subgraphs
- A Postgres database for storing the data output of those processed events
- A GraphQL API to allow clients to query this data

## 👨‍💻 Setting up a local Graph node

We don't need to worry about installing and running them: we'll use Docker for this. We defined a Docker configuration in `docker/docker-compose.yaml` and it will tell Docker what to do for each of those three components. Our Graph node will run inside a Docker container and connect it to Ethereum mainnet using DataHub as a provider (you'll need that DataHub API key soon).

From the root directory of the project, run:

```text
cd docker
ETHEREUM_RPC=mainnet:https://ethereum-mainnet--rpc.datahub.figment.io/apikey/<YOUR_DATAHUB_API_KEY> docker-compose up
```

Remember to add your DataHub API key to the end of the URL displayed above by replacing the text `<YOUR_DATAHUB_API_KEY>` before you run the command. You should see a bunch of white and blue commands and then the following:

```text
Starting docker_ipfs_1     ... done
Starting docker_postgres_1 ... done
Starting docker_graph-node_1 ... done
Attaching to docker_postgres_1, docker_ipfs_1, docker_graph-node_1
```

It should only take a moment to start the IPFS and Postgres containers, and you will want to pay attention to the Graph Node logging output to make sure that there are no errors on startup. When you see the following INFO logging about downloading the latest blocks from Ethereum, it should be running OK:

```text
docker-graph-node-1  | <TIMESTAMP> INFO Downloading latest blocks from Ethereum. This may take a few minutes..., provider: mainnet-rpc-0, component: BlockIngestor
```

> If you encounter the error "FileNotFoundError: [Errno 2] No such file or directory", make sure you have the latest version of Docker Desktop and that it's currently running on your system.

> If you encounter the error "Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?", well... make sure Docker is running ;)

## ✅ Make sure it works

The same way that a local web server usually listens for connections on `localhost:3000`, our local Graph node is listening for connections on `localhost:8020`.

Click on the button **Test local Graph node** to make sure it's running!

## 👣 Next Steps

A Graph node is now running on your computer but it's not doing much at the moment. Let's give it some code to run...
