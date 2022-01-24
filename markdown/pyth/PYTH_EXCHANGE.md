We're going to work with some additional code libraries to perform token swaps on a Solana based DEX. This is where we will swap our first SOL for some USDC so that we can begin using the liquidation bot. We'll go over the `OrcaSwapClient` and `JupiterSwapClient` which will be used to enable swapping SOL for SPL tokens.

On devnet, we'll use the Orca SDK to swap between SOL -> ORCA -> USDC.

On mainnet, we have access to the more powerful Jupiter SDK where we can swap directly without needing to keep track of intermediate pairs. Again, this mainnet enabled code is mainly for illustration and should not be used without proper testing and understanding the inherent risks.

---

# 🧱 Building the Exchange component

Two files to be aware of here: The Exchange component `components/protocols/pyth/components/Exchange.tsx` which is being rendered on the right side of the screen and the helper code for performing swaps, located in `components/protocols/pyth/lib/swap.ts`.

You'll notice that we have already included the price feed and wallet components for this step. There are also a few new components to consider:

- A textinput for the Yield Expectation
- Buttons to place buy and sell orders into the order book
- A table component to keep the order book organized (you'll need to scroll down on the right side of the page to see it)

# 🚚 Importing dependencies

We went over imports earlier in the pathway, so the only new things here are the Orca and Jupiter libraries. Going forward, we will only be discussing the Orca SDK - you are free to look at the `JupiterSwapClient` if you want to understand mainnet swaps using Jupiter. Understandably, we do not wish to make it _too_ easy for you to potentially get rekt performing swaps on mainnet with real money. Remember, Wall-E not The Terminator 😉.

- [`@jup-ag/core`](https://docs.jup.ag/jupiter-core/using-jupiter-core#usage) the Jupiter SDK enables us to create our `JupiterSwapClient`
- [`@orca-so/sdk`](https://github.com/orca-so/typescript-sdk#orca-typescript-sdk) the Orca SDK enables us to create our `OrcaSwapClient`

```typescript
// components/protocols/pyth/lib/swap.ts

import {Cluster, Connection, Keypair, PublicKey} from '@solana/web3.js';
import {Jupiter, RouteInfo, TOKEN_LIST_URL} from '@jup-ag/core';
import Decimal from 'decimal.js';
import {getOrca, Network, OrcaPoolConfig} from '@orca-so/sdk';
```

# 📈 Buy & Sell Orders

We need to define what an Order looks like so that we can work with it in code. This is a data type which contains information about an order, including the tokens being swapped and the size of the order. This interface is defined in `components/protocols/pyth/lib/wallet.ts`

```typescript
// components/protocols/pyth/lib/wallet.ts

// Define the interface for an Order
interface Order {
  side: 'buy' | 'sell';
  size: number;
  price: number;
  fromToken: string;
  toToken: string;
}
```

To tie it together, we need to define the interface for SPL Tokens as well as SwapResults.

```typescript
// components/protocols/pyth/lib/swap.ts

// Token interface
export interface Token {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
}

// SwapResult interface
export interface SwapResult {
  inAmount: number;
  outAmount: number;
  txIds: string[];
}
```

We also need to keep track of the total worth of our assets based on the current market price, the React `useState` hook is an natural choice for this. We will also set up some more app state to handle the details of the orders:

```typescript
// components/protocols/pyth/components/Exchange.tsx

// State for tracking user worth with current Market Price.
const [worth, setWorth] = useState({initial: 0, current: 0});

// yieldExpectation is the amount of EMA to trigger buy/sell signals
const [yieldExpectation, setYield] = useState<number>(0.001);
const [orderSize, setOrderSize] = useState<number>(20); // USDC
const [price, setPrice] = useState<number | undefined>(undefined);
const [symbol, setSymbol] = useState<string | undefined>(undefined);
const [orderBook, setOrderbook] = useState<Order[]>([]);
```

Take a look at how we can update the current worth:

```typescript
// components/protocols/pyth/components/Exchange.tsx

useEffect(() => {
  // Update the current worth each price update.
  const currentWorth = wallet?.sol_balance * price! + wallet.usdc_balance;
  setWorth({...worth, current: currentWorth});
}, [price, orderSizeUSDC, setPrice]);
```

Let's break down the `OrcaSwapClient` to understand what's actually happening on Solana when an order is executed:

```typescript
// components/protocols/pyth/lib/swap.ts

export class OrcaSwapClient {
  constructor(
    public readonly keypair: Keypair,
    public readonly connection: Connection,
  ) {}
```

The class constructor defines the `Keypair` and `Connection` as both _public_ and _readonly_ - this means we can trust that this data isn't being altered midway through the function. It's a mix of best practices and defensive programming 😉.

```typescript
  /**
   * @param size A `Decimal` formatted number
   * @returns
   *  - `txIds`: [`swapTxId`, `swapOrcaTxId`]
   *  - `inAmount`: `solAmount.toNumber()`
   *  - `outAmount`: `usdcAmount.toNumber()`
   */
  async buy(size: number): Promise<SwapResult> {
    const orca = getOrca(this.connection, Network.DEVNET);
    const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL); // Orca pool for SOL
    const solToken = orcaSolPool.getTokenB(); // SOL token
    const solAmount = new Decimal(size);
    const quote = await orcaSolPool.getQuote(solToken, solAmount);
    const orcaAmount = quote.getMinOutputAmount();
    console.log(
      `Swap ${solAmount.toString()} SOL for at least ${orcaAmount.toNumber()} ORCA`,
    );
    // orcaAmount is included because in the Orca smart contract there's a condition if the swap produces
    // less than the amount requested, the transaction will fail and the user will keep their SOL.
    const swapPayload = await orcaSolPool.swap(
      this.keypair,
      solToken,
      solAmount,
      orcaAmount,
    );

    const swapTxId = await swapPayload.execute();
    console.log('Swapped:', swapTxId, '\n');

    const orcaUSDCPool = orca.getPool(OrcaPoolConfig.ORCA_USDC);
    const orcaToken = orcaUSDCPool.getTokenA();
    console.log('orcaToken', orcaToken);
    const usdcQuote = await orcaUSDCPool.getQuote(orcaToken, orcaAmount);
    const usdcAmount = usdcQuote.getMinOutputAmount();
    const swapOrcaPayload = await orcaUSDCPool.swap(
      this.keypair,
      orcaToken,
      orcaAmount,
      usdcAmount,
    );
    console.log(
      `Swap ${orcaAmount.toString()} ORCA for at least ${usdcAmount.toNumber()} USDC`,
    );

    const swapOrcaTxId = await swapOrcaPayload.execute();
    console.log('Swapped:', swapOrcaTxId, '\n');
    return {
      txIds: [swapTxId, swapOrcaTxId],
      inAmount: solAmount.toNumber(),
      outAmount: usdcAmount.toNumber(),
    };
  }
```

The `buy` and `sell` methods are quite similar - taking a `size` parameter. In both cases, we start by getting an instance of the Orca SDK with the `getOrca` method, which gives us access to the `getPool` method. From there, we can use the `getTokenB` method to be sure we're passing the correct mint address for the SOL token to the `getQuote` method (keep in mind that `getQuote` is asynchronous and returns a Promise, so we need to `await` the result).

It's important to get a minimum output amount for the quoted swap. So important in fact, there is a specific method to do just that: `getMinOutputAmount` returns the smallest amount of ORCA tokens that the user will recieve for the quoted swap, and in the case that the swap produces less than this amountthe transaction will revert. This protects the user from sudden changes in liquidity and slippage. These are advanced topics we won't dive into here, but this particular pattern is quite easy to implement with the Orca SDK. Just remember to program defensively and keep your users in mind 😀.

We can now supply all the necessary parameters to the `swap` method on the Pool instance. The [type definitions](https://github.com/orca-so/typescript-sdk/blob/d231754ef33d21b6a60858996cd93450807f61f3/src/public/pools/types.ts#L91) tell us what we need to know about this method. It will "Perform a swap from the input type to the other token in the pool. Fee for the transaction will be paid by the owner's wallet." The `swap` returns the transaction signature of the swap instruction. This can be sent to the Solana cluster for processing [via the `execute` method from the Orca SDK's `TransactionPayload` type](https://github.com/orca-so/typescript-sdk/blob/d231754ef33d21b6a60858996cd93450807f61f3/src/public/utils/models/instruction.ts#L25).

Both `buy` and `sell` return the same values: The transaction IDs of both swaps to and from ORCA tokens contained in an array, and the amount of tokens in and out.

# 📖 The order book

The order book is necessary to keep track of the buy and sell orders we're going to be generating. When the liquidation bot is running, orders will be happening frequently. Luckily for us, antd has a flexible table component with built in pagination so we don't even need to program that part ourselves.

We've gone ahead and added a couple of buttons to the component being rendered on the right to let you send buy and sell orders to the order book.

Before doing this on devnet, give it a try using the mock wallet! You'll be able to preview the details of an order:

- The Transactions column will contain links to view the swap transactions on the [solscan.io](https://solscan.io) block explorer
- "Side" indicates whether the order was a buy or sell
- You can easily interpret the outgoing and incoming tokens and amounts

![Mock Order](mock_orderbook.png)

Let's take a quick look at the Table in the return value of `components/protocols/pyth/components/Exchange.tsx` to better understand how the order book is being rendered. The antd Table component takes an _array of objects_ for the `columns`, each of these objects has a `title`, `dataIndex` and `key` - optionally we can use the `render` method to add whatever additional React fragments we need, for example: Mapping the transaction IDs to a link pointing to the correct page on solscan.io, or changing the color of the tags we use to display the amounts.

{% hint style="info" %}
Remember to wrap the return values here in [React fragments](https://reactjs.org/docs/fragments.html) (`<> </>`) to avoid trouble with rendering, since they're being rendered within an existing `<div>`!
{% endhint %}

```tsx
// components/protocols/pyth/components/Exchange.tsx

<Table
  dataSource={orderBook}
  columns={[
    {
      title: 'Transactions',
      dataIndex: 'txIds',
      key: 'txIds',
      render: (txIds, record) => {
        return (
          <>
            {txIds.map((txId: string) => (
              <a
                href={`https://solscan.io/tx/${txId}?cluster=${record.cluster}`}
                key={txId}
                target={'_blank'}
                rel="noreferrer"
              >
                {txId.substring(-1, 5)}
              </a>
            ))}
          </>
        );
      },
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
    },
    {
      title: 'out Amount',
      dataIndex: 'outAmount',
      key: 'outAmount',
      render: (val, order) => {
        if (order.side === 'buy') {
          return <Tag color="red">{val / SOL_DECIMAL}</Tag>;
        } else {
          return <Tag color="green">{val / USDC_DECIMAL}</Tag>;
        }
      },
    },
    {
      title: 'Out Token',
      dataIndex: 'toToken',
      key: 'toToken',
    },
    {
      title: 'in Amount',
      dataIndex: 'inAmount',
      key: 'inAmount',
      render: (val, order) => {
        if (order.side === 'buy') {
          return <Tag color="red">{val / USDC_DECIMAL}</Tag>;
        } else {
          return <Tag color="green">{val / SOL_DECIMAL}</Tag>;
        }
      },
    },
    {
      title: 'In Token',
      dataIndex: 'fromToken',
      key: 'fromToken',
    },
  ]}
></Table>
```

---

# 🏋️ Challenge

{% hint style="tip" %}
In `components/protocols/pyth/lib/swap.tsx`, implement X.
{% endhint %}

**Take a few minutes to figure this out**

```typescript
//...

//...
```

**Need some help?** Check out these hints 👇

- ?

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//...

//...
```

**What happened in the code above?**

- ?

---

# ✅ Make sure it works

Once you've made the necessary changes to `components/protocols/pyth/lib/swap.tsx` and saved the file, the Next.js development server will rebuild the page automatically. Now you can click on the "sell" and "buy" buttons to send an order of each type on devnet using Orca.

---

# 🏁 Conclusion

We created functions to exchange tokens on Solana using a DEX. We also looked at how to use the Orca and Jupiter SDKs.
