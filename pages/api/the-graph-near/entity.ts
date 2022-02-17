import type {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';
import {defaultEntityStatus} from '@figment-the-graph-near/lib';
import {EntityStepStatusesT} from '@figment-the-graph-near/types';

const GENERATED_PATH = './subgraphs/near-subgraph/generated/schema.ts';

export default async function entity(
  _req: NextApiRequest,
  res: NextApiResponse<EntityStepStatusesT | {message: string}>,
) {
  try {
    let status = defaultEntityStatus;

    let generatedSchema = fs.readFileSync(GENERATED_PATH, 'utf8');
    // better to use a regex, need some regex expert here!
    // to make the code more robust, but it's working as is.
    let entities = generatedSchema
      .split(/\r?\n/)
      .filter((line) => {
        return line.trim().slice(0, 6) === 'export';
      })
      .map((words) => words.split(' ')[2])
      .sort();

    if (entities.length === 2) {
      status = {
        ...status,
        entities: {
          isValid: true,
          message: 'Two entities defined',
        },
      };
    }

    if (entities.includes('Account')) {
      status = {
        ...status,
        account: {
          isValid: true,
          message: 'Account entity defined',
        },
      };
    }

    if (entities.includes('Log')) {
      status = {
        ...status,
        log: {
          isValid: true,
          message: 'Log entity defined',
        },
      };
    }

    res.status(200).json(status);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json({
      message: errorMessage,
    });
  }
}
