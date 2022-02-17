export const getNodeUrl = (network: string) => {
  if (network === 'Datahub') {
    return `${process.env.POLKADOT_DATAHUB_URL}/apikey/${process.env.DATAHUB_POLKADOT_API_KEY}`;
  } else {
    return 'wss://westend-rpc.polkadot.io';
  }
};

export const accountExplorer = (network: string) => (address: string) =>
  `https://westend.subscan.io/account/${address}`;

export const transactionUrl = (hash: string) =>
  `https://westend.subscan.io/extrinsic/${hash}`;

export const FAUCET_URL = `https://app.element.io/#/room/#westend_faucet:matrix.org`;
