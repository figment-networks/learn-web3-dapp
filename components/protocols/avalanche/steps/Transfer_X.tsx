import { useState } from "react"
import axios from 'axios'
import { Form, Input, Button, Alert, Space, Typography } from 'antd'
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons'

import { getAvalancheClient, getAvalancheExplorerURL } from "utils/avalanche-utils"
import { AvalancheKeypairType, AvalancheTransferResponse, AvalancheTransferErrorResponse } from "types/avalanche-types"

const layout = {
	labelCol: { span: 4 },
	wrapperCol: { span: 20 },
}
const tailLayout = {
	wrapperCol: { offset: 4, span: 20 },
}

const { Text } = Typography

const Transfer = ({ keypair }: { keypair: AvalancheKeypairType | null} ) => {
	const [toAddress, setToAddress] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [fetching, setFetching] = useState<boolean>(false)
	const [txId, setTxId] = useState<string | null>(null)

	if (!keypair) return <Alert type="error" showIcon message={"Generate a Keypair first"} />

	const generateKeypair = () => {
		const address =
			getAvalancheClient()
			.XChain()
			.keyChain()
			.makeKey()
			.getAddressString()

		setToAddress(address)
	}
	
	const transfer = (values: any) => {
		setError(null)
		setTxId(null)

		const amountNumber = parseFloat(values.amount)
		console.log(`amountNumber`, amountNumber)
		if (isNaN(amountNumber)) {
			setError("Amount needs to be a valid number")
			return
		}

		setFetching(true)

		axios
			.post(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/avalanche/transfer`,
				{
					from: keypair.addressString,
					to: toAddress,
					amount: amountNumber,
				},
			)
			.then(res => {
				const data: AvalancheTransferResponse = res.data
				const txID: string = data.txID
				setTxId(txID)
				setFetching(false)
			})
			.catch(err => {
				console.log(`err.response`, err.response)
				const data: AvalancheTransferErrorResponse = err.response.data
				setTxId(null)
				setFetching(false)
				setError(data.message)
			})	
	}

	return (
		<Form
			{...layout}
			name="transfer"
			layout="horizontal"
			onFinish={transfer}
			initialValues={{
				from: keypair.addressString
			}}
		> 
			<Form.Item label="Sender" name="from" required>
				<Text code>{keypair.addressString}</Text>
			</Form.Item>

			<Form.Item label="Amount" name="amount" required tooltip="1 billion nAVAX = 1 AVAX">
				<Space direction="vertical">
					<Input suffix="nAVAX" style={{ width: "200px" }} />
				</Space>
			</Form.Item>

			<Form.Item label="Recipient" required>
				<Space direction="horizontal">
					{toAddress && <Text code>{toAddress}</Text>}
					<Button size="small" type="dashed" onClick={generateKeypair} icon={<RedoOutlined />}>Generate an address</Button>
				</Space>
			</Form.Item>

			<Form.Item {...tailLayout}>
				<Button type="primary" htmlType="submit" disabled={fetching}>
					Submit Transfer
				</Button>
			</Form.Item>

			{
				fetching &&
					<Form.Item {...tailLayout}>
						<Space size="large">
							<LoadingOutlined style={{ fontSize: 24, color: "#1890ff" }} spin />
							<Text type="secondary">Transfer initiated. Waiting for confirmations...</Text>
						</Space>
					</Form.Item>
			}

			{txId &&
				<Form.Item {...tailLayout}>
					<Alert
						type="success"
						showIcon
						message={
							<Text strong>Transfer confirmed!</Text>
						}
						description={
							<a href={getAvalancheExplorerURL(txId)} target="_blank" rel="noreferrer">View on Avalanche Explorer</a>
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
						onClose={() => setError(null)}
					/>
				</Form.Item>
			}
		</Form>
	)
}

export default Transfer
