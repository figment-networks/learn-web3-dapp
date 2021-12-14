import type {NextApiRequest, NextApiResponse} from 'next';
import type {ManifestStepStatusesT} from '@figment-the-graph-near/types';
import {manifestT} from '@figment-the-graph-near/types';
import yaml from 'js-yaml';
import fs from 'fs';
import {defaultManifestStatus} from '@figment-the-graph-near/lib';

const START_BLOCK = 54395933;
const MANIFEST_PATH = './subgraphs/near-subgraph/subgraph.yaml';
const HANDLER = 'handleReceipt';

const loadManifest = () => {
  let manifest = fs.readFileSync(MANIFEST_PATH, 'utf8');
  let data = yaml.load(manifest) as manifestT;

  let startBlock = data.dataSources[0].source.startBlock;
  let entities = data.dataSources[0].mapping.entities;
  let receiptHandlers = data.dataSources[0].mapping.receiptHandlers;
  return {
    startBlock,
    entities,
    receiptHandlers,
  };
};
export default async function manifest(
  _req: NextApiRequest,
  res: NextApiResponse<ManifestStepStatusesT | string>,
) {
  try {
    let status = defaultManifestStatus;
    const {startBlock, entities, receiptHandlers} = loadManifest();

    if (startBlock === START_BLOCK) {
      status = {
        ...status,
        block: {
          isValid: true,
          message: 'startBlock is 54395933',
        },
      };
    }

    if (
      entities.includes('Account') &&
      entities.includes('Log') &&
      entities.length == 2
    ) {
      status = {
        ...status,
        entities: {
          isValid: true,
          message: 'Account and Log entities',
        },
      };
    }

    if (
      receiptHandlers.length === 1 &&
      receiptHandlers[0]['handler'] === HANDLER
    ) {
      status = {
        ...status,
        receiptHandlers: {
          isValid: true,
          message: 'Receipt handler with receiptHandler',
        },
      };
    }

    res.status(200).json(status);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
