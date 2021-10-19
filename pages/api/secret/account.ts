import type {NextApiRequest, NextApiResponse} from 'next';
import {Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey} from 'secretjs';
import {Bip39, Random} from '@iov/crypto';

type ResponseT = {
  mnemonic: string;
  address: string;
};
export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>,
) {
  try {
    const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, 'secret');
    res.status(200).json({mnemonic, address});
  } catch (error) {
    console.log(error);
    res.status(500).json('Failed to connect to Secret');
  }
}
