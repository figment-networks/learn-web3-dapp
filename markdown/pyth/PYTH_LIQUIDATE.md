# 🔩 Bolting it all together

Now it's time to bring all the functionality that we've completed together and try out the working liquidation bot on the Solana devnet!

If you recall, at the beginning of the pathway we laid out the various topics we would need to touch on to make this project. At every step, we provided you with copious amounts of learning and a chance to solidify that learning by completing a small coding challenge related to the task at hand. Here is a quick recap of how the components fit together:

- We have a component that can toggle our Pyth price feed on and off as needed to start and stop the bot.
- We've got an account display, the "Wallet" component which shows us how many tokens the bot has access to. We can supply a private key to give the bot complete authority to swap these tokens.
- There's a beautiful Chart component to display the price data so that we know which way the market is moving. Knowledge is power!
- We've got an order book and a way to generate token swap transactions based on the Exponential Moving Average and execute them on a DEX.

The file `components/protocols/pyth/components/Liquidate.tsx` is being rendered on the right side of the page. You should be familiar with the imports by now. We're bringing in the `pythConnection` that we worked on in the first step to fetch our price data from the Solana cluster. We'll be using the `price` state variable, and the `yieldExpectation`. Each `useEffect` has comments in the code explaining what they're doing.

---

# 🏋️ Challenge

{% hint style="tip" %}
In `components/pyth/components/Liquidate.tsx`, implement X.
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

Before turning on the price feed, be sure to switch to the **live wallet** on devnet and paste in the private key of the keypair we created earlier, then funded with SOL. It should also contain some USDC from when we tested the token swaps with Orca. If the keypair doesn't have both SOL and USDC balances, the liquidation bot will fail to perform its assigned task.

Armed and ready? Now it's time to toggle the price feed on and watch the liquidation bot go to work!

The chart will populate with the ongoing price feed, and the bot will make buy & sell orders depending on the signals being emitted as events by the `eventListener`. This is all going to happen very quickly, but don't be afraid to let it run for a short time before toggling the price feed off to inspect the sequence of events.

For every instance where the order book has been updated, the bot will attempt to make the appropriate trade. If everything is working as it should, you'll see the amounts of SOL, USDC and ORCA update as the swaps are completed.

If you want to alter the yield expectation, it's best to turn off the price feed first.

It is also handy to have a peek at the dev tools console in your browser to see a little more information about the swaps. In Firefox, open the Web Developer Tools. In Chrome, they're just called Developer Tools. In both browsers, simply right click on the page and select **Inspect** from the context menu, then click on the **Console** tab in the Developer Tools window. Now you can see the output of the informative `console.log` statements we included in the code 🚀

---

# 🏁 Conclusion

Congratulations, you now have a functional yet very basic liquidation bot which depends on Pyth price data to make token swaps on a DEX! There are many ways in which you might seek to improve on this functionality - whether it's just a sleek design or implementing a more stringent algorithm for trading.
