
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSafeUrl } from 'components/protocols/secret/lib';
import { EnigmaUtils, SigningCosmWasmClient, Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey, } from 'secretjs';

export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
    try {
        const url = await getSafeUrl()
        const { mnemonic, txAmount }= req.body
        console.log(url)
        console.log(mnemonic)
        console.log(txAmount)

        const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic)
        const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
        const address = pubkeyToAddress(pubkey, 'secret');

        // 1. Initialize client
        const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
        const fees = {
          send: {
            amount: [{ amount: txAmount, denom: 'uscrt' }],
            gas: '80000',
          },
        };
        const client = new SigningCosmWasmClient(
            url,
            address,
            (signBytes) => signingPen.sign(signBytes),
            txEncryptionSeed, fees,
          );

        // 2. Send tokens
        const rcpt = address; // Set recipient to sender for testing, or generate another account as you did previously.
        const memo = 'sendTokens example'; // optional memo
        const sent = await client.sendTokens(rcpt, [{ 
          amount: txAmount, 
          denom: 'uscrt' 
        }], memo) // Send 1 SCRT / 1_000_000 uscrt
          
        // 3. Query the tx result
        const query = { id: sent.transactionHash };
        const tx = await client.searchTx(query);
        console.log('Transaction: ', tx);
        const hash = tx[0].hash;

        res.status(200).json(hash)
    } catch(error) {
        console.log(error)
        res.status(500).json('Error transferring uSCRT')
    }
}
