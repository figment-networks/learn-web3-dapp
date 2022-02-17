## 🎥 Video Walkthrough of Querying the NEAR Subgraph

{% embed url="https://www.youtube.com/watch?v=SnMQjraROOE" caption="Querying the NEAR Subgraph" %}

## 🕵🏻 Querying the subgraph

After deploying the subgraph, we need to wait a little in order for it to sync with the NEAR mainnet. It will scan past blocks starting at the `startBlock` you specified in `subgraph.yaml` to find receipts and then listen for any new receipts.

> Note: the indexing progression indicator in the dashboard for the Hosted Service is not currently functioning for NEAR subgraphs.

In your Hosted Service dashboard, there is a playground area with a GraphiQL UI. Consider this a sandbox in which to experiment with GraphQL queries. Open the right sidebar to explore your schema.

## 👨‍💻 Your turn! Write the GraphQL query

Using the playground, write a GraphQL query that returns the last 5 account DID registrations ordered by registration time (descending).

Some hints to help you:

- Start by just fetching for the "putDID" event function and passing all the fields you want back. Use this as a guide to filter - `where: {event_in: ["putDID"]}`
- You will want `id`, `accountId`, `did` and `registered`
- Then use `first`, `orderBy` and `orderDirection` to get 5 registrations.

## 😅 Solution

Try this query in your playground.

```graphql
// solution
query {
   logs(first: 5, orderBy: registered, orderDirection: desc, where: {event_in: ["putDID"]}) {
    id
    did
    accountId
    registered
  }
}
```

## 🥳 Now see the results of the query

Now, it's time to see the query in action! Click on the button on the right, and say hello to the DIDs!

> Note - if you don't see 5 entries it's because the contract is new and there haven't been more than 5 registrations yet. There should be at least one.

![dids](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/query-01.png?raw=true)

## 🏁 Conclusion

Congratulations, you made it! What did you think?

If you have any feedback, reach out on [Discord](https://figment.io/devchat)!

If you want to keep learning about The Graph, NEAR, or Ceramic, we have more advanced tutorials on [Figment Learn](https://learn.figment.io/protocols/).
