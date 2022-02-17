## 🎥 Video Walkthrough of the Subgraph Schema

{% embed url="https://www.youtube.com/watch?v=cIllX_fFTuc" caption="The Subgraph Schema" %}

## 🪢 Entities and relations

We just tweaked the manifest to declare what information we were looking for. We declared one entity called `Account` and another called `Log`. Now we need to implement them by defining what attributes they have and specifying their types.

This is analogous to the process of defining the Models in an MVC framework.

Entities will be defined in the `schema.graphql` file.

![Entities](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/entity-01.png?raw=true)

## 🧑🏼‍💻 Your turn! Define the Account and Log entities

For our implementation, this is super straightforward: We simply need an entity that stores all the values of the JSON object that we get from the contract log string so we can then use them later on in our application. Remember that you or your developer ensured the contract is emitting logs in NEP 171 (JSON) format.

The Graph support for NEAR provides a handy `json.fromString` function you can use. Unless you're going to pass back the entire JSON string and work with it in the frontend, you'll definitely want to break up the object as it unlocks the power of graphQL queries.

> You can create complex entities and relationships between them. Have a look at [Nader Dabit's tutorial](https://dev.to/dabit3/building-graphql-apis-on-ethereum-4poa) on how to use `@derivedFrom` to specify a one-to-many relationship. "For one-to-many relationships, the relationship should always be stored on the 'one' side, and the 'many' side should always be derived."

The DID Registry contract is outputting logs in the following format for the `init` and `putDID` methods.

```typescript
logging.log(`{"EVENT_JSON":{
    "standard":"nep171",
    "version":"1.0.0",
    "event":"init",
    "data":{
      "adminId":"${adminId}",
      "adminSet":${Context.blockTimestamp},
      "accountId":"${adminId}"
    }}}`);

logging.log(`{"EVENT_JSON":{
    "standard":"nep171",
    "version":"1.0.0",
    "event":"putDID",
    "data":{
      "accountId":"${accountId}",
      "did":"${did}",
      "registered":${Context.blockTimestamp},
      "owner":"${Context.predecessor}"
    }}}`);
```

Try filling in the blanks to build the corresponding entities. (Hint: Context.blockTimestamp is a large number, not a string)

> Note: the `!` means a property is required. The types you can use in entities includes: Bytes, ID, String, Boolean, Int, BigInt, and BigDecimal. See the [docs](https://thegraph.com/docs/developer/create-subgraph-hosted#built-in-scalar-types) for more info.

```graphql
type Account @entity {
  id: ID!
  signerId: String!
  # What type should log be defined as?
  log: __________
}

type Log ________ {
  id: ID!
  standard: String!
  version: String!
  event: _______
  adminId: String
  _______: ______
  accountId: String
  ___: _____
  registered: BigInt
  owner: String
}
```

## 😅 Solution

Replace the existing contents of `schema.graphql` with the following code snippet:

```graphql
// solution
type Account @entity {
  id: ID!
  signerId: String!
  log: [Log!]!
}

type Log @entity {
  id: ID!
  standard: String!
  version: String!
  event: String!
  adminId: String
  adminSet: BigInt
  accountId: String
  did: String
  registered: BigInt
  owner: String
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

What does `yarn codegen` do? This command creates some boilerplate code under the `generated` folder. This boilerplate code defines **typescript** classes for each `entities` (have a look at `generated/schema.ts`). We will use this code in the next step to define the mappings between our entities and the NEAR contract events.

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/entity-02.gif?raw=true)

## ✅ Make sure it's going to work

Before going to the next step, click on the **Check for expected entities** button on the right to make sure your entities are properly defined.
