import {
  Connection,
  PublicKey,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeURL} from '@solana/lib';
import * as borsh from 'borsh';

// The state of a greeting account managed by the hello world program
class GreetingAccount {
  counter = 0;
  constructor(fields: {counter: number} | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

// Borsh schema definition for greeting accounts
const GreetingSchema = new Map([
  [GreetingAccount, {kind: 'struct', fields: [['counter', 'u32']]}],
]);

// The expected size of each greeting account.
const GREETING_SIZE = borsh.serialize(
  GreetingSchema,
  new GreetingAccount(),
).length;

type ResponseT = {
  hash: string;
  greeter: string;
};
export default async function greeter(
  req: NextApiRequest,
  res: NextApiResponse<string | ResponseT>,
) {
  try {
    const {network, secret, programId: programAddress} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');

    const programId = new PublicKey(programAddress);
    const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(secret)));
    const GREETING_SEED = 'hello';

    // Are there any methods from PublicKey to derive a public key from a seed?
    const greetedPubkey = await PublicKey.createWithSeed(
      payer.publicKey,
      GREETING_SEED,
      programId,
    );

    // This function calculates the fees we have to pay to keep the newly
    // created account alive on the blockchain. We're naming it lamports because
    // that is the denomination of the amount being returned by the function.
    const lamports = await connection.getMinimumBalanceForRentExemption(
      GREETING_SIZE,
    );


    // Find which instructions are expected and complete SystemProgram with
    // the required arguments.
    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: GREETING_SEED,
        newAccountPubkey: greetedPubkey,
        lamports,
        space: GREETING_SIZE,
        programId,
      }),
    );

    // Complete this function call with the expected arguments.
    const hash = await sendAndConfirmTransaction(connection, transaction, [
      payer,
    ]);
    res.status(200).json({
      hash: hash,
      greeter: greetedPubkey.toBase58(),
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
}
