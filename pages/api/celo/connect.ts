import type {NextApiRequest, NextApiResponse} from 'next';
import {getSafeUrl} from '@figment-celo/lib';
import {newKit} from '@celo/contractkit';

export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const url = getSafeUrl();
    const kit = undefined;
    const version = undefined;
    res.status(200).json(version.slice(5, 11));
  } catch (error) {
    console.error(error);
    res.status(500).json('connection to Celo failed');
  }
}
