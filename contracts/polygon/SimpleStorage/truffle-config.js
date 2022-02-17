const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
// const mnemonic = fs.readFileSync('.secret').toString().trim();
const privateKey = fs.readFileSync('.secret').toString().trim();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  compilers: {
    solc: {
      version: '0.8.0',
      parser: 'solcjs', // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true,
          runs: 200, // Optimize for how many times you intend to run the code
        },
        evmVersion: 'istanbul', // Default: "istanbul"
      },
    },
  },
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*',
    },
    test: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*',
    },
    matic: {
      provider: () =>
        new HDWalletProvider({
          // As per the documentation at https://github.com/trufflesuite/truffle/tree/develop/packages/hdwallet-provider#general-usage
          // "If both mnemonic and private keys are provided, the mnemonic is used."
          // Therefore, uncomment the following lines to use a mnemonic instead of a private key:
          // mnemonic: {
          //   phrase: mnemonic,
          // },
          privateKeys: [privateKey],
          providerOrUrl: `https://matic-mumbai.chainstacklabs.com`,
          chainId: 80001,
        }),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
    },
  },
};
