# 🧩 DataHub API keys

If you wish to make use of the Pathway content using DataHub, you will need a DataHub account and a valid API key to access Polkadot via DataHub's infrastructure. [Sign up for a DataHub account](https://datahub-beta.figment.io/signup) and verify your email address. Once you have logged in to DataHub, you will need to create a new app and select the Polkadot protocol.

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

You can then paste your unique API key into `.env.local`, as the value for the environment variable `DATAHUB_POLKADOT_API_KEY`. This will authenticate you and enable you to make requests to Polkadot via DataHub. **The API key shown below is only an example and cannot be used to access DataHub**.

```yaml
# DataHub API keys
DATAHUB_AVALANCHE_API_KEY=
DATAHUB_CELO_API_KEY=
DATAHUB_NEAR_API_KEY=
DATAHUB_POLKADOT_API_KEY=9f40361b6a3253e577376495c580b700
DATAHUB_POLYGON_API_KEY=
DATAHUB_SECRET_API_KEY=
DATAHUB_SOLANA_API_KEY=
DATAHUB_TEZOS_API_KEY=
```

---

# 👣 Next Steps

Once you have your Polkadot API key saved in `/learn-web3-dapp/.env.local`, you're ready to begin.
Click on the **Next: Connect to Polkadot** button below.
