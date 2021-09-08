import { useState } from 'react'
import { Form, Input, Button, Alert, Space, Typography, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useAppState } from '@tezos/hooks'
import { transactionUrl } from '@tezos/lib'
import axios from 'axios'

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

const tailLayout = {
    wrapperCol: { offset: 4, span: 20 },
}

const { Text } = Typography

const recipient = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'

const Transfer = () => {
  const [error, setError] = useState<string | null>(null)
  const [fetching, setFetching] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const { state } = useAppState()

  const transfer = (values: any) => {
    const isValidAmount = parseFloat(values.amount)
    if (isNaN(isValidAmount)) {
        setError("Amount needs to be a valid number")
        throw Error('Invalid Amount')
    }
    const amount = parseFloat(values.amount)

    setFetching(true)
    axios
      .post(`/api/tezos/transfer`, {...state, amount, recipient })
      .then(res => {
        setTxHash(res.data)
        setFetching(false)
    })
      .catch(err => {
        console.error(err)
        setFetching(false)
    })
  }

  return (
    <Col style={{ minHeight: '350px'}}>
      <Form
        {...layout}
        name="transfer"
        layout="horizontal"
        onFinish={transfer}
        initialValues={{
            from: state.address,
            amount: 1,
            to: recipient,
        }}
      > 
      <Form.Item label="Sender" name="from" required>
        <Text code>{state.address}</Text>
      </Form.Item>

      <Form.Item label="Amount" name="amount" required tooltip="1 Tz = 10**6 mutez">
        <Space direction="vertical">
          <Input suffix="mutez" style={{ width: "200px" }} placeholder={'enter amount'}/>
        </Space>
      </Form.Item>

      <Form.Item label="Recipient" name="to" required>
        <Text code>{recipient}</Text>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" disabled={fetching}>
          Submit Transfer
        </Button>
      </Form.Item>

      {fetching &&
        <Form.Item {...tailLayout}>
          <Space size="large">
            <LoadingOutlined style={{ fontSize: 24, color: "#1890ff" }} spin />
            <Text type="secondary">Transfer initiated. Waiting for confirmations...</Text>
          </Space>
        </Form.Item>
      }

      {txHash &&
        <Form.Item {...tailLayout}>
          <Alert
          style={{ maxWidth: '350px'}}
            type="success"
            showIcon
            message={
              <Text strong>Transfer confirmed!</Text>
            }
            description={
              <a href={transactionUrl(txHash ?? '')} target="_blank" rel="noreferrer">
                View on Tezos Explorer
              </a>
            }
          />
        </Form.Item>
      }
      
      {error &&
        <Form.Item {...tailLayout}>
          <Alert
            type="error"
            showIcon
            closable
            message={error}
            onClose={() => setError('')}
          />
        </Form.Item>
      }
    </Form>
    </Col>
  );
};

export default Transfer
