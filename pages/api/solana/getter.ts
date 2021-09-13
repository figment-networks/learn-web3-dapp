import type {NextApiRequest, NextApiResponse} from 'next';
import {Connection, PublicKey} from '@solana/web3.js';
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

export default async function getter(
  req: NextApiRequest,
  res: NextApiResponse<string | number>,
) {
  try {
    const {network, greeter} = req.body;
    const url = getNodeURL(network);
    const connection = new Connection(url, 'confirmed');
    const greeterPublicKey = new PublicKey(greeter);

    const accountInfo = await connection.getAccountInfo(greeterPublicKey);

    if (accountInfo === null) {
      throw new Error('Error: cannot find the greeted account');
    }

    // Find the expected parameters.
    const greeting = borsh.deserialize(
      GreetingSchema,
      GreetingAccount,
      accountInfo.data,
    );

    // A little helper
    console.log(greeting);

    // Pass the counter to the client-side as JSON
    res.status(200).json(greeting.counter);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
}
