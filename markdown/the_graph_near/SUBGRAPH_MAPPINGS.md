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
import {near, log} from '@graphprotocol/graph-ts';
import {Account} from '../generated/schema';

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  // Implement the function here
}
```

`Account` is the imported object we've just defined, and `receipt` is referencing the definition of a `receiptWithOutcome` made available in The Graph NEAR implementation. Specifically:

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

Then we'll loop through the actions and call a handleAction function to create the `Account` entity we want to make available. The handleAction looks like this:

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
// change the methodName here to the methodName emitting the log in the contract
if (functionCall.methodName == 'putDID') {
  const receiptId = receipt.id.toHexString();
  let account = new Account(receipt.signerId);
  account.accountId = receipt.signerId;
  account.actionLogs = outcome.logs;
} else {
  log.info('Not processed - FunctionCall is: {}', [functionCall.methodName]);
}
```

When the `putDID` function is called, The Graph processes its ActionReceipt and puts the logs in `account.actionLogs`.

At last, we call `save()`.

```typescript
account.save();
```

## 🧑🏼‍💻 Your turn! Finish implementing the remaining functions of the did.near contract

We implemented part of the receipt handler. Can you finish it, by adding the code for the other functions (transferAdmin, changeVerificationStatus, addVerifier, removeVerifier, addEditor, removeEditor, deleteDID, storeAlias, deleteAlias):

```typescript
import {near, log} from '@graphprotocol/graph-ts';
import {Account} from '../generated/schema';

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;

  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i],
      receipt.receipt,
      receipt.block.header,
      receipt.outcome,
    );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome,
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info('Early return: {}', ['Not a function call']);
    return;
  }

  let accounts = new Account(receipt.signerId);
  const functionCall = action.toFunctionCall();

  if (functionCall.methodName == 'putDID') {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
    log.info('Not processed - FunctionCall is: {}', [functionCall.methodName]);
  }

  if (functionCall.methodName == 'init') {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
    log.info('Not processed - FunctionCall is: {}', [functionCall.methodName]);
  }

  account.save();

  // Your turn! Write underneath that code, but before account.save();
  // ---------------------------------------------------------------------
  // - implement an if statement to find the appropriate function call
  // - if it is there, set the receiptId
  // - set the signerId and log values
  // - save the account
}
```

## 😅 Solution

Your `src/mapping.ts` should look like this:

```typescript
// solution
import { near, log } from "@graphprotocol/graph-ts";
import { Account } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;

  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i],
      receipt.receipt,
      receipt.block.header,
      receipt.outcome
      );
  }
}

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

  let accounts = new Account(receipt.signerId);
  const functionCall = action.toFunctionCall();

  if (functionCall.methodName == "putDID") {
    const receiptId = receipt.id.toHexString();
      accounts.signerId = receipt.signerId;
      accounts.log = outcome.logs;
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "init") {
      const receiptId = receipt.id.toHexString();
      accounts.signerId = receipt.signerId;
      accounts.log = outcome.logs;

  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "transferAdmin") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

if (functionCall.methodName == "changeVerificationStatus") {
  const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addVerifier") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeVerifier") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "addEditor") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "removeEditor") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteDID") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "storeAlias") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  if (functionCall.methodName == "deleteAlias") {
    const receiptId = receipt.id.toHexString();
    accounts.signerId = receipt.signerId;
    accounts.log = outcome.logs;
  } else {
  log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  accounts.save();
}
}
```

## 🚀 Deploy your subgraph

Before you can deploy to The Hosted Service you'll need to create a place for it.

1. Go to your hosted-service dashboard and click Add Subgraph.

2. Fill out the form. You can select an image for your subgraph, give it a name, link it to an account, subtitle, description, github url and choose whether it is hidden from others or available to all.

> Your subgraph, once deployed needs to have activity on it. If it lies dormant (no queries) for more than 30 days, then you'll need to redeploy it in order for the service to start indexing it again.

Next, we'll need to update our `package.json` script deploy command to include the name of the subgraph you just created on The Hosted Service. Find this line in `package.json`:

```typescript
"deploy": "graph deploy <GITHUBNAME/SUBGRAPH> --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/"
```

and replace <GITHUBHAME/SUBGRAPH> with the name of your subgraph. For example:

```typescript
"deploy": "graph deploy ALuhning/DID-Registry --ipfs https://api.thegraph.com/ipfs/ --node https://api.thegraph.com/deploy/"
```

The final step before we can deploy is to authorize with The Graph. For that you need your access token (available from your dashboard). Run the following (replace <ACCESS_TOKEN> with your access token):

```bash
graph auth --product hosted-service <ACCESS_TOKEN>
```

And finally, we can now deploy the subgraph to The Hosted Service. Run the following commands to deploy your subgraph to The Hosted Service:

```bash
yarn codegen
yarn build
yarn deploy
```

What do those three commands do?

- `yarn codegen` generates the code
- `yarn build` compiles the code
- `yarn deploy` sends the compiled code to the Hosted Service to make it available for indexing and querying.

Now if you visit your subgraph in your dashboard, you can click on the Logs and see it starting to scan the NEAR mainnet for logs emitted by the functions in the did.near contract.

![terminal](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/the-graph/mapping-01.gif)

## ✅ Make sure it works

Now it's time for you to verify that you have followed the instructions carefully. Click on the **Check subgraph deployment** button on the right to check that your mappings are correctly implemented.
