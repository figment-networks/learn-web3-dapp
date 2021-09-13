import {Connection, PublicKey, LAMPORTS_PER_SOL} from '@solana/web3.js';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeURL} from '@solana/lib';

export default async function fund(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {network, address} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const publicKey = new PublicKey(address);
    const hash = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(hash);
    res.status(200).json(hash);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
