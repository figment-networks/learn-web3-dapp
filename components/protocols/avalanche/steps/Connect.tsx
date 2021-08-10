import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Col, Space, Typography } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { AvalancheConnectResponse } from '@avax/types'

const { Text } = Typography

const Connect = () => {
  const [version, setVersion] = useState<string | null>(null)
  const [fetchingVersion, setFetchingVersion] = useState<boolean>(false)

  useEffect(() => {
    getConnection()
  }, [])

  const getConnection = () => {
    setFetchingVersion(true)
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/avalanche/connect`)
      .then((res) => {
        const version: AvalancheConnectResponse = res.data
        setVersion(version)
        setFetchingVersion(false)
      })
      .catch((err) => {
        console.log(err)
        setFetchingVersion(false)
      })
  }

  return (
    <Col style={{ width: '100%' }}>
      {fetchingVersion ? (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      ) : version ? (
        <Alert
          message={
            <Space>
              Connected to Avalanche!
              <Text code>{version}</Text>
            </Space>
          }
          type='success'
          showIcon
        />
      ) : (
        <Alert message='Not connected to Avalanche' type='error' showIcon />
      )}
    </Col>
  )
}

export default Connect
