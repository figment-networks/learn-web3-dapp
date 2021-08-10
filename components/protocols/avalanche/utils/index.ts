import { Avalanche } from 'avalanche'

import { getDatahubNodeURL } from 'utils/datahub-utils'
import { AVALANCHE_NETWORKS, CHAINS } from 'types/types'

export const getAvalancheClient = () => {
  const datahubUrl = getDatahubNodeURL(
    CHAINS.AVALANCHE,
    AVALANCHE_NETWORKS.FUJI
  )
  const url = new URL(datahubUrl)

  const client = new Avalanche(
    url.hostname,
    parseInt(url.port),
    url.protocol.replace(':', ''),
    parseInt(process.env.AVALANCHE_NETWORK_ID as string),
    'X',
    'C',
    process.env.AVALANCHE_NETWORK_NAME
  )

  // Apply DataHub API authentication token
  client.setAuthToken(process.env.DATAHUB_AVALANCHE_API_KEY as string)

  return client
}

export const getAvalancheExplorerURL = (txId: string) => {
  return `https://explorer.avax-test.network/tx/${txId}`
}
