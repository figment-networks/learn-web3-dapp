import { BinTools, BN } from 'avalanche'
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

import { getAvalancheClient } from '@avax/utils'
import {
  AvalancheTransferResponse,
  AvalancheTransferErrorResponse
} from '@avax/types'

export default async function transfer(
  req: NextApiRequest,
  res: NextApiResponse<
    AvalancheTransferResponse | AvalancheTransferErrorResponse
  >
) {
  const client = getAvalancheClient()
  const credentialsPath = './credentials'
  const bintools = BinTools.getInstance()

  // Initialize client connection and keychain
  const chain = client.XChain()
  const keychain = chain.keyChain()

  // Import X-chain key from the previously created file
  const buffer = fs.readFileSync(`${credentialsPath}/avalanche_privkey.json`)
  const bufferStr = buffer.toString()
  const keyImport = keychain.importKey(bufferStr)

  // Fetch UTXO ( unspent transaction outputs)
  const address = keyImport.getAddressString()
  const { utxos } = await chain.getUTXOs(address)

  // Prepare transaction details
  const receiver = req.body.to // Pathway test receiver address
  const amount = req.body.amount // Total amount we're transferring = 0.05 AVAX
  const asset = 'AVAX' // Primary asset used for the transaction (Avalanche supports many)

  // Determine the real asset ID from its symbol/alias
  // We can also get the primary asset ID with chain.getAVAXAssetID() call
  const assetInfo = await chain.getAssetDescription(asset)
  const assetID = bintools.cb58Encode(assetInfo.assetID)

  // Fetch our current balance
  let balance = await chain.getBalance(address, assetID)
  console.log(`Balance before sending tx: ${JSON.stringify(balance)}`)

  // Send transaction to network
  try {
    // Generate a new transaction
    const unsignedTx = await chain.buildBaseTx(
      utxos, // unspent outputs
      new BN(amount), // transaction amount formatted as a BigNumber
      assetID, // AVAX asset
      [receiver], // addresses to send the funds
      [address], // addresses being used to send the funds from the UTXOs provided
      [address], // addresses that can spend the change remaining from the spent UTXOs
      bintools.stringToBuffer('Figment Pathway') // memo, totally optional
    )
    console.log(`Created an unsigned transaction: ${unsignedTx}`)

    // Generate a signed transaction
    const signedTx = unsignedTx.sign(keychain)
    console.log(`Signed the transaction with the keypair: ${signedTx}`)

    const txID = await chain.issueTx(signedTx)
    console.log('Transaction submitted!')
    console.log(
      '----------------------------------------------------------------'
    )
    console.log(
      `Visit https://explorer.avax-test.network/tx/${txID} to see transaction details`
    )
    console.log(
      '----------------------------------------------------------------'
    )

    res.status(200).json({
      txID
    })
  } catch (error) {
    console.log(`error.message`, error.message)
    res.status(500).json({
      message: error.message
    })
  }
}
