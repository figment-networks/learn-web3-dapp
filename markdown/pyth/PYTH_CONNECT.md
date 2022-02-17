# 🤨 What are we building, here?

Using price data from Pyth as the foundation, we are going to build a minimum viable product or "MVP" which supports automating the task of swapping between SOL and USDC tokens using a decentralized exchange or "DEX". The goal is to be able to buy when the price is low and sell when the price is high. There are several ways of referring to this functionality, but for the purposes of this Pathway we will refer to the MVP as a "liquidation bot".

To complete this project, we must implement the following:

- Connect to Pyth by subscribing to changes in the price data on Solana
- Display an account balance with the ability to switch between Solana clusters and accept a private key
- A chart component which accurately depicts the asset price
- Wire up an input for an expected yield and an amount to buy when a specific threshold of buy signals is reached
- The logic to determine when to send a swap transaction
- Wire it all together into a working set of components suitable for use

The purpose of this Pathway is to give you hands-on experience using Pyth by incorporating price data into a useful application. Unrelated to Pyth but still important, the rest of the components will strengthen your understanding of how to visualize market fluctuations on a chart and perform swaps on a DEX.

In essence the "bot" we are building is more like Wall-E than The Terminator. We're focused more on having fun and learning, than on ruthless efficiency.

![Wall-E and The Terminator](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/pyth/walle-terminator.jpg)

---

# 🧐 What is Pyth, anyway?

Smart contracts are isolated programs that automate the execution of tasks based on certain inputs. Sometimes those inputs occur off-chain. That means the smart contract needs a trusted way to determine that an input has occurred off-chain in order to execute actions on-chain. That service is provided by oracle protocols. These are a way to connect smart contracts to the outside world.

[Pyth](https://pyth.network) is an oracle protocol which allows publishers to include their price data for various asset pairs or _products_ on the [Solana](https://solana.com) blockchain. There are three sets of participants interacting with the Pyth protocol:

1. **Publishers** are first-party data providers who submit their asset pricing data to Pyth. Publishers are incentivized to publish accurate and timely prices by data staking and reward distribution mechanisms.
2. **Consumers** use the price data being aggregated by Pyth's on-chain program, optionally paying data fees to Delegators to promote accuracy of the price data.
3. **Delegators** stake tokens and earn data fees, and they can potentially lose their stake if the aggregate price data is inaccurate. Delegators are responsible for helping the Publishers to maximize the robustness of the price data.

The Pyth on-chain program maintains accounts on Solana which are responsible for tracking the products and their current price data. Pyth aims to make accurate, high-resolution financial market data easily accessible on Solana.

It is possible for consumers to interact with this data both on- and off-chain, depending on their needs. \
Pyth uses three types of account on Solana:

1. **Product** accounts store the metadata of a product such as its symbol and asset type.
2. **Price** accounts store the current price information of a product, including the symbol and **confidence interval**.
3. **Mapping** accounts maintain a linked list of other accounts - this allows applications to easily enumerate the full list of products served by Pyth.

The goal of Pyth's aggregation algorithm (say _that_ five times fast!) is to combine the prices reported by publishers, giving more weight to prices with a tighter confidence interval.
This helps consumers access more accurate price data, without worrying about a single publisher or even a small number of publishers moving the aggregate price by themselves.
Confidence weighting is necessary because publishers have different degrees of precision in their ability to observe a product. Another factor is that exchanges with more liquidity have tighter spreads than those with less liquidity.

{% hint style="info" %}
A spread can have several meanings in relation to finance. It often refers to the difference between two prices. The most common definition is the gap between the bid price and the ask price of an asset, the "bid-ask spread".
{% endhint %}

---

# ⛓ Consuming on-chain data

Pyth provides a few tools to consume the published data. We will use the [JavaScript client](https://github.com/pyth-network/pyth-client-js) `pyth-client-js` which we installed during the setup for this project. The client fetches the prices and returns JavaScript objects which are much easier to work with. It also enables us to listen for price updates which happen during each [slot](https://docs.solana.com/terminology#slot) on Solana (approximately every 400 _milliseconds_).

As you can probably guess, such a high frequency of updates will require some special handling.

---

# 🤑 Aggregate price

Aggregate means "formed or calculated by the combination of many separate units". When we refer to an "aggregate price" or "aggregate confidence interval" we mean that the information reported by Pyth is a combination of multiple data points. This is a good thing for consumers to be aware of, as it provides a clear opportunity to avoid the pitfall of acting on incorrect data. Don't just rely on the aggregate price as a true price when performing financial calculations, take the confidence interval and related factors into account.

---

# ⏰ Confidence interval

Pyth publishers must supply a confidence interval because in real markets, _there is no single price for a product_ - it is constantly changing based on market activity over time. This is especially true for cryptocurrency exchanges where assets can be trading at very different prices across exchanges.

A confidence **interval** is a range of values with an upper bound and a lower bound, computed at a particular confidence **level**.

Publishers who submit their price data to Pyth do not all use the same methods to determine their confidence in a given price. Because of the potential for a small number of publishers to influence the reported price of an asset, it is therefore important to use an _aggregate_ price. The confidence interval published on Pyth is also an aggregated value, based on the confidence being reported by Publishers. It is best practice for Publishers to provide high quality data. A confidence interval that is too low can lead to problems for consumers.

Pyth calculates the price and confidence intervals for all products on a constant basis. Any Publisher behind by 25 slots (approximately 10 seconds) is considered inactive and their prices are not included in the aggregate until they can catch up, which prevents stale data from being served.

{% hint style="tip" %}
"When consuming Pyth prices, we recommend using the confidence interval to protect your users from these unusual market conditions. The simplest way to do so is to use Pyth's confidence interval to compute a range in which the true price (probably) lies. You obtain this range by adding and subtracting a multiple of the confidence interval to the Pyth price; the bigger the multiple, the more likely the price lies within that range. \
We recommend considering a multiple of 3, which gives you a 99.7% probability that the true price is within the range (assuming normal distribution estimates are correct). Then, select the most conservative price within that range for every action. \
In other words, your protocol should _minimize state changes during times of large price uncertainty_." - Pyth [Best Practices](https://docs.pyth.network/consumers/best-practices)
{% endhint %}

---

# 🧠 Exponents

Not all price accounts maintain their data in floating point format. Sometimes it is necessary to use an exponent to convert price data from fixed-point to floating point. The readable price (including the decimal, i.e. 150.004731628) is calculated by taking the `price` field from a Pyth price account and multiplying it by `10^exponent`. This will be a negative exponent, which will move the decimal to the left. The exponent is included in the price data held within the price account for a given product.

The price, confidence interval and exponent will be displayed in the component on the right side of this page once you have completed the coding challenge and start the price feed.

---

# 🏋️ Challenge

{% hint style="tip" %}
In `components/protocols/pyth/components/Connect.tsx`, implement `getPythData` by creating an instance of the `PythConnection` class and then registering the `onPriceChange` callback. You must replace the instances of `undefined` with working code to accomplish this. \
\
_We don't want you to be overwhelmed by price data for every available product, so we have narrowed it down to SOL/USD for the purposes of this tutorial._
{% endhint %}

**Take a few minutes to figure this out**

```typescript
//...
const connection = new Connection(clusterApiUrl(SOLANA_NETWORKS.DEVNET));
const pythPublicKey = undefined;
const pythConnection = undefined;

const Connect = () => {
  // ...
  const getPythData = async (checked: boolean) => {
    undefined.onPriceChange((product, price) => {
      if (
        product.symbol === 'Crypto.SOL/USD' &&
        price.price &&
        price.confidence
      ) {
        // ...
    });
    // ...
  };
//...
```

**Need some help?** Check out these links & hints 👇

- [What are callback functions](https://www.freecodecamp.org/news/javascript-callback-functions-what-are-callbacks-in-js-and-how-to-use-them/) in JavaScript?
- There is a function for mapping Solana clusters to the public key of the Pyth program: `getPythProgramKeyForCluster`. \
  You'll need to supply the name of the Solana cluster you want to get Pyth data from (`mainnet-beta`, `devnet` or `testnet`).
  - To connect to Pyth, use the `PythConnection` class from `@pythnetwork/client` - You'll need to supply a JSON-RPC connection and a Pyth program public key. Seasoned developers may wish to [dive into the code](https://github.com/pyth-network/pyth-client-js/blob/3de72323598131d6d14a9dc9f48f5f225b5fbfd2/src/PythConnection.ts#L29) to see what it's doing.

Still not sure how to do this? No problem! The solution is below so you don't get stuck.

---

# 😅 Solution

```typescript
// solution
//...
const connection = new Connection(clusterApiUrl(SOLANA_NETWORKS.DEVNET));
const pythPublicKey = getPythProgramKeyForCluster(PYTH_NETWORKS.DEVNET);
const pythConnection = new PythConnection(connection, pythPublicKey);

const Connect = () => {
  // ...
  const getPythData = async (checked: boolean) => {
    pythConnection.onPriceChange((product, price) => {
      if (
        product.symbol === 'Crypto.SOL/USD' &&
        price.price &&
        price.confidence
      ) {
        console.log(
          `${product.symbol}: $${price.price} \xB1$${price.confidence}`,
        );
        setPrice(price.price);
        setSymbol('Crypto.SOL/USD');
      } else if (product.symbol === 'Crypto.SOL/USD' && !price.price) {
        console.log(`${product.symbol}: price currently unavailable`);
        setPrice(0);
        setSymbol('Crypto.SOL/USD');
      }
    });

    if (!checked) {
      message.info('Stopping feed!');
      pythConnection.stop();
    } else {
      message.info('Starting feed!');
      pythConnection.start();
    }
  };
};
//...
```

**What happened in the code above?**

- We created a `connection` instance of the `Connection` class using the `new` constructor, and passing the function `clusterApiUrl` which returns the RPC endpoint URL of the given Solana cluster. `SOLANA_NETWORKS.DEVNET` is a constant defined in the file `types/index.ts`. Slightly more verbose than supplying the string "devnet", though it is more readable and in this way we are not hard-coding the value.
- We're passing the `checked` boolean to the `getPythData` function to operate starting/stopping the price feed using the antd toggle component.
- After registering the `onPriceChange` callback on the `pythConnection`, we can perform any actions necessary for our app to function. Using conditional statements to change the behavior of the app depending on the product symbol, price or confidence interval.
- The `onPriceChange` callback will be invoked every time a Pyth price gets updated. This callback gets two arguments:
  - `price` contains the official Pyth price and confidence, along with the component prices that were combined to produce this result.
  - `product` contains metadata about the price feed, such as the symbol (e.g., "Crypto.SOL/USD") and the number of decimal points.
- Once you've set up the connection and the `onPriceChange` callback, you'll be able to tap into the price feed with a simple `pythConnection.start()`! \
  We have set up an easy to use component here to toggle it on and off, but in production you would probably want to handle this a little bit differently.
- `\xB1` is the escaped Hex code for the Unicode character `±`, "plus or minus" - indicating the following value is the confidence interval.
- We need to provide a way to stop listening to the price feed, in this case when the toggle switch component is turned off it will call `pythConnection.stop()`, removing the callback.

{% hint style="info" %}
If you are interested in seeing the breakdown of the aggregated data, it is available on the `priceComponents` property of the `price` object.
{% endhint %}

---

# ✅ Make sure it works

Once you've made the necessary changes to `components/protocols/pyth/components/Connect.tsx` and saved the file, click on the toggle switch labeled "Pyth" on the right side of the screen to connect to Pyth & display the current price of the SOL/USD product! Be aware that the queries are being put through a public endpoint and are therefore subject to rate and data limiting. If you leave this price feed running for a while (~30 minutes), you will run out of requests and the feed will stop updating. **Remember to switch it off before moving to the next step!**

---

# 🏁 Conclusion

We established a connection to the Pyth price feed on Solana using the JavaScript Pyth client. The connection can be regulated by listening to the price feed using a callback function and removing that callback when we want to stop listening.
We also discussed three key concepts involved in price data: Aggregate price, confidence interval, and the exponent used to convert price data from fixed-point to floating point.

If you'd like, take a few minutes to learn more about how Pyth's [account structure](https://docs.pyth.network/how-pyth-works/account-structure) & [price aggregation](https://docs.pyth.network/how-pyth-works/price-aggregation) work by reviewing the official documentation.

If you are interested in the specifics, check out the [Pyth whitepaper](https://s3.us-east-2.amazonaws.com/pyth.whitepaper/whitepaper.pdf) which explains how the protocol operates.
