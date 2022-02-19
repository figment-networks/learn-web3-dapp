import type {NextApiRequest, NextApiResponse} from 'next';
import {Connection, PublicKey} from '@solana/web3.js';
import {getNodeURL} from '@figment-solana/lib';

export default async function balance(
  req: NextApiRequest,
  res: NextApiResponse<string | number>,
) {
  try {
    const {network, address} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    if (balance === 0 || balance === undefined) {
      throw new Error('Account not funded');
    }
    res.status(200).json(balance);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
