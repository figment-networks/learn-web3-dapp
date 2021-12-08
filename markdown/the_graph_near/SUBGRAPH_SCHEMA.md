## 🪢 Entities and relations

We just tweaked the manifest to declare what information we were looking for. We declared one entity called `Registry`. Now we need to implement it by defining what attributes it has and what are those attribute types.

This is analogous to the process of defining the Models in an MVC framework.

Entities will be defined in the `schema.graphql` file.

![Entities](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/entity-01.png)

## 🧑🏼‍💻 Your turn! Define the Punk and Account entities

Start from the following code below and fill in the two missing fields: `punksBought` on `Account` and `owner` on `Punk`. Have a look at Nader Dabit's tutorial on how to use `@derivedFrom` to specify a one-to-many relationship.

> "For one-to-many relationships, the relationship should always be stored on the 'one' side, and the 'many' side should always be derived."

```graphql
type Account @entity {
  id: ID!
  # Reference the Punk entity to specify the relation between them
  # aka "A owner has multiple Punks"
  punksBought: _______________
  numberOfPunkBought: BigInt!
}

type Punk @entity {
  id: ID!
  index: BigInt!
  # Reference the Account entity to specify the relation between them
  # aka "A punk belongs to an Owner"
  owner: __________
  value: BigInt!
  date: BigInt!
}
```

## 😅 Solution

Replace the existing contents of `schema.graphql` with the following code snippet:

```graphql
// solution
type Account @entity {
  id: ID!
  # Defining the one to many relationship here from the "one" perspective
  # "an Account has many Punks"
  punksBought: [Punk!] @derivedFrom(field: "owner")
  numberOfPunkBought: BigInt!
}

type Punk @entity {
  id: ID!
  index: BigInt!
  # Defining the one to many relationship here from the "many" perspective
  # "a Punk has one Account"
  owner: Account!
  value: BigInt!
  date: BigInt!
}
```

In the above code snippet, there are two points worth mentioning:

- For the purpose of indexing, entities _must have_ an `ID` field to uniquely identify them.
- As an `Account` can be the **owner** of multiple `Punk` we must explicitly define the `1:n` relation on the `Account`'s **punksBought** attribute using `[Punk!] @deriveFrom(field: "owner")` directive:

```text
                               |      ------
                               | --- | Punk |
                               |      ------
                               ...
     ---------                 |      ------
    | Account |  1 : ----- n : | --- | Punk |
     ---------                 |      ------
                               ...
                               |      ------
                               | --- | Punk |
                               |      ------
```

## 🏗️ The "codegen" command

We have now defined the entities that we declared in the manifest!

Run the following command to generate boilerplate code from our **entities**:

```text
cd punks
yarn codegen
```

What does `yarn codegen` do? This command create some boilerplate code under the `generated` folder. This boilerplate code define **typescript** classes for each `entities` (have a look at `generated/schema.ts`). We will use this code in the next step to define the mappings between our entities and the smart-contract events.

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/entity-02.gif)

## ✅ Make sure it works

Before going to the next step, click on the **Check for expected entities** button on the right to make sure your entities are properly defined.
