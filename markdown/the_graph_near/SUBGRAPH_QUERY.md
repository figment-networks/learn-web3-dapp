## 🕵🏻 Querying the subgraph

After deploying the subgraph, we need to wait a little in order for it to sync with the NEAR mainnet. It will scan past blocks starting at the `startBlock` you specified in `subgraph.yaml` to find receipts and then listen for any new receipts.

> Note: the indexing progression indicator for the Hosted Service is not currently functioning for NEAR subgraphs.

In your Hosted Service dashboard, there is a playground area with a GraphiQL UI. Consider this a sandbox in which to experiment with GraphQL queries. Open the right sidebar to explore your schema.

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

Now, it's time to enjoy the result of your work! Click on the button on the right, and say hello to the DIDs!

![punks](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/query-01.png)

## 🏁 Conclusion

Nice, you made it! What did you think?

If you have any feedback, reach out on [Discord](https://figment.io/devchat)!

If you want to keep learning about The Graph, NEAR, or Ceramic, we have more advanced tutorials on [Figment Learn](https://learn.figment.io/protocols/).
