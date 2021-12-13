import {useState, useEffect} from 'react';
import {PoweroffOutlined} from '@ant-design/icons';
import {Alert, Col, Space, Typography, Button} from 'antd';

import {useGlobalState} from 'context';
import {getInnerState} from 'utils/context';
import {getPolygonFaucetURL} from '@figment-polygon/lib';
import {getBalance} from '@figment-polygon/challenges';

const {Text} = Typography;

const DECIMAL_OFFSET = 10 ** 18;
const TOKEN_SYMBOL = 'MATIC';

const Balance = () => {
  const {state, dispatch} = useGlobalState();
  const {address} = getInnerState(state);

  const [balance, setBalance] = useState<number | null>(0);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    if (balance) {
      dispatch({
        type: 'SetIsCompleted',
      });
    }
  }, [balance, setBalance]);

  const checkGetBalance = async () => {
    setFetching(true);
    setError(undefined);
    setBalance(null);
    const {error, balance} = await getBalance(address);
    if (error) {
      setError(error);
    } else {
      setBalance(
        parseFloat(
          ((parseFloat(balance as string) / DECIMAL_OFFSET) * 100).toFixed(),
        ) / 100,
      );
    }
    setFetching(false);
  };

  return (
    <Col>
      <Space direction="vertical" style={{width: '100%'}} size="large">
        <Alert
          message={
            <Text>
              Fund your address using the{' '}
              <a href={getPolygonFaucetURL()} target="_blank" rel="noreferrer">
                official Matic Faucet
              </a>
            </Text>
          }
          type="warning"
          showIcon
        />
        <Button
          type="primary"
          icon={<PoweroffOutlined />}
          onClick={checkGetBalance}
          loading={fetching}
          size="large"
        >
          Check Balance
        </Button>
        {balance ? (
          <Alert
            message={
              <Text
                strong
              >{`This address has a balance of ${balance} ${TOKEN_SYMBOL}`}</Text>
            }
            type="success"
            showIcon
          />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Alert message="Please Complete the code." type="error" showIcon />
        )}
      </Space>
    </Col>
  );
};

export default Balance;
