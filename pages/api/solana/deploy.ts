import type {NextApiRequest, NextApiResponse} from 'next';
import {Connection, PublicKey} from '@solana/web3.js';
import {getNodeURL} from '@figment-solana/lib';
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
    // Re-create publicKeys from params
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
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
