## 🪢 Entities and relations

We just tweaked the manifest to declare what information we were looking for. We declared one entity called `Account`. Now we need to implement it by defining what attributes it has and what are those attribute types.

This is analogous to the process of defining the Models in an MVC framework.

Entities will be defined in the `schema.graphql` file.

![Entities](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/entity-01.png)

## 🧑🏼‍💻 Your turn! Define the Account entity

For our implementation, this is super straight forward. We simply need an entity that returns the log string which is already in a JSON format. We can then dissect that JSON object in the front end to use what we need.

There may be a way to do some of that extraction in the subgraph itself if you want. There is a `json.fromString` function you can use. You can also create more complex entities and relationships between them. Have a look at [Nader Dabit's tutorial](https://dev.to/dabit3/building-graphql-apis-on-ethereum-4poa) on how to use `@derivedFrom` to specify a one-to-many relationship.

> "For one-to-many relationships, the relationship should always be stored on the 'one' side, and the 'many' side should always be derived."

Knowing what you do about how logs are emitted in a NEAR contract - try filling in the blank for the type of log.

```graphql
type Account @entity {
  id: ID!
  signerId: String!
  # What type should log be defined as?
  log: _______________
}
```

## 😅 Solution

Replace the existing contents of `schema.graphql` with the following code snippet:

```graphql
// solution
type Account @entity {
  id: ID!
  signerId: String!
  log: [String!]
}
```

In the above code snippet, there are two points worth mentioning:

- For the purpose of indexing, entities _must have_ an `ID` field to uniquely identify them.
- Logs emmitted from a NEAR contract are strings. Developers can make it easy to consume them be ensuring they emit properly formed JSON strings. It's possible to have more than one log emmitted from the same function, so we store them in an array.

## 🏗️ The "codegen" command

We have now defined the entity that we declared in the manifest!

Run the following command to generate boilerplate code from our **entities**:

```text
yarn codegen
```

What does `yarn codegen` do? This command create some boilerplate code under the `generated` folder. This boilerplate code define **typescript** classes for each `entities` (have a look at `generated/schema.ts`). We will use this code in the next step to define the mappings between our entities and the NEAR contract events.

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/entity-02.gif)

## ✅ Make sure it works

Before going to the next step, click on the **Check for expected entities** button on the right to make sure your entities are properly defined.
