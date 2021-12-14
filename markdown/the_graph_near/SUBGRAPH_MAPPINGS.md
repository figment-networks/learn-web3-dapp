## 🗺 Mapping events to entities

Remember in the "Tweak the manifest" step we defined a receipt handler? It looked like this:

```yaml
receiptHandlers:
  - handler: handleReceipt
```

> We could also have defined a blockHandler if we are interested in block related data. Currently blockHandler and receiptHandler are the only two handlers available for NEAR.

For each handler that is defined in `subgraph.yaml` under `mapping` we will create an exported function of the same name. Each receipt handler must accept a single parameter called receipt with a type of `near.ReceiptWithOutcome`.

This receipt handler is what we call a "mapping" and it goes in `src/mapping.ts`. It will transform the NEAR logging data into entities defined in your schema.

## ✏️ Implement the receipt handler

Now we have to implement the `handleReceipt` handler to be able to process the log data from an outcome in a receipt and turn it into an piece of data that can be persisted in the Hosted Service's Postgres database.

First, open `src/mapping.ts`.

Then we need to import some code and prototype the function:

```typescript
import {near, log, json, JSONValueKind} from '@graphprotocol/graph-ts';
import {Account, Log} from '../generated/schema';

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  // Implement the function here
}
```

`Account` and `Log` are the imported objects (entities) we've just defined, and `receipt` is referencing the definition of a `receiptWithOutcome` made available in The Graph NEAR implementation. Specifically:

```typescript
class ReceiptWithOutcome {
  outcome: ExecutionOutcome,
  receipt: ActionReceipt,
  block: Block
```

and `ExecutionOutcome` is where we get at the logs emmitted.

```typescript
class ExecutionOutcome {
      gasBurnt: u64,
      blockHash: Bytes,
      id: Bytes,
      logs: Array<string>,
      receiptIds: Array<Bytes>,
      tokensBurnt: BigInt,
      executorId: string,
  }
```

NEAR has two types of receipts: action receipts or data receipts. Data Receipts are receipts that contain some data for some ActionReceipt with the same receiver_id. Data receipts are not currently handled by The Graph.

ActionReceipts are the result of a transaction execution or another ActionReceipt processing. They'll show up for one of the seven actions that might occur on NEAR: FunctionCall, TransferAction, StakeAction, AddKeyAction, DeleteKeyAction, CreateAccountAction, or DeleteAccountAction.

Probably the most useful are the ActionReceipts from FunctionCall actions. That is where we'll typically add our log output in a contract to emit the log on completion of the FunctionCall. Because of that, those functionCalls are what we want The Graph to listen for.

First, we'll need to grab the actions from the receipt:

```typescript
const actions = receipt.receipt.actions;
```

Then we'll loop through the actions and call a handleAction function to create the `Account` and `Log` entities we want to make available. The handleAction looks like this:

```typescript
for (let i = 0; i < actions.length; i++) {
  handleAction(
    actions[i],
    receipt.receipt,
    receipt.block.header,
    receipt.outcome,
  );
}
```

As discussed above, we want the logs that come from function calls in the contract. So we'll do this. Notice tht we first check to see if the `Account` entity exists and if it doesn't, create a new one:

```typescript
function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }
  let account: Account
  if (account == null) {
  let account = new Account(receipt.signerId);
  const functionCall = action.toFunctionCall();
  ...
```

Now we'll have the ability to pick out the logs that correspond to the `functionCall` in the contract, so we simply do the following for the name of each function we want to listen for in the contract. For example, this one is listening for the `putDID` function:

```typescript
if (functionCall.methodName == "putDID") {
   ...
```

When the `putDID` function is called, The Graph processes its ActionReceipt and puts the logs in an array of `outcome.logs`.

So, first we want to create a new Log and then check that the function actually emitted a log. If it did, we get the receiptID and set it to logs.id:

```typescript
let logs = new Log(`${receiptId}`);
  if(outcome.logs[0]!=null){
    logs.id = receipt.signerId;
```

Knowing there is now a log, we want to take the string and parse it to a JSON object. We do that like so:

```typescript
let parsed = json.fromString(outcome.logs[0])
  if(parsed.kind == JSONValueKind.OBJECT){
    let entry = parsed.toObject()
```

At this point we have a JSON object in entry. Let's take another look at a NEP 171 log:

```typescript
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

In addition to the overall top level object we just parsed, there are two more objects: EVENT_JSON and data. We will need to create objects out of each of those as well. Starting with EVENT_JSON:

```typescript
//EVENT_JSON
let eventJSON = entry.entries[0].value.toObject();
```

Now we will want to loop through each of the object's keys and assign the values to their corresponding entity properties like so:

```typescript
//standard, version, event (these stay the same for a NEP 171 emmitted log)
for (let i = 0; i < eventJSON.entries.length; i++) {
  let key = eventJSON.entries[i].key.toString();
  switch (true) {
    case key == 'standard':
      logs.standard = eventJSON.entries[i].value.toString();
      break;
    case key == 'event':
      logs.event = eventJSON.entries[i].value.toString();
      break;
    case key == 'version':
      logs.version = eventJSON.entries[i].value.toString();
      break;
  }
}
```

> See how the keys in the switch statement match the keys in the log emitted from the contract? Notice how the keys also correspond to the entity property names and types?

And we do the same thing for the data object:

```typescript
//data
let data = eventJSON.entries[0].value.toObject();
for (let i = 0; i < data.entries.length; i++) {
  let key = data.entries[i].key.toString();
  switch (true) {
    case key == 'accountId':
      logs.accountId = data.entries[i].value.toString();
      break;
    case key == 'did':
      logs.did = data.entries[i].value.toString();
      break;
    case key == 'registered':
      logs.registered = data.entries[i].value.toBigInt();
      break;
    case key == 'owner':
      logs.owner = data.entries[i].value.toString();
      break;
  }
}
```

At last, we call `logs.save()` and then push the log onto the account entity with `accounts.log.push(logs.id)`.

## 🧑🏼‍💻 Your turn! Implementing the init function of the did.near contract

We implemented part of the receipt handler. Can you finish it, by adding the code for the init function?

```typescript
// ...
  } else {
    log.info('Not processed - FunctionCall is: {}', [functionCall.methodName]);
  }

  // Your turn! Write underneath that code, but before account.save();
  // ---------------------------------------------------------------------
  // - implement an if statement to find the appropriate function call
  // - if it is there, set the receiptId
  // - set the signerId
  // - create a new Log
  // - parse the objects and loop through the keys to assign the values to the entity properties (don't forget correct types)
  // - save the log and push in the the accounts log array

  // Here's the init log for reference:
  // logging.log(`{"EVENT_JSON":{
  //  "standard":"nep171",
  //  "version":"1.0.0",
  //  "event":"init",
  //  "data":{
  //    "adminId":"${adminId}",
  //    "adminSet":${Context.blockTimestamp},
  //    "accountId":"${adminId}"
  //  }}}`)
}
```

## 😅 Solution

Your `src/mapping.ts` should look like this:

```typescript
// solution

// ...
if (functionCall.methodName == 'init') {
  const receiptId = receipt.id.toHexString();
  accounts.signerId = receipt.signerId;

  let logs = new Log(`${receiptId}`);
  if (outcome.logs[0] != null) {
    logs.id = receipt.signerId;

    let parsed = json.fromString(outcome.logs[0]);
    if (parsed.kind == JSONValueKind.OBJECT) {
      let entry = parsed.toObject();

      //EVENT_JSON
      let eventJSON = entry.entries[0].value.toObject();

      //standard, version, event (these stay the same for a NEP 171 emmitted log)
      for (let i = 0; i < eventJSON.entries.length; i++) {
        let key = eventJSON.entries[i].key.toString();
        switch (true) {
          case key == 'standard':
            logs.standard = eventJSON.entries[i].value.toString();
            break;
          case key == 'event':
            logs.event = eventJSON.entries[i].value.toString();
            break;
          case key == 'version':
            logs.version = eventJSON.entries[i].value.toString();
            break;
        }
      }

      //data
      let data = eventJSON.entries[0].value.toObject();
      for (let i = 0; i < data.entries.length; i++) {
        let key = data.entries[i].key.toString();
        switch (true) {
          case key == 'adminId':
            logs.adminId = data.entries[i].value.toString();
            break;
          case key == 'accountId':
            logs.accountId = data.entries[i].value.toString();
            break;
          case key == 'adminSet':
            logs.adminSet = data.entries[i].value.toBigInt();
            break;
        }
      }
    }
    logs.save();
  }

  accounts.log.push(logs.id);
} else {
  log.info('Not processed - FunctionCall is: {}', [functionCall.methodName]);
}
// ...
```

## 🚀 Deploy your subgraph

Before you can deploy to The Hosted Service you'll need to create a place for it.

1. Go to your Hosted Service dashboard and click Add Subgraph.

2. Fill out the form. You can select an image for your subgraph, give it a name, subtitle, description, github url and link it to an account. You can also choose whether it is hidden from others or available to all.

> Once your subgraph is deployed, it needs to have activity on it to remain active. If there are no queries for more than 30 days, you'll need to redeploy it in order for the Hosted Service to start indexing it again.

Next, we'll need to update `package.json`'s deploy command to include the name of the subgraph you just created on the Hosted Service. Find this line in `package.json`:

```json
"deploy": "graph deploy <GITHUBNAME/SUBGRAPH> --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/"
```

Replace <GITHUBHAME/SUBGRAPH> with the name of your subgraph. For example:

```json
"deploy": "graph deploy ALuhning/DID-Registry --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/"
```

The final step before deploying to the Hosted Service is to authorize with The Graph CLI. For that, you need your access token (available from [your dashboard](https://thegraph.com/hosted-service/dashboard)). Run the following command, remember to replace <ACCESS_TOKEN> with your actual access token:

```bash
graph auth --product hosted-service <ACCESS_TOKEN>
```

We can now deploy our subgraph to the Hosted Service with the following commands:

```text
yarn codegen
yarn build
yarn deploy
```

What do those three commands do?

- `yarn codegen` generates the types for the GraphQL schema.
- `yarn build` compiles the subgraph and organizes the files in the `build` directory.
- `yarn deploy` sends the compiled code to the Hosted Service to make it available for indexing and querying.

Now if you visit your subgraph in your dashboard, you can click on the Logs and see it starting to scan the NEAR mainnet for logs emitted by the functions in the did.near contract.

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph-near/mapping-01.gif)

## ✅ Make sure it works

Now it's time for you to verify that you have followed the instructions carefully. Click on the **Check subgraph deployment** button on the right to check that your subgraph has been deployed to the Hosted Service.
