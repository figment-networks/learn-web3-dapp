import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'

import { getAvalancheClient } from '@avax/utils'
type Data = any

export default function account(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const client = getAvalancheClient()

  // Define the path where our keypair will be saved in JSON format
  const credentialsPath = './credentials'
  const keyPath = `${credentialsPath}/avalanche_privkey.json`
  const chain = client.XChain() // the chainID can be altered if necessary, but we are on XChain here
  const keyChain = chain.keyChain() // keyChain will be the returned instance of KeyChain from AVMAPI

  let key
  if (!fs.existsSync(keyPath)) {
    console.log('Generating a new keypair...')
    key = keyChain.makeKey()
    fs.writeFileSync(keyPath, key.getPrivateKeyString())
  } else {
    const buffer = fs.readFileSync(keyPath)
    console.log(`buffer`, buffer)
    const bufferStr = buffer.toString()

    if (bufferStr) {
      console.log('Loading keypair from saved private key...')
      key = keyChain.importKey(bufferStr)
    } else {
      console.log('Generating a new keypair...')
      key = keyChain.makeKey()
      fs.writeFileSync(keyPath, key.getPrivateKeyString())
    }
  }

  res.status(200).json({
    addressString: key.getAddressString()
  })
}
