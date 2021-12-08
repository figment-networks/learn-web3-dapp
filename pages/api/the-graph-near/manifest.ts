import type {NextApiRequest, NextApiResponse} from 'next';
import type {ManifestStepStatusesT} from '@figment-the-graph-near/types';
import {manifestT} from '@figment-the-graph-near/types';
import yaml from 'js-yaml';
import fs from 'fs';
import {defaultManifestStatus} from '@figment-the-graph-near/lib';

const START_BLOCK = 13100000;
const MANIFEST_PATH = './subgraphs/punks/subgraph.yaml';
const EVENT =
  'PunkBought(indexed uint256,uint256,indexed address,indexed address)';
const HANDLER = 'handlePunkBought';

const loadManifest = () => {
  let manifest = fs.readFileSync(MANIFEST_PATH, 'utf8');
  let data = yaml.load(manifest) as manifestT;

  let startBlock = data.dataSources[0].source.startBlock;
  let entities = data.dataSources[0].mapping.entities;
  let eventHandlers = data.dataSources[0].mapping.eventHandlers;
  return {
    startBlock,
    entities,
    eventHandlers,
  };
};
export default async function manifest(
  _req: NextApiRequest,
  res: NextApiResponse<ManifestStepStatusesT | string>,
) {
  try {
    let status = defaultManifestStatus;
    const {startBlock, entities, eventHandlers} = loadManifest();

    if (startBlock === START_BLOCK) {
      status = {
        ...status,
        block: {
          isValid: true,
          message: 'startBlock is 13100000',
        },
      };
    }

    if (
      entities.includes('Punk') &&
      entities.includes('Account') &&
      entities.length == 2
    ) {
      status = {
        ...status,
        entities: {
          isValid: true,
          message: 'Punk and Account entities',
        },
      };
    }

    if (
      eventHandlers.length === 1 &&
      eventHandlers[0]['event'] === EVENT &&
      eventHandlers[0]['handler'] === HANDLER
    ) {
      status = {
        ...status,
        eventHandlers: {
          isValid: true,
          message: 'PunkBought event with handlePunkBought handler',
        },
      };
    }

    res.status(200).json(status);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
