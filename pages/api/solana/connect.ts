import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeURL} from '@figment-solana/lib';
import {Connection} from '@solana/web3.js';

export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {network} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const version = await connection.getVersion();
    res.status(200).json(version['solana-core']);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
