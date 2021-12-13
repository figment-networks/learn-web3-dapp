import {useState, useEffect} from 'react';
import {Alert, Col, Space, Typography, Button} from 'antd';
import {PoweroffOutlined} from '@ant-design/icons';
import Confetti from 'react-confetti';

import {PROTOCOL_INNER_STATES_ID} from 'types';
import {connect} from '@figment-polygon/challenges';
import {getChainLabel} from 'utils/context';
import {useGlobalState} from 'context';

const {Text} = Typography;

const Connect = () => {
  const {state, dispatch} = useGlobalState();
  const chainLabel = getChainLabel(state);

  const [error, setError] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      dispatch({
        type: 'SetInnerState',
        values: [
          {
            [PROTOCOL_INNER_STATES_ID.ADDRESS]: address,
          },
        ],
        isCompleted: true,
      });
    }
  }, [address, setAddress]);

  const getConnection = async () => {
    setFetching(true);
    setError(undefined);
    setAddress(undefined);
    const {error, address} = await connect();
    if (error) {
      setError(error);
    } else {
      setAddress(address);
    }
    setFetching(false);
  };

  return (
    <Col>
      {address && (
        <Confetti numberOfPieces={500} tweenDuration={1000} gravity={0.05} />
      )}
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={getConnection}
          loading={fetching}
          size="large"
        >
          Check Metamask Connection
        </Button>
        {address ? (
          <Alert
            message={<Text strong>{`Connected to account:`}</Text>}
            type="success"
            description={<Text code>{address}</Text>}
            showIcon
          />
        ) : error ? (
          <Alert
            message={
              <Space>
                <Text code>Error: {error}</Text>
              </Space>
            }
            type="error"
            showIcon
          />
        ) : (
          <Alert
            message={<Space>Not Connected to {chainLabel}</Space>}
            type="error"
            showIcon
          />
        )}
      </Space>
    </Col>
  );
};

export default Connect;
