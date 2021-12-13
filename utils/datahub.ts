import {
  NETWORKS,
  PROTOCOLS,
  CHAINS,
  NEAR_NETWORKS,
  CELO_NETWORKS,
  SECRET_NETWORKS,
  POLKADOT_NETWORKS,
  POLKADOT_PROTOCOLS,
  SOLANA_NETWORKS,
} from 'types';

export const getNodeURL = (
  chain: CHAINS,
  network: NETWORKS,
  protocol?: PROTOCOLS,
  node?: string,
): string => {
  if (node === 'datahub') {
    return getDatahubNodeURL(chain, network, protocol);
  }
  if (node === 'devnet') {
    return getTestnetNodeURL(chain);
  }
  if (node === 'localnet') {
    return getLocalNodeURL(chain);
  }
  return getDatahubNodeURL(chain, network, protocol);
};

const getTestnetNodeURL = (chain: CHAINS): string => {
  switch (chain) {
    case CHAINS.SOLANA:
      return 'https://api.devnet.solana.com';
    case CHAINS.AVALANCHE:
      return 'https://api.avax-test.network';
    case CHAINS.NEAR:
      return 'https://rpc.testnet.near.org';
    case CHAINS.CERAMIC:
      return 'https://ceramic-clay.3boxlabs.com';
    default:
      return '';
  }
};

const getLocalNodeURL = (chain: CHAINS): string => {
  switch (chain) {
    case CHAINS.SOLANA:
      return 'http://127.0.0.1:8899';
    case CHAINS.AVALANCHE:
      return 'http://127.0.0.1:9650';
    default:
      return '';
  }
};

export const getDatahubNodeURL = (
  chain: CHAINS,
  network: NETWORKS,
  protocol?: PROTOCOLS,
): string => {
  switch (chain) {
    case CHAINS.AVALANCHE:
      return getDataHubAvalancheNodeUrl();
    case CHAINS.NEAR:
      return getDataHubNearNodeUrl(network as NEAR_NETWORKS);
    case CHAINS.POLKADOT:
      return getDataHubPolkadotNodeUrl(
        network as POLKADOT_NETWORKS,
        protocol as POLKADOT_PROTOCOLS,
      );
    case CHAINS.SOLANA:
      return getDataHubSolanaNodeUrl(network as SOLANA_NETWORKS);
    case CHAINS.CELO:
      return getDataHubCeloNodeUrl(network as CELO_NETWORKS);
    case CHAINS.SECRET:
      return getDataHubSecretNodeUrl(network as SECRET_NETWORKS);
    default:
      return '';
  }
};

const getDataHubAvalancheNodeUrl = (): string =>
  `https://${process.env.AVALANCHE_DATAHUB_URL}/apikey/${process.env.DATAHUB_AVALANCHE_API_KEY}`;

const getDataHubNearNodeUrl = (network: NEAR_NETWORKS): string =>
  network === NEAR_NETWORKS.TESTNET
    ? `https://${process.env.DATAHUB_NEAR_MAINNET_RPC_URL}/apikey/${process.env.DATAHUB_NEAR_API_KEY}`
    : `https://${process.env.DATAHUB_NEAR_TESTNET_RPC_URL}/apikey/${process.env.DATAHUB_NEAR_API_KEY}`;

const getDataHubCeloNodeUrl = (network: CELO_NETWORKS): string =>
  network === CELO_NETWORKS.TESTNET
    ? `https://${process.env.DATAHUB_CELO_MAINNET_RPC_URL}/apikey/${process.env.DATAHUB_CELO_API_KEY}/`
    : `https://${process.env.DATAHUB_CELO_TESTNET_RPC_URL}/apikey/${process.env.DATAHUB_CELO_API_KEY}/`;

const getDataHubSecretNodeUrl = (network?: SECRET_NETWORKS): string =>
  `https://${process.env.DATAHUB_SECRET_TESTNET_URL}/apikey/${process.env.DATAHUB_SECRET_API_KEY}/`;

const getDataHubPolkadotNodeUrl = (
  network: POLKADOT_NETWORKS,
  protocol: POLKADOT_PROTOCOLS,
): string => {
  if (network === POLKADOT_NETWORKS.TESTNET) {
    if (protocol === POLKADOT_PROTOCOLS.RPC) {
      return `https://${process.env.DATAHUB_POLKADOT_WESTEND_RPC_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`;
    } else if (protocol === POLKADOT_PROTOCOLS.WS) {
      return `wss://${process.env.DATAHUB_POLKADOT_WESTEND_WS_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`;
    }
  } else if (network === POLKADOT_NETWORKS.DATAHUB) {
    if (protocol === POLKADOT_PROTOCOLS.RPC) {
      return `https://${process.env.DATAHUB_POLKADOT_MAINNET_RPC_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`;
    } else if (protocol === POLKADOT_PROTOCOLS.WS) {
      return `wss://${process.env.DATAHUB_POLKADOT_MAINNET_WS_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`;
    }
  }

  return '';
};

const getDataHubSolanaNodeUrl = (network: SOLANA_NETWORKS): string => {
  if (network === SOLANA_NETWORKS.MAINNET) {
    return `https://${process.env.DATAHUB_SOLANA_MAINNET_URL}/apikey/${process.env.DATAHUB_SOLANA_API_KEY}`;
  } else {
    return `https://${process.env.DATAHUB_SOLANA_DEVNET_URL}/apikey/${process.env.DATAHUB_SOLANA_API_KEY}`;
  }
};
