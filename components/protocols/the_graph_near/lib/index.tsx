import {
  ManifestStepStatusesT,
  EntityStepStatusesT,
} from '@figment-the-graph-near/types';

export const getEtherScanContract = (address: string) => {
  return `https://etherscan.io/address/${address}`;
};

export const defaultManifestStatus: ManifestStepStatusesT = {
  block: {
    isValid: true,
    message: 'Invalid startBlock',
  },
  entities: {
    isValid: true,
    message: 'Invalid entities',
  },
  eventHandlers: {
    isValid: true,
    message: 'Invalid eventHandlers',
  },
};

export const defaultEntityStatus: EntityStepStatusesT = {
  entities: {
    isValid: true,
    message: 'Numbers of entities mismatch',
  },
  account: {
    isValid: true,
    message: 'Account entity is missing',
  },
  punk: {
    isValid: true,
    message: 'Punk entity is missing',
  },
};

type WEI = string;
type ETH = string;

export const toEther = (amountInWei: WEI): ETH => {
  // 1 ETH = 10**18 wei
  const DECIMAL_OFFSET = 10 ** 18;
  const centiEther = parseFloat(
    ((parseFloat(amountInWei) / DECIMAL_OFFSET) * 100).toFixed(),
  );
  return (centiEther / 100).toFixed(2);
};
