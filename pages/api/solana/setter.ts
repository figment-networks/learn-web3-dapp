import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstructionCtorFields,
  AccountMeta,
  Signer,
} from '@solana/web3.js';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeURL} from '@solana/lib';

export default async function setter(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {greeter, secret, programId, network} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');

    const greeterPublicKey = new PublicKey(greeter);
    const programKey = new PublicKey(programId);

    const payerSecretKey = new Uint8Array(JSON.parse(secret));
    const payerKeypair = Keypair.fromSecretKey(payerSecretKey);

    // this your turn to figure out
    // how to create this instruction
    const keys: AccountMeta = {
      pubkey: greeterPublicKey,
      isSigner: false,
      isWritable: true,
    };

    const opts: TransactionInstructionCtorFields = {
      keys: [keys],
      programId: programKey,
      data: Buffer.alloc(0),
    };

    const instruction = new TransactionInstruction(opts);

    // this your turn to figure out
    // how to create this transaction

    const transaction = new Transaction();
    transaction.add(instruction);

    const signer: Signer = {
      publicKey: payerKeypair.publicKey,
      secretKey: payerKeypair.secretKey,
    };
    const signers: Array<Signer> = [signer];

    const hash = await sendAndConfirmTransaction(
      connection,
      transaction,
      signers,
    );

    res.status(200).json(hash);
  } catch (error) {
    console.error(error);
    res.status(500).json('Get balance failed');
  }
}
