## 🗺 Mapping events to entities

Remember in the "Tweak the manifest" step we defined a receipt handler? It looked like this:

```yaml
receiptHandlers:
  - handler: handleReceipt
```

> We could also define a blockHandler if we are interested in block related metrics.

For each handler that is defined in `subgraph.yaml` under `mapping` we will create an exported function of the same name. Each receipt handler must accept a single parameter called receipt with a type of near.ReceiptWithOutcome.

This receipt handlers is what we call a "mapping" and it goes in `src/mapping.ts`. It will transform the NEAR logging data into entities defined in your schema.

## ✏️ Implement the receipt handler

Now we have to implement the `handleReceipt` handler to be able to process the log data from an outcome in a receipt and turn it into an piece of data that can be persisted in the Hosted Service's Postgres database.

First, open `src/mapping.ts`.

Then we need to import some code and prototype the function:

```typescript
import {BigInt} from '@graphprotocol/graph-ts';

import {PunkBought as PunkBoughtEvent} from '../generated/Contract/Contract';
import {Account, Punk} from '../generated/schema';

export function handlePunkBought(event: PunkBoughtEvent): void {
  // Implement the function here
}
```

`Account` and `Punk` imported objects are the ones we've just defined, and `PunkBoughtEvent` is referencing the definition of an event we made in the `subgraph.yaml`.

```typescript
let account = Account.load(event.params.toAddress.toHexString());
```

To create the `Account` entity, we first need to test if the entity already exists:

```typescript
if (account == null) {
  account = new Account(event.params.toAddress.toHexString());
  account.id = event.params.toAddress.toHexString();
  account.numberOfPunkBought = BigInt.fromI32(1);
}
```

If it does not, we create a new one by filling all the fields. Otherwise, we only need to increment the `numberOfPunkBought`.

```typescript
else {
  account.numberOfPunkBought = account.numberOfPunkBought.plus(
    BigInt.fromI32(1),
  );
}
```

At last and for both cases, we call `save()`.

```typescript
account.save();
```

The creation of a `Punk` entity follows the same logic, as an helper be inform that we can access timestamp of the event using `event.block.timestamp`.

## 🧑🏼‍💻 Your turn! Finish implement the "handlePunkBought" handler

We implemented half of the event handler. Can you finish it?

```typescript
import {BigInt} from '@graphprotocol/graph-ts';

import {PunkBought as PunkBoughtEvent} from '../generated/Contract/Contract';
import {Account, Punk} from '../generated/schema';

export function handlePunkBought(event: PunkBoughtEvent): void {
  let account = Account.load(event.params.toAddress.toHexString());

  if (account == null) {
    account = new Account(event.params.toAddress.toHexString());
    account.id = event.params.toAddress.toHexString();
    account.numberOfPunkBought = BigInt.fromI32(1);
  } else {
    account.numberOfPunkBought = account.numberOfPunkBought.plus(
      BigInt.fromI32(1),
    );
  }

  account.save();

  // Your turn! Write underneath those comments
  // ---------------------------------------------------------------------
  // - find (aka load) the Punk using his HexString found in the event
  // - if there is none, create it and set its "id" and "index" attributes
  // - set the "owner", "value" and "date" attributes
  // - save the punk
}
```

## 😅 Solution

Your `src/mapping.ts` should look like this:

```typescript
// solution
import {BigInt} from '@graphprotocol/graph-ts';

import {PunkBought as PunkBoughtEvent} from '../generated/Contract/Contract';
import {Account, Punk} from '../generated/schema';

export function handlePunkBought(event: PunkBoughtEvent): void {
  let account = Account.load(event.params.toAddress.toHexString());

  if (account == null) {
    account = new Account(event.params.toAddress.toHexString());
    account.id = event.params.toAddress.toHexString();
    account.numberOfPunkBought = BigInt.fromI32(1);
  } else {
    account.numberOfPunkBought = account.numberOfPunkBought.plus(
      BigInt.fromI32(1),
    );
  }

  account.save();

  let punk = Punk.load(event.params.punkIndex.toHexString());

  if (punk == null) {
    punk = new Punk(event.params.punkIndex.toHexString());
    punk.id = event.params.punkIndex.toHexString();
    punk.index = event.params.punkIndex;
  }

  punk.owner = event.params.toAddress.toHexString();
  punk.value = event.params.value;
  punk.date = event.block.timestamp;

  punk.save();
}
```

## 🚀 Deploy your subgraph

Last but not least, run the following command to deploy your subgraph to your local Graph node:

```bash
yarn create-local
yarn deploy-local
```

What do those two commands do?

- `yarn create-local` will create an endpoint for our subgraph (see the environment variable **NEXT_PUBLIC_LOCAL_SUBGRAPH** in your `.env.local`):
  - On `http://localhost:8000/subgraphs/name/punks` if running `learn-web3-dapp` locally
  - On Gitpod, the port number goes in front of the URL like this example: `https://8000-apricot-piranha-iub1loby.ws-us18.gitpod.io/`. Your URL will be different, so you need to copy and paste it from your address bar, then add the port number and hyphen in front of the URL (`8000-`) into `.env.local` as the value of **NEXT_PUBLIC_LOCAL_SUBGRAPH**.
- `yarn deploy-local` will deploy the subgraph to the endpoint specified by **NEXT_PUBLIC_LOCAL_SUBGRAPH**.

As soon as you run `yarn deploy-local`, you will see Docker starting to scan the Ethereum mainnet for CryptoPunks!

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/mapping-01.gif)

## ✅ Make sure it works

Now it's time for you to verify that you have followed the instructions carefully. Click on the **Check subgraph deployment** button on the right to check that your mappings are correctly implemented.
