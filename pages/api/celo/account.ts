import type {NextApiRequest, NextApiResponse} from 'next';
import {getSafeUrl} from '@figment-celo/lib';
import {newKit} from '@celo/contractkit';

type ResponseT = {
  address: string;
  secret: string;
};
export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>,
) {
  try {
    const url = getSafeUrl();
    const kit = newKit(url);
    const account = undefined;
    const address = undefined;
    const secret = undefined;

    res.status(200).json({
      address,
      secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Account creation failed');
  }
}
