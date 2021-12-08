## 🕵🏻 Querying the subgraph

After deploying the subgraph, we need to wait a little in order for it to sync with the NEAR mainnet. It will scan past blocks to find receipts and then listen for any new receipts.

> Note: the indexing progression indicator for the Hosted Service is not currently functioning for NEAR subgraphs.

> Before running the query, you'll need to make sure you have the [Metamask](https://metamask.io/) extension installed in your browser and that you're connected to the mainnet of Ethereum. Why? We'll decorate the data returned by the GraphQL query with data coming from the [CryptoPunks Data on Etherscan](https://etherscan.io/address/0x16F5A35647D6F03D5D3da7b35409D65ba03aF3B2#readContract) to be able to render the images and other CryptoPunk metadata.

In your Hosted Service dashboard, clicking on a deployedl you should see a GraphQL endpoint that resembles `https://api.thegraph.com/subgraphs/name/<username>/<subgraph-name>` Open this in another tab, and you will see a GraphiQL UI. Consider this a sandbox in which to experiment with GraphQL queries. Open the right sidebar to explore your schema.

If you're running the Pathway using Gitpod, you will need to add the Gitpod Workspace URL to `.env.local` instead of localhost, as mentioned in the previous step. The port number must also be added to the beginning of the URL, rather than at the end. For example: `https://8000-olive-meerkat-mapxxnyp.ws-us18.gitpod.io/`.

## 👨‍💻 Your turn! Write the GraphQL query

In `components/protocols/the_graph/graphql/query.ts`, write a GraphQL query to return the 10 most expensive CryptoPunks.

Some hints to help you:

- Start by just fetching for punks and passing all the fields you want back
- You will want `id`, `index`, `value` and `date`
- Then use `first`, `orderBy` and `orderDirection` to get 10 of highest value

Remember to use **GraphiQL IDE** at [http://localhost:8000/subgraphs/name/punks](http://localhost:8000/subgraphs/name/punks) (or at your Gitpod URL) to play around

## 😅 Solution

In `components/protocols/the_graph/graphql/query.ts` replace the GraphQL query with:

```graphql
// solution
query {
  punks(first: 10, orderBy: value, orderDirection: desc) {
    id
    index
    owner {
      id
    }
    value
    date
  }
}
```

## 🥳 Enjoy the result of your work

Now, it's time to enjoy the result of your work! Click on the button on the right, and say hello to the Punks!

![punks](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/query-01.png)

## 🏁 Conclusion

Nice, you made it! What did you think?

If you have any feedback, reach out on [Discord](https://figment.io/devchat)!

If you want to keep learning about The Graph, we have more advanced tutorials on [Figment Learn](https://learn.figment.io/protocols/thegraph).
