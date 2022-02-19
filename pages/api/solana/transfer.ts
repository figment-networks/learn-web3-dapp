import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeURL} from '@figment-solana/lib';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

export default async function transfer(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {address, secret, recipient, lamports, network} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');

    const fromPubkey = new PublicKey(address);
    const toPubkey = new PublicKey(recipient);
    // The secret key is stored in our state as a stringified array
    const secretKey = Uint8Array.from(JSON.parse(secret as string));

    //... let's skip the beginning as it should be familiar for you by now!
    // Find the parameter to pass
    const instructions = SystemProgram.transfer({
      fromPubkey,
      lamports,
      toPubkey,
    });

    // How could you construct a signer array's
    const signers = new Array({publicKey: fromPubkey, secretKey});

    // Maybe adding something to a Transaction could be interesting ?
    const transaction = new Transaction().add(instructions);

    // We can send and confirm a transaction in one row.
    const hash = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
    );

    res.status(200).json(hash);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
