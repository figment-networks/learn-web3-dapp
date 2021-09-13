import {useState} from 'react';
import {Alert, Col, Input, Button, Space, Typography} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {ethers} from 'ethers';
import {useEffect} from 'react';

const {Text} = Typography;

// Prevents "Property 'ethereum' does not exist on type
// 'Window & typeof globalThis' ts(2339)" linter warning
declare let window: any;

const Restore = () => {
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');

  const restore = () => {
    console.log(value);
    try {
      const wallet = ethers.Wallet.fromMnemonic(value.trim())
      const selectedAddress = window.ethereum.selectedAddress;
      if (wallet.address.toLocaleLowerCase() === selectedAddress) {
        setAddress(wallet.address.toLocaleLowerCase())
        setSecret(wallet.privateKey.toLocaleLowerCase())
      } else {
        setError('Unable to restore account');
      }
    } catch (error) {
      setAddress(null);
      setSecret(null);
      setError('Invalid mnemonic');
    }
  };

  return (
    <Col style={{minHeight: '350px', maxWidth: '490px'}}>
      <Space direction="vertical" size="large">
        <Space direction="vertical">
          <Text>
            Below enter the <span style={{fontWeight: 'bold'}}>mnemonic</span>{' '}
            of your wallet:
          </Text>
          <Input
            style={{width: '500px', fontWeight: 'bold'}}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button type="primary" onClick={restore}>
            Restore Account
          </Button>
        </Space>
        {error && <Alert type="error" closable message={error} />}
        {address ? (
          <Alert
            message={
              <Text strong>{`This is the restored address ${address}`}</Text>
            }
            type="success"
            closable
            showIcon
          />
        ) : null}
        {secret ? (
          <Alert
            message={<Text strong>{`This is the private key ${secret}`}</Text>}
            type="warning"
            closable
            showIcon
          />
        ) : null}
      </Space>
    </Col>
  );
};

export default Restore;
