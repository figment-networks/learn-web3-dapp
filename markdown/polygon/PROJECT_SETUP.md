# 🦊 Install Metamask

Make sure you have the [Metamask](https://metamask.io/) browser extension installed!

---

# 🦺 Safety disclaimers

{% hint style="info" %}
If you **ALREADY** have Metamask installed and are using it for a hot wallet, we _**strongly recommend**_ creating an entirely new wallet in Metamask for the purposes of these tutorials. Figment Learn wants nothing to do with your personal keys. We do not want any accidents involving anybody's cryptocurrency! Again, you _must not continue_ until you take care of this.  
{% endhint %}

{% hint style="danger" %}
If you **DO NOT** already have Metamask installed, welcome to the wonderful world of Web 3!  
The first piece of advice we will give you is to make _absolutely sure that you write down the_ [**Secret Recovery Phrase**](https://community.metamask.io/t/what-is-a-secret-recovery-phrase-and-how-to-keep-your-crypto-wallet-secure/3440) that is generated during Metamask's initial setup. Do not store it in a digital format. Do not share it with anybody. Please do keep it accessible to yourself because you will be using it during the pathway.
{% endhint %}

---

# ⛓ Add the Mumbai testnet to Metamask

The first task is to connect to the Polygon Mumbai testnet by adding it to the list of RPC endpoints in Metamask. Click on the Fox head icon in your web browser to open the popup, and then follow this workflow to complete the process :

- Click on the current network at the top of the Metamask popup (by default is says "Ethereum Mainnet")
- Scroll down and click on "Custom RPC"
- Fill in the form:
  - Network Name: `Polygon Mumbai`
  - New RPC URL: `https://rpc-mumbai.maticvigil.com/`
  - Chain ID: `80001`
  - Currency Symbol: `MATIC`
  - Block Explorer URL : `https://mumbai.polygonscan.com`
- Double check the information, then click on the Save button.

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/polygon/add_mumbai.png)

We use the testnet for development before moving into production on the main network or "mainnet".

If you experience issues with the maticvigil.com endpoint, use one of the other endpoints listed at [https://docs.polygon.technology/docs/develop/network-details/network/](https://docs.polygon.technology/docs/develop/network-details/network/) - click on Mumbai-Testnet below the Network heading to view them.

---

# 🧩 DataHub API keys

If you wish to make use of the Pathway content using DataHub, you will need a DataHub account and a valid API key to access Polygon via DataHub's infrastructure. [Sign up for a DataHub account](https://datahub-beta.figment.io/signup) and verify your email address. Once you have logged in to DataHub, you will need to create a new app and select the Polygon protocol.

Click "Create New App":

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/dh_api_1.png?raw=true)

Type in a name for your app, select the **Staging** environment, then click on the **Solana** icon in the list of available protocols. \
Click "Create app" when you're finished:

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/dh_api_2.png?raw=true)

You can now find your API key on the Overview tab of the app on the [**DataHub Dashboard**](https://datahub-beta.figment.io/apps):

![](https://raw.githubusercontent.com/figment-networks/learn-web3-dapp/main/markdown/__images__/dh_api_3.png?raw=true)

To use your API key, you should copy the contents of the `.env.example` file located in the project root directory (`/learn-web3-dapp/.env.example`) into a new file named `.env.local` (`/learn-web3-dapp/.env.local`). Also, since this file will contain your API key, we have already added it to the `.gitignore`.

{% hint style="info" %}
Easily duplicate the file with the terminal command `cp .env.example .env.local`!
{% endhint %}

You can then paste your unique API key into `.env.local`, as the value for the environment variable `DATAHUB_POLYGON_API_KEY`. This will authenticate you and enable you to make requests to Polygon via DataHub. **The API key shown below is only an example and cannot be used to access DataHub**.

```yaml
# DataHub API keys
DATAHUB_AVALANCHE_API_KEY=
DATAHUB_CELO_API_KEY=
DATAHUB_NEAR_API_KEY=
DATAHUB_POLKADOT_API_KEY=
DATAHUB_POLYGON_API_KEY=e5f82e4d1e8f7add65aa849bb5313f3f
DATAHUB_SECRET_API_KEY=
DATAHUB_SOLANA_API_KEY=
DATAHUB_TEZOS_API_KEY=
```

---

# 👣 Next Steps

Once you have your Polygon API key saved in `/learn-web3-dapp/.env.local`, you're ready to begin.
Click on the **Next: Connect to Polygon** button below.
