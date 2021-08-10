import type { NextApiRequest, NextApiResponse } from 'next'

import { AvalancheQueryResponse } from '@avax/types'
import { getAvalancheClient } from '@avax/utils'

export default async function query(
  req: NextApiRequest,
  res: NextApiResponse<AvalancheQueryResponse>
) {
  const client = getAvalancheClient()
  const info = client.Info()
  const pChain = client.PChain()

  // Fetch blockchain details
  const pChainHeight = await pChain.getHeight()
  const pChainMinStake = await pChain.getMinStake()

  const pBlockchainId = await info.getBlockchainID('P')
  const xBlockchainId = await info.getBlockchainID('X')
  const cBlockchainId = await info.getBlockchainID('C')
  const txFee = await info.getTxFee()

  res.status(200).json({
    pBlockchainId,
    pChainHeight,
    pChainMinStake,
    xBlockchainId,
    cBlockchainId,
    txFee
  })
}
