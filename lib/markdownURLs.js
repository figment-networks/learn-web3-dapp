const MARKDOWN_BASE_URL = 'https://raw.githubusercontent.com';
const MARKDOWN_BASE_ORGANISATION = '/figment-networks';
const MARKDOWN_BASE_REPOSITORY = '/datahub-learn';
const MARKDOWN_BASE_BRANCH = '/master';
const MARKDOWN_BASE_DIRECTORY = '/figment-learn/new-pathways';
const MARKDOWN_URI =
  MARKDOWN_BASE_URL +
  MARKDOWN_BASE_ORGANISATION +
  MARKDOWN_BASE_REPOSITORY +
  MARKDOWN_BASE_BRANCH +
  MARKDOWN_BASE_DIRECTORY;

const markdownUrls = {
  solana: {
    PROJECT_SETUP: `${MARKDOWN_URI}/solana/solana-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/solana/solana-01-connect.md`,
    CREATE_ACCOUNT: `${MARKDOWN_URI}/solana/solana-02-account.md`,
    FUND_ACCOUNT: `${MARKDOWN_URI}/solana/solana-03-fund.md`,
    GET_BALANCE: `${MARKDOWN_URI}/solana/solana-04-balance.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/solana/solana-05-transfer.md`,
    DEPLOY_CONTRACT: `${MARKDOWN_URI}/solana/solana-06-deploy.md`,
    SOLANA_CREATE_GREETER: `${MARKDOWN_URI}/solana/solana-07-greeter.md`,
    GET_CONTRACT_VALUE: `${MARKDOWN_URI}/solana/solana-08-getvalue.md`,
    SET_CONTRACT_VALUE: `${MARKDOWN_URI}/solana/solana-09-setvalue.md`,
  },
  polygon: {
    PROJECT_SETUP: `${MARKDOWN_URI}/polygon/polygon-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/polygon/polygon-01-connect.md`,
    QUERY_CHAIN: `${MARKDOWN_URI}/polygon/polygon-02-query.md`,
    GET_BALANCE: `${MARKDOWN_URI}/polygon/polygon-04-fund.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/polygon/polygon-05-transfer.md`,
    DEPLOY_CONTRACT: `${MARKDOWN_URI}/polygon/polygon-06-deploy.md`,
    SET_CONTRACT_VALUE: `${MARKDOWN_URI}/polygon/polygon-07-setter.md`,
    GET_CONTRACT_VALUE: `${MARKDOWN_URI}/polygon/polygon-08-getter.md`,
    RESTORE_ACCOUNT: `${MARKDOWN_URI}/polygon/polygon-03-restore.md`,
  },
  avalanche: {
    PROJECT_SETUP: `${MARKDOWN_URI}/avalanche/avalanche-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/avalanche/avalanche-01-connect.md`,
    CREATE_KEYPAIR: `${MARKDOWN_URI}/avalanche/avalanche-02-account.md`,
    GET_BALANCE: `${MARKDOWN_URI}/avalanche/avalanche-03-balance.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/avalanche/avalanche-04-transfer.md`,
    EXPORT_TOKEN: `${MARKDOWN_URI}/avalanche/avalanche-05-export.md`,
    IMPORT_TOKEN: `${MARKDOWN_URI}/avalanche/avalanche-06-import.md`,
  },
  celo: {
    PROJECT_SETUP: `${MARKDOWN_URI}/celo/celo-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/celo/celo-01-connect.md`,
    CREATE_ACCOUNT: `${MARKDOWN_URI}/celo/celo-02-account.md`,
    GET_BALANCE: `${MARKDOWN_URI}/celo/celo-03-balance.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/celo/celo-04-transfer.md`,
    SWAP_TOKEN: `${MARKDOWN_URI}/celo/celo-05-swap.md`,
    DEPLOY_CONTRACT: `${MARKDOWN_URI}/celo/celo-06-deploy.md`,
    GET_CONTRACT_VALUE: `${MARKDOWN_URI}/celo/celo-07-getter.md`,
    SET_CONTRACT_VALUE: `${MARKDOWN_URI}/celo/celo-08-setter.md`,
  },
  polkadot: {
    PROJECT_SETUP: `${MARKDOWN_URI}/polkadot/polkadot-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/polkadot/polkadot-01-connect.md`,
    CREATE_ACCOUNT: `${MARKDOWN_URI}/polkadot/polkadot-02-account.md`,
    RESTORE_ACCOUNT: `${MARKDOWN_URI}/polkadot/polkadot-03-restore.md`,
    ESTIMATE_FEES: `${MARKDOWN_URI}/polkadot/polkadot-04-estimate.md`,
    GET_BALANCE: `${MARKDOWN_URI}/polkadot/polkadot-05-balance.md`,
    ESTIMATE_DEPOSIT: `${MARKDOWN_URI}/polkadot/polkadot-06-deposit.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/polkadot/polkadot-07-transfer.md`,
  },
  tezos: {
    PROJECT_SETUP: `${MARKDOWN_URI}/tezos/tezos-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/tezos/tezos-01-connect.md`,
    CREATE_ACCOUNT: `${MARKDOWN_URI}/tezos/tezos-02-account.md`,
    GET_BALANCE: `${MARKDOWN_URI}/tezos/tezos-03-balance.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/tezos/tezos-04-transfer.md`,
    DEPLOY_CONTRACT: `${MARKDOWN_URI}/tezos/tezos-05-deploy.md`,
    GET_CONTRACT_VALUE: `${MARKDOWN_URI}/tezos/tezos-06-getter.md`,
    SET_CONTRACT_VALUE: `${MARKDOWN_URI}/tezos/tezos-07-setter.md`,
  },
  secret: {
    PROJECT_SETUP: `${MARKDOWN_URI}/secret/secret-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/secret/secret-01-connect.md`,
    CREATE_ACCOUNT: `${MARKDOWN_URI}/secret/secret-02-account.md`,
    GET_BALANCE: `${MARKDOWN_URI}/secret/secret-03-balance.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/secret/secret-04-transfer.md`,
    DEPLOY_CONTRACT: `${MARKDOWN_URI}/secret/secret-05-deploy.md`,
    GET_CONTRACT_VALUE: `${MARKDOWN_URI}/secret/secret-06-getter.md`,
    SET_CONTRACT_VALUE: `${MARKDOWN_URI}/secret/secret-07-setter.md`,
  },
  near: {
    PROJECT_SETUP: `${MARKDOWN_URI}/near/near-setup.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/near/near-01-connect.md`,
    CREATE_KEYPAIR: `${MARKDOWN_URI}/near/near-02-keypair.md`,
    CREATE_ACCOUNT: `${MARKDOWN_URI}/near/near-34-account.md`,
    GET_BALANCE: `${MARKDOWN_URI}/near/near-05-balance.md`,
    TRANSFER_TOKEN: `${MARKDOWN_URI}/near/near-06-transfer.md`,
    DEPLOY_CONTRACT: `${MARKDOWN_URI}/near/near-07-deploy.md`,
    GET_CONTRACT_VALUE: `${MARKDOWN_URI}/near/near-08-getter.md`,
    SET_CONTRACT_VALUE: `${MARKDOWN_URI}/near/near-09-setter.md`,
  },
  ceramic: {
    PROJECT_SETUP: `${MARKDOWN_URI}/ceramic/ceramic-01-intro.md`,
    CHAIN_CONNECTION: `${MARKDOWN_URI}/ceramic/ceramic-02-connect.md`,
    LOGIN: `${MARKDOWN_URI}/ceramic/ceramic-03-login.md`,
    BASIC_PROFILE: `${MARKDOWN_URI}/ceramic/ceramic-04-basic-profile.md`,
    CUSTOM_DEFINITION: `${MARKDOWN_URI}/ceramic/ceramic-05-custom-definition.md`,
  },
  the_graph: {
    PROJECT_SETUP: `${MARKDOWN_URI}/the_graph/01-setup.md`,
    GRAPH_NODE: `${MARKDOWN_URI}/the_graph/02-node.md`,
    SUBGRAPH_SCAFFOLD: `${MARKDOWN_URI}/the_graph/03-subgraph.md`,
    SUBGRAPH_MANIFEST: `${MARKDOWN_URI}/the_graph/04-manifest.md`,
    SUBGRAPH_SCHEMA: `${MARKDOWN_URI}/the_graph/05-entities.md`,
    SUBGRAPH_MAPPINGS: `${MARKDOWN_URI}/the_graph/06-mappings.md`,
    SUBGRAPH_QUERY: `${MARKDOWN_URI}/the_graph/07-query.md`,
  },
};

module.exports = markdownUrls;
