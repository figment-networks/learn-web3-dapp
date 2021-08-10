import type { NextApiRequest, NextApiResponse } from 'next'

import { getAvalancheClient } from '@avax/utils'
import { AvalancheConnectResponse } from '@avax/types'

export default function connect(
  req: NextApiRequest,
  res: NextApiResponse<AvalancheConnectResponse>
) {
  const client = getAvalancheClient()
  const info = client.Info()

  info
    .getNodeVersion()
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json('Error connecting to Avalanche')
    })
}
