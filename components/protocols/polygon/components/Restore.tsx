import {Alert, Col, Input, Space, Typography, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import {useState, useEffect} from 'react';

import {useGlobalState} from 'context';
import {restore} from '@figment-polygon/challenges';
import {getInnerState} from 'utils/context';

const {Text} = Typography;

const Restore = () => {
  const {state, dispatch} = useGlobalState();
  const {address: address0} = getInnerState(state);

  const [address, setAddress] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [mnemonic, setMnemonic] = useState<string>('');

  useEffect(() => {
    if (address) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [address, setAddress]);

  const checkRestore = () => {
    setAddress(undefined);
    setError(undefined);
    const {error, restoredAddress} = restore(mnemonic, address0);
    if (error) {
      setError(error);
    } else {
      setAddress(restoredAddress);
    }
  };

  return (
    <Col>
      <Space direction="vertical">
        <Text>
          Below enter the <span style={{fontWeight: 'bold'}}>mnemonic</span> of
          your wallet:
        </Text>
        <Input
          style={{width: '500px', fontWeight: 'bold'}}
          onChange={(event) => setMnemonic(event.target.value)}
        />
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={checkRestore}
          size="large"
        >
          Restore Account
        </Button>
        {address ? (
          <Alert
            message={
              <Text strong>
                {`Restored address: ${address.slice(0, 12)}...`}
              </Text>
            }
            type="success"
          />
        ) : error ? (
          <Alert type="error" message={error} />
        ) : null}
      </Space>
    </Col>
  );
};

export default Restore;
