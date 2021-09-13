import type {NextApiRequest, NextApiResponse} from 'next';
import {Connection, PublicKey} from '@solana/web3.js';
import {getNodeURL} from '@solana/lib';
import path from 'path';
import fs from 'mz/fs';

const PROGRAM_PATH = path.resolve('dist/solana/program');
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'helloworld.so');

export default async function deploy(
  req: NextApiRequest,
  res: NextApiResponse<string | boolean>,
) {
  try {
    const {network, programId} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const publicKey = new PublicKey(programId);
    const programInfo = await connection.getAccountInfo(publicKey);

    if (programInfo === null) {
      if (fs.existsSync(PROGRAM_SO_PATH)) {
        throw new Error(
          'Program needs to be deployed with `solana program deploy`',
        );
      } else {
        throw new Error('Program needs to be built and deployed');
      }
    } else if (!programInfo.executable) {
      throw new Error(`Program is not executable`);
    }

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(error.message);
  }
}
