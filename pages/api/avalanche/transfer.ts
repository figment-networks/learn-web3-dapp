import type {NextApiRequest, NextApiResponse} from 'next';
import {getAvalancheClient} from '@figment-avalanche/lib';
import {BinTools, BN} from 'avalanche';

export default async function transfer(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  try {
    const {secret, navax, recipient, address, network} = req.body;
    const client = getAvalancheClient(network);
    const chain = client.XChain();
    const keychain = chain.keyChain();
    // Using keychain, load the private key to sign transactions
    keychain.importKey(secret);

    // Fetch UTXOs (unspent transaction outputs)
    const {utxos} = await chain.getUTXOs(address);

    // Determine the real asset ID from its symbol/alias
    const binTools = BinTools.getInstance();
    const assetInfo = await chain.getAssetDescription('AVAX');
    const assetID = binTools.cb58Encode(assetInfo.assetID);

    // Create a new transaction
    const transaction = await chain.buildBaseTx(
      utxos, // Unspent transaction outputs
      new BN(navax), // Transaction amount, formatted as a BigNumber
      assetID, // AVAX asset
      [recipient], // Addresses we are sending the funds to (receiver)
      [address], // Addresses being used to send the funds from the UTXOs provided (sender)
      [address], // Addresses that can spend the change remaining from the spent UTXOs (payer)
    );

    // Sign the transaction and send it to the network
    const signedTx = transaction.sign(keychain);
    const hash = await chain.issueTx(signedTx);

    res.status(200).json(hash);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
