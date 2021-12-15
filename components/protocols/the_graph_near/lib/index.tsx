import {
  ManifestStepStatusesT,
  EntityStepStatusesT,
} from '@figment-the-graph-near/types';

export const getNEARContract = (address: string) => {
  return `https://explorer.near.org/accounts/${address}`;
};

export const defaultManifestStatus: ManifestStepStatusesT = {
  block: {
    isValid: false,
    message: 'Invalid startBlock',
  },
  entities: {
    isValid: false,
    message: 'Invalid entities',
  },
  receiptHandlers: {
    isValid: false,
    message: 'Invalid receiptHandler',
  },
};

export const defaultEntityStatus: EntityStepStatusesT = {
  entities: {
    isValid: false,
    message: 'Number of entities mismatch',
  },
  account: {
    isValid: false,
    message: 'Account entity is missing',
  },
  log: {
    isValid: false,
    message: 'Log entity is missing',
  },
};
