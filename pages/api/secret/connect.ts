import type {NextApiRequest, NextApiResponse} from 'next';
import {getSafeUrl} from 'components/protocols/secret/lib';
import {CosmWasmClient} from 'secretjs';

export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const url = await getSafeUrl();
    const client = new CosmWasmClient(url);
    const nodeInfo = await client.restClient.nodeInfo();
    const version = nodeInfo.application_version.version;
    res.status(200).json(version);
  } catch (error) {
    console.log(error);
    res.status(500).json('Failed to connect to secret');
  }
}
