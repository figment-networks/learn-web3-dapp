import type {NextApiRequest, NextApiResponse} from 'next';
import {getSafeUrl} from 'components/protocols/secret/lib';
import {CosmWasmClient} from 'secretjs';

export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const url = await getSafeUrl(false);
    const {address} = req.body;
    const client = new CosmWasmClient(url);
    console.log(client);

    const account = await client.getAccount(address);
    console.log(account);
    const balance = account?.balance[0].amount as string;

    res.status(200).json(balance);
  } catch (error) {
    console.log(error);
    res.status(500).json('failed to connect to secret');
  }
}
